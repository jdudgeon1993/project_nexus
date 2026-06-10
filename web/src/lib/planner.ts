import { supabase } from './supabase';
import { gtfsTimeToMinutes } from './schedule';
import { getTripDelay, type ParsedFeed } from './gtfsrt';

const TRANSFER_BUFFER_MINUTES = 3;
const MAX_ITINERARIES = 3;

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
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_type: number;
  route_color: string | null;
}

async function stopTimesAt(stopIds: string[]): Promise<StopTimeRow[]> {
  if (!supabase || stopIds.length === 0) return [];
  const { data, error } = await supabase
    .from('rtd_stop_times')
    .select(
      'trip_id, stop_id, stop_sequence, arrival_time, departure_time, rtd_stops(stop_name), rtd_trips(route_id, rtd_routes(route_short_name, route_long_name, route_type, route_color))',
    )
    .in('stop_id', stopIds);
  if (error || !data) return [];
  return (data as any[])
    .filter((r) => r.rtd_trips?.rtd_routes)
    .map((r) => ({
      trip_id: r.trip_id,
      stop_id: r.stop_id,
      stop_sequence: Number(r.stop_sequence),
      arrival_time: r.arrival_time,
      departure_time: r.departure_time,
      stop_name: r.rtd_stops?.stop_name ?? '',
      route_id: r.rtd_trips.route_id,
      route_short_name: r.rtd_trips.rtd_routes.route_short_name,
      route_long_name: r.rtd_trips.rtd_routes.route_long_name,
      route_type: Number(r.rtd_trips.rtd_routes.route_type),
      route_color: r.rtd_trips.rtd_routes.route_color ? `#${r.rtd_trips.rtd_routes.route_color}` : null,
    }));
}

/** All stop_times for the given trips (used to find shared transfer stops). */
async function stopTimesForTrips(tripIds: string[]): Promise<StopTimeRow[]> {
  if (!supabase || tripIds.length === 0) return [];
  // Supabase caps IN-list sizes comfortably below this; chunk to stay safe.
  const chunks: string[][] = [];
  for (let i = 0; i < tripIds.length; i += 100) chunks.push(tripIds.slice(i, i + 100));
  const results = await Promise.all(
    chunks.map((chunk) =>
      supabase!
        .from('rtd_stop_times')
        .select(
          'trip_id, stop_id, stop_sequence, arrival_time, departure_time, rtd_stops(stop_name), rtd_trips(route_id, rtd_routes(route_short_name, route_long_name, route_type, route_color))',
        )
        .in('trip_id', chunk),
    ),
  );
  const rows: StopTimeRow[] = [];
  for (const { data } of results) {
    for (const r of (data ?? []) as any[]) {
      if (!r.rtd_trips?.rtd_routes) continue;
      rows.push({
        trip_id: r.trip_id,
        stop_id: r.stop_id,
        stop_sequence: Number(r.stop_sequence),
        arrival_time: r.arrival_time,
        departure_time: r.departure_time,
        stop_name: r.rtd_stops?.stop_name ?? '',
        route_id: r.rtd_trips.route_id,
        route_short_name: r.rtd_trips.rtd_routes.route_short_name,
        route_long_name: r.rtd_trips.rtd_routes.route_long_name,
        route_type: Number(r.rtd_trips.rtd_routes.route_type),
        route_color: r.rtd_trips.rtd_routes.route_color ? `#${r.rtd_trips.rtd_routes.route_color}` : null,
      });
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
