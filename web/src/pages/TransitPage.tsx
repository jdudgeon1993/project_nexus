import { useGtfsRt } from '../lib/useGtfsRt';
import { getActiveAlerts, type ServiceAlert } from '../lib/gtfsrt';
import RailLineSection from '../components/RailLineSection';
import TripPlanner from '../components/TripPlanner';

/** Feed data older than this is probably stuck/stale rather than just between polls. */
const STALE_THRESHOLD_SECONDS = 120;

export default function TransitPage() {
  const { tripUpdates, vehiclePositions, alerts, lastUpdated, error, loading } = useGtfsRt();

  // No specific route/stop filter yet -> shows all currently-active alerts.
  const activeAlerts = getActiveAlerts(alerts);

  const feedTimestamps = [tripUpdates?.header?.timestamp, vehiclePositions?.header?.timestamp]
    .filter((t): t is number => typeof t === 'number' && t > 0);
  const oldestFeedAge = feedTimestamps.length > 0 ? Math.floor(Date.now() / 1000) - Math.min(...feedTimestamps) : null;
  const isStale = oldestFeedAge != null && oldestFeedAge > STALE_THRESHOLD_SECONDS;

  return (
    <section className="space-y-4">
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

      <TripPlanner tripUpdates={tripUpdates} />

      <RailLineSection />

      {/* GTFS-RT diagnostics — confirms whether live data is actually flowing */}
      <details className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm" open>
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
    </section>
  );
}
