import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPaths = [resolve(__dirname, '.env'), resolve(__dirname, '../.env')];
for (const p of envPaths) {
  if (existsSync(p)) {
    const content = readFileSync(p, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val.trim();
      }
    }
  }
}

// Import compiled Lambda handler
const { handler } = await import('./dist/analyze.js');

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && (req.url === '/analyze' || req.url === '/')) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      const event = {
        version: '2.0',
        routeKey: 'POST /analyze',
        rawPath: '/analyze',
        headers: req.headers,
        requestContext: {
          requestId: 'local-' + Date.now(),
          http: { method: 'POST', path: '/analyze' }
        },
        body,
        isBase64Encoded: false
      };

      try {
        const result = await handler(event);
        res.writeHead(result.statusCode || 200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...result.headers
        });
        res.end(result.body);
      } catch (err) {
        console.error('Local server execution error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: { message: err.message } }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n🚀 ResuMatch Local Backend running on http://127.0.0.1:${PORT}/analyze\n`);
});
