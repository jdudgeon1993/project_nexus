import { useEffect, useState } from 'react';
import { fetchWeather, type WeatherData } from '../lib/api';

export default function InfoPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => setWeather(null));
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Info</h2>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-slate-400">Denver weather</p>
        <p className="text-2xl font-bold">
          {weather ? `${weather.icon} ${weather.temp}°F` : 'Loading…'}
        </p>
      </div>
    </section>
  );
}
