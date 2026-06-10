import { supabase } from './supabase';
import { gtfsTimeToMinutes } from './schedule';
import { getTripDelay, type ParsedFeed } from './gtfsrt';

const TRANSFER_BUFFER_MINUTES = 3;
const MAX_ITINERARIES = 3;
/** Stops within this distance count as the same transfer point (bus bay <-> rail platform, across a park-n-ride). */
const WALK_RADIUS_METERS = 400;
/** Extra minutes for a proximity (walking) transfer vs a same-platform one. */
const WALK_TRANSFER_BUFFER_MINUTES = 4;

function distMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export interface ItineraryLeg {
  routeShortName: string;
  routeLongName: string;
  routeType: number;
  routeColor: string | null;
  tripId: string;
  boardStopName: string;
  boardTime: string; // GTFS HH:MM:SS
  alightStopName: string;
  alightTime: string;
  delaySeconds: number | null;
}

export interface Itinerary {
  legs: ItineraryLeg[];
  departMinutes: number;
  arriveMinutes: number;
  totalMinutes: number;
  transfers: number;
}

interface StopTimeRow {
  trip_id: string;
  stop_id: string;
  stop_sequence: number;
  arrival_time: string | null;
  departure_time: string | null;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_type: number;
  route_color: string | null;
}

function mapRow(r: any): StopTimeRow | null {
  if (!r.rtd_trips?.rtd_routes) return null;
  return {
    trip_id: r.trip_id,
    stop_id: r.stop_id,
    stop_sequence: Number(r.stop_sequence),
    arrival_time: r.arrival_time,
    departure_time: r.departure_time,
    stop_name: r.rtd_stops?.stop_name ?? '',
    stop_lat: Number(r.rtd_stops?.stop_lat ?? 0),
    stop_lon: Number(r.rtd_stops?.stop_lon ?? 0),
    route_id: r.rtd_trips.route_id,
    route_short_name: r.rtd_trips.rtd_routes.route_short_name,
    route_long_name: r.rtd_trips.rtd_routes.route_long_name,
    route_type: Number(r.rtd_trips.rtd_routes.route_type),
    route_color: r.rtd_trips.rtd_routes.route_color ? `#${r.rtd_trips.rtd_routes.route_color}` : null,
  };
}

const ROW_SELECT =
  'trip_id, stop_id, stop_sequence, arrival_time, departure_time, rtd_stops(stop_name, stop_lat, stop_lon), rtd_trips(route_id, rtd_routes(route_short_name, route_long_name, route_type, route_color))';

async function stopTimesAt(stopIds: string[]): Promise<StopTimeRow[]> {
  if (!supabase || stopIds.length === 0) return [];
  const { data, error } = await supabase
    .from('rtd_stop_times')
    .select(ROW_SELECT)
    .in('stop_id', stopIds);
  if (error || !data) return [];
  return (data as any[]).map(mapRow).filter((r): r is StopTimeRow => r !== null);
}

/** All stop_times for the given trips (used to find shared transfer stops). */
async function stopTimesForTrips(tripIds: string[]): Promise<StopTimeRow[]> {
  if (!supabase || tripIds.length === 0) return [];
  // Supabase/PostgREST silently caps responses at 1000 rows, so chunk small
  // enough (10 trips x ~80 stops) that no single request can hit the cap.
  const chunks: string[][] = [];
  for (let i = 0; i < tripIds.length; i += 10) chunks.push(tripIds.slice(i, i + 10));
  const results = await Promise.all(
    chunks.map((chunk) => supabase!.from('rtd_stop_times').select(ROW_SELECT).in('trip_id', chunk)),
  );
  const rows: StopTimeRow[] = [];
  for (const { data } of results) {
    for (const r of (data ?? []) as any[]) {
      const row = mapRow(r);
      if (row) rows.push(row);
    }
  }
  return rows;
}

function legDelay(tripUpdates: ParsedFeed | null, row: StopTimeRow): number | null {
  if (!tripUpdates) return null;
  return getTripDelay(tripUpdates, { trip_id: row.trip_id, route_id: row.route_id }).delaySeconds;
}

