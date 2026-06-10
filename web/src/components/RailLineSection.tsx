import { useRailLine } from '../lib/useRailLine';

function formatDelay(seconds: number | null): string {
  if (seconds == null) return '';
  if (Math.abs(seconds) < 60) return 'on time';
  const mins = Math.round(seconds / 60);
  return mins > 0 ? `+${mins} min late` : `${Math.abs(mins)} min early`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const hour = h % 24;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function RailLineSection({ shortName }: { shortName: string }) {
  const { stops, departuresByStop, vehicles, loading, error } = useRailLine(shortName);

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
                {vehicles.map((v) => (
                  <li key={v.id} className="text-sm text-slate-400">
                    Train {v.id}
                    {v.lat != null && v.lon != null && ` — ${v.lat.toFixed(4)}, ${v.lon.toFixed(4)}`}
                    {v.status && ` · ${v.status.replace(/_/g, ' ').toLowerCase()}`}
                    {v.delaySeconds != null && ` · ${formatDelay(v.delaySeconds)}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className="mb-2 font-medium text-slate-300">Next Departures</h4>
            <ul className="space-y-1">
              {stops.map((stop) => (
                <li key={stop.stop_id} className="flex justify-between text-sm">
                  <span className="text-slate-200">{stop.stop_name}</span>
                  <span className="text-slate-500">
                    {(departuresByStop[stop.stop_id] ?? []).map((d) => formatTime(d.departure_time)).join(', ') || '—'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
