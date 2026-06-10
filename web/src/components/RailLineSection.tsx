import { useEffect, useState } from 'react';
import { useRailLine } from '../lib/useRailLine';
import RailLineMap from './RailLineMap';

const RAIL_LINES = ['A', 'B', 'D', 'E', 'G', 'H', 'N', 'R', 'W'];

function formatDelay(seconds: number | null): string {
  if (seconds == null) return '';
  if (Math.abs(seconds) < 60) return 'on time';
  const mins = Math.round(seconds / 60);
  return mins > 0 ? `+${mins} min late` : `${Math.abs(mins)} min early`;
}

function formatClockTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/** Live mm:ss countdown, falling back to whole minutes once it's far out. */
function formatCountdown(unixSeconds: number, now: number): string {
  const totalSeconds = Math.round(unixSeconds - now / 1000);
  if (totalSeconds <= 0) return 'now';
  if (totalSeconds < 90) return `${totalSeconds}s`;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins < 5) return `${mins}m ${secs}s`;
  return `${mins} min`;
}

export default function RailLineSection() {
  const [shortName, setShortName] = useState('N');
  const { directions, arrivalsByStop, vehicles, loading, error } = useRailLine(shortName);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

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

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-[#38bdf8]" /> Toward {directions[0]?.headsign ?? 'direction 1'}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-[#a78bfa]" /> Toward {directions[1]?.headsign ?? 'direction 2'}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-[#facc15]" /> Delayed 1–10 min
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-[#ef4444]" /> Delayed 10+ min
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full border border-slate-400 bg-slate-700" /> Station
            </span>
          </div>

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
                <ul className="space-y-2">
                  {dir.stops.map((stop) => {
                    const arrivals = arrivalsByStop[`${stop.stop_id}|${dir.directionId}`] ?? [];
                    return (
                      <li key={stop.stop_id} className="text-sm">
                        <div className="text-slate-200">{stop.stop_name}</div>
                        {arrivals.length > 0 ? (
                          <ul className="ml-2 space-y-0.5">
                            {arrivals.map((a, i) => (
                              <li key={i} className="flex justify-between text-slate-500">
                                <span>{formatClockTime(a.time)}</span>
                                <span className="font-mono">{formatCountdown(a.time, now)}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="ml-2 text-slate-600">—</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}

          <p className="text-xs text-slate-600">
            Stop names and station list come from RTD's weekly GTFS schedule export and may lag recent service
            changes. Train positions and arrival predictions above are live.
          </p>
        </>
      )}
    </div>
  );
}
