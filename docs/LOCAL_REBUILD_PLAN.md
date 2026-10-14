# Nexus Local: rebuild plan

Goal: the same useful RTD rail app, rebuilt simple and self-hosted on the
home server (`g3-node1`), with **no Supabase, no Railway, no API keys and no
paid map service**. The only outside thing it talks to is RTD's own open
data, which is the source of the information and needs no key.

Status: plan, not started (written 2026-10-14). Decisions to make are marked
**Decide**.

---

## Why

- **Things break from the outside.** In October 2026, CARTO's free dark
  map tiles started returning "API KEY REQUIRED" and the map went blank.
  Nothing in the app changed. Every outside service is another thing that
  can do that.
- **Two hosted services for one small app.** Railway runs the server
  (~$6/mo); Supabase holds the weekly schedule and push subscriptions. Both
  need accounts, keys and dashboards.
- **The data is small.** RTD's whole rail schedule is 10 lines, ~4,100
  trips, ~52,000 stop times and ~67,000 shape points. That fits in one
  SQLite file of a few MB; no database server needed.
- **The code grew big.** `RailLineSection.tsx` alone is ~1,550 lines.

## What we keep, drop or replace

| Today | Uses | Local plan |
|---|---|---|
| Weekly schedule in Supabase via GitHub Action | Supabase, GitHub secret | **Replace.** The server downloads RTD's GTFS zip itself every Sunday night (systemd timer), keeps rail only, writes `data/rtd.sqlite`. |
| Live trains: browser parses GTFS-RT protobuf | Railway proxy | **Simplify.** The server fetches RTD's `.pb` feeds every ~20 s, parses them once, and hands the browser plain JSON. No protobuf code in the browser. |
| Base map: CARTO, now OpenStreetMap tiles | Outside tile server | **Replace with a self-hosted map** (Protomaps, see below). Fallback: OpenStreetMap tiles as today. |
| Rail lines and stations on the map | Supabase shapes and stops | **Keep**, drawn from the local SQLite. |
| "Drive to the station" route, distance and time | Google Routes API (key, billing) | **Replace with our own routing engine (OSRM)**, see below. Or drop it. **Decide.** |
| `/api/search-nearby-transit`, `/api/calculate-drive-time` | Google APIs | **Delete.** Nothing in the app calls them. "Nearest station" comes from the local stop list instead. |
| Weather in the header | Open-Meteo (no key) | **Decide:** keep (free, no key) or drop to be fully RTD-only. |
| Express Lane toll estimator | Local table (`lib/tolls.ts`) | **Keep** as-is. |
| Push alerts for followed lines | web-push + Supabase table | **Keep**, with subscriptions in the local SQLite. Self-generated VAPID keys; no account. |
| Install as an app (PWA) + offline cache | Service worker | **Keep.** Needs HTTPS, which Tailscale provides (see Hosting). |
| GitHub Pages copy | — | **Delete.** It's a stale leftover. |
| `supabase/functions/gtfs-rt-proxy` | — | **Delete.** Already replaced. |

## Target design

```
                 RTD open data (no key)
                  │ weekly GTFS zip        │ live .pb feeds every ~20 s
                  ▼                        ▼
   g3-node1 ─ nexus server ───────────────────────────────────────────
   │  importer  → data/rtd.sqlite   (routes, stops, trips, stop_times,
   │                                 shapes, calendar, feed_info,
   │                                 push_subscriptions)
   │  live poller → in-memory JSON  (vehicles, arrivals, alerts)
   │  alert watcher → web-push to subscribed phones
   │  /api/*  small JSON endpoints
   │  /tiles/denver.pmtiles  self-hosted map
   │  /       the app (static HTML/CSS/JS)
   └── reached over Tailscale: https://g3-node1.tailfdf6a6.ts.net (tailscale serve)
```

### The map, with no API

**Protomaps** turns OpenStreetMap into one file (`.pmtiles`) that we cut to
just the Denver metro area and host ourselves. The browser draws it with
**MapLibre GL**, and Protomaps ships ready-made light and dark styles.

- One download, roughly 50–150 MB for the metro area, refreshed a couple of
  times a year (or never: streets don't change much).
- No account, no key, no per-request limits, works offline on the tailnet.
- Rail lines, stations and live trains are layers on top, from our own data.

Simplest fallback if Protomaps feels like too much at first: keep Leaflet
with OpenStreetMap's tile server and the dark filter (what's live now).

### Driving distance and time, with no API

