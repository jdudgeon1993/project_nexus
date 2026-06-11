export default function SettingsPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto p-4 pb-6">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Settings</h2>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-slate-400">
            Favorite stations, home/work addresses, and theme preferences will go here.
          </p>
        </div>
      </section>
    </div>
  );
}
