import { useEffect, useRef, useState } from 'react';
import { fetchGtfsRt } from './api';
import { decodeFeed, type ParsedFeed } from './gtfsrt';

export interface GtfsRtState {
  tripUpdates: ParsedFeed | null;
  vehiclePositions: ParsedFeed | null;
  alerts: ParsedFeed | null;
  lastUpdated: Date | null;
  error: string | null;
  loading: boolean;
}

const POLL_INTERVAL_MS = 30_000;

export function useGtfsRt(): GtfsRtState {
  const [state, setState] = useState<GtfsRtState>({
    tripUpdates: null,
    vehiclePositions: null,
    alerts: null,
    lastUpdated: null,
    error: null,
    loading: true,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function poll() {
      try {
        const [tu, vp, al] = await Promise.all([
          fetchGtfsRt('TripUpdate').then(decodeFeed),
          fetchGtfsRt('VehiclePosition').then(decodeFeed),
          fetchGtfsRt('Alerts').then(decodeFeed),
        ]);
        if (!mounted.current) return;
        setState({
          tripUpdates: tu,
          vehiclePositions: vp,
          alerts: al,
          lastUpdated: new Date(),
          error: null,
          loading: false,
        });
      } catch (err) {
        if (!mounted.current) return;
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to fetch GTFS-RT feeds',
          loading: false,
        }));
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  return state;
}