**OSRM** (Open Source Routing Machine) is the open-source engine behind
many map apps. We give it Colorado's OpenStreetMap road data once, and it
answers "route, distance and drive time from A to B" from our own server.

- Data: Colorado extract from Geofabrik (~250 MB `.osm.pbf`).
- Prepare once (needs a few GB of RAM: do it on `fedora-beast`), then copy
  the prepared files to node1, where `osrm-routed` serves them with ~1–2 GB
  of memory. Refresh the road data a couple of times a year.
- The app asks our server `GET /api/drive?from=lat,lon&to=stop_id`; our
  server asks OSRM on localhost. Nothing leaves the house.
- **Limit:** no live traffic. Times are typical, not rush-hour; good enough
  for "about 18 minutes to Arapahoe at Village Center".
- The route line draws on the same self-hosted map.

If that's more than wanted, drop the feature entirely; nothing else depends
on it.

### The server

**Decide: Python or Node.**

- **Python (recommended):** one language for the importer and the server,
  the same stack as Cura, and it's the language you're learning. FastAPI (or
  Flask) + SQLite + `gtfs-realtime-bindings` + `pywebpush`. Runs under
  systemd like Cura.
- **Node:** reuse more of `server/index.js` and the TypeScript logic as-is.

### The app

**Decide: keep React or go plain.**

- **Plain HTML/CSS/JS (recommended for "simple"):** a few small pages (Lines,
  a Line's map and arrivals, Trip planner, Tolls, Alerts) that read JSON from
  the server. No build step, easy to read and change.
- **Keep React + Vite:** reuse components, but keep the build step and the
  large files.

Either way, the matching, schedule and planner logic in `web/src/lib/*.ts`
is the reference to port. It's the valuable part of the current code.

### Hosting on node1

- systemd service (like `zbb-budget`), data in `/opt/nexus/data/`.
- **HTTPS for the PWA and push:** `tailscale serve` gives
  `https://g3-node1.tailfdf6a6.ts.net` a real certificate, so it installs as
  an app on your phone and push works, as long as the phone is on the
  tailnet.
- **Decide:** only you and your household (tailnet only, simplest), or
  public (Tailscale Funnel or a Cloudflare Tunnel later)?
- Backups: the SQLite file is rebuilt every Sunday from RTD, so only
  `push_subscriptions` matters; it joins the existing nightly backup to
  `~/Sync/node1-backups/`.

## Phases

### Phase 0: Keep today's app working (done in this PR)
- [x] Map tiles: CARTO → OpenStreetMap, dark filter.
- [x] README describes the real app.

### Phase 1: Local data
- [ ] Python importer: GTFS zip → `rtd.sqlite` (rail only, one transaction,
      keeps the last good file if a download fails).
- [ ] Weekly systemd timer on node1 (Sunday 10 PM MT), replacing the GitHub
      Action.
- [ ] Live poller: TripUpdate / VehiclePosition / Alerts → JSON, with the
      existing trip-matching rules (trip_id first, then route + direction +
      time).

### Phase 2: Local server + map
- [ ] JSON endpoints: lines, a line's stops and shape, arrivals at a stop,
      live vehicles, alerts, feed version.
- [ ] Self-hosted Protomaps file for the Denver metro + MapLibre with the
      dark style.
- [ ] systemd service + `tailscale serve` HTTPS.

### Phase 3: The app, simplified
- [ ] Line list → line page (map + next trains each way + alerts).
- [ ] Trip planner (port `lib/planner.ts`), toll estimator (port
      `lib/tolls.ts`).
- [ ] Drive to the station via local OSRM (if chosen): set up OSRM with
      the Colorado extract, `/api/drive`, route line + distance + time.
- [ ] PWA manifest + service worker; push alerts with local VAPID keys.

### Phase 4: Switch over and retire
- [ ] Run both side by side for a week; compare arrivals.
- [ ] Re-subscribe your phone to alerts on the local app.
- [ ] Retire: Railway project (cancel the ~$6/mo), Supabase project (export
      first), the GitHub Action and its secret, GitHub Pages, the Google key
      (delete it in Google Cloud so nothing can bill).

## Decisions

1. Server language: **Python** (recommended) or Node?
2. App: **plain HTML/JS** (recommended) or keep React?
3. Drive distance and time: **our own OSRM** (recommended, no API, no live traffic) or drop it?
4. Weather: keep (Open-Meteo, no key) or drop?
5. Who uses it: tailnet only (recommended) or public?
