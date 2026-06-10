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
  delaySeconds: number | null;
}

export function useRailLine(shortName: string) {
  const { tripUpdates, vehiclePositions, lastUpdated, error, loading } = useGtfsRt();
  const [routeId, setRouteId] = useState<string | null>(null);
  const [stops, setStops] = useState<RailStop[]>([]);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setScheduleLoading(true);
        const rid = (await getRouteId(shortName)) ?? shortName;
        if (cancelled) return;
        setRouteId(rid);

        const stopList = await getStopsForRoute(rid, 0);
        if (cancelled) return;
        setStops(stopList);
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
        delaySeconds,
      };
    });

  const arrivalsByStop: Record<string, UpcomingArrival[]> = getUpcomingArrivalsByStop(tripUpdates, effectiveRouteId);

  return {
    routeId,
    stops,
    arrivalsByStop,
    vehicles,
    lastUpdated,
    loading: loading || scheduleLoading,
    error: error || scheduleError,
  };
}
