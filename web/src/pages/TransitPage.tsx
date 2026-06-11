import { useEffect, useState } from 'react';
import { useGtfsRt } from '../lib/useGtfsRt';
import { getActiveAlerts, type ServiceAlert } from '../lib/gtfsrt';
import { getRailLines, type RailLineOption } from '../lib/schedule';
import RailLineSection from '../components/RailLineSection';
import TripPlanner from '../components/TripPlanner';
import HomeView from '../components/HomeView';

/** Feed data older than this is probably stuck/stale rather than just between polls. */
const STALE_THRESHOLD_SECONDS = 120;

const TABS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'plan', label: 'Plan', icon: '🧭' },
  { id: 'map', label: 'Map', icon: '🗺️' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function TabPill({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  return (
    <div className="fixed inset-x-0 bottom-[4.5rem] z-[1100] flex justify-center px-4">
      <div className="flex gap-1 rounded-full border border-slate-800 bg-slate-900/90 p-1 shadow-lg backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TransitPage() {
  const { tripUpdates, vehiclePositions, alerts, lastUpdated, error, loading } = useGtfsRt();
  const [tab, setTab] = useState<TabId>('home');
  const [lines, setLines] = useState<RailLineOption[]>([]);

  useEffect(() => {
    getRailLines().then(setLines);
  }, []);

  // No specific route/stop filter yet -> shows all currently-active alerts.
  const activeAlerts = getActiveAlerts(alerts);

  const feedTimestamps = [tripUpdates?.header?.timestamp, vehiclePositions?.header?.timestamp]
    .filter((t): t is number => typeof t === 'number' && t > 0);
  const oldestFeedAge = feedTimestamps.length > 0 ? Math.floor(Date.now() / 1000) - Math.min(...feedTimestamps) : null;
  const isStale = oldestFeedAge != null && oldestFeedAge > STALE_THRESHOLD_SECONDS;

  if (tab === 'map') {
    // Full-bleed map view escapes the page's padding and fills the space
    // between the app header and the bottom tab bar.
    return (
      <>
        <div className="fixed inset-x-0 top-14 bottom-16">
          <RailLineSection />
        </div>
        <TabPill tab={tab} setTab={setTab} />
      </>
    );
  }

  return (
    <section className="space-y-4 pb-16">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Live Transit</h2>
        {!loading && oldestFeedAge != null && (
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isStale ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}
            title={`GTFS-RT feed last updated ${oldestFeedAge}s ago`}
          >
            <span className={`h-2 w-2 rounded-full ${isStale ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
            {isStale ? `Feed stale (${Math.round(oldestFeedAge / 60)}m old)` : 'Live'}
          </span>
        )}
      </div>

      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((alert: ServiceAlert) => (
            <div key={alert.id} className="rounded-xl border border-amber-600/40 bg-amber-500/10 p-3">
              <p className="font-semibold text-amber-300">
                ⚠️ {alert.routeIds.length > 0 ? `[${alert.routeIds.join(', ')}] ` : ''}
                {alert.header}
                {alert.effect && (
                  <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-300">
                    {alert.effect.replace(/_/g, ' ')}
                  </span>
                )}
                {alert.cause && (
                  <span className="ml-2 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                    {alert.cause.replace(/_/g, ' ')}
                  </span>
                )}
              </p>
              {alert.description && <p className="mt-1 text-sm text-amber-200/80">{alert.description}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 'home' && <HomeView tripUpdates={tripUpdates} lines={lines} onPlanTrip={() => setTab('plan')} />}
      {tab === 'plan' && <TripPlanner tripUpdates={tripUpdates} />}

      {/* GTFS-RT diagnostics — confirms whether live data is actually flowing */}
      <details className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-300">GTFS-RT Diagnostics</summary>
        <div className="mt-2 space-y-1 text-slate-400">
          {loading && <p>Loading feeds…</p>}
          {error && <p className="text-red-400">Error: {error}</p>}
          {!loading && (
            <>
              <p>Trip Updates: {tripUpdates?.entity?.length ?? 0} entities</p>
              <p>Vehicle Positions: {vehiclePositions?.entity?.length ?? 0} entities</p>
              <p>Alerts: {alerts?.entity?.length ?? 0} entities ({activeAlerts.length} active)</p>
              <p>Last updated: {lastUpdated?.toLocaleTimeString() ?? '—'}</p>
            </>
          )}
        </div>
      </details>

      <TabPill tab={tab} setTab={setTab} />
    </section>
  );
}