function makeLeg(board: StopTimeRow, alight: StopTimeRow, tripUpdates: ParsedFeed | null): ItineraryLeg {
  return {
    routeShortName: board.route_short_name,
    routeLongName: board.route_long_name,
    routeType: board.route_type,
    routeColor: board.route_color,
    tripId: board.trip_id,
    boardStopName: board.stop_name,
    boardTime: board.departure_time ?? board.arrival_time ?? '',
    alightStopName: alight.stop_name,
    alightTime: alight.arrival_time ?? alight.departure_time ?? '',
    delaySeconds: legDelay(tripUpdates, board),
  };
}

/**
 * Plans trips from origin to destination using the imported schedule
 * (direct routes plus one-transfer combinations, e.g. bus -> rail).
 * Times are scheduled; live delays from GTFS-RT are attached per leg when known.
 */
export async function planTrip(
  originStopId: string,
  destStopId: string,
  tripUpdates: ParsedFeed | null = null,
): Promise<Itinerary[]> {
  if (!supabase) return [];
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const [originRows, destRows] = await Promise.all([stopTimesAt([originStopId]), stopTimesAt([destStopId])]);
  if (originRows.length === 0 || destRows.length === 0) return [];

  const destByTrip = new Map(destRows.map((r) => [r.trip_id, r]));
  const itineraries: Itinerary[] = [];

  // --- Direct: same trip serves both stops in order ---
  for (const o of originRows) {
    const d = destByTrip.get(o.trip_id);
    if (!d || d.stop_sequence <= o.stop_sequence) continue;
    const dep = gtfsTimeToMinutes(o.departure_time ?? o.arrival_time);
    const arr = gtfsTimeToMinutes(d.arrival_time ?? d.departure_time);
    if (dep == null || arr == null || dep < nowMinutes) continue;
    itineraries.push({
      legs: [makeLeg(o, d, tripUpdates)],
      departMinutes: dep,
      arriveMinutes: arr,
      totalMinutes: arr - dep,
      transfers: 0,
    });
  }

  // --- One transfer: origin trip -> shared stop -> destination trip ---
  // Only search for transfers if direct options are scarce.
  if (itineraries.length < MAX_ITINERARIES) {
    const originTripIds = [...new Set(originRows.map((r) => r.trip_id))];
    const destTripIds = [...new Set(destRows.map((r) => r.trip_id))].filter(
      (id) => !destByTrip.has(id) || !originRows.some((o) => o.trip_id === id),
    );

    const [originFull, destFull] = await Promise.all([
      stopTimesForTrips(originTripIds),
      stopTimesForTrips(destTripIds),
    ]);

    const originSeqByTrip = new Map(originRows.map((r) => [r.trip_id, r.stop_sequence]));
    const originRowByTrip = new Map(originRows.map((r) => [r.trip_id, r]));
    const destSeqByTrip = new Map(destRows.map((r) => [r.trip_id, r.stop_sequence]));

    // Index second-leg boardings by stop: trips that pass through a stop BEFORE reaching the destination.
    const secondLegByStop = new Map<string, StopTimeRow[]>();
    for (const row of destFull) {
      const destSeq = destSeqByTrip.get(row.trip_id);
      if (destSeq == null || row.stop_sequence >= destSeq) continue;
      if (!secondLegByStop.has(row.stop_id)) secondLegByStop.set(row.stop_id, []);
      secondLegByStop.get(row.stop_id)!.push(row);
    }

    for (const row of originFull) {
      const originSeq = originSeqByTrip.get(row.trip_id);
      if (originSeq == null || row.stop_sequence <= originSeq) continue; // must be after boarding
      const candidates = secondLegByStop.get(row.stop_id);
      if (!candidates) continue;

      const firstBoard = originRowByTrip.get(row.trip_id)!;
      // Don't suggest "transferring" to the same route
      const dep1 = gtfsTimeToMinutes(firstBoard.departure_time ?? firstBoard.arrival_time);
      const arr1 = gtfsTimeToMinutes(row.arrival_time ?? row.departure_time);
      if (dep1 == null || arr1 == null || dep1 < nowMinutes) continue;

      for (const second of candidates) {
        if (second.route_short_name === firstBoard.route_short_name) continue;
        const dep2 = gtfsTimeToMinutes(second.departure_time ?? second.arrival_time);
        if (dep2 == null || dep2 < arr1 + TRANSFER_BUFFER_MINUTES) continue;
        const destRow = destByTrip.get(second.trip_id);
        if (!destRow) continue;
        const arr2 = gtfsTimeToMinutes(destRow.arrival_time ?? destRow.departure_time);
        if (arr2 == null) continue;

        itineraries.push({
          legs: [makeLeg(firstBoard, row, tripUpdates), makeLeg(second, destRow, tripUpdates)],
          departMinutes: dep1,
          arriveMinutes: arr2,
          totalMinutes: arr2 - dep1,
          transfers: 1,
        });
      }
    }
  }

  // Earliest arrival wins; dedupe near-identical options (same routes + same departure).
  itineraries.sort((a, b) => a.arriveMinutes - b.arriveMinutes);
  const seen = new Set<string>();
  const unique: Itinerary[] = [];
  for (const it of itineraries) {
    const key = it.legs.map((l) => `${l.routeShortName}@${l.boardTime}`).join('>');
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(it);
    if (unique.length >= MAX_ITINERARIES) break;
  }
  return unique;
}

