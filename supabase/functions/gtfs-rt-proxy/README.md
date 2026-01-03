# GTFS-RT Proxy Edge Function

This Supabase Edge Function proxies RTD Denver's GTFS-RT feeds to fix CORS issues.

## Deployment

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy gtfs-rt-proxy
```

## Usage

Once deployed, your function will be available at:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/gtfs-rt-proxy
```

### Query Parameters

- `feed` (required): The feed type to fetch
  - `TripUpdate` - Real-time trip updates and delays
  - `VehiclePosition` - Live vehicle GPS positions
  - `Alerts` - Service alerts and disruptions

### Examples

```javascript
// Fetch Trip Updates
const response = await fetch(
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/gtfs-rt-proxy?feed=TripUpdate'
);
const buffer = await response.arrayBuffer();

// Fetch Vehicle Positions
const response = await fetch(
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/gtfs-rt-proxy?feed=VehiclePosition'
);
const buffer = await response.arrayBuffer();

// Fetch Alerts
const response = await fetch(
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/gtfs-rt-proxy?feed=Alerts'
);
const buffer = await response.arrayBuffer();
```

## Frontend Integration

Update your GTFS_RT_FEEDS constant in index.html:

```javascript
const GTFS_RT_FEEDS = {
    tripUpdates: 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/gtfs-rt-proxy?feed=TripUpdate',
    vehiclePositions: 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/gtfs-rt-proxy?feed=VehiclePosition',
    alerts: 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/gtfs-rt-proxy?feed=Alerts'
};
```

## Testing Locally

```bash
# Serve the function locally
supabase functions serve gtfs-rt-proxy

# Test it
curl "http://localhost:54321/functions/v1/gtfs-rt-proxy?feed=TripUpdate"
```

## Notes

- The function includes a 15-second cache to reduce load on RTD's servers
- CORS headers are properly configured for browser access
- Error handling returns JSON with details
- Logs include feed type and byte size for monitoring
