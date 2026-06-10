import { useState } from 'react';
import { searchNearbyTransit, type NearbyStop } from '../lib/api';

export default function SearchPage() {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(0.5);
  const [stops, setStops] = useState<NearbyStop[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!location) {
      setError('Please enter a location');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchNearbyTransit(location, radius);
      setStops(data.stops);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search nearby transit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Nearby Bus Stops</h2>
      <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          placeholder="Address or place"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="flex gap-2">
          {[0.25, 0.5, 1].map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                radius === r ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-300'
              }`}
            >
              {r} mi
            </button>
          ))}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {stops && (
        <div className="space-y-2">
          {stops.length === 0 && <p className="text-slate-400">No bus stops found nearby.</p>}
          {stops.map((stop) => (
            <div key={stop.place_id ?? stop.name} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <p className="font-semibold">{stop.name}</p>
              {stop.address && <p className="text-sm text-slate-400">{stop.address}</p>}
              <p className="text-sm text-slate-400">{stop.distance} mi away{stop.rating ? ` · ⭐ ${stop.rating}` : ''}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
