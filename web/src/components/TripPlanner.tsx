import { useEffect, useRef, useState } from 'react';
import { searchStops, routeTypeLabel, type StopSearchResult } from '../lib/schedule';
import { planTrip, type Itinerary } from '../lib/planner';
import type { ParsedFeed } from '../lib/gtfsrt';

function formatGtfsTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const hour24 = h % 24;
  const period = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function StopInput({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: StopSearchResult | null;
  onSelect: (stop: StopSearchResult | null) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StopSearchResult[]>([]);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    debounce.current = setTimeout(() => {
      searchStops(query).then(setResults);
    }, 300);
    return () => clearTimeout(debounce.current);
  }, [query]);

  if (value) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
        <span className="rounded bg-slate-800 px-2 py-1 text-sm text-slate-200">{value.stopName}</span>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stop or station…"
        className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder:text-slate-500"
      />
      {results.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border border-slate-700 bg-slate-800 shadow-lg">
          {results.map((s) => (
            <button
              key={s.stopId}
              type="button"
              onClick={() => {
                onSelect(s);
                setQuery('');
                setResults([]);
              }}
              className="block w-full truncate px-2 py-1.5 text-left text-sm text-slate-300 hover:bg-slate-700"
            >
              {s.stopName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TripPlanner({ tripUpdates }: { tripUpdates: ParsedFeed | null }) {
  const [origin, setOrigin] = useState<StopSearchResult | null>(null);
  const [destination, setDestination] = useState<StopSearchResult | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function plan() {
    if (!origin || !destination) return;
    setState('loading');
    try {
      const results = await planTrip(origin.stopId, destination.stopId, tripUpdates);
      setItineraries(results);
      setState('done');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div>
        <h3 className="text-lg font-semibold">Trip Planner</h3>
        <p className="text-xs text-slate-500">
          Combines buses and trains — direct routes and one-transfer connections (e.g. bus to rail).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <StopInput label="From" value={origin} onSelect={setOrigin} />
        <StopInput label="To" value={destination} onSelect={setDestination} />
        <div className="flex items-end">
          <button
            type="button"
            onClick={plan}
            disabled={!origin || !destination || state === 'loading'}
            className="rounded bg-sky-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-40"
          >
            {state === 'loading' ? 'Planning…' : 'Plan trip'}
          </button>
        </div>
      </div>

      {state === 'error' && <p className="text-sm text-red-400">Something went wrong planning the trip.</p>}
      {state === 'done' && itineraries.length === 0 && (
        <p className="text-sm text-slate-400">
          No upcoming trips found for the rest of today. Try different stops — the planner covers direct and
          one-transfer connections from scheduled departures.
        </p>
      )}

      {itineraries.map((it, i) => (
        <div key={i} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-200">
              {formatGtfsTime(it.legs[0].boardTime)} → {formatGtfsTime(it.legs[it.legs.length - 1].alightTime)}
            </span>
            <span className="text-slate-400">
              {it.totalMinutes} min · {it.transfers === 0 ? 'direct' : `${it.transfers} transfer`}
            </span>
          </div>
          <div className="space-y-2">
            {it.legs.map((leg, j) => (
              <div key={j} className="flex items-start gap-2 text-sm">
                <span
                  className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-bold text-slate-950"
                  style={{ backgroundColor: leg.routeColor ?? '#38bdf8' }}
                >
                  {leg.routeShortName}
                </span>
                <div className="min-w-0">
                  <p className="text-slate-200">
                    Board at <span className="font-medium">{leg.boardStopName}</span> ·{' '}
                    {formatGtfsTime(leg.boardTime)}
                    {leg.delaySeconds != null && Math.abs(leg.delaySeconds) >= 60 && (
                      <span className={leg.delaySeconds > 0 ? 'text-yellow-400' : 'text-emerald-400'}>
                        {' '}
                        ({leg.delaySeconds > 0 ? '+' : ''}
                        {Math.round(leg.delaySeconds / 60)} min live)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">
                    {routeTypeLabel(leg.routeType)} · arrive {leg.alightStopName} at {formatGtfsTime(leg.alightTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-[10px] text-slate-600">
        Times are from RTD's schedule; live delay shown when a matching vehicle is reporting. Transfer buffer: 3 min.
      </p>
    </div>
  );
}
