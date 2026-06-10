import { useEffect, useState } from 'react';
import { useGtfsRt } from './useGtfsRt';
import { getTripDelay } from './gtfsrt';
import {
  getRouteId,
  getStopsForRoute,
  getActiveServiceIds,
  getNextDepartures,
  type RailStop,
  type NextDeparture,
} from './schedule';

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
  const [departuresByStop, setDeparturesByStop] = useState<Record<string, NextDeparture[]>>({});
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setScheduleLoading(true);
        const rid = await getRouteId(shortName);
        if (cancelled) return;
        if (!rid) {
          setScheduleError(`No route found for "${shortName}"`);
          return;
        }
        setRouteId(rid);

        const [stopList, serviceIds] = await Promise.all([getStopsForRoute(rid, 0), getActiveServiceIds()]);
        if (cancelled) return;
        setStops(stopList);

        const entries = await Promise.all(
          stopList.map(async (s) => [s.stop_id, await getNextDepartures(rid, s.stop_id, serviceIds, 3)] as const),
        );
        if (cancelled) return;
        setDeparturesByStop(Object.fromEntries(entries));
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

  const vehicles: LiveVehicle[] = (vehiclePositions?.entity ?? [])
    .filter((e: any) => routeId && e.vehicle?.trip?.routeId === routeId)
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

  return {
    routeId,
    stops,
    departuresByStop,
    vehicles,
    lastUpdated,
    loading: loading || scheduleLoading,
    error: error || scheduleError,
  };
}