/** All stop_times for a route's imported trips, grouped by trip and ordered by stop_sequence. */
async function routeTripRows(routeShortName: string): Promise<Map<string, StopTimeRow[]>> {
  const empty = new Map<string, StopTimeRow[]>();
  if (!supabase) return empty;
  const { data: route } = await supabase
    .from('rtd_routes')
    .select('route_id')
    .eq('route_short_name', routeShortName)
    .maybeSingle();
  if (!route) return empty;
  const { data: trips } = await supabase.from('rtd_trips').select('trip_id').eq('route_id', route.route_id);
  if (!trips || trips.length === 0) return empty;

  const rows = await stopTimesForTrips(trips.map((t: any) => t.trip_id));
  const byTrip = new Map<string, StopTimeRow[]>();
  for (const r of rows) {
    if (!byTrip.has(r.trip_id)) byTrip.set(r.trip_id, []);
    byTrip.get(r.trip_id)!.push(r);
  }
  for (const list of byTrip.values()) list.sort((a, b) => a.stop_sequence - b.stop_sequence);
  return byTrip;
}

/** Closest pair of stops between two routes — for "why didn't this connect?" diagnostics. */
function closestApproach(
  a: Map<string, StopTimeRow[]>,
  b: Map<string, StopTimeRow[]>,
): { meters: number; stopA: string; stopB: string } | null {
  const stopsA = new Map<string, StopTimeRow>();
  for (const rows of a.values()) for (const r of rows) stopsA.set(r.stop_id, r);
  const stopsB = new Map<string, StopTimeRow>();
  for (const rows of b.values()) for (const r of rows) stopsB.set(r.stop_id, r);
  let best: { meters: number; stopA: string; stopB: string } | null = null;
  for (const sa of stopsA.values()) {
    for (const sb of stopsB.values()) {
      const d = distMeters(sa.stop_lat, sa.stop_lon, sb.stop_lat, sb.stop_lon);
      if (!best || d < best.meters) best = { meters: d, stopA: sa.stop_name, stopB: sb.stop_name };
    }
  }
  return best;
}

interface ChainState {
  stopId: string;
  lat: number;
  lon: number;
  arriveMinutes: number;
  legs: ItineraryLeg[];
}

export interface ChainResult {
  itineraries: Itinerary[];
  issues: string[];
}

/**
 * Plans a trip along a USER-CHOSEN sequence of routes (e.g. ["120L", "N"]):
 * board the first route at the origin, transfer between consecutive routes at
 * any pair of stops within walking distance (bus bay <-> rail platform counts),
 * and arrive at the destination on the last route. This is the "unorthodox
 * combo" planner that stop-ID-only systems can't do.
 */
