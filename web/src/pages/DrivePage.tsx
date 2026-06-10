import { useState } from 'react';
import { calculateDriveTime, type DriveTimeLeg } from '../lib/api';

export default function DrivePage() {
  const [home, setHome] = useState('');
  const [work, setWork] = useState('');
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [result, setResult] = useState<{ homeToWork: DriveTimeLeg; workToHome: DriveTimeLeg } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!home || !work) {
      setError('Please enter both home and work addresses');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setResult(await calculateDriveTime(home, work, avoidHighways));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate drive time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Drive Times</h2>
      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          placeholder="Home address"
          value={home}
          onChange={(e) => setHome(e.target.value)}
        />
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          placeholder="Work address"
          value={work}
          onChange={(e) => setWork(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={avoidHighways} onChange={(e) => setAvoidHighways(e.target.checked)} />
          Avoid highways
        </label>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Calculating…' : 'Calculate Route'}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {result && (
          <div className="space-y-1 text-sm text-slate-300">
            <p>Home → Work: {result.homeToWork.minutes} min ({result.homeToWork.trafficPercent}% traffic)</p>
            <p>Work → Home: {result.workToHome.minutes} min ({result.workToHome.trafficPercent}% traffic)</p>
          </div>
        )}
      </div>
    </section>
  );
}
