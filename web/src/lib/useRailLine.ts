import { useEffect, useRef, useState } from 'react';
import { useGtfsRt } from './useGtfsRt';
import { getSkippedStops, getTripDelay, getUpcomingArrivalsByStop, type UpcomingArrival } from './gtfsrt';
import { getFrequencyMinutes, getRouteFare, getRouteId, getScheduledDurationMinutes, getShapePoints, getStopsForRoute, getTransfersForStops, isRouteServiceToday, type RailStop, type RouteFare, type ShapePoint, type StopTransfer, type TripAccessibility } from './schedule';

export interface LiveVehicle {
  id: string;
  lat?: number;
  lon?: number;
  bearing?: number;
  speedMph?: number;
  speedPending?: boolean;
  status?: string;
  tripId?: string;
  directionId?: number;
  stopId?: string;
  delaySeconds: number | null;
  occupancyStatus?: string;
}

export interface DirectionInfo {
  directionId: number;
  headsign: string;
  stops: RailStop[];
  scheduledDurationMinutes: number | null;
  shape: ShapePoint[];
  accessibility: TripAccessibility;
  frequencyMinutes: number | null;
}

/** Great-circle distance in meters between two lat/lon points. */
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function useRailLine(shortName: string | null) {
  const { tripUpdates, vehiclePositions, alerts, lastUpdated, error, loading } = useGtfsRt();
  const [routeId, setRouteId] = useState<string | null>(null);
  const [routeType, setRouteType] = useState<number | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [directions, setDirections] = useState<DirectionInfo[]>([]);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [fare, setFare] = useState<RouteFare | null>(null);
  const [transfersByStop, setTransfersByStop] = useState<Record<string, StopTransfer[]>>({});
  const [serviceToday, setServiceToday] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (shortName == null) {
      setRouteId(null);
      setRouteType(null);
      setColor(null);
      setDirections([]);
      setFare(null);
      setTransfersByStop({});
      setServiceToday(null);
      setScheduleError(null);
      setScheduleLoading(false);
      return;
    }

    (async () => {
      try {
        setScheduleLoading(true);
        setScheduleError(null);
        setDirections([]);
        setFare(null);
        setTransfersByStop({});
        setServiceToday(null);
        const route = await getRouteId(shortName);
        const rid = route?.routeId ?? shortName;
        if (cancelled) return;
        setRouteId(rid);
        setRouteType(route?.routeType ?? null);
        setColor(route?.color ?? null);

        const [dir0, dir1] = await Promise.all([getStopsForRoute(rid, 0), getStopsForRoute(rid, 1)]);
        if (cancelled) return;

        const [shape0, shape1, freq0, freq1, routeFare] = await Promise.all([
          dir0.shapeId ? getShapePoints(dir0.shapeId) : Promise.resolve([]),
          dir1.shapeId ? getShapePoints(dir1.shapeId) : Promise.resolve([]),
          dir0.tripId ? getFrequencyMinutes(dir0.tripId) : Promise.resolve(null),
          dir1.tripId ? getFrequencyMinutes(dir1.tripId) : Promise.resolve(null),
          getRouteFare(rid),
        ]);
        if (cancelled) return;

        setFare(routeFare);

        const dirs: DirectionInfo[] = [];
        if (dir0.stops.length > 0) {
          dirs.push({
            directionId: 0,
            headsign: dir0.stops[dir0.stops.length - 1].stop_name,
            stops: dir0.stops,
            scheduledDurationMinutes: getScheduledDurationMinutes(dir0.stops),
            shape: shape0,
            accessibility: dir0.accessibility,
            frequencyMinutes: freq0,
          });
        }
        if (dir1.stops.length > 0) {
          dirs.push({
            directionId: 1,
            headsign: dir1.stops[dir1.stops.length - 1].stop_name,
            stops: dir1.stops,
            scheduledDurationMinutes: getScheduledDurationMinutes(dir1.stops),
            shape: shape1,
            accessibility: dir1.accessibility,
            frequencyMinutes: freq1,
          });
        }
        setDirections(dirs);

        const allStopIds = [...new Set(dirs.flatMap((d) => d.stops.map((s) => s.stop_id)))];
        getTransfersForStops(allStopIds, shortName).then((t) => {
          if (!cancelled) setTransfersByStop(t);
        });
        isRouteServiceToday(rid).then((s) => {
          if (!cancelled) setServiceToday(s);
        });
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

  // RTD doesn't populate VehiclePosition.speed, so estimate it from the
  // distance/time delta between consecutive position fixes for each vehicle.
  const lastFixByVehicle = useRef<Map<string, { lat: number; lon: number; timestamp: number; fixCount: number; speedMph?: number }>>(new Map());

  const vehicles: LiveVehicle[] = (vehiclePositions?.entity ?? [])
    .filter((e: any) => effectiveRouteId != null && e.vehicle?.trip?.routeId === effectiveRouteId)
    .map((e: any) => {
      const v = e.vehicle;
      const { delaySeconds } = getTripDelay(tripUpdates, {
        trip_id: v.trip?.tripId,
        route_id: v.trip?.routeId,
        direction_id: v.trip?.directionId,
      });

      const lat = v.position?.latitude;
      const lon = v.position?.longitude;
      // Use our own poll time rather than RTD's per-vehicle timestamp, which
      // doesn't reliably advance between polls for every vehicle.
      const timestamp = lastUpdated != null ? lastUpdated.getTime() / 1000 : undefined;
      let speedMph: number | undefined = v.position?.speed != null ? v.position.speed * 2.23694 : undefined;

      const vehicleId = v.vehicle?.id ?? v.trip?.tripId ?? e.id;
      let fixCount = 0;
      if (speedMph == null && lat != null && lon != null && timestamp != null) {
        const prev = lastFixByVehicle.current.get(vehicleId);
        fixCount = (prev?.fixCount ?? 0) + 1;
        if (prev && timestamp > prev.timestamp) {
          const dtSeconds = timestamp - prev.timestamp;
          const meters = haversineMeters(prev.lat, prev.lon, lat, lon);
          const mph = (meters / dtSeconds) * 2.23694;
          // Ignore implausible jumps (GPS noise, stop-time updates) above ~90 mph.
          if (mph <= 90) speedMph = mph;
        }
        // Sticky: if this poll didn't yield a fresh estimate, keep showing the
        // last known good one rather than flashing back to "no data".
        if (speedMph == null) speedMph = prev?.speedMph;
        lastFixByVehicle.current.set(vehicleId, { lat, lon, timestamp, fixCount, speedMph });
      }

      return {
        id: e.id,
        lat,
        lon,
        bearing: v.position?.bearing,
        speedMph,
        speedPending: speedMph == null && fixCount > 0 && fixCount < 2,
        status: v.currentStatus,
        tripId: v.trip?.tripId,
        directionId: v.trip?.directionId != null ? Number(v.trip.directionId) : undefined,
        stopId: v.stopId,
        delaySeconds,
        occupancyStatus: v.occupancyStatus && v.occupancyStatus !== 'NO_DATA_AVAILABLE' ? v.occupancyStatus : undefined,
      };
    });

  const arrivalsByStop: Record<string, UpcomingArrival[]> = getUpcomingArrivalsByStop(tripUpdates, effectiveRouteId ?? '');
  const skippedStops: Set<string> = getSkippedStops(tripUpdates, effectiveRouteId ?? '');

  // Live vehicle status (arriving/at platform/departed) reported directly by the train, per stop+direction.
  const vehicleStatusByStop: Record<string, string> = {};
  const vehicleByStop: Record<string, LiveVehicle> = {};
  const vehicleByTripId: Record<string, LiveVehicle> = {};
  for (const v of vehicles) {
    if (v.tripId) vehicleByTripId[v.tripId] = v;
    if (!v.stopId || v.directionId == null || !v.status) continue;
    vehicleStatusByStop[`${v.stopId}|${v.directionId}`] = v.status;
    vehicleByStop[`${v.stopId}|${v.directionId}`] = v;
  }

  return {
    routeId,
    routeType,
    color,
    fare,
    transfersByStop,
    serviceToday,
    directions,
    arrivalsByStop,
    skippedStops,
    vehicleStatusByStop,
    vehicleByStop,
    vehicleByTripId,
    vehicles,
    tripUpdates,
    vehiclePositions,
    alerts,
    lastUpdated,
    loading: loading || scheduleLoading,
    error: error || scheduleError,
  };
}
