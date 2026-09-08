import { createSession, type Session } from './domain.js';
const key = 'gnx-inception-v3';
export type Store = { sessions: Session[]; activeId: string };
export function load(): Store {
  const raw = localStorage.getItem(key);
  if (!raw) { const s = createSession(); return { sessions: [s], activeId: s.id }; }
  const data = JSON.parse(raw) as Store;
  if (!Array.isArray(data.sessions) || !data.sessions.length || !data.sessions.every(s => s.id && Array.isArray(s.claims) && Array.isArray(s.evidence) && Array.isArray(s.skipped))) throw new Error('No se pudo recuperar la sesión guardada.');
  return data;
}
export function save(store: Store) { localStorage.setItem(key, JSON.stringify(store)); }
function db(): Promise<IDBDatabase> { return new Promise((resolve, reject) => { const r = indexedDB.open('gnx-evidence', 1); r.onupgradeneeded = () => r.result.createObjectStore('files'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }); }
export async function putFile(id: string, blob: Blob) { const d = await db(); return new Promise<void>((resolve, reject) => { const tx = d.transaction('files', 'readwrite'); tx.objectStore('files').put(blob, id); tx.oncomplete = () => { d.close(); resolve(); }; tx.onerror = () => { d.close(); reject(tx.error); }; tx.onabort = () => reject(tx.error); }); }
export async function getFile(id: string): Promise<Blob | undefined> { const d = await db(); return new Promise((resolve, reject) => { const r = d.transaction('files').objectStore('files').get(id); r.onsuccess = () => { resolve(r.result); d.close(); }; r.onerror = () => { reject(r.error); d.close(); }; }); }
export async function deleteFile(id: string) { const d = await db(); return new Promise<void>((resolve, reject) => { const tx = d.transaction('files', 'readwrite'); tx.objectStore('files').delete(id); tx.oncomplete = () => { d.close(); resolve(); }; tx.onerror = () => reject(tx.error); }); }
