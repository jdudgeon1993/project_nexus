import { lazy, Suspense, useEffect, useState } from 'react';
import { useRailLine } from '../lib/useRailLine';
import { getRailLines, getNearestRoutes, getRoutesServingStop, routeTypeLabel, type RailLineOption, type NearbyRoute, type RouteAtStop } from '../lib/schedule';
import { getArrivalsForStop, getActiveAlerts, type UpcomingArrival, type ServiceAlert } from '../lib/gtfsrt';
import { getDrivingRoute, type DrivingRoute } from '../lib/api';
import { decodePolyline } from '../lib/polyline';
import { loadSavedTrips, type SavedTrip } from '../lib/savedTrips';
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

/** Destination input + result, shared between the empty-map state and the Directions tab. */
function DirectionsPanel({
  destination,
  setDestination,
  driveLoading,
  driveError,
  drivingRoute,
  onGo,
}: {
  destination: string;
  setDestination: (v: string) => void;
  driveLoading: boolean;
  driveError: string | null;
  drivingRoute: DrivingRoute | null;
  onGo: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onGo()}
          placeholder="Destination address…"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={onGo}
          disabled={driveLoading || !destination.trim()}
          className="shrink-0 rounded-lg border border-orange-500 bg-orange-500/20 px-3 py-2 text-sm font-medium text-orange-300 hover:bg-orange-500/30 disabled:opacity-50"
        >
          {driveLoading ? '…' : 'Go'}
        </button>
      </div>
      {driveError && <p className="text-xs text-red-400">{driveError}</p>}
      {drivingRoute && (
        <p className="text-sm text-slate-300">
          🚗 {drivingRoute.minutes} min · {(drivingRoute.distanceMeters / 1609.34).toFixed(1)} mi
          {drivingRoute.trafficPercent > 0 && <span className="text-amber-400"> · +{drivingRoute.trafficPercent}% traffic</span>}
        </p>
      )}
    </div>
  );
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
  const [shortName, setShortName] = useState<string | null>(null);
  const [lines, setLines] = useState<RailLineOption[]>([]);
  const { directions, arrivalsByStop, skippedStops, vehicleByTripId, vehicles, routeType, color, fare, transfersByStop, serviceToday, tripUpdates, alerts, lastUpdated, loading, error } =
    useRailLine(shortName);
  const [selectedVehicleStop, setSelectedVehicleStop] = useState<string | null>(null);
  const activeAlerts: ServiceAlert[] = getActiveAlerts(alerts);
  const [savedTrips] = useState<SavedTrip[]>(loadSavedTrips);
  const [sheetTab, setSheetTab] = useState<'schedule' | 'directions' | 'alerts'>('schedule');

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

  const [destination, setDestination] = useState('');
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [drivingRoute, setDrivingRoute] = useState<DrivingRoute | null>(null);
  const [driveOrigin, setDriveOrigin] = useState<[number, number] | null>(null);
  const [driveDestPoint, setDriveDestPoint] = useState<[number, number] | null>(null);
  const [drivePoints, setDrivePoints] = useState<[number, number][] | null>(null);

  function startDriving() {
    if (!destination.trim()) return;
    if (!navigator.geolocation) {
      setDriveError("Couldn't get your location");
      return;
    }
    setDriveLoading(true);
    setDriveError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const origin: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        try {
          const route = await getDrivingRoute(
            { lat: origin[0], lng: origin[1] },
            destination.trim(),
          );
          if (!route.polyline) throw new Error('No route geometry returned');
          const points = decodePolyline(route.polyline);
          setDrivingRoute(route);
          setDriveOrigin(origin);
          setDriveDestPoint(points[points.length - 1]);
          setDrivePoints(points);
        } catch (e) {
          setDriveError(e instanceof Error ? e.message : 'Failed to get directions');
          setDrivingRoute(null);
        } finally {
          setDriveLoading(false);
        }
      },
      () => {
        setDriveError("Couldn't get your location");
        setDriveLoading(false);
      },
      { timeout: 10000 },
    );
  }

  function selectLine(name: string) {
    setShortName(name);
    setSheetTab('schedule');
  }

  function clearDriving() {
    setDrivingRoute(null);
    setDriveOrigin(null);
    setDriveDestPoint(null);
    setDrivePoints(null);
    setDestination('');
    setDriveError(null);
  }

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

  // Map shows either the rail line or the driving route, never both — which one
  // depends on whether the user is on the Directions tab.
  const showDriving = drivePoints && driveOrigin && driveDestPoint && (shortName == null || sheetTab === 'directions');
  const showRail = shortName != null && sheetTab !== 'directions';

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed live map */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center bg-slate-950 text-sm text-slate-500">Loading map…</div>}>
          <RailLineMap
            directions={showRail ? directions : []}
            vehicles={showRail ? vehicles : []}
            routeColor={color}
            drivingRoute={showDriving ? { points: drivePoints!, origin: driveOrigin!, destination: driveDestPoint! } : null}
          />
        </Suspense>
      </div>

      {/* Floating search bar — persistent "Find a Stop or Route" entry point */}
      <div className="absolute inset-x-2 top-2 z-[1001] space-y-2">
        {activeAlerts.length > 0 && (
          <div className="space-y-1.5">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-amber-600/40 bg-amber-500/10 p-2 shadow-lg backdrop-blur">
                <p className="text-xs font-semibold text-amber-300">
                  ⚠️ {alert.routeIds.length > 0 ? `[${alert.routeIds.join(', ')}] ` : ''}
                  {alert.header}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-2 shadow-lg backdrop-blur">
          <span className="pl-1 text-slate-500">🔍</span>
          <input
            type="text"
            value={search}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchOpen(true);
            }}
            placeholder="Find a Stop or Route…"
            className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={findNearby}
            title="Find routes near my location"
            className="shrink-0 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-700"
          >
            {nearbyState === 'loading' ? '…' : '📍'}
          </button>
          {shortName != null && (
            <button
              type="button"
              onClick={() => toggleFavorite(shortName)}
              title={favorites.includes(shortName) ? 'Remove from favorites' : 'Add to favorites (loads first next visit)'}
              className="shrink-0 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm hover:bg-slate-700"
            >
              {favorites.includes(shortName) ? '★' : '☆'}
            </button>
          )}
        </div>

        {searchOpen && (
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/90 p-2 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Routes &amp; Lines</p>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-xs text-slate-500 hover:text-slate-300">
                ✕ close
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
                      selectLine(r.shortName);
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
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {favorites.filter((f) => lineOptions.some((l) => l.shortName === f)).length > 0 && (
                <div>
                  <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">★ Favorites</p>
                  {favorites
                    .filter((f) => lineOptions.some((l) => l.shortName === f))
                    .map((f) => {
                      const line = lineOptions.find((l) => l.shortName === f)!;
                      return (
                        <button
                          key={`fav-${f}`}
                          type="button"
                          onClick={() => {
                            selectLine(f);
                            setSearch('');
                            setSearchOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded px-1 py-1 text-left text-sm text-slate-300 hover:bg-slate-800"
                        >
                          <span
                            className="flex h-6 min-w-6 items-center justify-center rounded-full text-xs font-bold text-slate-950"
                            style={{ backgroundColor: line.color ?? '#38bdf8' }}
                          >
                            {f}
                          </span>
                          <span className="truncate">{line.routeType === 3 ? line.longName : `${f} Line`}</span>
                        </button>
                      );
                    })}
                </div>
              )}
              {[
                { label: 'Commuter Rail', items: commuterLines, suffix: ' Line' },
                { label: 'Light Rail', items: lightRailLines, suffix: ' Line' },
                { label: 'Bus', items: busLines, suffix: '' },
              ].map(
                ({ label, items, suffix }) =>
                  items.length > 0 && (
                    <div key={label}>
                      <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                      {items.map((line) => (
                        <button
                          key={line.shortName}
                          type="button"
                          onClick={() => {
                            selectLine(line.shortName);
                            setSearch('');
                            setSearchOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded px-1 py-1 text-left text-sm text-slate-300 hover:bg-slate-800"
                        >
                          <span
                            className="flex h-6 min-w-6 items-center justify-center rounded-full text-xs font-bold text-slate-950"
                            style={{ backgroundColor: line.color ?? '#38bdf8' }}
                          >
                            {line.shortName}
                          </span>
                          <span className="truncate">{suffix ? `${line.shortName}${suffix}` : `${line.shortName} — ${line.longName}`}</span>
                        </button>
                      ))}
                    </div>
                  ),
              )}
              {commuterLines.length === 0 && lightRailLines.length === 0 && busLines.length === 0 && (
                <p className="px-1 py-1 text-sm text-slate-500">No routes match "{search}"</p>
              )}
            </div>
          </div>
        )}

        {loading && <p className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-sm text-slate-400 shadow-lg backdrop-blur">Loading…</p>}
        {error && <p className="rounded-xl border border-red-900/60 bg-slate-900/90 px-3 py-2 text-sm text-red-400 shadow-lg backdrop-blur">Error: {error}</p>}
      </div>

      {/* Bottom sheet — live vehicles, departure board, stop detail */}
      {!loading && (
        <BottomSheet
          initialSnap={shortName == null && !drivingRoute ? 0 : 1}
          header={
            shortName == null ? (
              <div className="w-full px-1 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  {drivingRoute ? 'Driving Directions' : 'Live Transit Map'}
                </p>
                <p className="truncate text-sm font-semibold text-slate-100">
                  {drivingRoute
                    ? `🚗 ${drivingRoute.minutes} min · ${(drivingRoute.distanceMeters / 1609.34).toFixed(1)} mi${drivingRoute.trafficPercent > 0 ? ` · +${drivingRoute.trafficPercent}% traffic` : ''}`
                    : 'Search for a route, or tap 🚗 for driving directions'}
                </p>
              </div>
            ) : (
            <div className="w-full px-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-slate-950 shadow-md"
                    style={{ backgroundColor: lineColor }}
                  >
                    {shortName}
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Route &amp; Station</p>
                    <p className="truncate text-sm font-semibold text-slate-100">
                      {isBus ? `Route ${shortName}` : `${shortName} Line`}
                      {dir && <span className="font-normal text-slate-400"> · To {dir.headsign}</span>}
                    </p>
                  </div>
                </div>
                {!loading &&
                  (hasLiveService ? (
                    <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Active</span>
                  ) : serviceToday === false ? (
                    <span className="shrink-0 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400">No service today</span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400">No live service</span>
                  ))}
              </div>
              {dir && (
                <p className="mt-1 truncate text-[10px] text-slate-500">
                  {routeType != null && `${routeTypeLabel(routeType)} · $${farePrice.toFixed(2)}`}
                  {dir.accessibility.wheelchairAccessible === true && ' · ♿'}
                  {dir.accessibility.bikesAllowed === true && ' · 🚲'}
                  {dir.scheduledDurationMinutes != null && ` · ~${formatDuration(dir.scheduledDurationMinutes)} trip`}
                  {dir.frequencyMinutes != null && ` · every ~${dir.frequencyMinutes} min`}
                </p>
              )}
              {directions.length > 1 && (
                <div className="mt-2 flex gap-1">
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
              )}
              <div className="mt-2 flex gap-1 border-t border-slate-800 pt-2">
                {(
                  [
                    { id: 'schedule', label: '📅 Schedule' },
                    { id: 'directions', label: '🧭 Directions' },
                    { id: 'alerts', label: `🔔 Alerts${activeAlerts.length > 0 ? ` (${activeAlerts.length})` : ''}` },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSheetTab(t.id)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                      sheetTab === t.id ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            )
          }
        >
          {shortName == null ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">
                Use the search bar above to pick a rail line or bus route, find one near you, or get driving directions below.
              </p>
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Driving Directions</h4>
                <DirectionsPanel
                  destination={destination}
                  setDestination={setDestination}
                  driveLoading={driveLoading}
                  driveError={driveError}
                  drivingRoute={drivingRoute}
                  onGo={startDriving}
                />
                {drivingRoute && (
                  <button type="button" onClick={clearDriving} className="mt-2 text-xs text-slate-500 hover:text-slate-300">
                    ✕ clear directions
                  </button>
                )}
              </div>
              {savedTrips.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">My Commute</h4>
                  {savedTrips.map((trip) => {
                    const firstRoute = trip.chain[0];
                    const line = lineOptions.find((l) => l.shortName === firstRoute);
                    return (
                      <button
                        key={trip.name}
                        type="button"
                        onClick={() => selectLine(firstRoute)}
                        className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-left hover:border-sky-500"
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-slate-950"
                          style={{ backgroundColor: line?.color ?? '#38bdf8' }}
                        >
                          {firstRoute}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-200">{trip.name}</p>
                          <p className="truncate text-xs text-slate-500">{trip.chain.join(' → ')}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : sheetTab === 'directions' ? (
            <DirectionsPanel
              destination={destination}
              setDestination={setDestination}
              driveLoading={driveLoading}
              driveError={driveError}
              drivingRoute={drivingRoute}
              onGo={startDriving}
            />
          ) : sheetTab === 'alerts' ? (
            <div className="space-y-2">
              <a
                href="https://www.rtd-denver.com/service-advisories"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-sm text-emerald-300 hover:border-emerald-500"
              >
                🔗 View live service advisories on rtd-denver.com
              </a>
              {activeAlerts.length === 0 && (
                <p className="text-xs text-slate-600">
                  No active alerts in RTD's live feed right now ({alerts?.entity?.length ?? 0} raw entries received).
                </p>
              )}
              {activeAlerts.length === 0 ? null : (
                activeAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl border border-amber-600/40 bg-amber-500/10 p-3">
                    <p className="text-sm font-semibold text-amber-300">
                      ⚠️ {alert.routeIds.length > 0 ? `[${alert.routeIds.join(', ')}] ` : ''}
                      {alert.header}
                      {alert.effect && (
                        <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-300">
                          {alert.effect.replace(/_/g, ' ')}
                        </span>
                      )}
                    </p>
                    {alert.description && <p className="mt-1 text-sm text-amber-200/80">{alert.description}</p>}
                    {alert.url && (
                      <a
                        href={alert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs font-medium text-amber-300 underline"
                      >
                        More details →
                      </a>
                    )}
                  </div>
                ))
              )}
              {lastUpdated && <p className="text-xs text-slate-600">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
            </div>
          ) : (
          <>
          {/* Live vehicles */}
          <div className="mb-4">
            <h4 className="mb-1 text-sm font-medium text-slate-300">{isBus ? 'Live Buses' : 'Live Trains'} ({vehicles.length})</h4>
            {vehicles.length === 0 ? (
              <p className="text-sm text-slate-500">{isBus ? 'No active buses right now.' : 'No active trains right now.'}</p>
            ) : (
              <ul className="space-y-1.5">
                {vehicles.map((v, i) => {
                  const headsign = directions.find((d) => d.directionId === v.directionId)?.headsign;
                  const dirColor = v.directionId === 1 ? '#c084fc' : '#38bdf8';
                  const delayLabel = formatDelay(v.delaySeconds);
                  const delayClass =
                    v.delaySeconds == null
                      ? 'text-slate-500'
                      : Math.abs(v.delaySeconds) < 60
                        ? 'text-emerald-400'
                        : v.delaySeconds > 0
                          ? 'text-amber-400'
                          : 'text-sky-400';
                  return (
                    <li key={v.id} className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base"
                        style={{ backgroundColor: `${dirColor}22`, borderColor: dirColor }}
                      >
                        {isBus ? '🚌' : '🚆'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-100">
                          {isBus ? 'Bus' : 'Train'} {i + 1}
                          {v.occupancyStatus && <span className="font-normal text-slate-400"> · {formatOccupancy(v.occupancyStatus)}</span>}
                        </p>
                        {headsign && <p className="truncate text-xs text-slate-500">→ {headsign}</p>}
                      </div>
                      <div className="shrink-0 text-right text-xs">
                        {v.speedMph != null && <p className="text-slate-300">{Math.round(v.speedMph)} mph</p>}
                        {delayLabel && <p className={delayClass}>{delayLabel}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Stop timeline — one direction at a time */}
          {!dir ? (
            <p className="text-sm text-slate-500">No stop data available.</p>
          ) : (
            <div className="relative pl-6">
              <div className="absolute bottom-2 left-[7px] top-2 w-0.5 rounded-full" style={{ backgroundColor: `${lineColor}55` }} />
              <div className="space-y-3">
                {(() => {
                  const stopIndexById = new Map(dir.stops.map((s, i) => [s.stop_id, i]));
                  return dir.stops.map((stop, idx) => {
                  const arrivals = arrivalsByStop[`${stop.stop_id}|${dir.directionId}`] ?? [];
                  const { current: next, upcoming } = getCountdownDisplay(arrivals, now);
                  const stopLabel = idx === 0 ? 'Departs' : 'Arrives';
                  const stopKey = `${stop.stop_id}|${dir.directionId}`;
                  const isSkipped = skippedStops.has(stopKey);
                  const scheduled = formatScheduledTime(stop.departure_time ?? stop.arrival_time);

                  // Match this stop's next predicted arrival to the live vehicle running that
                  // trip, then use the vehicle's *reported* status (not just time math) to
                  // decide the wording: Arrived / Arriving / Departed / X min / Scheduled.
                  const matched = next ? vehicleByTripId[next.tripId] : undefined;
                  const vIdx = matched?.stopId != null ? stopIndexById.get(matched.stopId) : undefined;
                  const atThisStop = matched != null && vIdx === idx;
                  const passedThisStop = matched != null && vIdx != null && vIdx > idx;
                  const trainHere = atThisStop && (matched!.status === 'STOPPED_AT' || matched!.status === 'INCOMING_AT');
                  const trainApproaching = atThisStop && matched!.status === 'IN_TRANSIT_TO';

                  let dotClasses = 'border-slate-600 bg-slate-800';
                  let statusNode: React.ReactNode = null;
                  let timeMain: React.ReactNode;
                  let timeSub: string | null = null;

                  if (isSkipped) {
                    dotClasses = 'border-red-500 bg-red-500/30';
                    statusNode = <span className="text-xs font-semibold uppercase tracking-wide text-red-400">Skipping</span>;
                    timeMain = '—';
                  } else if (atThisStop && matched!.status === 'STOPPED_AT') {
                    dotClasses = 'border-amber-400 bg-amber-400';
                    statusNode = <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Arrived</span>;
                    timeMain = <span className="text-base font-bold text-amber-400">Arrived</span>;
                    timeSub = `${formatClockTime(next!.time)} · ${stopLabel}`;
                  } else if (atThisStop && matched!.status === 'INCOMING_AT') {
                    dotClasses = 'border-amber-400 bg-amber-400';
                    statusNode = <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Arriving</span>;
                    timeMain = <span className="text-base font-bold text-amber-400">Arriving</span>;
                    timeSub = `${formatClockTime(next!.time)} · ${stopLabel}`;
                  } else if (atThisStop && next && Math.round((next.time * 1000 - now) / 60000) <= 1) {
                    dotClasses = 'border-amber-400 bg-amber-400';
                    statusNode = <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Arriving</span>;
                    timeMain = <span className="text-base font-bold text-amber-400">Arriving</span>;
                    timeSub = `${formatClockTime(next.time)} · ${stopLabel}`;
                  } else if (passedThisStop) {
                    dotClasses = 'border-slate-500 bg-slate-600';
                    statusNode = <span className="text-xs font-medium text-slate-500">Departed</span>;
                    timeMain = <span className="text-base font-bold text-slate-500">Departed</span>;
                    timeSub = next ? `${formatClockTime(next.time)} · ${stopLabel}` : null;
                  } else if (next) {
                    dotClasses = 'border-emerald-400 bg-emerald-400/20';
                    statusNode = <span className="text-xs font-medium text-emerald-400">Live GPS tracking</span>;
                    timeMain = <span className="text-base font-bold text-sky-400">{formatCountdown(next.time, now)}</span>;
                    timeSub = `${formatClockTime(next.time)} · ${stopLabel}`;
                  } else {
                    statusNode = <span className="text-xs text-slate-600">Scheduled</span>;
                    timeMain = <span className="text-base font-bold text-slate-500">{scheduled ?? '—'}</span>;
                    timeSub = scheduled ? stopLabel : null;
                  }

                  const expanded = selectedStop?.stopId === stop.stop_id;

                  return (
                    <div key={stop.stop_id} className={`relative ${isSkipped ? 'opacity-50' : ''}`}>
                      <span className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 ${dotClasses}`} />
                      {trainApproaching && (
                        <button
                          type="button"
                          onClick={() => setSelectedVehicleStop((cur) => (cur === stopKey ? null : stopKey))}
                          title="Train approaching — tap for details"
                          className="absolute -left-[26px] -top-3 z-10 animate-bounce text-base leading-none"
                        >
                          {isBus ? '🚌' : '🚆'}
                        </button>
                      )}
                      {trainHere && (
                        <button
                          type="button"
                          onClick={() => setSelectedVehicleStop((cur) => (cur === stopKey ? null : stopKey))}
                          title="Train at this stop — tap for details"
                          className="absolute -left-[27px] top-0 z-10 animate-pulse text-lg leading-none"
                        >
                          {isBus ? '🚌' : '🚆'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedStop((cur) => (cur?.stopId === stop.stop_id ? null : { stopId: stop.stop_id, stopName: stop.stop_name }))}
                        className="flex w-full items-start justify-between gap-2 text-left"
                      >
                        <div className="min-w-0">
                          <span className={`truncate text-sm font-semibold ${expanded ? 'text-sky-300' : 'text-slate-100'}`}>{stop.stop_name}</span>
                          {transfersByStop[stop.stop_id]?.length > 0 && (
                            <span className="ml-2 text-xs font-semibold text-sky-400" title={`Connects to: ${transfersByStop[stop.stop_id].map((t) => t.routeLongName).join(', ')}`}>
                              ⇄ {transfersByStop[stop.stop_id].map((t) => t.routeShortName).join(', ')}
                            </span>
                          )}
                          <div>{statusNode}</div>
                          {upcoming.length > 0 && (
                            <p className="mt-0.5 text-xs text-slate-600">then {upcoming.map((a) => formatCountdown(a.time, now)).join(', ')}</p>
                          )}
                          {selectedVehicleStop === stopKey && matched && (
                            <p className="mt-1 rounded bg-slate-800/80 px-2 py-1 text-xs text-slate-300">
                              {isBus ? '🚌 Bus' : '🚆 Train'}
                              {trainApproaching ? ' approaching' : ' here'} · {formatDelay(matched.delaySeconds)}
                              {matched.speedMph != null && ` · ${Math.round(matched.speedMph)} mph`}
                              {matched.occupancyStatus && ` · ${formatOccupancy(matched.occupancyStatus)}`}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          {timeMain}
                          {timeSub && <p className="text-[10px] uppercase tracking-wide text-slate-600">{timeSub}</p>}
                        </div>
                      </button>

                      {expanded && (
                        <div className="mt-2 rounded-lg border border-sky-900/60 bg-slate-950 p-3">
                          <p className="text-xs text-slate-400">
                            Scheduled {stopLabel.toLowerCase()}: <span className="font-semibold text-slate-200">{scheduled ?? '—'}</span>
                          </p>
                          <div className="mt-2 border-t border-slate-800 pt-2">
                            {stopRoutes === null ? (
                              <p className="text-sm text-slate-500">Loading other routes…</p>
                            ) : stopRoutes.length === 0 ? (
                              <p className="text-sm text-slate-500">No other routes found for this stop in the imported schedule.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {stopRoutes.map((r) => {
                                  const liveArrivals = getArrivalsForStop(tripUpdates, selectedStop!.stopId).filter((a) => a.routeId === r.routeId);
                                  return (
                                    <div key={r.shortName} className="flex items-center gap-2 text-sm">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          selectLine(r.shortName);
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
                          </div>
                        </div>
                      )}
                    </div>
                  );
                  });
                })()}
              </div>
            </div>
          )}

          <p className="mt-3 text-xs text-slate-600">
            Stop names and {isBus ? 'route' : 'station'} list come from RTD's weekly GTFS schedule export and may lag recent service changes.{' '}
            {isBus ? 'Bus' : 'Train'} positions and arrival predictions above are live.
          </p>
          </>
          )}
        </BottomSheet>
      )}
    </div>
  );
}
