import { lazy, Suspense, useEffect, useState } from 'react';
import { useRailLine } from '../lib/useRailLine';
import { getRailLines, getNearestRoutes, routeTypeLabel, type RailLineOption, type NearbyRoute } from '../lib/schedule';
import type { UpcomingArrival } from '../lib/gtfsrt';

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

export default function RailLineSection() {
  const [shortName, setShortName] = useState('N');
  const [lines, setLines] = useState<RailLineOption[]>([]);
  const { directions, arrivalsByStop, skippedStops, vehicleStatusByStop, vehicles, routeType, color, fare, loading, error } =
    useRailLine(shortName);
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
  const [nearby, setNearby] = useState<NearbyRoute[]>([]);
  const [nearbyState, setNearbyState] = useState<'idle' | 'loading' | 'error'>('idle');

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

  return (
    <div className="space-y-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      {/* Header bar — looks like a station sign */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-slate-950 shadow-md"
            style={{ backgroundColor: lineColor }}
          >
            {shortName}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold leading-tight">{isBus ? `Route ${shortName}` : `${shortName} Line`}</h3>
              {!loading &&
                (hasLiveService ? (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-400">
                    No live service
                  </span>
                ))}
            </div>
            {routeType != null && (
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {routeTypeLabel(routeType)}
                {fare != null && ` · $${fare.price.toFixed(2)}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex w-32 gap-1 sm:w-40">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search routes…"
              className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={findNearby}
              title="Find routes near my location"
              className="shrink-0 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
            >
              {nearbyState === 'loading' ? '…' : '📍'}
            </button>
          </div>
          {nearbyState === 'error' && (
            <p className="w-32 text-right text-[10px] text-red-400 sm:w-40">Couldn't get location</p>
          )}
          {nearby.length > 0 && (
            <div className="w-32 space-y-0.5 rounded border border-slate-700 bg-slate-800 p-1 sm:w-40">
              {nearby.map((r) => (
                <button
                  key={r.shortName}
                  type="button"
                  onClick={() => {
                    setShortName(r.shortName);
                    setNearby([]);
                  }}
                  className="block w-full truncate rounded px-1 py-0.5 text-left text-[11px] text-slate-300 hover:bg-slate-700"
                  title={`${r.stopName} — ${Math.round(r.distanceMeters)}m`}
                >
                  {r.shortName} · {Math.round(r.distanceMeters)}m
                </button>
              ))}
            </div>
          )}
          <select
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            className="w-32 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-200 sm:w-40"
          >
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
      </div>

      {loading && <p className="px-4 pb-4 text-slate-400">Loading…</p>}
      {error && <p className="px-4 pb-4 text-sm text-red-400">Error: {error}</p>}

      {!loading && (
        <>
          <div className="px-4">
            <Suspense fallback={<div className="flex h-64 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-500">Loading map…</div>}>
              <RailLineMap directions={directions} vehicles={vehicles} />
            </Suspense>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-[#38bdf8]" /> Toward{' '}
              {directions[0]?.headsign ?? 'direction 1'}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-[#a78bfa]" /> Toward{' '}
              {directions[1]?.headsign ?? 'direction 2'}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-[#facc15]" /> Delayed 1–10 min
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-[#ef4444]" /> Delayed 10+ min
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full border border-slate-400 bg-slate-700" /> {isBus ? 'Stop' : 'Station'}
            </span>
          </div>

          <div className="px-4">
            <h4 className="mb-2 font-medium text-slate-300">{isBus ? 'Live Buses' : 'Live Trains'} ({vehicles.length})</h4>
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

          {/* Departure board */}
          {directions.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-slate-500">No stop data available.</p>
          ) : (
            <div className="grid gap-4 px-4 pb-4 lg:grid-cols-2">
              {directions.map((dir) => (
                <div key={dir.directionId} className="overflow-hidden rounded-lg border border-slate-800">
                  <div
                    className="flex items-center justify-between px-3 py-2 text-sm font-bold uppercase tracking-wider text-slate-950"
                    style={{ backgroundColor: lineColor }}
                  >
                    <span>Toward {dir.headsign}</span>
                    <span className="flex items-center gap-2 text-xs font-semibold normal-case opacity-80">
                      {dir.accessibility.wheelchairAccessible === true && <span title="Wheelchair accessible">♿</span>}
                      {dir.accessibility.bikesAllowed === true && <span title="Bikes allowed">🚲</span>}
                      {dir.scheduledDurationMinutes != null && <span>~{dir.scheduledDurationMinutes} min trip</span>}
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
                          <span className="truncate font-sans text-slate-200">{stop.stop_name}</span>
                          {isSkipped ? (
                            <span className="col-span-2 text-right text-xs uppercase tracking-wide text-red-400/80">
                              Skipping
                            </span>
                          ) : next ? (
                            <>
                              <span className="text-right text-slate-500">
                                {formatClockTime(next.time)}
                                <span className="ml-1 text-[10px] uppercase tracking-wide text-slate-600">
                                  {stopLabel}
                                </span>
                              </span>
                              {liveStatus === 'STOPPED_AT' ? (
                                <span className="text-right text-xs font-bold uppercase tracking-wide text-emerald-400">
                                  At platform
                                </span>
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
                                  {scheduled && (
                                    <span className="ml-1 text-[10px] uppercase tracking-wide text-slate-700">
                                      {stopLabel}
                                    </span>
                                  )}
                                </span>
                                <span className="text-right text-[10px] uppercase tracking-wide text-slate-700">
                                  {scheduled ? 'sched only' : '—'}
                                </span>
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
              ))}
            </div>
          )}

          <p className="px-4 pb-4 text-xs text-slate-600">
            Stop names and {isBus ? 'route' : 'station'} list come from RTD's weekly GTFS schedule export and may lag
            recent service changes. {isBus ? 'Bus' : 'Train'} positions and arrival predictions above are live.
          </p>
        </>
      )}
    </div>
  );
}
