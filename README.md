# RTD Transit Nexus

A phone-friendly web app (installable as a PWA) for Denver's RTD rail lines:
live train positions and arrivals, line maps, a trip planner, I-25 Express
Lane toll estimates, and push notifications for service alerts on the lines
you follow.

> **Moving local.** The plan to rebuild this as a simple, self-hosted app on
> the home server (no Supabase, no Railway, no paid map or Google APIs) is in
> [`docs/LOCAL_REBUILD_PLAN.md`](docs/LOCAL_REBUILD_PLAN.md). This README
> describes the app as it runs today.

## How it fits together

```
 RTD open data ──────────────┐
  • weekly schedule (GTFS)   │  GitHub Action, Sundays 10 PM MT
  • live feeds (GTFS-RT .pb) │  scripts/rtd_import.py ──► Supabase Postgres (rtd_* tables)
                             │                                   ▲
                             ▼                                   │ schedule queries
  Railway: server/index.js (Express) ◄── /api/* ──  web/ (React + Vite PWA, Leaflet maps)
   • /api/gtfs-rt      live feed proxy (no CORS)                 │
   • /api/weather      Open-Meteo (no key)                       │
   • /api/driving-route  Google Routes API (key)                 │
   • /api/push/*       web-push alerts; subscriptions in Supabase│
   • serves web/dist for everything else ────────────────────────┘
```

| Part | Where | What it does |
|---|---|---|
| `web/` | built into `web/dist`, served by the server | The whole app: one page (`MapPage` → `RailLineSection`) with the line map (`RailLineMap`), live trains, trip planner (`TripPlanner`), toll estimator (`ExpressLaneTolls`), install prompt and service worker (`sw.ts`). Reads the schedule straight from Supabase with the anon key. |
| `server/index.js` | Railway (Nixpacks, `nixpacks.toml`) | Express server: the `/api/*` routes above, a background poller that turns RTD service alerts into push notifications, and the static site. |
| `scripts/rtd_import.py` | GitHub Actions (`.github/workflows/update-gtfs.yml`) | Downloads RTD's GTFS zip, keeps rail routes only, and replaces every `rtd_*` table in Supabase in one transaction. Records the version in `rtd_feed_info`. |
| `sql/` | Supabase | Schema for `rtd_feed_info`. |
| `supabase/functions/gtfs-rt-proxy` | Supabase (legacy) | The old live-feed proxy, replaced by `/api/gtfs-rt`. Not used. |

The base map is OpenStreetMap's standard tiles, darkened with a CSS filter
(`web/src/lib/basemap.ts`, `.basemap-dark` in `web/src/index.css`). Until
October 2026 it used CARTO's `dark_all` tiles, which now return an
"API KEY REQUIRED" placeholder.

## Configuration

Server (Railway variables):

| Variable | Needed for |
|---|---|
| `PORT` | Set by Railway |
| `GOOGLE_MAPS_API_KEY` | `/api/driving-route` (the "drive to the station" feature). Also used by `/api/search-nearby-transit` and `/api/calculate-drive-time`, which nothing in the app calls anymore. |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Push notifications |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Push subscriptions (`push_subscriptions` table) |
| `PUSH_TEST_SECRET` | Optional: protects `/api/push/test` |

Web build (Vite, read at build time):

| Variable | Needed for |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Schedule queries |
| `VITE_VAPID_PUBLIC_KEY` | Subscribing to push |

GitHub Actions secret: `SUPABASE_DB_URL` (direct or session-pooler Postgres
URL, not the port-6543 transaction pooler).

## Run it locally

```bash
cd web && npm install && npm run build      # needs the VITE_* variables
cd ../server && npm install
GOOGLE_MAPS_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node index.js
# open http://localhost:3000 (or $PORT)
```

For front-end work, `cd web && npm run dev` (Vite proxies `/api` per
`vite.config.ts`).

## Data

- **Schedule:** `https://www.rtd-denver.com/files/gtfs/google_transit.zip`
  (redirects to RTD's open-data server). Imported weekly; rail routes only
  (`route_type` 0, 1, 2).
- **Live feeds:** `https://www.rtd-denver.com/files/gtfs-rt/{TripUpdate,VehiclePosition,Alerts}.pb`
  (redirect to `open-data.rtd-denver.com`; the server follows the redirect).
- **Check the imported version:**
  ```sql
  SELECT feed_version, feed_start_date, feed_end_date, last_updated,
         NOW() - last_updated AS age
  FROM rtd_feed_info ORDER BY last_updated DESC LIMIT 1;
  ```
- **Re-import now:** GitHub → Actions → *Update RTD GTFS Data* → *Run workflow*.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Map shows "API KEY REQUIRED" tiles | An old build still pointing at CARTO tiles. Redeploy. |
| Grey map, no tiles | OpenStreetMap tiles blocked or offline. The rail lines and trains still draw. |
| No live trains | `/api/gtfs-rt?feed=VehiclePosition` failing: check Railway logs, or RTD's feed. |
| Lines or stops missing | Stale or failed weekly import: check the Actions tab and `rtd_feed_info`. |
| "Failed to get directions" | `GOOGLE_MAPS_API_KEY` missing, or the Routes API isn't enabled / billing is off. |
| No push notifications | VAPID or Supabase variables missing on Railway; phone not subscribed. |

## License

MIT
