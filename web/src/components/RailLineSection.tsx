import { useState } from 'react';
import { useRailLine } from '../lib/useRailLine';
import RailLineMap from './RailLineMap';

const RAIL_LINES = ['A', 'B', 'D', 'E', 'G', 'H', 'N', 'R', 'W'];

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

export default function RailLineSection() {
  const [shortName, setShortName] = useState('N');
  const { directions, arrivalsByStop, vehicles, loading, error } = useRailLine(shortName);

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{shortName} Line</h3>
        <select
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
          className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-200"
        >
          {RAIL_LINES.map((line) => (
            <option key={line} value={line}>
              {line} Line
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-slate-400">Loading…</p>}
      {error && <p className="text-sm text-red-400">Error: {error}</p>}

      {!loading && (
        <>
          <RailLineMap directions={directions} vehicles={vehicles} />

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

          {directions.length === 0 ? (
            <p className="text-sm text-slate-500">No stop data available.</p>
          ) : (
            directions.map((dir) => (
              <div key={dir.directionId}>
                <h4 className="mb-2 font-medium text-slate-300">Toward {dir.headsign}</h4>
                <ul className="space-y-1">
                  {dir.stops.map((stop) => {
                    const arrivals = arrivalsByStop[`${stop.stop_id}|${dir.directionId}`] ?? [];
                    return (
                      <li key={stop.stop_id} className="flex justify-between text-sm">
                        <span className="text-slate-200">{stop.stop_name}</span>
                        <span className="text-slate-500">
                          {arrivals.length > 0 ? arrivals.map((a) => formatEta(a.time)).join(', ') : '—'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
