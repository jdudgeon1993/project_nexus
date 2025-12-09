<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>RTD N Line – Live Departures</title>

<style>
    body {
        font-family: Inter, sans-serif;
        background: #eef2f5;
        padding: 20px;
        display: flex;
        justify-content: center;
    }

    .wrapper {
        display: flex;
        gap: 20px;
    }

    .card {
        background: #ffffff;
        width: 320px;
        padding: 20px;
        border-radius: 18px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }

    .title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 8px;
    }

    .stop {
        font-size: 14px;
        color: #666;
        margin-bottom: 20px;
    }

    .time {
        font-size: 40px;
        font-weight: 800;
        margin-bottom: 10px;
    }

    .status {
        padding: 6px 10px;
        font-size: 13px;
        border-radius: 6px;
        display: inline-block;
    }

    .scheduled { background: #dfe7ff; color: #203a8f; }
    .predicted { background: #d4f8da; color: #05652b; }
    .error { background: #ffd4d4; color: #9f0000; }
</style>
</head>
<body>

<div class="wrapper">
    <!-- Southbound card -->
    <div class="card" id="southCard">
        <div class="title">Southbound → Union Station</div>
        <div class="stop">From: Northglenn / 112th</div>
        <div class="time" id="southTime">--</div>
        <div class="status scheduled" id="southStatus">Loading…</div>
    </div>

    <!-- Northbound card -->
    <div class="card" id="northCard">
        <div class="title">Northbound → Northglenn</div>
        <div class="stop">From: Union Station</div>
        <div class="time" id="northTime">--</div>
        <div class="status scheduled" id="northStatus">Loading…</div>
    </div>
</div>

<script>
const API_KEY = "TXTmQ3It74ub7L4huB6mgBxUJ824DRLG";
const ROUTE_ID = "r-9xj6-n";

const STOP_NORTHGLENN = "s-9xj7584cbq-northglenn~112thavestation";
const STOP_UNION = "s-9xj64t5cbc-unionstation";

async function getNextDeparture(stopId, directionFilter) {
    const url = `https://transit.land/api/v2/rest/stops/${stopId}/departures?` +
                `route_onestop_id=${ROUTE_ID}&limit=10&api_key=${API_KEY}`;

    const response = await fetch(url);
    const json = await response.json();

    // Filter by direction_id
    const departures = (json.departures || []).filter(
        d => Number(d.trip.direction_id) === directionFilter
    );

    return departures[0]; // earliest upcoming
}

function render(cardPrefix, departure) {
    const timeEl = document.getElementById(cardPrefix + "Time");
    const statusEl = document.getElementById(cardPrefix + "Status");

    if (!departure) {
        timeEl.innerText = "--";
        statusEl.innerText = "No trains scheduled";
        statusEl.className = "status error";
        return;
    }

    const dep = departure.departure;

    const time =
        dep.predicted_time ||
        dep.time ||
        dep.scheduled_time;

    const dt = new Date(time);

    timeEl.innerText = dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    if (dep.predicted_time) {
        statusEl.innerText = "Real-time";
        statusEl.className = "status predicted";
    } else {
        statusEl.innerText = "Scheduled";
        statusEl.className = "status scheduled";
    }
}

async function update() {
    try {
        // Southbound = direction 1 (toward Union Station)
        const south = await getNextDeparture(STOP_NORTHGLENN, 1);
        render("south", south);

        // Northbound = direction 0 (toward Northglenn)
        const north = await getNextDeparture(STOP_UNION, 0);
        render("north", north);

    } catch (err) {
        console.error(err);
    }
}

update();
setInterval(update, 30000); // refresh every 30s
</script>
</body>
</html>