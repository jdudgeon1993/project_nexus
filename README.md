<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live RTD Trains</title>
</head>
<body>
  <h1>Next RTD Trains</h1>
  <ul id="train-list"></ul>

  <script type="module">
    import { FeedMessage } from 'https://cdn.jsdelivr.net/npm/gtfs-realtime-bindings@0.0.7/dist/gtfs-realtime-bindings.mjs';

    const RTD_URL = 'https://www.rtd-denver.com/files/gtfs-rt/TripUpdate.pb';
    const PROXY = 'https://corsproxy.io/?'; // CORS proxy

    // Your stop IDs
    const STOPS = ['33727','35254']; // Union Station & 112th/Northglenn

    async function getTrains() {
      try {
        const res = await fetch(PROXY + RTD_URL);
        const arrayBuffer = await res.arrayBuffer();
        const feed = FeedMessage.decode(new Uint8Array(arrayBuffer));

        const trains = [];

        feed.entity.forEach(entity => {
          if (!entity.trip_update) return;
          const trip = entity.trip_update;
          trip.stop_time_update.forEach(stu => {
            if (STOPS.includes(stu.stop_id)) {
              const arrivalTime = stu.arrival?.time 
                ? new Date(stu.arrival.time.low * 1000).toLocaleTimeString() 
                : 'No estimate';
              trains.push({
                stop_id: stu.stop_id,
                headsign: trip.trip_headsign,
                arrival: arrivalTime,
                delay: stu.arrival?.delay || 0
              });
            }
          });
        });

        displayTrains(trains);
      } catch (err) {
        console.error('Error fetching trains:', err);
      }
    }

    function displayTrains(trains) {
      const list = document.getElementById('train-list');
      list.innerHTML = '';
      trains.forEach(train => {
        const li = document.createElement('li');
        li.textContent = `${train.headsign} → Stop ${train.stop_id}: ${train.arrival} (Delay: ${train.delay}s)`;
        list.appendChild(li);
      });
    }

    // Refresh every 30 seconds
    getTrains();
    setInterval(getTrains, 30000);
  </script>
</body>
</html>