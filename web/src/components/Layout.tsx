import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Transit', icon: '🚆', end: true },
  { to: '/drive', label: 'Drive', icon: '🚗' },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/info', label: 'Info', icon: 'ℹ️' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="flex h-14 shrink-0 items-center border-b border-slate-800 bg-slate-900/60 px-4 backdrop-blur">
        <h1 className="text-lg font-bold tracking-tight">RTD Transit Nexus</h1>
      </header>

      <main className="relative flex-1 px-4 py-6 pb-24">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 h-16 border-t border-slate-800 bg-slate-900/90 backdrop-blur">
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
