import { supabase } from './supabase';

export interface RailStop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  stop_sequence: number;
  arrival_time: string | null;
  departure_time: string | null;
}

/** Parses a GTFS HH:MM:SS time (hours can exceed 24 for next-day trips) into total minutes. */
function gtfsTimeToMinutes(time: string | null): number | null {
  if (!time) return null;
  const [h, m, s] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m + (s ?? 0) / 60;
}

/** Scheduled end-to-end trip duration in minutes, derived from the representative trip's stop times. */
export function getScheduledDurationMinutes(stops: RailStop[]): number | null {
  if (stops.length < 2) return null;
  const start = gtfsTimeToMinutes(stops[0].departure_time ?? stops[0].arrival_time);
  const end = gtfsTimeToMinutes(stops[stops.length - 1].arrival_time ?? stops[stops.length - 1].departure_time);
  if (start == null || end == null || end < start) return null;
  return Math.round(end - start);
}

export interface RailLineOption {
  shortName: string;
  longName: string;
  routeType: number;
  color: string | null;
  sortOrder: number | null;
}

/** GTFS route_type: 2 = commuter rail, 0/1 = light rail/subway, 3 = bus. */
export function routeTypeLabel(routeType: number): string {
  if (routeType === 2) return 'Commuter Rail';
  if (routeType === 3) return 'Bus';
  return 'Light Rail';
}

/** All rail lines present in the current GTFS import (reflects active RTD service). */
export async function getRailLines(): Promise<RailLineOption[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('rtd_routes')
    .select('route_short_name, route_long_name, route_type, route_color, route_sort_order')
    .order('route_sort_order', { ascending: true, nullsFirst: false })
    .order('route_short_name');
  if (error || !data) return [];
  return data.map((r: any) => ({
    shortName: r.route_short_name,
    longName: r.route_long_name,
    routeType: Number(r.route_type),
    color: r.route_color ? `#${r.route_color}` : null,
    sortOrder: r.route_sort_order != null ? Number(r.route_sort_order) : null,
  }));
}

/** Approximate distance in meters between two lat/lon points (haversine). */
function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export interface NearbyRoute {
  shortName: string;
  longName: string;
  routeType: number;
  stopName: string;
  distanceMeters: number;
}

/** Routes whose representative stops are closest to the given coordinates, nearest first. */
export async function getNearestRoutes(lat: number, lon: number, limit = 5): Promise<NearbyRoute[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('rtd_stop_times')
    .select('rtd_stops(stop_name, stop_lat, stop_lon), rtd_trips(route_id, rtd_routes(route_short_name, route_long_name, route_type))');
  if (error || !data) return [];

  const best = new Map<string, NearbyRoute>();
  for (const row of data as any[]) {
    const stop = row.rtd_stops;
    const route = row.rtd_trips?.rtd_routes;
    if (!stop || !route || stop.stop_lat == null || stop.stop_lon == null) continue;
    const dist = distanceMeters(lat, lon, Number(stop.stop_lat), Number(stop.stop_lon));
    const key = route.route_short_name;
    const existing = best.get(key);
    if (!existing || dist < existing.distanceMeters) {
      best.set(key, {
        shortName: route.route_short_name,
        longName: route.route_long_name,
        routeType: Number(route.route_type),
        stopName: stop.stop_name,
        distanceMeters: dist,
      });
    }
  }

  return [...best.values()].sort((a, b) => a.distanceMeters - b.distanceMeters).slice(0, limit);
}

export async function getRouteId(shortName: string): Promise<{ routeId: string; routeType: number; color: string | null } | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('rtd_routes')
    .select('route_id, route_type, route_color')
    .eq('route_short_name', shortName)
    .maybeSingle();
  if (error || !data) return null;
  return {
    routeId: data.route_id,
    routeType: Number(data.route_type),
    color: data.route_color ? `#${data.route_color}` : null,
  };
}

export interface ShapePoint {
  lat: number;
  lon: number;
  sequence: number;
}

export interface TripAccessibility {
  wheelchairAccessible: boolean | null;
  bikesAllowed: boolean | null;
}

export interface RouteFare {
  price: number;
  currency: string;
}

/** Fare for a route, derived from fare_rules + fare_attributes (first match). */
export async function getRouteFare(routeId: string): Promise<RouteFare | null> {
  if (!supabase) return null;
  const { data: rules, error: ruleErr } = await supabase
    .from('rtd_fare_rules')
    .select('fare_id')
    .eq('route_id', routeId)
    .limit(1);
  if (ruleErr || !rules || rules.length === 0) return null;
  const { data: attr, error: attrErr } = await supabase
    .from('rtd_fare_attributes')
    .select('price, currency_type')
    .eq('fare_id', rules[0].fare_id)
    .maybeSingle();
  if (attrErr || !attr) return null;
  return { price: Number(attr.price), currency: attr.currency_type ?? 'USD' };
}

