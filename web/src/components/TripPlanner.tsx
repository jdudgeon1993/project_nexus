import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  getRailLines,
  getRouteOverview,
  getRoutesServingStop,
  routeTypeLabel,
  searchStops,
  type RailLineOption,
  type RouteAtStop,
  type RouteOverview,
  type StopSearchResult,
} from '../lib/schedule';
import { planChain, type Itinerary } from '../lib/planner';
import type { ParsedFeed } from '../lib/gtfsrt';

const ChainMap = lazy(() => import('./ChainMap'));

const TRANSFER_ESTIMATE_MINUTES = 5;

/** "45 min" under an hour, "1 hr 52 min" above. */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

function formatGtfsTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const hour24 = h % 24;
  const period = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function RouteBadge({ name, color }: { name: string; color: string | null }) {
  return (
    <span
      className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold text-slate-950"
      style={{ backgroundColor: color ?? '#38bdf8' }}
    >
      {name}
    </span>
  );
}

/** "Not sure which route?" helper: search a stop, see which routes serve it, tap to add to the chain. */
function RouteFinder({ onPick }: { onPick: (shortName: string) => void }) {
  const [query, setQuery] = useState('');
  const [stops, setStops] = useState<StopSearchResult[]>([]);
  const [picked, setPicked] = useState<StopSearchResult | null>(null);
  const [routes, setRoutes] = useState<RouteAtStop[] | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (query.trim().length < 2) {
      setStops([]);
      return;
    }
    debounce.current = setTimeout(() => searchStops(query).then(setStops), 300);
    return () => clearTimeout(debounce.current);
  }, [query]);

  useEffect(() => {
    if (!picked) {
      setRoutes(null);
      return;
    }
    let cancelled = false;
    setRoutes(null);
    getRoutesServingStop(picked.stopId).then((r) => {
      if (!cancelled) setRoutes(r);
    });
    return () => {
      cancelled = true;
    };
  }, [picked?.stopId]);

  return (
    <details className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-sm">
      <summary className="cursor-pointer text-slate-400">Not sure which route? Search a stop near you</summary>
      <div className="relative mt-2 space-y-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPicked(null);
          }}
          placeholder="Search stop name…"
          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder:text-slate-500"
        />
        {!picked && stops.length > 0 && (
          <div className="absolute z-10 max-h-44 w-full overflow-y-auto rounded border border-slate-700 bg-slate-800 shadow-lg">
            {stops.map((s) => (
              <button
                key={s.stopId}
                type="button"
                onClick={() => {
                  setPicked(s);
                  setStops([]);
                }}
                className="block w-full truncate px-2 py-1.5 text-left text-sm text-slate-300 hover:bg-slate-700"
              >
                {s.stopName}
              </button>
            ))}
          </div>
        )}
        {picked && (
          <div>
            <p className="mb-1 text-xs text-slate-500">Routes at {picked.stopName} — tap to add:</p>
            {routes === null ? (
              <p className="text-xs text-slate-500">Loading…</p>
            ) : routes.length === 0 ? (
              <p className="text-xs text-slate-500">No routes found at this stop.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {routes.map((r) => (
                  <button key={r.shortName} type="button" onClick={() => onPick(r.shortName)} title={r.longName}>
                    <RouteBadge name={r.shortName} color={r.color} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </details>
  );
}

export default function TripPlanner({ tripUpdates }: { tripUpdates: ParsedFeed | null }) {
  const [allLines, setAllLines] = useState<RailLineOption[]>([]);
  const [chain, setChain] = useState<string[]>([]);
  const [routeQuery, setRouteQuery] = useState('');

  // Route-scoped stop pickers: board on the FIRST route, exit on the LAST.
  const [firstOverview, setFirstOverview] = useState<RouteOverview | null>(null);
  const [lastOverview, setLastOverview] = useState<RouteOverview | null>(null);
  const [boardStopId, setBoardStopId] = useState('');
  const [exitStopId, setExitStopId] = useState('');

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [fallbackRoutes, setFallbackRoutes] = useState<RouteOverview[]>([]);
  const [showingDayStart, setShowingDayStart] = useState(false);

  // When to travel: leave now (default), depart at a time, or arrive by a time.
  const [timeMode, setTimeMode] = useState<'now' | 'depart' | 'arrive'>('now');
  const [timeValue, setTimeValue] = useState('');

  function timeValueToMinutes(): number | null {
    const [h, m] = timeValue.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  }

  useEffect(() => {
    getRailLines().then(setAllLines);
  }, []);

  const firstRoute = chain[0] ?? null;
  const lastRoute = chain[chain.length - 1] ?? null;

  useEffect(() => {
    setBoardStopId('');
    if (!firstRoute) {
      setFirstOverview(null);
      return;
    }
    let cancelled = false;
    setFirstOverview(null);
    getRouteOverview(firstRoute).then((o) => {
      if (!cancelled) setFirstOverview(o);
    });
    return () => {
      cancelled = true;
    };
  }, [firstRoute]);

  useEffect(() => {
    setExitStopId('');
    if (!lastRoute) {
      setLastOverview(null);
      return;
    }
    if (lastRoute === firstRoute) return; // single-route chain reuses firstOverview
    let cancelled = false;
    setLastOverview(null);
    getRouteOverview(lastRoute).then((o) => {
      if (!cancelled) setLastOverview(o);
    });
    return () => {
      cancelled = true;
    };
  }, [lastRoute, firstRoute]);

  const exitOverview = lastRoute === firstRoute ? firstOverview : lastOverview;

  const routeSuggestions =
    routeQuery.trim().length > 0
      ? allLines
          .filter(
            (l) =>
              !chain.includes(l.shortName) &&
              (l.shortName.toLowerCase().startsWith(routeQuery.trim().toLowerCase()) ||
                l.longName?.toLowerCase().includes(routeQuery.trim().toLowerCase())),
          )
          .slice(0, 6)
      : [];

  function addRoute(shortName: string) {
    setChain((prev) => (prev.includes(shortName) || prev.length >= 5 ? prev : [...prev, shortName]));
    setRouteQuery('');
  }

  async function plan() {
    if (chain.length === 0) return;
    setState('loading');
    setIssues([]);
    setFallbackRoutes([]);
    setShowingDayStart(false);
    try {
      const picked = timeValueToMinutes();
      const opts =
        timeMode === 'depart' && picked != null
          ? { startMinutes: picked }
          : timeMode === 'arrive' && picked != null
            ? { startMinutes: 0, arriveByMinutes: picked }
            : {};
      let result = await planChain(boardStopId || null, exitStopId || null, chain, tripUpdates, opts);

      // "Leave now" with nothing left today — show how the first trips of the day connect instead.
      if (result.itineraries.length === 0 && timeMode === 'now') {
        const dayStart = await planChain(boardStopId || null, exitStopId || null, chain, tripUpdates, {
          startMinutes: 0,
        });
        if (dayStart.itineraries.length > 0) {
          result = { itineraries: dayStart.itineraries, issues: result.issues };
          setShowingDayStart(true);
        }
      }

      setItineraries(result.itineraries);
      setIssues(result.issues);

      // Last resort: nothing connects at any time of day -> show the routes on a map with a rough estimate.
      if (result.itineraries.length === 0) {
        const overviews = await Promise.all(chain.map((name) => getRouteOverview(name)));
        setFallbackRoutes(overviews.filter((o): o is RouteOverview => o !== null));
      }
      setState('done');
    } catch {
      setState('error');
    }
  }

  const fallbackEstimate =
    fallbackRoutes.length > 0 && fallbackRoutes.every((r) => r.durationMinutes != null)
      ? fallbackRoutes.reduce((sum, r) => sum + (r.durationMinutes ?? 0), 0) +
        (fallbackRoutes.length - 1) * TRANSFER_ESTIMATE_MINUTES
      : null;

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div>
        <h3 className="text-lg font-semibold">Trip Planner</h3>
        <p className="text-xs text-slate-500">
          Pick your routes in order — bus, rail, or both (e.g. 120L then N). Transfers are found automatically
          wherever the routes come within a short walk.
        </p>
      </div>

      {/* Step 1: the route chain */}
      <div className="relative">
        <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">1 · Your routes, in order</label>
        <div className="flex flex-wrap items-center gap-1.5">
          {chain.map((name, i) => {
            const line = allLines.find((l) => l.shortName === name);
            return (
              <span key={name} className="flex items-center gap-1 rounded-full bg-slate-800 py-0.5 pl-1 pr-2 text-sm">
                <RouteBadge name={name} color={line?.color ?? null} />
                {i < chain.length - 1 && <span className="text-slate-500">→</span>}
                <button
                  type="button"
                  onClick={() => setChain((prev) => prev.filter((c) => c !== name))}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              </span>
            );
          })}
          {chain.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                setChain((prev) => [...prev].reverse());
                // Board/exit stops follow their routes when the chain flips.
                setBoardStopId(exitStopId);
                setExitStopId(boardStopId);
                setItineraries([]);
                setIssues([]);
                setState('idle');
              }}
              className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-300 hover:border-sky-500 hover:text-sky-300"
              title="Reverse the trip — plan the ride home"
            >
              ⇄ Reverse
            </button>
          )}
          {chain.length < 5 && (
            <input
              type="text"
              value={routeQuery}
              onChange={(e) => setRouteQuery(e.target.value)}
              placeholder={chain.length === 0 ? 'Add route (e.g. 120L)…' : 'Add another…'}
              className="w-36 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-200 placeholder:text-slate-500"
            />
          )}
        </div>
        {routeSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-48 w-72 overflow-y-auto rounded border border-slate-700 bg-slate-800 shadow-lg">
            {routeSuggestions.map((l) => (
              <button
                key={l.shortName}
                type="button"
                onClick={() => addRoute(l.shortName)}
                className="block w-full truncate px-2 py-1.5 text-left text-sm text-slate-300 hover:bg-slate-700"
              >
                {l.shortName} — {l.longName}
              </button>
            ))}
          </div>
        )}
      </div>

      <RouteFinder onPick={addRoute} />

      {/* Step 2: optional boarding/exit stops, scoped to the first/last route */}
      {chain.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              2 · Board {firstRoute} at
            </label>
            <select
              value={boardStopId}
              onChange={(e) => setBoardStopId(e.target.value)}
              disabled={!firstOverview}
              className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 disabled:opacity-50"
            >
              <option value="">{firstOverview ? 'Anywhere (start of line)' : 'Loading stops…'}</option>
              {firstOverview?.stops.map((s) => (
                <option key={s.stop_id} value={s.stop_id}>
                  {s.stop_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              3 · Exit {lastRoute} at
            </label>
            <select
              value={exitStopId}
              onChange={(e) => setExitStopId(e.target.value)}
              disabled={!exitOverview}
              className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 disabled:opacity-50"
            >
              <option value="">{exitOverview ? 'End of the line' : 'Loading stops…'}</option>
              {exitOverview?.stops.map((s) => (
                <option key={s.stop_id} value={s.stop_id}>
                  {s.stop_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* When to travel */}
      {chain.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs uppercase tracking-wide text-slate-500">4 · When</label>
          <div className="flex overflow-hidden rounded border border-slate-700 text-xs">
            {(
              [
                ['now', 'Leave now'],
                ['depart', 'Depart at'],
                ['arrive', 'Arrive by'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTimeMode(mode)}
                className={`px-2.5 py-1.5 ${timeMode === mode ? 'bg-sky-600 font-medium text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {timeMode !== 'now' && (
            <input
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-200"
            />
          )}
        </div>
      )}

      <button
        type="button"
        onClick={plan}
        disabled={chain.length === 0 || state === 'loading' || (timeMode !== 'now' && timeValueToMinutes() == null)}
        className="rounded bg-sky-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-40"
      >
        {state === 'loading'
          ? 'Planning…'
          : chain.length === 0
            ? 'Add a route to plan'
            : timeMode !== 'now' && timeValueToMinutes() == null
              ? 'Pick a time'
              : 'Plan trip'}
      </button>

      {state === 'error' && <p className="text-sm text-red-400">Something went wrong planning the trip.</p>}
      {issues.map((msg, i) => (
        <p key={i} className="text-sm text-amber-400">
          {msg}
        </p>
      ))}

      {showingDayStart && itineraries.length > 0 && (
        <p className="text-sm text-sky-400">
          No connections left today — here's how the first trips of the service day line up:
        </p>
      )}

      {itineraries.map((it, i) => (
        <div key={i} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-200">
              {formatGtfsTime(it.legs[0].boardTime)} → {formatGtfsTime(it.legs[it.legs.length - 1].alightTime)}
            </span>
            <span className="text-slate-400">
              {formatDuration(it.totalMinutes)} · {it.transfers === 0 ? 'direct' : `${it.transfers} transfer${it.transfers > 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="space-y-2">
            {it.legs.map((leg, j) => (
              <div key={j} className="flex items-start gap-2 text-sm">
                <RouteBadge name={leg.routeShortName} color={leg.routeColor} />
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

      {/* Fallback: no scheduled itinerary — show the chained routes on a map with a rough estimate */}
      {state === 'done' && itineraries.length === 0 && fallbackRoutes.length > 0 && (
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-300">Route overview</span>
            {fallbackEstimate != null && (
              <span className="text-slate-400">
                est. ~{formatDuration(fallbackEstimate)} end-to-end{fallbackRoutes.length > 1 ? ' incl. transfers' : ''}
              </span>
            )}
          </div>
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-500">
                Loading map…
              </div>
            }
          >
            <ChainMap routes={fallbackRoutes} />
          </Suspense>
          <p className="text-xs text-slate-500">
            No scheduled departures matched for the rest of today, so here's both routes on the map — where the lines
            come close is your transfer point. The estimate uses each route's typical end-to-end time.
          </p>
        </div>
      )}

      <p className="text-[10px] text-slate-600">
        Times are from RTD's schedule; live delay shown when a matching vehicle is reporting. Transfers connect any
        stops within a 400m walk (4 min buffer) — including bus bay to rail platform.
      </p>
    </div>
  );
}
