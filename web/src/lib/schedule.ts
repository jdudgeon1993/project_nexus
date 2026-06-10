import { supabase } from './supabase';

export interface RailStop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  stop_sequence: number;
}

export interface NextDeparture {
  trip_id: string;
  departure_time: string;
  direction_id: number;
}

export async function getRouteId(shortName: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('rtd_routes')
    .select('route_id')
    .eq('route_short_name', shortName)
    .maybeSingle();
  if (error || !data) return null;
  return data.route_id;
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export async function getActiveServiceIds(): Promise<string[]> {
  if (!supabase) return [];
  const now = new Date();
  const dayCol = DAYS[now.getDay()];
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('rtd_calendar')
    .select('service_id')
    .eq(dayCol, 1)
    .lte('start_date', dateStr)
    .gte('end_date', dateStr);
  if (error || !data) return [];
  return data.map((r: { service_id: string }) => r.service_id);
}

/** Returns the ordered list of stops for one direction of a route, using a representative trip. */
export async function getStopsForRoute(routeId: string, directionId = 0): Promise<RailStop[]> {
  if (!supabase) return [];
  const { data: trip } = await supabase
    .from('rtd_trips')
    .select('trip_id')
    .eq('route_id', routeId)
    .eq('direction_id', directionId)
    .limit(1)
    .maybeSingle();
  if (!trip) return [];

  const { data: stopTimes } = await supabase
    .from('rtd_stop_times')
    .select('stop_id, stop_sequence, rtd_stops(stop_name, stop_lat, stop_lon)')
    .eq('trip_id', trip.trip_id)
    .order('stop_sequence');
  if (!stopTimes) return [];

  return stopTimes.map((st: any) => ({
    stop_id: st.stop_id,
    stop_sequence: st.stop_sequence,
    stop_name: st.rtd_stops?.stop_name,
    stop_lat: Number(st.rtd_stops?.stop_lat),
    stop_lon: Number(st.rtd_stops?.stop_lon),
  }));
}

/** Next scheduled departures from a stop, across all directions, for currently-active services. */
export async function getNextDepartures(
  routeId: string,
  stopId: string,
  serviceIds: string[],
  limit = 3,
): Promise<NextDeparture[]> {
  if (!supabase || serviceIds.length === 0) return [];

  const { data: trips } = await supabase
    .from('rtd_trips')
    .select('trip_id, direction_id')
    .eq('route_id', routeId)
    .in('service_id', serviceIds);
  if (!trips || trips.length === 0) return [];

  const directionByTrip = new Map(trips.map((t: any) => [t.trip_id, t.direction_id]));
  const tripIds = trips.map((t: any) => t.trip_id);

  const now = new Date();
  const nowStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const { data: stopTimes } = await supabase
    .from('rtd_stop_times')
    .select('trip_id, departure_time')
    .eq('stop_id', stopId)
    .in('trip_id', tripIds)
    .gte('departure_time', nowStr)
    .order('departure_time')
    .limit(limit);
  if (!stopTimes) return [];

  return stopTimes.map((st: any) => ({
    trip_id: st.trip_id,
    departure_time: st.departure_time,
    direction_id: directionByTrip.get(st.trip_id),
  }));
}
