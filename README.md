<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RTD N Line Final Stop ID Diagnostic</title>
    <script src="https://cdn.jsdelivr.net/npm/protobufjs@7.2.5/dist/protobuf.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: auto; padding: 20px; background-color: #f7f7f7; }
        h1 { text-align: center; color: #D9534F; margin-bottom: 30px; }
        .train-section { background-color: #ffffff; border: 1px solid #ddd; padding: 25px; margin-bottom: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        h2 { border-bottom: 2px solid #D9534F; padding-bottom: 10px; margin-top: 0; }
        .next-train-container { background-color: #ffe6e6; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center; border: 1px dashed #D9534F; }
        .next-train-label { font-size: 1.1em; font-weight: 600; color: #D9534F; }
        .next-train-time { font-size: 2.2em; font-weight: bold; color: #005A9C; display: block; margin-top: 5px; }
        .note { text-align: center; color: #666; font-size: 0.9em; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>

    <h1>🚨 FINAL STOP ID DIAGNOSTIC 🚨</h1>
    <p class="note">This code is looking for the NEXT N Line train ANYWHERE in the system.</p>
    
    <div class="train-section">
        <h2>Next N Line Prediction Found</h2>
        <div class="next-train-container">
            <span class="next-train-label">Next Train Prediction (Any Stop):</span>
            <span class="next-train-time" id="loading-status">Loading...</span>
        </div>
    </div>

    <script>
        const TARGET_STOP_ID = '35366'; 
        const N_LINE_ROUTE_ID = 'N'; 
        const RTD_FEED_URL = 'https://corsproxy.io/?https%3A%2F%2Fopen-data.rtd-denver.com%2Ffiles%2Fgtfs-rt%2Frtd%2FTripUpdate.pb';
        
        // GTFS-RT Schema (Confirmed Working)
        const GTFS_SCHEMA = {
            "nested": { "transit_realtime": { "nested": {
                "FeedHeader": { "fields": { "gtfsRealtimeVersion": { "type": "string", "id": 1 }, "incrementality": { "type": "int32", "id": 2, "options": { "default": 0 } }, "timestamp": { "type": "uint64", "id": 3 } } },
                "FeedMessage": { "fields": { "header": { "type": "FeedHeader", "id": 1 }, "entity": { "type": "FeedEntity", "rule": "repeated", "id": 2 } } },
                "FeedEntity": { "fields": { "id": { "type": "string", "id": 1 }, "tripUpdate": { "type": "TripUpdate", "id": 3 } } },
                "TripUpdate": { "fields": { "trip": { "type": "TripDescriptor", "id": 1 }, "stopTimeUpdate": { "type": "StopTimeUpdate", "rule": "repeated", "id": 2 } } },
                "StopTimeUpdate": { "fields": { "stopId": { "type": "string", "id": 4 }, "arrival": { "type": "StopTimeEvent", "id": 1 }, "departure": { "type": "StopTimeEvent", "id": 2 } } },
                "StopTimeEvent": { "fields": { "time": { "type": "int64", "id": 1 } } },
                "TripDescriptor": { "fields": { "tripId": { "type": "string", "id": 1 }, "routeId": { "type": "string", "id": 5 }, "directionId": { "type": "uint32", "id": 6 }, "headsign": { "type": "string", "id": 3 } } }
            } } }
        };

        async function getNextTrain() {
            const statusElement = document.getElementById('loading-status');
            statusElement.textContent = 'Fetching and Decoding...';

            try {
                const response = await fetch(RTD_FEED_URL);
                const buffer = await response.arrayBuffer();
                const uint8Array = new Uint8Array(buffer);

                const root = protobuf.Root.fromJSON(GTFS_SCHEMA);
                const FeedMessage = root.lookupType("transit_realtime.FeedMessage");
                const message = FeedMessage.decode(uint8Array);
                const entities = message.entity || [];

                if (entities.length === 0) {
                     statusElement.textContent = 'RTD feed is empty.';
                     return;
                }

                let predictions = [];
                const now = Math.floor(Date.now() / 1000); 
                
                entities.forEach(entity => {
                    const tripUpdate = entity.tripUpdate; 
                    const trip = tripUpdate?.trip;

                    if (tripUpdate && tripUpdate.stopTimeUpdate && trip) {
                        const updates = tripUpdate.stopTimeUpdate;
                        
                        // Filter 1: Check for the CONFIRMED N Line Route ID ('N')
                        if (trip.routeId === N_LINE_ROUTE_ID) { 
                            updates.forEach(update => {
                                // 🛑 STOP ID CHECK REMOVED 🛑
                                
                                const timeObject = update.arrival || update.departure;
                                
                                if (timeObject && timeObject.time && Number(timeObject.time) >= now) {
                                    predictions.push({
                                        timestamp: Number(timeObject.time),
                                        headsign: trip.headsign || 'Unknown Destination',
                                        foundStopId: update.stopId, // Capture the Stop ID
                                    });
                                }
                            });
                        }
                    }
                });

                // Sort and Display
                predictions.sort((a, b) => a.timestamp - b.timestamp);
                
                function formatTime(timestamp) {
                    if (!timestamp) return 'N/A';
                    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }

                if (predictions.length === 0) {
                     statusElement.textContent = 'No N Line trips currently in the feed.';
                     console.log("❌ CONFIRMATION: N Line has NO active trains in the RTD system feed right now.");
                } else {
                    const nextPrediction = predictions[0];
                    const timeString = formatTime(nextPrediction.timestamp);
                    
                    // Display the next prediction found anywhere in the system
                    statusElement.innerHTML = `
                        ${timeString}<br>
                        <span style="font-size: 0.5em; font-weight: normal; color: #005A9C;">
                            DEST: ${nextPrediction.headsign} (Stop ID: ${nextPrediction.foundStopId})
                        </span>
                    `;
                    
                    // Log the critical information to the console
                    console.log("✅ SUCCESS! N LINE PREDICTION FOUND.");
                    console.log("-> YOUR STOP ID MAY BE WRONG. The prediction found has Stop ID:", nextPrediction.foundStopId);
                    console.log("-> Use this correct ID in the final code.");
                }

            } catch (error) {
                console.error("Fatal Error:", error);
                statusElement.textContent = 'Live data error. See console.';
            }
        }

        window.addEventListener('load', () => {
            getNextTrain(); 
            setInterval(getNextTrain, 30000); 
        });
    </script>
</body>
</html>
