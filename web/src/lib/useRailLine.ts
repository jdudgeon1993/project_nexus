import { useEffect, useState } from 'react';
import { useGtfsRt } from './useGtfsRt';
import { getTripDelay, getUpcomingArrivalsByStop, type UpcomingArrival } from './gtfsrt';
import { getRouteId, getScheduledDurationMinutes, getStopsForRoute, type RailStop } from './schedule';

export interface LiveVehicle {
  id: string;
  lat?: number;
  lon?: number;
  bearing?: number;
  status?: string;
  tripId?: string;
  directionId?: number;
  stopId?: string;
  delaySeconds: number | null;
}

export interface DirectionInfo {
  directionId: number;
  headsign: string;
  stops: RailStop[];
  scheduledDurationMinutes: number | null;
}

export function useRailLine(shortName: string) {
  const { tripUpdates, vehiclePositions, lastUpdated, error, loading } = useGtfsRt();
  const [routeId, setRouteId] = useState<string | null>(null);
  const [routeType, setRouteType] = useState<number | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [directions, setDirections] = useState<DirectionInfo[]>([]);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setScheduleLoading(true);
        setDirections([]);
        const route = await getRouteId(shortName);
        const rid = route?.routeId ?? shortName;
        if (cancelled) return;
        setRouteId(rid);
        setRouteType(route?.routeType ?? null);
        setColor(route?.color ?? null);

        const [stops0, stops1] = await Promise.all([getStopsForRoute(rid, 0), getStopsForRoute(rid, 1)]);
        if (cancelled) return;

        const dirs: DirectionInfo[] = [];
        if (stops0.length > 0) {
          dirs.push({
            directionId: 0,
            headsign: stops0[stops0.length - 1].stop_name,
            stops: stops0,
            scheduledDurationMinutes: getScheduledDurationMinutes(stops0),
          });
        }
        if (stops1.length > 0) {
          dirs.push({
            directionId: 1,
            headsign: stops1[stops1.length - 1].stop_name,
            stops: stops1,
            scheduledDurationMinutes: getScheduledDurationMinutes(stops1),
          });
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
        stopId: v.stopId,
        delaySeconds,
      };
    });

  const arrivalsByStop: Record<string, UpcomingArrival[]> = getUpcomingArrivalsByStop(tripUpdates, effectiveRouteId);

  // Live vehicle status (arriving/at platform/departed) reported directly by the train, per stop+direction.
  const vehicleStatusByStop: Record<string, string> = {};
  for (const v of vehicles) {
    if (!v.stopId || v.directionId == null || !v.status) continue;
    vehicleStatusByStop[`${v.stopId}|${v.directionId}`] = v.status;
  }

  return {
    routeId,
    routeType,
    color,
    directions,
    arrivalsByStop,
    vehicleStatusByStop,
    vehicles,
    lastUpdated,
    loading: loading || scheduleLoading,
    error: error || scheduleError,
  };
}
