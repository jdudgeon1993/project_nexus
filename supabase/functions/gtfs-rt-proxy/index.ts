// Supabase Edge Function: GTFS-RT Proxy
// Fixes CORS issues by proxying RTD's GTFS-RT feeds

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GTFS_RT_FEEDS = {
  TripUpdate: 'https://www.rtd-denver.com/files/gtfs-rt/TripUpdate.pb',
  VehiclePosition: 'https://www.rtd-denver.com/files/gtfs-rt/VehiclePosition.pb',
  Alerts: 'https://www.rtd-denver.com/files/gtfs-rt/Alerts.pb'
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get feed type from query parameter
    const url = new URL(req.url);
    const feedType = url.searchParams.get('feed') || 'TripUpdate';

    // Validate feed type
    if (!GTFS_RT_FEEDS[feedType as keyof typeof GTFS_RT_FEEDS]) {
      return new Response(
        JSON.stringify({ error: 'Invalid feed type. Use: TripUpdate, VehiclePosition, or Alerts' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const feedUrl = GTFS_RT_FEEDS[feedType as keyof typeof GTFS_RT_FEEDS];

    console.log(`Fetching GTFS-RT feed: ${feedType} from ${feedUrl}`);

    // Fetch the Protocol Buffer feed from RTD
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'RTD-Transit-App/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`RTD feed returned ${response.status}: ${response.statusText}`);
    }

    // Get the binary data
    const buffer = await response.arrayBuffer();

    console.log(`Successfully fetched ${feedType}: ${buffer.byteLength} bytes`);

    // Return the Protocol Buffer with proper CORS headers
    return new Response(buffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'public, max-age=15', // Cache for 15 seconds
      }
    });

  } catch (error) {
    console.error('GTFS-RT Proxy Error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to fetch GTFS-RT feed',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
