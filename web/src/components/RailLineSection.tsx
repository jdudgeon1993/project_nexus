import { useEffect, useState } from 'react';
import { useRailLine } from '../lib/useRailLine';
import { getRailLines, routeTypeLabel, type RailLineOption } from '../lib/schedule';
import RailLineMap from './RailLineMap';

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
  if (totalSeconds <= 0) return 'DUE';
  if (totalSeconds < 90) return `${totalSeconds}s`;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins < 5) return `${mins}m ${secs}s`;
  return `${mins} min`;
}

export default function RailLineSection() {
  const [shortName, setShortName] = useState('N');
  const [lines, setLines] = useState<RailLineOption[]>([]);
  const { directions, arrivalsByStop, vehicles, routeType, color, loading, error } = useRailLine(shortName);
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

  const lineOptions = lines.length > 0 ? lines : [{ shortName: 'N', longName: 'N Line', routeType: 0, color: null }];
  const commuterLines = lineOptions.filter((l) => l.routeType === 2);
  const lightRailLines = lineOptions.filter((l) => l.routeType !== 2);
  const hasLiveService = vehicles.length > 0;
  const lineColor = color ?? '#38bdf8';

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
              <h3 className="text-lg font-semibold leading-tight">{shortName} Line</h3>
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
              <p className="text-xs uppercase tracking-wide text-slate-500">{routeTypeLabel(routeType)}</p>
            )}
          </div>
        </div>
        <select
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
          className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-200"
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
        </select>
      </div>

      {loading && <p className="px-4 pb-4 text-slate-400">Loading…</p>}
      {error && <p className="px-4 pb-4 text-sm text-red-400">Error: {error}</p>}

      {!loading && (
        <>
          <div className="px-4">
            <RailLineMap directions={directions} vehicles={vehicles} />
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
              <span className="inline-block h-3 w-3 rounded-full border border-slate-400 bg-slate-700" /> Station
            </span>
          </div>

          <div className="px-4">
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

          {/* Departure board */}
          {directions.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-slate-500">No stop data available.</p>
          ) : (
            <div className="grid gap-4 px-4 pb-4 lg:grid-cols-2">
              {directions.map((dir) => (
                <div key={dir.directionId} className="overflow-hidden rounded-lg border border-slate-800">
                  <div
                    className="px-3 py-2 text-sm font-bold uppercase tracking-wider text-slate-950"
                    style={{ backgroundColor: lineColor }}
                  >
                    Toward {dir.headsign}
                  </div>
                  <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-0.5 bg-slate-950/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>Station</span>
                    <span className="text-right">Sched</span>
                    <span className="text-right">Due</span>
                  </div>
                  <div className="divide-y divide-slate-800/60 font-mono text-sm">
                    {dir.stops.map((stop, idx) => {
                      const arrivals = arrivalsByStop[`${stop.stop_id}|${dir.directionId}`] ?? [];
                      const next = arrivals[0];
                      const isImminent = next && next.time - now / 1000 <= 120;
                      return (
                        <div
                          key={stop.stop_id}
                          className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-3 px-3 py-1.5 ${
                            idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'
                          }`}
                        >
                          <span className="truncate font-sans text-slate-200">{stop.stop_name}</span>
                          {next ? (
                            <>
                              <span className="text-right text-slate-500">{formatClockTime(next.time)}</span>
                              <span className={`text-right font-bold ${isImminent ? 'text-amber-400' : 'text-sky-400'}`}>
                                {formatCountdown(next.time, now)}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-right text-slate-700">—</span>
                              <span className="text-right text-slate-700">—</span>
                            </>
                          )}
                          {arrivals.length > 1 && (
                            <span className="col-span-3 -mt-0.5 text-right text-xs text-slate-600">
                              then {arrivals
                                .slice(1)
                                .map((a) => formatCountdown(a.time, now))
                                .join(', ')}
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
            Stop names and station list come from RTD's weekly GTFS schedule export and may lag recent service
            changes. Train positions and arrival predictions above are live.
          </p>
        </>
      )}
    </div>
  );
}