/** Average headway in minutes for a trip, if frequency-based service is defined. */
export async function getFrequencyMinutes(tripId: string): Promise<number | null> {
  if (!supabase || !tripId) return null;
  const { data, error } = await supabase
    .from('rtd_frequencies')
    .select('headway_secs')
    .eq('trip_id', tripId);
  if (error || !data || data.length === 0) return null;
  const avg = data.reduce((sum: number, f: any) => sum + Number(f.headway_secs), 0) / data.length;
  return Math.round(avg / 60);
}

export interface StopTransfer {
  routeShortName: string;
  routeLongName: string;
}

/** Other routes reachable via a same-station transfer from the given stop. */
export async function getTransfersForStop(stopId: string): Promise<StopTransfer[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('rtd_transfers')
    .select('to_stop_id')
    .eq('from_stop_id', stopId)
    .neq('to_stop_id', stopId);
  if (error || !data || data.length === 0) return [];

  const toStopIds = [...new Set(data.map((t: any) => t.to_stop_id))];
  const { data: stopTimes, error: stErr } = await supabase
    .from('rtd_stop_times')
    .select('stop_id, rtd_trips(rtd_routes(route_short_name, route_long_name))')
    .in('stop_id', toStopIds);
  if (stErr || !stopTimes) return [];

  const seen = new Map<string, StopTransfer>();
  for (const row of stopTimes as any[]) {
    const route = row.rtd_trips?.rtd_routes;
    if (!route) continue;
    seen.set(route.route_short_name, {
      routeShortName: route.route_short_name,
      routeLongName: route.route_long_name,
    });
  }
  return [...seen.values()];
}

/** GTFS 1 = yes, 2 = no, 0/missing = unknown. */
function gtfsBool(value: unknown): boolean | null {
  const n = Number(value);
  if (n === 1) return true;
  if (n === 2) return false;
  return null;
}

/** Returns the ordered list of stops for one direction of a route, using a representative trip. */
export async function getStopsForRoute(routeId: string, directionId = 0): Promise<{ stops: RailStop[]; shapeId: string | null; tripId: string | null; accessibility: TripAccessibility }> {
  const empty = { stops: [], shapeId: null, tripId: null, accessibility: { wheelchairAccessible: null, bikesAllowed: null } };
  if (!supabase) return empty;
  const { data: trip } = await supabase
    .from('rtd_trips')
    .select('trip_id, shape_id, wheelchair_accessible, bikes_allowed')
    .eq('route_id', routeId)
    .eq('direction_id', directionId)
    .limit(1)
    .maybeSingle();
  if (!trip) return empty;

  const accessibility: TripAccessibility = {
    wheelchairAccessible: gtfsBool(trip.wheelchair_accessible),
    bikesAllowed: gtfsBool(trip.bikes_allowed),
  };

  const { data: stopTimes } = await supabase
    .from('rtd_stop_times')
    .select('stop_id, stop_sequence, arrival_time, departure_time, rtd_stops(stop_name, stop_lat, stop_lon)')
    .eq('trip_id', trip.trip_id)
    .order('stop_sequence');
  if (!stopTimes) return { stops: [], shapeId: trip.shape_id ?? null, tripId: trip.trip_id ?? null, accessibility };

  const stops = stopTimes.map((st: any) => ({
    stop_id: st.stop_id,
    stop_sequence: st.stop_sequence,
    stop_name: st.rtd_stops?.stop_name,
    stop_lat: Number(st.rtd_stops?.stop_lat),
    stop_lon: Number(st.rtd_stops?.stop_lon),
    arrival_time: st.arrival_time ?? null,
    departure_time: st.departure_time ?? null,
  }));

  return { stops, shapeId: trip.shape_id ?? null, tripId: trip.trip_id ?? null, accessibility };
}

/** Returns the ordered shape points (route geometry) for a given shape_id. */
export async function getShapePoints(shapeId: string): Promise<ShapePoint[]> {
  if (!supabase || !shapeId) return [];
  const { data, error } = await supabase
    .from('rtd_shapes')
    .select('shape_pt_lat, shape_pt_lon, shape_pt_sequence')
    .eq('shape_id', shapeId)
    .order('shape_pt_sequence');
  if (error || !data) return [];
  return data.map((p: any) => ({
    lat: Number(p.shape_pt_lat),
    lon: Number(p.shape_pt_lon),
    sequence: p.shape_pt_sequence,
  }));
}
