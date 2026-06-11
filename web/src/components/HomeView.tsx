import { useEffect, useState } from 'react';
import { loadSavedTrips, type SavedTrip } from '../lib/savedTrips';
import { getRouteId, type RailLineOption } from '../lib/schedule';
import { supabase } from '../lib/supabase';
import StatusBanner from './StatusBanner';
import type { ParsedFeed } from '../lib/gtfsrt';

interface ResolvedTrip extends SavedTrip {
  routeColor: string | null;
  boardStopName: string;
  destination: string;
}

async function resolveTrip(trip: SavedTrip, lines: RailLineOption[]): Promise<ResolvedTrip> {
  const firstRoute = trip.chain[0];
  const lastRoute = trip.chain[trip.chain.length - 1];
  const line = lines.find((l) => l.shortName === firstRoute);

  let boardStopName = 'Start of line';
  if (trip.boardStopId && supabase) {
    const { data } = await supabase.from('rtd_stops').select('stop_name').eq('stop_id', trip.boardStopId).maybeSingle();
    if (data) boardStopName = data.stop_name;
  }

  let destination = lastRoute;
  if (trip.exitStopId && supabase) {
    const { data } = await supabase.from('rtd_stops').select('stop_name').eq('stop_id', trip.exitStopId).maybeSingle();
    if (data) destination = data.stop_name;
  } else {
    const r = await getRouteId(lastRoute);
    destination = r ? `${lastRoute} terminus` : lastRoute;
  }

  return {
    ...trip,
    routeColor: line?.color ?? null,
    boardStopName,
    destination,
  };
}

export default function HomeView({
  tripUpdates,
  lines,
  onPlanTrip,
}: {
  tripUpdates: ParsedFeed | null;
  lines: RailLineOption[];
  onPlanTrip: () => void;
}) {
  const [trips, setTrips] = useState<ResolvedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = loadSavedTrips();
    if (saved.length === 0 || lines.length === 0) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all(saved.map((t) => resolveTrip(t, lines))).then((resolved) => {
      if (!cancelled) {
        setTrips(resolved);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lines]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading your commute…</p>;
  }

  if (trips.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
        <p className="text-slate-300">No saved trips yet.</p>
        <p className="mt-1 text-sm text-slate-500">
          Build a route combo in the Plan tab and tap <span className="text-sky-300">☆ Save</span> to pin it here for
          one-tap status.
        </p>
        <button
          type="button"
          onClick={onPlanTrip}
          className="mt-3 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        >
          Plan a trip
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">My Commute</h3>
      {trips.map((trip) => (
        <div key={trip.name} className="space-y-2">
          <p className="text-sm font-medium text-slate-300">{trip.name}</p>
          {trip.boardStopId ? (
            <StatusBanner
              tripUpdates={tripUpdates}
              routeShortName={trip.chain[0]}
              routeColor={trip.routeColor}
              stopId={trip.boardStopId}
              stopName={trip.boardStopName}
              destinationLabel={trip.destination}
            />
          ) : (
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-sm text-slate-400">
              {trip.chain.join(' → ')} — board stop not set; open in Plan for live status.
            </div>
          )}
          {trip.chain.length > 1 && (
            <p className="pl-1 text-xs text-slate-500">
              Then transfer to {trip.chain.slice(1).join(' → ')} toward {trip.destination}
            </p>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onPlanTrip}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 text-sm font-medium text-slate-300 hover:border-sky-500 hover:text-sky-300"
      >
        Open trip planner →
      </button>
    </div>
  );
}
