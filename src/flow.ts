import type { Session, Claim, TopicId } from './domain.js';

export type ContextKind = 'project' | 'client' | 'prospect' | 'mixed';
export const kindLabels: Record<ContextKind, string> = { project:'Proyecto', client:'Cliente', prospect:'Prospecto', mixed:'Contexto mixto' };
export type Facet = { id:string; topic:TopicId; label:string; question:string; reason:string; match?:RegExp; depth:number; kinds?:ContextKind[] };
export type FlowQuestion = { id:string; topic:TopicId; question:string; reason:string; hint:string; starters:readonly string[] };

// Stable facet IDs are the common contract of local selection, AI and Markdown.
export const facets: Facet[] = [
  {id:'story.case',topic:'story',label:'Caso concreto y situación',depth:0,question:'¿Qué ocurrió en el caso más reciente que representa esta situación?',reason:'Un ejemplo real permite distinguir el problema observado de una idea de solución.',match:/ayer|semana pasada|últim[oa] (caso|vez|reunión)|recientemente/i},
  {id:'people.roles',topic:'people',label:'Operador, afectado y decisor',depth:0,question:'¿Quién vive esta situación y quién decide qué hacer al respecto?',reason:'El estratega necesita entender las perspectivas y la autoridad de decisión.',match:/(decide|aprueba|responsable|director|dueñ[oa]).{3,100}/i},
  {id:'outcome.measure',topic:'outcome',label:'Resultado, línea base y plazo',depth:0,question:'¿Qué resultado observable quieres conseguir, desde qué situación actual y en qué plazo?',reason:'Una medida y un horizonte permiten valorar la oportunidad y comprobar la prueba.',match:/(reducir|pasar|aumentar|bajar).{0,100}\d.{0,80}(días|mes|horas|minutos|%)/i},
  {id:'process.journey',topic:'process',label:'Proceso actual y fricción',depth:0,question:'¿Cómo se desarrolla hoy el proceso desde el primer contacto hasta el resultado?',reason:'Los pasos reales muestran dónde intervenir y qué dependencias conservar.',match:/primero.{5,150}(después|luego|finalmente)/i},
  {id:'sources.owner',topic:'sources',label:'Fuentes, dueño y acceso',depth:0,question:'¿Qué fuente permite comprobar lo que contaste y quién puede darnos acceso?',reason:'El constructor necesita saber dónde vive la información y quién la mantiene.',match:/(excel|crm|documento|reporte|sistema).{0,100}(mantiene|responsable|acceso|actualiza)/i},
  {id:'boundaries.authority',topic:'boundaries',label:'Aprobaciones y datos sensibles',depth:0,question:'¿Qué acciones requieren aprobación y qué información no debe compartirse?',reason:'Los límites explícitos orientan una solución que respete la autoridad del equipo.',match:/(requiere aprobación|no debe|nunca|prohibido).{5,150}/i},
  {id:'relationship.stage',topic:'relationship',label:'Relación y etapa',depth:0,question:'¿En qué etapa está la relación y qué compromiso existe hoy?',reason:'La situación comercial cambia tanto la estrategia como la próxima acción.',kinds:['client','prospect','mixed'],match:/contrato|renovación|negociación|descubrimiento|propuesta enviada|cliente actual/i},
  {id:'economics.resources',topic:'economics',label:'Valor, presupuesto y recursos',depth:0,question:'¿Qué valor está en juego y qué presupuesto o recursos existen para actuar?',reason:'El estratega debe poder contrastar impacto, viabilidad y prioridad.',match:/(presupuesto|ingreso|costo|valor|inversión).{0,80}(\d|desconoc|definir)/i},
  {id:'exceptions.failure',topic:'exceptions',label:'Excepciones, daño y escalamiento',depth:1,question:'¿Qué caso difícil podría hacer fallar el plan y quién debe intervenir?',reason:'Las excepciones definen pruebas y reglas de escalamiento.',match:/(falla|error|excepción|urgencia).{0,100}(escala|avisa|responsable|detiene)/i},
  {id:'systems.integration',topic:'systems',label:'Sistemas, entradas y salidas',depth:1,question:'¿Qué sistemas deben participar y qué información entra o sale de cada uno?',reason:'El constructor necesita límites de integración y entregables concretos.',match:/(crm|erp|api|sistema).{0,100}(recibe|envía|exporta|importa|entrada|salida)/i},
  {id:'adoption.owner',topic:'adoption',label:'Adopción y operación',depth:1,question:'¿Quién usará y mantendrá la solución, y qué cambiará en su trabajo diario?',reason:'Una solución útil requiere dueño operativo y un lugar en el trabajo real.',match:/(usará|mantendrá|capacita|adopción|operará).{3,100}/i},
  {id:'experiment.test',topic:'experiment',label:'Prueba, responsable y decisión',depth:1,question:'¿Qué prueba pequeña harían, quién la lidera y qué resultado permitiría continuar?',reason:'Esto entrega al estratega y al constructor una siguiente decisión comprobable.',match:/(piloto|prueba|experimento).{0,100}(responsable|lidera|éxito|medir)/i},
  {id:'people.absent',topic:'people',label:'Perspectiva ausente',depth:1,question:'¿Quién podría describir esto de otra forma y qué necesitamos validar con esa persona?',reason:'Una sola perspectiva no confirma una visión completa del caso.'},
  {id:'sources.evidence',topic:'sources',label:'Evidencia concreta y vigencia',depth:1,question:'¿Qué ejemplo, registro o documento vigente respalda la parte más importante del caso?',reason:'La procedencia evita convertir una suposición en un hecho.'},
  {id:'relationship.decision',topic:'relationship',label:'Compra, alternativas y objeciones',depth:1,question:'¿Cómo se tomará la siguiente decisión comercial y qué podría impedirla?',reason:'Necesitamos comprender quién decide, las alternativas y las objeciones.',kinds:['client','prospect','mixed']},
  {id:'boundaries.quality',topic:'boundaries',label:'Calidad y aceptación',depth:1,question:'¿Qué condiciones debe cumplir el resultado para que el equipo lo acepte?',reason:'El constructor necesita criterios de aceptación observables, incluidos errores tolerables.'}
];

