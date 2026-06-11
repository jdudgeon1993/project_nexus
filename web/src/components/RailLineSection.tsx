import { lazy, Suspense, useEffect, useState } from 'react';
import { useRailLine } from '../lib/useRailLine';
import { getRailLines, getNearestRoutes, getRoutesServingStop, routeTypeLabel, type RailLineOption, type NearbyRoute, type RouteAtStop } from '../lib/schedule';
import { getArrivalsForStop, type UpcomingArrival } from '../lib/gtfsrt';
import BottomSheet from './BottomSheet';

const RailLineMap = lazy(() => import('./RailLineMap'));

const OCCUPANCY_LABELS: Record<string, string> = {
  EMPTY: 'empty',
  MANY_SEATS_AVAILABLE: 'many seats available',
  FEW_SEATS_AVAILABLE: 'few seats available',
  STANDING_ROOM_ONLY: 'standing room only',
  CRUSHED_STANDING_ROOM_ONLY: 'crowded',
  FULL: 'full',
  NOT_ACCEPTING_PASSENGERS: 'not accepting passengers',
  NOT_BOARDABLE: 'not boardable',
};

function formatOccupancy(status: string): string {
  return OCCUPANCY_LABELS[status] ?? status.replace(/_/g, ' ').toLowerCase();
}

/** "45 min" under an hour, "1 hr 52 min" above. */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

function formatDelay(seconds: number | null): string {
  if (seconds == null) return '';
  if (Math.abs(seconds) < 60) return 'on time';
  const mins = Math.round(seconds / 60);
  return mins > 0 ? `+${mins} min late` : `${Math.abs(mins)} min early`;
}

/** Formats a GTFS HH:MM:SS time (hours can exceed 24 for next-day trips) as a 12-hour clock time. */
function formatScheduledTime(time: string | null): string | null {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const hour24 = h % 24;
  const period = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatClockTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/** Live mm:ss countdown, falling back to whole minutes once it's far out. */
function formatCountdown(unixSeconds: number, now: number): string {
  const totalSeconds = Math.round(unixSeconds - now / 1000);
  if (totalSeconds <= 0) return 'DUE';
  if (totalSeconds < 90) return `${totalSeconds}s`;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins < 5) return `${mins}m ${secs}s`;
  return `${mins} min`;
}

interface CountdownDisplay {
  text: string;
  className: string;
}

/**
 * Walks an arrival forward through its lifecycle:
 * >5min blue countdown -> <=5min yellow -> <=1min red -> <=7s "Arriving" (red, no countdown)
 * -> just passed (<=10s ago) "Departed" (red) -> falls back to the next scheduled arrival.
 */
function getCountdownDisplay(arrivals: UpcomingArrival[], now: number): { display: CountdownDisplay; current: UpcomingArrival | null; upcoming: UpcomingArrival[] } {
  const nowSeconds = now / 1000;
  let currentIndex = arrivals.findIndex((a) => a.time - nowSeconds > -10);
  if (currentIndex === -1) currentIndex = arrivals.length;
  const current = arrivals[currentIndex] ?? null;
  const upcoming = arrivals.slice(currentIndex + 1);

  if (!current) return { display: { text: '—', className: 'text-slate-700' }, current, upcoming };

  const diff = current.time - nowSeconds;
  if (diff <= 0) {
    return { display: { text: 'Departed', className: 'text-red-400' }, current, upcoming };
  }
  if (diff <= 7) {
    return { display: { text: 'Arriving', className: 'text-red-400' }, current, upcoming };
  }
  if (diff <= 60) {
    return { display: { text: formatCountdown(current.time, now), className: 'text-red-400' }, current, upcoming };
  }
  if (diff <= 300) {
    return { display: { text: formatCountdown(current.time, now), className: 'text-amber-400' }, current, upcoming };
  }
  return { display: { text: formatCountdown(current.time, now), className: 'text-sky-400' }, current, upcoming };
}

const FAV_KEY = 'nexus_fav_routes';