export async function planChain(
  originStopId: string | null,
  destStopId: string | null,
  routeNames: string[],
  tripUpdates: ParsedFeed | null = null,
  options: { startMinutes?: number; arriveByMinutes?: number } = {},
): Promise<ChainResult> {
  const issues: string[] = [];
  if (!supabase || routeNames.length === 0) return { itineraries: [], issues: ['No routes selected.'] };

  const now = new Date();
  const nowMinutes = options.startMinutes ?? now.getHours() * 60 + now.getMinutes();

  const [{ data: originStop }, { data: destStop }] = await Promise.all([
    originStopId
      ? supabase.from('rtd_stops').select('stop_id, stop_name, stop_lat, stop_lon').eq('stop_id', originStopId).maybeSingle()
      : Promise.resolve({ data: null }),
    destStopId
      ? supabase.from('rtd_stops').select('stop_id, stop_name, stop_lat, stop_lon').eq('stop_id', destStopId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  if (originStopId && !originStop) return { itineraries: [], issues: ['Could not load the origin stop.'] };
  if (destStopId && !destStop) return { itineraries: [], issues: ['Could not load the destination stop.'] };

  const routeRows = await Promise.all(routeNames.map(routeTripRows));
  for (let i = 0; i < routeNames.length; i++) {
    if (routeRows[i].size === 0) issues.push(`No schedule data found for route ${routeNames[i]}.`);
  }
  if (issues.length > 0) return { itineraries: [], issues };

  // Multiple departure options: run the chain from a few different start times.
  const finals: Itinerary[] = [];
  // With no origin stop, ride the first route from its starting terminal.
  let states: ChainState[] = [
    originStop
      ? {
          stopId: originStop.stop_id,
          lat: Number(originStop.stop_lat),
          lon: Number(originStop.stop_lon),
          arriveMinutes: nowMinutes,
          legs: [],
        }
      : { stopId: '', lat: NaN, lon: NaN, arriveMinutes: nowMinutes, legs: [] },
  ];

  for (let i = 0; i < routeNames.length; i++) {
    const isFirst = i === 0;
    const isLast = i === routeNames.length - 1;
    const buffer = isFirst ? 0 : WALK_TRANSFER_BUFFER_MINUTES;
    const nextStates = new Map<string, ChainState>();
    let boardedAnywhere = false;

    for (const trip of routeRows[i].values()) {
      for (const state of states) {
        // Find the first stop on this trip we can board: near the state's location, departing after we arrive (+buffer).
        let boardIdx = -1;
        for (let k = 0; k < trip.length; k++) {
          const row = trip[k];
          const near =
            isFirst && !originStop
              ? k === 0 // no origin chosen: board at the trip's starting terminal
              : row.stop_id === state.stopId ||
                distMeters(row.stop_lat, row.stop_lon, state.lat, state.lon) <= WALK_RADIUS_METERS;
          if (!near) continue;
          const dep = gtfsTimeToMinutes(row.departure_time ?? row.arrival_time);
          if (dep == null || dep < state.arriveMinutes + buffer) continue;
          boardIdx = k;
          break;
        }
        if (boardIdx === -1) continue;
        boardedAnywhere = true;

        const board = trip[boardIdx];
        for (let k = boardIdx + 1; k < trip.length; k++) {
          const alight = trip[k];
          const arr = gtfsTimeToMinutes(alight.arrival_time ?? alight.departure_time);
          if (arr == null) continue;
          const legs = [...state.legs, makeLeg(board, alight, tripUpdates)];

          if (isLast) {
            const atDest = destStop
              ? alight.stop_id === destStop.stop_id ||
                distMeters(alight.stop_lat, alight.stop_lon, Number(destStop.stop_lat), Number(destStop.stop_lon)) <= WALK_RADIUS_METERS
              : k === trip.length - 1; // no destination chosen: ride to the end of the line
            if (atDest) {
              const dep0 = gtfsTimeToMinutes(legs[0].boardTime)!;
              finals.push({
                legs,
                departMinutes: dep0,
                arriveMinutes: arr,
                totalMinutes: arr - dep0,
                transfers: legs.length - 1,
              });
              break; // first reachable destination stop on this trip is the arrival
            }
          } else {
            // Candidate transfer point toward the next route — keep the earliest arrival
            // per (stop, first-leg departure) so later departures survive for arrive-by mode.
            const stateKey = `${alight.stop_id}|${legs[0]?.boardTime ?? ''}`;
            const existing = nextStates.get(stateKey);
            if (!existing || arr < existing.arriveMinutes) {
              nextStates.set(stateKey, {
                stopId: alight.stop_id,
                lat: alight.stop_lat,
                lon: alight.stop_lon,
                arriveMinutes: arr,
                legs,
              });
            }
          }
        }
      }
    }

    if (!isLast) {
      if (nextStates.size === 0) {
        issues.push(
          boardedAnywhere
            ? `Boarded ${routeNames[i]}, but found no upcoming connection to ${routeNames[i + 1]}.`
            : `No upcoming ${routeNames[i]} departures near ${i === 0 ? originStop?.stop_name ?? 'the start of the line' : 'the transfer point'} today.`,
        );
        const approach = closestApproach(routeRows[i], routeRows[i + 1]);
        if (approach) {
          issues.push(
            approach.meters <= WALK_RADIUS_METERS
              ? `${routeNames[i]} and ${routeNames[i + 1]} do connect at ${approach.stopA} / ${approach.stopB} (${Math.round(approach.meters)}m apart) — the remaining schedules today just don't line up. Try earlier in the day.`
              : `Closest the two routes get: ${approach.stopA} to ${approach.stopB}, ~${Math.round(approach.meters)}m apart (beyond the ${WALK_RADIUS_METERS}m walk limit).`,
          );
        }
        return { itineraries: [], issues };
      }
      // Keep the search bounded: best 80 transfer candidates by arrival time.
      states = [...nextStates.values()].sort((a, b) => a.arriveMinutes - b.arriveMinutes).slice(0, 80);
    } else if (finals.length === 0) {
      issues.push(
        boardedAnywhere
          ? `${routeNames[i]} doesn't reach ${destStop?.stop_name ?? 'the end of the line'} (within a ${WALK_RADIUS_METERS}m walk) from those transfer points.`
          : `No upcoming ${routeNames[i]} departures connect from ${routeNames[i - 1] ?? originStop?.stop_name ?? 'the start'} today.`,
      );
    }
  }

  let candidates = finals;
  if (options.arriveByMinutes != null) {
    candidates = candidates.filter((it) => it.arriveMinutes <= options.arriveByMinutes!);
    if (candidates.length === 0 && finals.length > 0) {
      const earliest = finals.reduce((min, it) => Math.min(min, it.arriveMinutes), Infinity);
      const h = Math.floor(earliest / 60) % 24;
      const m = Math.round(earliest % 60);
      issues.push(
        `Nothing arrives by the requested time — earliest possible arrival on this combo is ${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}.`,
      );
    }
    // Arrive-by mode: prefer leaving as late as possible while still making it.
    candidates.sort((a, b) => b.departMinutes - a.departMinutes);
  } else {
    candidates.sort((a, b) => a.arriveMinutes - b.arriveMinutes);
  }

  // Dominance pruning: drop any option that departs at the same time or earlier
  // than another but arrives later — e.g. same bus, just waiting for a later train.
  const dominated = candidates.filter(
    (it) =>
      !candidates.some(
        (other) => other !== it && other.departMinutes >= it.departMinutes && other.arriveMinutes < it.arriveMinutes,
      ),
  );

  const seenKeys = new Set<string>();
  const unique: Itinerary[] = [];
  for (const it of dominated) {
    // Dedupe on the full leg signature (board AND alight) so near-identical variants collapse.
    const key = it.legs.map((l) => `${l.routeShortName}@${l.boardTime}>${l.alightTime}@${l.alightStopName}`).join('|');
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    unique.push(it);
    if (unique.length >= MAX_ITINERARIES) break;
  }
  return { itineraries: unique, issues };
}
