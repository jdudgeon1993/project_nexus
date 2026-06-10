import { useGtfsRt } from '../lib/useGtfsRt';
import { getActiveAlerts, type ServiceAlert } from '../lib/gtfsrt';
import RailLineSection from '../components/RailLineSection';

export default function TransitPage() {
  const { tripUpdates, vehiclePositions, alerts, lastUpdated, error, loading } = useGtfsRt();

  // No specific route/stop filter yet -> shows all currently-active alerts.
  const activeAlerts = getActiveAlerts(alerts);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Live Transit</h2>

      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((alert: ServiceAlert) => (
            <div key={alert.id} className="rounded-xl border border-amber-600/40 bg-amber-500/10 p-3">
              <p className="font-semibold text-amber-300">
                ⚠️ {alert.routeIds.length > 0 ? `[${alert.routeIds.join(', ')}] ` : ''}
                {alert.header}
              </p>
              {alert.description && <p className="mt-1 text-sm text-amber-200/80">{alert.description}</p>}
            </div>
          ))}
        </div>
      )}

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