function loadFavorites(): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function RailLineSection() {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [shortName, setShortName] = useState(() => loadFavorites()[0] ?? 'N');
  const [lines, setLines] = useState<RailLineOption[]>([]);
  const { directions, arrivalsByStop, skippedStops, vehicleStatusByStop, vehicles, routeType, color, fare, transfersByStop, serviceToday, tripUpdates, loading, error } =
    useRailLine(shortName);

  function toggleFavorite(name: string) {
    setFavorites((prev) => {
      const next = prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  }

  // Stop view: tap a stop in the list to see every route serving it + live arrivals.
  const [selectedStop, setSelectedStop] = useState<{ stopId: string; stopName: string } | null>(null);
  const [stopRoutes, setStopRoutes] = useState<RouteAtStop[] | null>(null);
  useEffect(() => {
    if (!selectedStop) {
      setStopRoutes(null);
      return;
    }
    let cancelled = false;
    setStopRoutes(null);
    getRoutesServingStop(selectedStop.stopId).then((r) => {
      if (!cancelled) setStopRoutes(r);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedStop?.stopId]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    getRailLines().then((result) => {
      if (result.length > 0) setLines(result);
    });
  }, []);

  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [nearby, setNearby] = useState<NearbyRoute[]>([]);
  const [nearbyState, setNearbyState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [directionIdx, setDirectionIdx] = useState(0);

  function findNearby() {
    if (!navigator.geolocation) {
      setNearbyState('error');
      return;
    }
    setNearbyState('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const results = await getNearestRoutes(pos.coords.latitude, pos.coords.longitude);
        setNearby(results);
        setNearbyState(results.length > 0 ? 'idle' : 'error');
      },
      () => setNearbyState('error'),
      { timeout: 10000 },
    );
  }

  const lineOptions = lines.length > 0 ? lines : [{ shortName: 'N', longName: 'N Line', routeType: 0, color: null, sortOrder: null }];
  const filteredOptions = search.trim()
    ? lineOptions.filter(
        (l) =>
          l.shortName.toLowerCase().includes(search.trim().toLowerCase()) ||
          l.longName?.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : lineOptions;
  const commuterLines = filteredOptions.filter((l) => l.routeType === 2);
  const lightRailLines = filteredOptions.filter((l) => l.routeType === 0 || l.routeType === 1);
  const busLines = filteredOptions.filter((l) => l.routeType === 3);
  const hasLiveService = vehicles.length > 0;
  const lineColor = color ?? '#38bdf8';
  const isBus = routeType === 3;

  // RTD doesn't publish fares in GTFS (account-based fare capping since 2024),
  // so fall back to the published flat fares: $10 airport service, $2.75 standard.
  const currentLine = lineOptions.find((l) => l.shortName === shortName);
  const isAirportRoute = shortName === 'A' || /airport|skyride/i.test(currentLine?.longName ?? '');
  const farePrice = fare?.price ?? (isAirportRoute ? 10 : 2.75);

  const dir = directions[Math.min(directionIdx, Math.max(directions.length - 1, 0))];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed live map */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center bg-slate-950 text-sm text-slate-500">Loading map…</div>}>
          <RailLineMap directions={directions} vehicles={vehicles} routeColor={color} />
        </Suspense>
      </div>

      {/* Floating top bar — route picker, status, search */}
      <div className="absolute inset-x-2 top-2 z-[1001] space-y-2">
        <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-2 shadow-lg backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-slate-950 shadow-md"
              style={{ backgroundColor: lineColor }}
            >
              {shortName}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold leading-tight">{isBus ? `Route ${shortName}` : `${shortName} Line`}</h3>
                {!loading &&
                  (hasLiveService ? (
                    <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Active</span>
                  ) : serviceToday === false ? (
                    <span className="shrink-0 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400">No service today</span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400">No live service</span>
                  ))}
              </div>
              {routeType != null && (
                <p className="truncate text-[10px] uppercase tracking-wide text-slate-500" title={fare == null ? 'RTD standard fare (not from GTFS)' : undefined}>
                  {routeTypeLabel(routeType)}
                  {` · $${farePrice.toFixed(2)}`}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => toggleFavorite(shortName)}
              title={favorites.includes(shortName) ? 'Remove from favorites' : 'Add to favorites (loads first next visit)'}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm hover:bg-slate-700"
            >
              {favorites.includes(shortName) ? '★' : '☆'}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              title="Search routes"
              className={`rounded-lg border px-2 py-1.5 text-sm ${searchOpen ? 'border-sky-500 bg-sky-500/20 text-sky-300' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              🔍
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/90 p-2 shadow-lg backdrop-blur">
            <div className="flex gap-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search routes…"
                autoFocus
                className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={findNearby}
                title="Find routes near my location"
                className="shrink-0 rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
              >
                {nearbyState === 'loading' ? '…' : '📍'}
              </button>
            </div>
            {nearbyState === 'error' && <p className="text-[10px] text-red-400">Couldn't get location</p>}
            {nearby.length > 0 && (
              <div className="space-y-0.5 rounded border border-slate-700 bg-slate-800 p-1">
                {nearby.map((r) => (
                  <button
                    key={r.shortName}
                    type="button"
                    onClick={() => {
                      setShortName(r.shortName);
                      setNearby([]);
                      setSearchOpen(false);
                    }}
                    className="block w-full truncate rounded px-1 py-0.5 text-left text-xs text-slate-300 hover:bg-slate-700"
                    title={`${r.stopName} — ${Math.round(r.distanceMeters)}m`}
                  >
                    {r.shortName} · {Math.round(r.distanceMeters)}m
                  </button>
                ))}
              </div>
            )}
            <select
              value={shortName}
              onChange={(e) => {
                setShortName(e.target.value);
                setSearchOpen(false);
              }}
              className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200"
            >
              {favorites.length > 0 && (
                <optgroup label="★ Favorites">
                  {favorites
                    .filter((f) => lineOptions.some((l) => l.shortName === f))
                    .map((f) => {
                      const line = lineOptions.find((l) => l.shortName === f)!;
                      return (
                        <option key={`fav-${f}`} value={f}>
                          {line.routeType === 3 ? `${f} — ${line.longName}` : `${f} Line`}
                        </option>
                      );
                    })}
                </optgroup>
              )}
              {commuterLines.length > 0 && (
                <optgroup label="Commuter Rail">
                  {commuterLines.map((line) => (
                    <option key={line.shortName} value={line.shortName}>
                      {line.shortName} Line
                    </option>
                  ))}
                </optgroup>
              )}
              {lightRailLines.length > 0 && (
                <optgroup label="Light Rail">
                  {lightRailLines.map((line) => (
                    <option key={line.shortName} value={line.shortName}>
                      {line.shortName} Line
                    </option>
                  ))}
                </optgroup>
              )}
              {busLines.length > 0 && (
                <optgroup label="Bus">
                  {busLines.map((line) => (
                    <option key={line.shortName} value={line.shortName}>
                      {line.shortName} — {line.longName}
                    </option>
                  ))}
                </optgroup>
              )}
              {commuterLines.length === 0 && lightRailLines.length === 0 && busLines.length === 0 && (
                <option value={shortName}>No routes match "{search}"</option>
              )}
            </select>
          </div>
        )}

        {loading && <p className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-sm text-slate-400 shadow-lg backdrop-blur">Loading…</p>}
        {error && <p className="rounded-xl border border-red-900/60 bg-slate-900/90 px-3 py-2 text-sm text-red-400 shadow-lg backdrop-blur">Error: {error}</p>}
      </div>

      {/* Bottom sheet — live vehicles, departure board, stop detail */}
      {!loading && (
        <BottomSheet
          header={
            directions.length > 1 && (
              <div className="flex gap-1">
                {directions.map((d, i) => (
                  <button
                    key={d.directionId}
                    type="button"
                    onClick={() => setDirectionIdx(i)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      i === directionIdx ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Toward {d.headsign}
                  </button>
                ))}
              </div>
            )
          }
        >
          {/* Legend */}
          <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#38bdf8]" /> Toward {directions[0]?.headsign ?? 'direction 1'}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#a78bfa]" /> Toward {directions[1]?.headsign ?? 'direction 2'}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#facc15]" /> Delayed 1–10 min
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> Delayed 10+ min
            </span>
          </div>

          {/* Live vehicles */}
          <div className="mb-3">
            <h4 className="mb-1 text-sm font-medium text-slate-300">{isBus ? 'Live Buses' : 'Live Trains'} ({vehicles.length})</h4>
            {vehicles.length === 0 ? (
              <p className="text-sm text-slate-500">{isBus ? 'No active buses right now.' : 'No active trains right now.'}</p>
            ) : (
              <ul className="space-y-1">
                {vehicles.map((v, i) => (
                  <li key={v.id} className="text-sm text-slate-400">
                    {isBus ? 'Bus' : 'Train'} {i + 1}
                    {v.lat != null && v.lon != null && ` — ${v.lat.toFixed(4)}, ${v.lon.toFixed(4)}`}
                    {v.status && ` · ${v.status.replace(/_/g, ' ').toLowerCase()}`}
                    {v.delaySeconds != null && ` · ${formatDelay(v.delaySeconds)}`}
                    {v.occupancyStatus && ` · ${formatOccupancy(v.occupancyStatus)}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Departure board — one direction at a time */}
          {!dir ? (
            <p className="text-sm text-slate-500">No stop data available.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-800">
              <div
                className="flex items-center justify-between px-3 py-2 text-sm font-bold uppercase tracking-wider text-slate-950"
                style={{ backgroundColor: lineColor }}
              >
                <span>Toward {dir.headsign}</span>
                <span className="flex items-center gap-2 text-xs font-semibold normal-case opacity-80">
                  {dir.accessibility.wheelchairAccessible === true && <span title="Wheelchair accessible">♿</span>}
                  {dir.accessibility.bikesAllowed === true && <span title="Bikes allowed">🚲</span>}
                  {dir.scheduledDurationMinutes != null && <span>~{formatDuration(dir.scheduledDurationMinutes)} trip</span>}
                  {dir.frequencyMinutes != null && <span>Every ~{dir.frequencyMinutes} min</span>}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-0.5 bg-slate-950/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>{isBus ? 'Stop' : 'Station'}</span>
                <span className="text-right">Sched</span>
                <span className="text-right">Due</span>
              </div>
              <div className="divide-y divide-slate-800/60 font-mono text-sm">
                {dir.stops.map((stop, idx) => {
                  const arrivals = arrivalsByStop[`${stop.stop_id}|${dir.directionId}`] ?? [];
                  const { display, current: next, upcoming } = getCountdownDisplay(arrivals, now);
                  const stopLabel = idx === 0 ? 'Departs' : 'Arrives';
                  const liveStatus = vehicleStatusByStop[`${stop.stop_id}|${dir.directionId}`];
                  const isSkipped = skippedStops.has(`${stop.stop_id}|${dir.directionId}`);
                  return (
                    <div
                      key={stop.stop_id}
                      className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-3 px-3 py-1.5 ${
                        idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'
                      } ${isSkipped ? 'opacity-50' : ''}`}
                    >
                      <span className="truncate font-sans text-slate-200">
                        <button
                          type="button"
                          onClick={() => setSelectedStop((cur) => (cur?.stopId === stop.stop_id ? null : { stopId: stop.stop_id, stopName: stop.stop_name }))}
                          title="Show all routes and arrivals at this stop"
                          className={`truncate text-left hover:text-sky-300 hover:underline ${selectedStop?.stopId === stop.stop_id ? 'text-sky-300' : ''}`}
                        >
                          {stop.stop_name}
                        </button>
                        {transfersByStop[stop.stop_id]?.length > 0 && (
                          <span className="ml-2 text-xs font-semibold normal-case text-sky-400" title={`Connects to: ${transfersByStop[stop.stop_id].map((t) => t.routeLongName).join(', ')}`}>
                            ⇄ {transfersByStop[stop.stop_id].map((t) => t.routeShortName).join(', ')}
                          </span>
                        )}
                      </span>
                      {isSkipped ? (
                        <span className="col-span-2 text-right text-xs uppercase tracking-wide text-red-400/80">Skipping</span>
                      ) : next ? (
                        <>
                          <span className="text-right text-slate-500">
                            {formatClockTime(next.time)}
                            <span className="ml-1 text-[10px] uppercase tracking-wide text-slate-600">{stopLabel}</span>
                          </span>
                          {liveStatus === 'STOPPED_AT' ? (
                            <span className="text-right text-xs font-bold uppercase tracking-wide text-emerald-400">At platform</span>
                          ) : (
                            <span
                              className={`text-right font-bold ${
                                display.text === 'Arriving' || display.text === 'Departed'
                                  ? `text-xs uppercase tracking-wide ${display.className}`
                                  : display.className
                              }`}
                            >
                              {display.text}
                            </span>
                          )}
                        </>
                      ) : (() => {
                        const scheduled = formatScheduledTime(stop.departure_time ?? stop.arrival_time);
                        return (
                          <>
                            <span className="text-right text-slate-600">
                              {scheduled ?? '—'}
                              {scheduled && <span className="ml-1 text-[10px] uppercase tracking-wide text-slate-700">{stopLabel}</span>}
                            </span>
                            <span className="text-right text-[10px] uppercase tracking-wide text-slate-700">{scheduled ? 'sched only' : '—'}</span>
                          </>
                        );
                      })()}
                      {upcoming.length > 0 && (
                        <span className="col-span-3 -mt-0.5 text-right text-xs text-slate-600">
                          then {upcoming.map((a) => formatCountdown(a.time, now)).join(', ')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedStop && (
            <div className="mt-3 rounded-lg border border-sky-900/60 bg-slate-950 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-slate-200">{selectedStop.stopName}</h4>
                <button type="button" onClick={() => setSelectedStop(null)} className="text-xs text-slate-500 hover:text-slate-300">
                  ✕ close
                </button>
              </div>
              {stopRoutes === null ? (
                <p className="text-sm text-slate-500">Loading routes…</p>
              ) : stopRoutes.length === 0 ? (
                <p className="text-sm text-slate-500">No routes found for this stop in the imported schedule.</p>
              ) : (
                <div className="space-y-1.5">
                  {stopRoutes.map((r) => {
                    const liveArrivals = getArrivalsForStop(tripUpdates, selectedStop.stopId).filter((a) => a.routeId === r.routeId);
                    return (
                      <div key={r.shortName} className="flex items-center gap-2 text-sm">
                        <button
                          type="button"
                          onClick={() => {
                            setShortName(r.shortName);
                            setSelectedStop(null);
                          }}
                          title={`${r.longName} — switch to this route`}
                          className="flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-bold text-slate-950 hover:opacity-80"
                          style={{ backgroundColor: r.color ?? '#38bdf8' }}
                        >
                          {r.shortName}
                        </button>
                        <span className="min-w-0 flex-1 truncate text-slate-400">{r.longName}</span>
                        <span className="text-xs text-slate-300">
                          {liveArrivals.length > 0 ? liveArrivals.slice(0, 3).map((a) => formatCountdown(a.time, now)).join(', ') : 'no live arrivals'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="mt-2 text-[10px] text-slate-600">All routes serving this stop. Tap a route badge to switch to it.</p>
            </div>
          )}

          <p className="mt-3 text-xs text-slate-600">
            Stop names and {isBus ? 'route' : 'station'} list come from RTD's weekly GTFS schedule export and may lag recent service changes.{' '}
            {isBus ? 'Bus' : 'Train'} positions and arrival predictions above are live.
          </p>
        </BottomSheet>
      )}
    </div>
  );
}
