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
  routeType: number;
  color: string | null;
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
    .select('route_short_name, route_long_name, route_type, route_color')
    .order('route_short_name');
  if (error || !data) return [];
  return data.map((r: any) => ({
    shortName: r.route_short_name,
    longName: r.route_long_name,
    routeType: Number(r.route_type),
    color: r.route_color ? `#${r.route_color}` : null,
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
