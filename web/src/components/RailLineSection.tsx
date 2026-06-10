import { useRailLine } from '../lib/useRailLine';

function formatDelay(seconds: number | null): string {
  if (seconds == null) return '';
  if (Math.abs(seconds) < 60) return 'on time';
  const mins = Math.round(seconds / 60);
  return mins > 0 ? `+${mins} min late` : `${Math.abs(mins)} min early`;
}

function formatEta(unixSeconds: number): string {
  const mins = Math.round((unixSeconds * 1000 - Date.now()) / 60000);
  if (mins <= 0) return 'now';
  if (mins === 1) return '1 min';
  return `${mins} min`;
}

export default function RailLineSection({ shortName }: { shortName: string }) {
  const { stops, arrivalsByStop, vehicles, loading, error } = useRailLine(shortName);

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="text-lg font-semibold">{shortName} Line</h3>

      {loading && <p className="text-slate-400">Loading…</p>}
      {error && <p className="text-sm text-red-400">Error: {error}</p>}

      {!loading && (
        <>
          <div>
            <h4 className="mb-2 font-medium text-slate-300">Live Trains ({vehicles.length})</h4>
            {vehicles.length === 0 ? (
              <p className="text-sm text-slate-500">No active trains right now.</p>
            ) : (
              <ul className="space-y-1">
                {vehicles.map((v, i) => (
                  <li key={v.id} className="text-sm text-slate-400">
                    Train {i + 1}
                    {v.lat != null && v.lon != null && ` — ${v.lat.toFixed(4)}, ${v.lon.toFixed(4)}`}
                    {v.status && ` · ${v.status.replace(/_/g, ' ').toLowerCase()}`}
                    {v.delaySeconds != null && ` · ${formatDelay(v.delaySeconds)}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className="mb-2 font-medium text-slate-300">Next Arrivals</h4>
            {stops.length === 0 ? (
              <p className="text-sm text-slate-500">No stop data available.</p>
            ) : (
              <ul className="space-y-1">
                {stops.map((stop) => {
                  const arrivals = arrivalsByStop[stop.stop_id] ?? [];
                  return (
                    <li key={stop.stop_id} className="flex justify-between text-sm">
                      <span className="text-slate-200">{stop.stop_name}</span>
                      <span className="text-slate-500">
                        {arrivals.length > 0
                          ? arrivals.map((a) => formatEta(a.time)).join(', ')
                          : '—'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
