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
export function gtfsTimeToMinutes(time: string | null): number | null {
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

  // Bounding-box prefilter (~5.5km) so we don't pull every stop_time row in the system.
  const latDelta = 0.05;
  const lonDelta = latDelta / Math.cos((lat * Math.PI) / 180);
  const { data: nearbyStops, error: stopsErr } = await supabase
    .from('rtd_stops')
    .select('stop_id, stop_name, stop_lat, stop_lon')
    .gte('stop_lat', lat - latDelta)
    .lte('stop_lat', lat + latDelta)
    .gte('stop_lon', lon - lonDelta)
    .lte('stop_lon', lon + lonDelta);
  if (stopsErr || !nearbyStops || nearbyStops.length === 0) return [];

  const stopsByDistance = nearbyStops
    .filter((s: any) => s.stop_lat != null && s.stop_lon != null)
    .map((s: any) => ({
      ...s,
      distance: distanceMeters(lat, lon, Number(s.stop_lat), Number(s.stop_lon)),
    }))
    .sort((a: any, b: any) => a.distance - b.distance)
    .slice(0, 100);
  const stopInfo = new Map(stopsByDistance.map((s: any) => [s.stop_id, s]));

  const { data, error } = await supabase
    .from('rtd_stop_times')
    .select('stop_id, rtd_trips(rtd_routes(route_short_name, route_long_name, route_type))')
    .in('stop_id', [...stopInfo.keys()]);
  if (error || !data) return [];

  const best = new Map<string, NearbyRoute>();
  for (const row of data as any[]) {
    const stop = stopInfo.get(row.stop_id);
    const route = row.rtd_trips?.rtd_routes;
    if (!stop || !route) continue;
    const existing = best.get(route.route_short_name);
    if (!existing || stop.distance < existing.distanceMeters) {
      best.set(route.route_short_name, {
        shortName: route.route_short_name,
        longName: route.route_long_name,
        routeType: Number(route.route_type),
        stopName: stop.stop_name,
        distanceMeters: stop.distance,
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

/** Whether the route has scheduled service today, per calendar + calendar_dates. Null if unknown. */
export async function isRouteServiceToday(routeId: string): Promise<boolean | null> {
  if (!supabase) return null;
  const { data: trips, error: tripsErr } = await supabase
    .from('rtd_trips')
    .select('service_id')
    .eq('route_id', routeId);
  if (tripsErr || !trips || trips.length === 0) return null;
  const serviceIds = [...new Set(trips.map((t: any) => t.service_id))];

  const now = new Date();
  const today = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];

  const [{ data: cal }, { data: exceptions }] = await Promise.all([
    supabase.from('rtd_calendar').select('*').in('service_id', serviceIds),
    supabase.from('rtd_calendar_dates').select('service_id, exception_type').in('service_id', serviceIds).eq('date', today),
  ]);

  const added = new Set((exceptions ?? []).filter((e: any) => Number(e.exception_type) === 1).map((e: any) => e.service_id));
  const removed = new Set((exceptions ?? []).filter((e: any) => Number(e.exception_type) === 2).map((e: any) => e.service_id));

  if (added.size > 0) return true;
  if (!cal || cal.length === 0) return null;
  return cal.some(
    (c: any) =>
      !removed.has(c.service_id) &&
      Number(c[weekday]) === 1 &&
      c.start_date <= today &&
      c.end_date >= today,
  );
}

export interface RouteAtStop {
  routeId: string;
  shortName: string;
  longName: string;
  routeType: number;
  color: string | null;
}

/** All routes whose imported trips serve the given stop. */
export async function getRoutesServingStop(stopId: string): Promise<RouteAtStop[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('rtd_stop_times')
    .select('rtd_trips(route_id, rtd_routes(route_short_name, route_long_name, route_type, route_color))')
    .eq('stop_id', stopId);
  if (error || !data) return [];
  const seen = new Map<string, RouteAtStop>();
  for (const row of data as any[]) {
    const route = row.rtd_trips?.rtd_routes;
    if (!route) continue;
    seen.set(route.route_short_name, {
      routeId: row.rtd_trips.route_id,
      shortName: route.route_short_name,
      longName: route.route_long_name,
      routeType: Number(route.route_type),
      color: route.route_color ? `#${route.route_color}` : null,
    });
  }
  return [...seen.values()].sort((a, b) => a.shortName.localeCompare(b.shortName));
}

export interface StopSearchResult {
  stopId: string;
  stopName: string;
  lat: number;
  lon: number;
}

/** Search stops by name for the trip planner. */
export async function searchStops(query: string, limit = 8): Promise<StopSearchResult[]> {
  if (!supabase || query.trim().length < 2) return [];
  const { data, error } = await supabase
    .from('rtd_stops')
    .select('stop_id, stop_name, stop_lat, stop_lon')
    .ilike('stop_name', `%${query.trim()}%`)
    .limit(limit);
  if (error || !data) return [];
  return data.map((s: any) => ({
    stopId: s.stop_id,
    stopName: s.stop_name,
    lat: Number(s.stop_lat),
    lon: Number(s.stop_lon),
  }));
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

/** For each given stop, the other routes reachable via a same-station transfer (excluding the current route). */
export async function getTransfersForStops(stopIds: string[], currentRouteShortName: string): Promise<Record<string, StopTransfer[]>> {
  if (!supabase || stopIds.length === 0) return {};

  const { data: transfers, error } = await supabase
    .from('rtd_transfers')
    .select('from_stop_id, to_stop_id')
    .in('from_stop_id', stopIds);
  if (error || !transfers || transfers.length === 0) return {};

  const toStopIds = [...new Set(transfers.map((t: any) => t.to_stop_id).filter((id: string) => !stopIds.includes(id)))];
  if (toStopIds.length === 0) return {};

  const { data: stopTimes, error: stErr } = await supabase
    .from('rtd_stop_times')
    .select('stop_id, rtd_trips(rtd_routes(route_short_name, route_long_name))')
    .in('stop_id', toStopIds);
  if (stErr || !stopTimes) return {};

  const routesByStop = new Map<string, Map<string, StopTransfer>>();
  for (const row of stopTimes as any[]) {
    const route = row.rtd_trips?.rtd_routes;
    if (!route || route.route_short_name === currentRouteShortName) continue;
    if (!routesByStop.has(row.stop_id)) routesByStop.set(row.stop_id, new Map());
    routesByStop.get(row.stop_id)!.set(route.route_short_name, {
      routeShortName: route.route_short_name,
      routeLongName: route.route_long_name,
    });
  }

  const result: Record<string, StopTransfer[]> = {};
  for (const t of transfers as any[]) {
    const routes = routesByStop.get(t.to_stop_id);
    if (!routes || routes.size === 0) continue;
    if (!result[t.from_stop_id]) result[t.from_stop_id] = [];
    for (const r of routes.values()) {
      if (!result[t.from_stop_id].some((existing) => existing.routeShortName === r.routeShortName)) {
        result[t.from_stop_id].push(r);
      }
    }
  }
  return result;
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
