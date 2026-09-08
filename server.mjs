import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { configured, model, effort, interview, validateInput } from './ai.mjs';
const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
let aiBusy = false;
createServer(async (req, res) => {
  const path = new URL(req.url || '/', 'http://localhost').pathname;
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  const json = (status, data) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(data)); };
  if (![`localhost:${port}`, `127.0.0.1:${port}`].includes(req.headers.host)) return json(403,{error:'Host no permitido.'});
  if (path === '/health') return json(200,{status:'ok',service:'gnx-inception',mode:configured ? 'openai' : 'local',model:configured ? model : null,effort:configured ? effort : null});
  if (path === '/api/interview') {
    if (req.method !== 'POST') return json(405,{error:'POST requerido.'});
    if (req.headers.origin && ![`http://localhost:${port}`,`http://127.0.0.1:${port}`].includes(req.headers.origin)) return json(403,{error:'Origen no permitido.'});
    if (!req.headers['content-type']?.startsWith('application/json')) return json(415,{error:'JSON requerido.'});
    if (aiBusy) return json(429,{error:'Hay una solicitud en curso. Espera un momento.'});
    aiBusy = true;
    try {
      let size = 0; const chunks = [];
      for await (const chunk of req) { size += chunk.length; if (size > 200000) return json(413,{error:'Contexto demasiado grande.'}); chunks.push(chunk); }
      let body; try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return json(400,{error:'JSON inválido.'}); }
      if (!validateInput(body)) return json(400,{error:'Aporte inválido o contexto demasiado largo.'});
      return json(200,await interview(body));
    } catch (error) { return json(error.status || 502,{error:error.name === 'TimeoutError' ? 'OpenAI tardó demasiado. Tu aporte se conserva; puedes reintentar.' : error.message.startsWith('OpenAI') || error.message.startsWith('La clave') || error.message.startsWith('El proyecto') || error.message.startsWith('La respuesta') ? error.message : 'No se pudo conectar a OpenAI. Tu aporte se conserva.'}); }
    finally { aiBusy = false; }
  }
  const safe = path === '/' ? 'index.html' : path.slice(1);
  if (!['index.html', 'ui.css', 'favicon.svg'].includes(safe) && !/^dist\/[a-zA-Z0-9_/-]+\.js$/.test(safe)) { res.writeHead(404); return res.end('Not found'); }
  try {
    const data = await readFile(root + safe);
    res.writeHead(200, { 'Content-Type': types[safe.slice(safe.lastIndexOf('.'))] || 'text/plain', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`GNX Inception running at http://localhost:${port}`));
