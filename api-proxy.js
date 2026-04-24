/* ════════════════════════════════════════════
   LOXONE ICON GENERATOR — API PROXY
   Proxy local pour appels Genspark LLM
   Évite l'exposition du token côté client
   Port: 3747
   ════════════════════════════════════════════ */
'use strict';

const http  = require('http');
const https = require('https');

const PORT      = 3747;
const API_BASE  = 'https://www.genspark.ai/api/llm_proxy/v1';
const API_KEY   = process.env.GENSPARK_TOKEN || '';

if (!API_KEY) {
  console.error('❌ GENSPARK_TOKEN non défini');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS — accepte localhost et GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Seul endpoint exposé : /chat
  if (req.method !== 'POST' || req.url !== '/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let parsed;
    try { parsed = JSON.parse(body); }
    catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'JSON invalide' }));
      return;
    }

    const payload = JSON.stringify({
      model:      parsed.model      || 'gpt-4o',
      messages:   parsed.messages   || [],
      max_tokens: parsed.max_tokens || 2048,
      temperature:parsed.temperature || 0.3,
    });

    const options = {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const url = new URL(`${API_BASE}/chat/completions`);
    options.hostname = url.hostname;
    options.path     = url.pathname;
    options.port     = 443;

    const proxyReq = https.request(options, proxyRes => {
      res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', err => {
      console.error('Proxy error:', err.message);
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Proxy error: ' + err.message }));
      }
    });

    proxyReq.write(payload);
    proxyReq.end();
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Proxy Genspark démarré sur http://127.0.0.1:${PORT}`);
});
