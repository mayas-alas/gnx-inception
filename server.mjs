import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  const path = new URL(req.url || '/', 'http://localhost').pathname;
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (path === '/health') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ status: 'ok', service: 'gnx-inception', mode: 'local' })); }
  const safe = path === '/' ? 'index.html' : path.slice(1);
  if (!['index.html', 'ui.css', 'favicon.svg'].includes(safe) && !/^dist\/[a-zA-Z0-9_/-]+\.js$/.test(safe)) { res.writeHead(404); return res.end('Not found'); }
  try {
    const data = await readFile(root + safe);
    res.writeHead(200, { 'Content-Type': types[safe.slice(safe.lastIndexOf('.'))] || 'text/plain', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`GNX Inception running at http://localhost:${port}`));
