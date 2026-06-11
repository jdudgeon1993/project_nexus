import { useEffect, useState } from 'react';
import { getRouteId } from '../lib/schedule';
import { getArrivalsForStop } from '../lib/gtfsrt';
import type { ParsedFeed } from '../lib/gtfsrt';

/**
 * Color-coded "ARRIVING NOW / DEPARTING SOON / X MIN" banner for a route at a
 * stop, driven by live GTFS-RT predictions (falls back to a neutral state
 * when nothing is reporting).
 */
export default function StatusBanner({
  tripUpdates,
  routeShortName,
  routeColor,
  stopId,
  stopName,
  destinationLabel,
}: {
  tripUpdates: ParsedFeed | null;
  routeShortName: string;
  routeColor: string | null;
  stopId: string;
  stopName: string;
  destinationLabel: string;
}) {
  const [routeId, setRouteId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getRouteId(routeShortName).then((r) => {
      if (!cancelled) setRouteId(r?.routeId ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [routeShortName]);

  const arrivals = routeId ? getArrivalsForStop(tripUpdates, stopId, 20).filter((a) => a.routeId === routeId) : [];
  const next = arrivals[0];
  const minsAway = next ? Math.round((next.time * 1000 - Date.now()) / 60000) : null;

  let label: string;
  let sublabel: string;
  let classes: string;
  if (minsAway == null) {
    label = 'NO LIVE DATA';
    sublabel = `${stopName} · check the schedule`;
    classes = 'border-slate-700 bg-slate-800/60 text-slate-300';
  } else if (minsAway <= 0) {
    label = 'ARRIVING NOW';
    sublabel = `${stopName}${next?.delaySeconds ? ` · ${next.delaySeconds > 0 ? '+' : ''}${Math.round(next.delaySeconds / 60)} min` : ''}`;
    classes = 'border-red-500/50 bg-red-500/10 text-red-400 animate-pulse';
  } else if (minsAway <= 5) {
    label = 'DEPARTING SOON';
    sublabel = `${stopName} · ${minsAway} min`;
    classes = 'border-amber-500/50 bg-amber-500/10 text-amber-400';
  } else {
    label = `${minsAway} MIN`;
    sublabel = `${stopName} · live`;
    classes = 'border-sky-500/40 bg-sky-500/10 text-sky-300';
  }

  return (
    <div className={`rounded-xl border p-3 ${classes}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-sm font-bold text-slate-950"
            style={{ backgroundColor: routeColor ?? '#38bdf8' }}
          >
            {routeShortName}
          </span>
          <div className="text-sm font-medium leading-tight text-slate-100">
            To {destinationLabel}
            <div className="text-xs font-normal text-slate-400">{sublabel}</div>
          </div>
        </div>
        <span className="text-lg font-bold tracking-tight">{label}</span>
      </div>
    </div>
  );
}
