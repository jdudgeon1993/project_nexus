import { supabase } from './supabase';

export interface RailStop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  stop_sequence: number;
}

export interface RailLineOption {
  shortName: string;
  longName: string;
}

/** All rail lines present in the current GTFS import (reflects active RTD service). */
export async function getRailLines(): Promise<RailLineOption[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('rtd_routes')
    .select('route_short_name, route_long_name')
    .order('route_short_name');
  if (error || !data) return [];
  return data.map((r: any) => ({ shortName: r.route_short_name, longName: r.route_long_name }));
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