export function detectKind(text:string): ContextKind {
  const prospect = /prospect[oa]|lead\b|cliente potencial|oportunidad comercial|aún no compra/i.test(text);
  const client = /cliente actual|cliente existente|nuestro cliente|renovación|renovar|cuenta activa|contrato vigente|^(tengo un cliente|mi cliente|el cliente|quiero (entender|conocer|analizar) (a )?(un|el|mi) cliente)/i.test(text);
  if (prospect && client) return 'mixed';
  if (prospect) return 'prospect';
  if (client) return 'client';
  return 'project';
}
export function contextKind(s:Session): ContextKind { return s.kind ?? detectKind(s.claims.find(c => c.topic === 'story')?.text ?? s.draft); }
export function activeFacets(s:Session): Facet[] { const kind = contextKind(s); return facets.filter(f => !f.kinds || f.kinds.includes(kind)); }
export type Coverage = { facet:Facet; status:'missing'|'mentioned'|'reported'|'unknown'|'deferred'; sources:Claim[] };
export function coverage(s:Session): Coverage[] {
  return activeFacets(s).map(f => {
    const direct = s.claims.filter(c => c.questionId === f.id || (!c.questionId && c.topic === f.topic && f.depth === 0));
    if (direct.length) return {facet:f,status:direct.at(-1)!.uncertain ? 'unknown' : 'reported',sources:direct};
    if (s.deferred?.includes(f.id)) return {facet:f,status:'deferred',sources:[]};
    const mentions = f.match ? s.claims.filter(c => f.match!.test(c.text)) : [];
    return {facet:f,status:mentions.length ? 'mentioned' : 'missing',sources:mentions};
  });
}
export function candidateFacets(s:Session): Coverage[] {
  const all = s.claims.map(c => c.text).join(' ');
  return coverage(s).filter(c => ['missing','mentioned'].includes(c.status)).sort((a,b) => {
    const weight = (c:Coverage) => c.facet.depth * 100 + (c.status === 'mentioned' ? 20 : 0) - (/privad|confidencial|dinero|riesgo/i.test(all) && c.facet.topic === 'boundaries' ? 150 : 0) - (contextKind(s) !== 'project' && c.facet.topic === 'relationship' ? 70 : 0);
    return weight(a)-weight(b);
  });
}
export function localQuestion(s:Session, chosenId?:string): FlowQuestion | undefined {
  if (!s.claims.length && !s.deferred?.includes('story.case') && !chosenId) return {id:'story.case',topic:'story',question:'¿Qué quieres que entendamos primero?',reason:'A partir de lo que cuentes construiremos la ruta de preguntas.',hint:'Puede ser un proyecto, un cliente, un prospecto o una situación por explorar. Cuéntanos qué pasa y qué te gustaría conseguir.',starters:['Tengo un proyecto en mente','Quiero entender a un cliente','Estoy explorando un prospecto']};
  const selected = chosenId ? coverage(s).find(c => c.facet.id === chosenId) : candidateFacets(s)[0];
  if (!selected) return;
  const f = selected.facet; const kind = contextKind(s);
  const specific: Partial<Record<ContextKind, Record<string,string>>> = {
    client:{'story.case':'¿Qué ocurrió en la última interacción importante con este cliente?','process.journey':'¿Cómo vive este cliente el servicio actual, desde la solicitud hasta la entrega?','outcome.measure':'¿Qué cambio demostraría valor para este cliente y en qué plazo?','relationship.stage':'¿Cómo está hoy la relación con este cliente y qué compromiso o renovación se aproxima?'},
    prospect:{'story.case':'¿Qué expresó este prospecto en el último contacto?','people.roles':'¿Quién es tu contacto en este prospecto y quién decide la compra?','process.journey':'¿Cómo resuelve hoy el prospecto esta necesidad y qué le cuesta hacerlo?','outcome.measure':'¿Qué resultado justificaría que este prospecto avance y cómo lo comprobaría?','experiment.test':'¿Qué siguiente paso permitiría al prospecto comprobar valor antes de comprometerse?','relationship.stage':'¿En qué etapa está este prospecto y qué acordaron en el último contacto?'}
  };
  const question = specific[kind]?.[f.id] ?? f.question;
  return {id:f.id,topic:f.topic,question,reason:f.reason,hint:selected.status === 'mentioned' ? `Ya mencionaste: «${selected.sources[0].text.slice(0,150)}${selected.sources[0].text.length > 150 ? '…' : ''}». Completa solo el detalle que falta.` : `Lo exploramos en el contexto de ${kindLabels[kind].toLowerCase()}. Puedes indicar lo que sabes y lo que falta consultar.`,starters:[]};
}
export function advance(s:Session) {
  const candidates = candidateFacets(s);
  const ai = s.aiTurn;
  const validAi = ai?.nextQuestionId && candidates.some(c => c.facet.id === ai.nextQuestionId && c.facet.topic === ai.nextTopic);
  s.flowQuestion = validAi ? {...localQuestion(s,ai.nextQuestionId)!,question:ai.question,reason:ai.reason} : localQuestion(s);
  if (s.flowQuestion) { s.current = s.flowQuestion.topic; s.view = 'interview'; } else s.view = 'brief';
}
export function currentQuestion(s:Session): FlowQuestion {
  if (!s.flowQuestion && !s.claims.length && s.current === 'story') return localQuestion(s)!;
  return s.flowQuestion ?? localQuestion(s, activeFacets(s).find(f => f.topic === s.current)?.id) ?? localQuestion(s) ?? {id:'story.case',topic:'story',question:'¿Qué quieres añadir a este contexto?',reason:'Puedes seguir refinando el insumo.',hint:'Completa lo que todavía falta.',starters:[]};
}
export function deferCurrent(s:Session) {
  const id = currentQuestion(s).id;
  s.deferred = [...new Set([...(s.deferred ?? []),id])]; s.flowQuestion = undefined; s.aiTurn = undefined; advance(s);
}
