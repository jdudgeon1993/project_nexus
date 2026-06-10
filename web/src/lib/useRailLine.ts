import { useEffect, useState } from 'react';
import { useGtfsRt } from './useGtfsRt';
import { getTripDelay, getUpcomingArrivalsByStop, type UpcomingArrival } from './gtfsrt';
import { getRouteId, getStopsForRoute, type RailStop } from './schedule';

export interface LiveVehicle {
  id: string;
  lat?: number;
  lon?: number;
  bearing?: number;
  status?: string;
  tripId?: string;
  directionId?: number;
  delaySeconds: number | null;
}

export interface DirectionInfo {
  directionId: number;
  headsign: string;
  stops: RailStop[];
}

export function useRailLine(shortName: string) {
  const { tripUpdates, vehiclePositions, lastUpdated, error, loading } = useGtfsRt();
  const [routeId, setRouteId] = useState<string | null>(null);
  const [directions, setDirections] = useState<DirectionInfo[]>([]);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setScheduleLoading(true);
        setDirections([]);
        const rid = (await getRouteId(shortName)) ?? shortName;
        if (cancelled) return;
        setRouteId(rid);

        const [stops0, stops1] = await Promise.all([getStopsForRoute(rid, 0), getStopsForRoute(rid, 1)]);
        if (cancelled) return;

        const dirs: DirectionInfo[] = [];
        if (stops0.length > 0) {
          dirs.push({ directionId: 0, headsign: stops0[stops0.length - 1].stop_name, stops: stops0 });
        }
        if (stops1.length > 0) {
          dirs.push({ directionId: 1, headsign: stops1[stops1.length - 1].stop_name, stops: stops1 });
        }
        setDirections(dirs);
      } catch (e) {
        if (!cancelled) setScheduleError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setScheduleLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shortName]);

  const effectiveRouteId = routeId ?? shortName;

  const vehicles: LiveVehicle[] = (vehiclePositions?.entity ?? [])
    .filter((e: any) => e.vehicle?.trip?.routeId === effectiveRouteId)
    .map((e: any) => {
      const v = e.vehicle;
      const { delaySeconds } = getTripDelay(tripUpdates, {
        trip_id: v.trip?.tripId,
        route_id: v.trip?.routeId,
        direction_id: v.trip?.directionId,
      });
      return {
        id: e.id,
        lat: v.position?.latitude,
        lon: v.position?.longitude,
        bearing: v.position?.bearing,
        status: v.currentStatus,
        tripId: v.trip?.tripId,
        directionId: v.trip?.directionId != null ? Number(v.trip.directionId) : undefined,
        delaySeconds,
      };
    });

  const arrivalsByStop: Record<string, UpcomingArrival[]> = getUpcomingArrivalsByStop(tripUpdates, effectiveRouteId);

  return {
    routeId,
    directions,
    arrivalsByStop,
    vehicles,
    lastUpdated,
    loading: loading || scheduleLoading,
    error: error || scheduleError,
  };
}
