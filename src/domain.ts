export const topics = [
  { id: 'story', label: 'El punto de partida', short: 'Contexto', question: '¿Qué te gustaría cambiar?', reason: 'Un caso real nos ayuda a entender dónde empieza el problema.', hint: 'Cuéntame la última vez que ocurrió. Si todavía es una idea, empieza por lo que imaginas.', starters: ['Tengo un proceso que mejorar', 'Estoy explorando una idea', 'Quiero ahorrar tiempo'] },
  { id: 'people', label: 'Las personas', short: 'Personas', question: '¿Quién vive este problema de cerca?', reason: 'Quien usa la solución y quien la aprueba pueden necesitar cosas distintas.', hint: 'Piensa en quien hace el trabajo, quien recibe el resultado y quien decide.', starters: ['Nuestro equipo de operaciones', 'Los clientes', 'Todavía necesito consultarlo'] },
  { id: 'process', label: 'El trabajo de hoy', short: 'Proceso', question: '¿Cómo lo resuelven hoy, paso a paso?', reason: 'Los pasos y las esperas revelan el mejor lugar para empezar.', hint: 'Desde que llega la solicitud hasta que alguien da el trabajo por terminado.', starters: ['Primero recibimos una solicitud', 'Lo hacemos manualmente', 'Cada persona lo hace diferente'] },
  { id: 'outcome', label: 'El cambio que importa', short: 'Resultado', question: '¿Qué tendría que mejorar en los próximos 30 días?', reason: 'Una señal observable nos permitirá saber si la primera prueba sirvió.', hint: 'Puedes estimar: tiempo actual, tiempo deseado y cómo lo medirías.', starters: ['Reducir el tiempo de respuesta', 'Disminuir los errores', 'Tomar mejores decisiones'] },
  { id: 'sources', label: 'Lo que ya existe', short: 'Información', question: '¿Dónde está la información que necesitamos?', reason: 'Saber qué fuente es confiable evita construir sobre supuestos.', hint: 'Documentos, sistemas, mensajes o alguien que conoce el proceso. Indica quién los mantiene.', starters: ['En hojas de cálculo', 'En nuestro sistema interno', 'En la experiencia del equipo'] },
  { id: 'boundaries', label: 'El criterio humano', short: 'Límites', question: '¿Qué decisión debe seguir en manos de una persona?', reason: 'Definir aprobaciones permite explorar la ayuda del agente con límites claros.', hint: 'Piensa en dinero, datos privados, mensajes a clientes o decisiones difíciles de revertir.', starters: ['Enviar al cliente requiere aprobación', 'Nunca modificar los datos originales', 'Necesitamos definirlo con el equipo'] },
  { id: 'exceptions', label: 'Cuando algo se complica', short: 'Excepciones', question: '¿Qué caso difícil podría cambiar este plan?', reason: 'Las excepciones nos dicen cuándo pedir ayuda y detener una automatización.', hint: 'Recuerda un error, información incompleta o una situación que no encaja en el proceso habitual.', starters: ['Cuando faltan datos', 'Cuando hay una urgencia', 'Cuando dos fuentes se contradicen'] },
  { id: 'experiment', label: 'La primera prueba', short: 'Prueba', question: '¿Cuál sería una primera prueba pequeña y útil?', reason: 'Una prueba con responsable y criterio de éxito convierte el mapa en una acción.', hint: 'Elige un caso, una persona responsable y una señal para decidir si continuar.', starters: ['Probar con cinco casos reales', 'Revisarlo con quien opera el proceso', 'Primero validar la información'] }
] as const;
export type TopicId = typeof topics[number]['id'];
export type Claim = { id: string; topic: TopicId; text: string; original: string; reviewed: boolean; uncertain: boolean; sourceId: string; createdAt: string };
export type Evidence = { id: string; name: string; type: string; size: number; text?: string; createdAt: string; status: 'read' | 'attached'; topic: TopicId };
export type Session = { id: string; title: string; createdAt: string; updatedAt: string; claims: Claim[]; skipped: TopicId[]; evidence: Evidence[]; draft: string; current: TopicId; view: 'interview' | 'brief'; pending?: Claim; route?: string; demo?: boolean };
export const uid = () => crypto.randomUUID();
export function createSession(): Session { const now = new Date().toISOString(); return { id: uid(), title: 'Mi próximo proyecto', createdAt: now, updatedAt: now, claims: [], skipped: [], evidence: [], draft: '', current: 'story', view: 'interview' }; }
export function nextTopic(s: Session): TopicId | undefined {
  const available = topics.filter(t => !s.claims.some(c => c.topic === t.id) && !s.skipped.includes(t.id));
  const text = s.claims.map(c => c.text).join(' ').toLowerCase();
  const priority: TopicId[] = /privad|confidencial|pago|dinero|médic|riesgo/.test(text) ? ['boundaries', 'people'] : /objetivo|reducir|30 días|meta/.test(text) ? ['people', 'process'] : /excel|sistema|primero|después/.test(text) ? ['outcome', 'people'] : [];
  return priority.find(id => available.some(t => t.id === id)) ?? available[0]?.id;
}
export function prepareClaim(s: Session, text: string): Claim { return { id: uid(), topic: s.current, text: text.trim(), original: text.trim(), reviewed: false, uncertain: /no sé|no sabemos|supongo|quizá|creo|aproximad|estim/.test(text.toLowerCase()), sourceId: uid(), createdAt: new Date().toISOString() }; }
export function confirmClaim(s: Session, text: string, uncertain = false) {
  if (!s.pending) return;
  s.pending.text = text.trim(); s.pending.reviewed = true; s.pending.uncertain = uncertain || s.pending.uncertain;
  // Keep earlier versions: a correction must not erase its original source.
  s.claims.push(s.pending); s.skipped = s.skipped.filter(id => id !== s.pending!.topic); s.pending = undefined; s.draft = '';
  const next = nextTopic(s); if (next) s.current = next; else s.view = 'brief';
}
export function latest(s: Session, id: TopicId) { return s.claims.filter(c => c.topic === id).at(-1); }
export function gaps(s: Session) { return topics.filter(t => !latest(s, t.id) || latest(s, t.id)?.uncertain); }
export function tensions(s: Session): string[] {
  const all = s.claims.map(c => c.text).join(' ').toLowerCase(); const result: string[] = [];
  if (/automátic|sin intervención|sin aprobación/.test(all) && /requiere aprobación|debe aprobar|revisión humana/.test(all)) result.push('Revisar alcance: se menciona automatización y también aprobación humana. Aclara qué acciones corresponden a cada una.');
  if (s.claims.some(c => c.uncertain)) result.push('Hay estimaciones o respuestas pendientes de validación. No deben tratarse como hechos comprobados.');
  return result;
}
export function packageSession(s: Session) {
  const pending = gaps(s); return { schemaVersion: 1, project: { id: s.id, title: s.title, status: pending.length ? 'needs_validation' : 'usable', updatedAt: s.updatedAt },
    brief: topics.map(t => ({ topic: t.id, label: t.short, statement: latest(s, t.id)?.text ?? null, claimId: latest(s, t.id)?.id ?? null })),
    claims: s.claims.map(c => ({ ...c, validation: 'reported', kind: c.uncertain ? 'estimate' : 'statement', interpretationReviewed: c.reviewed })),
    sources: s.claims.map(c => ({ id: c.sourceId, text: c.original, createdAt: c.createdAt })), evidence: s.evidence,
    contradictions: tensions(s), openQuestions: pending.map(t => t.question),
    agentDraft: { purpose: latest(s, 'outcome')?.text ?? latest(s, 'story')?.text ?? 'Por definir', capabilities: ['Organizar el contexto aportado', 'Preparar preguntas para validar pendientes'], boundaries: latest(s, 'boundaries')?.text ?? 'Por definir antes de ejecutar acciones', status: 'proposal_only' },
    handoff: { doNotAssume: ['Una revisión del operador no equivale a corroboración independiente.', 'Los adjuntos no demuestran por sí mismos una afirmación.', 'Este borrador no autoriza acciones externas.'], usableNow: s.claims.filter(c => !c.uncertain).map(c => c.id), validationPlan: pending.map(t => ({ question: t.question, owner: 'Por asignar' })), nextBestAction: pending[0]?.question ?? 'Acordar responsable y validar la prueba con el equipo.', destination: s.route ?? 'validation' } };
}
export function demoSession(index: number) {
  const s = createSession(); s.demo = true;
  const demos = [
    ['Una idea por explorar', 'Quiero que el equipo encuentre respuestas más fácilmente, pero no sé dónde empezar.'],
    ['Propuestas sin retrabajo', 'Primero recibimos un pedido por correo, después buscamos precios en Excel y armamos la propuesta. Ayer usamos una versión antigua y hubo que rehacerla.'],
    ['Una meta compartida', 'El objetivo es reducir el tiempo de respuesta de cinco días a dos en 30 días. Necesito conocer la perspectiva de quienes hacen el trabajo.']
  ]; s.title = demos[index][0]; s.pending = prepareClaim(s, demos[index][1]); confirmClaim(s, s.pending.text); return s;
}
