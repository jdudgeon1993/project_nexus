import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { fetchWeather, type WeatherData } from '../lib/api';

const FAB_ITEMS = [
  { to: '/plan', label: 'Plan', icon: '🧭' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const location = useLocation();
  const onMap = location.pathname === '/';

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => setWeather(null));
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-slate-950 text-slate-100">
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

      {/* Small floating shortcuts to the non-map sections — replaces the old bottom nav bar. */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[1200] flex flex-col gap-2">
        {FAB_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border text-lg shadow-lg backdrop-blur transition-colors ${
                isActive
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                  : 'border-slate-700 bg-slate-900/90 text-slate-300 hover:border-slate-500'
              }`
            }
            title={item.label}
          >
            {item.icon}
          </NavLink>
        ))}
        {!onMap && (
          <NavLink
            to="/"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-lg text-slate-300 shadow-lg backdrop-blur transition-colors hover:border-slate-500"
            title="Map"
          >
            🗺️
          </NavLink>
        )}
      </div>
    </div>
  );
}
