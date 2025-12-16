import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ROADMAP_API_BASE = "https://roadmap-project-api-production.up.railway.app";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const API_KEY = Deno.env.get('EXTERNAL_ROADMAP_API_KEY');
    
    if (!API_KEY) {
      console.error('EXTERNAL_ROADMAP_API_KEY not configured');
      return new Response(
        JSON.stringify({ roadmaps: null, useFallback: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try common API endpoints
    const endpoints = [
      `${ROADMAP_API_BASE}/roadmaps?key=${API_KEY}`,
      `${ROADMAP_API_BASE}/api/roadmaps?key=${API_KEY}`,
      `${ROADMAP_API_BASE}/?key=${API_KEY}`,
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log('Trying endpoint:', endpoint.replace(API_KEY, '[REDACTED]'));
        const response = await fetch(endpoint);
        const data = await response.json();
        
        // Check if the API returns actual roadmap data
        if (data.roadmaps && Array.isArray(data.roadmaps)) {
          console.log('Found roadmaps array in response');
          return new Response(
            JSON.stringify({ roadmaps: data.roadmaps, useFallback: false }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (Array.isArray(data) && data.length > 0 && data[0].nodes) {
          console.log('Found roadmaps data array');
          return new Response(
            JSON.stringify({ roadmaps: data, useFallback: false }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (error) {
        console.log('Endpoint failed:', error);
        continue;
      }
    }
    
    // If no endpoint returns valid data, signal to use fallback
    console.log('No valid roadmap data from API, signaling fallback');
    return new Response(
      JSON.stringify({ roadmaps: null, useFallback: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Fetch external roadmap error:', error);
    return new Response(
      JSON.stringify({ roadmaps: null, useFallback: true, error: 'Failed to fetch roadmaps' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});