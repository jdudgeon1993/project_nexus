import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { fetchWeather, type WeatherData } from '../lib/api';

const NAV_ITEMS = [
  { to: '/', label: 'Map', icon: '🗺️', end: true },
  { to: '/plan', label: 'Plan', icon: '🧭' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => setWeather(null));
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 backdrop-blur">
        <h1 className="text-lg font-bold tracking-tight">RTD Transit Nexus</h1>
        {weather && (
          <span className="flex items-center gap-1.5 text-sm text-slate-300">
            <span>{weather.icon}</span>
            <span>{weather.temp}°F</span>
          </span>
        )}
      </header>

      <main className="relative flex-1 overflow-hidden">
        <Outlet />
      </main>

      <nav className="h-16 shrink-0 border-t border-slate-800 bg-slate-900/90 backdrop-blur">
        <ul className="mx-auto flex h-full max-w-xl items-center justify-between px-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <span className="text-lg leading-none">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
