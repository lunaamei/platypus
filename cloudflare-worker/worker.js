// Cloudflare Worker — proxies chat completions to GitHub Models so the real
// PAT never reaches the browser. Deploy with `wrangler deploy` from this
// directory, then set the secret with `wrangler secret put GITHUB_MODELS_KEY`.
//
// Set ALLOWED_ORIGIN below (or as a Worker variable) to your GitHub Pages
// origin, e.g. "https://your-username.github.io", so only your site can call it.

const ALLOWED_ORIGIN = 'https://lunaamei.github.io';

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const body = await request.text();

    const upstream = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GITHUB_MODELS_KEY}`,
      },
      body,
    });

    const responseBody = await upstream.text();

    return new Response(responseBody, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  },
};
