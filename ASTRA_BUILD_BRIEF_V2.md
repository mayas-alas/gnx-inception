# Astra Build Brief V2 — GNX Project Inception

## Resultado que debe producir el PoC

Construye una experiencia de **inception conversacional asistida por IA** que ayude a una persona de negocio a vaciar, ordenar y validar el conocimiento necesario para iniciar un proyecto y diseñar un agente de trabajo.

La experiencia no debe prometer un “360 completo” a partir de una sola conversación. Debe producir:

1. una visión amplia y estructurada de lo que el operador sabe;
2. evidencia y trazabilidad para cada conclusión importante;
3. contradicciones, supuestos y huecos claramente visibles;
4. un plan concreto para conseguir lo que falta;
5. un paquete de contexto que otro agente pueda procesar sin reinterpretar respuestas crudas.

El producto se considera exitoso cuando convierte conocimiento tácito y desordenado en **contexto utilizable, verificable y accionable**.

## Principio central: el 360 se obtiene por triangulación

No confundas muchas preguntas con conocimiento completo. Una respuesta extensa puede seguir siendo una opinión sin evidencia.

El sistema debe separar y combinar cinco tipos de señal:

- **Relato:** lo que la persona dice que ocurre.
- **Ejemplo concreto:** una ocasión real y reciente en la que ocurrió.
- **Evidencia:** documento, dato, audio, captura, enlace, artefacto o registro que lo respalda.
- **Perspectiva:** quién lo afirma y qué papel ocupa en el proceso.
- **Validación:** quién más debe confirmar, contradecir o decidir.

Una sesión con un solo operador ofrece una visión 360 de **su conocimiento**, no necesariamente del proyecto. Para declarar una visión 360 del proyecto deben estar representadas o señaladas las perspectivas de quien:

- vive el problema;
- ejecuta el proceso;
- toma o aprueba decisiones;
- controla datos, riesgo o cumplimiento;
- recibe el impacto del resultado.

Si alguna perspectiva no está presente, conviértela en una pregunta abierta o siguiente acción. Nunca rellenes el hueco con una inferencia silenciosa.

## Promesa al operador

> Cuéntame el proyecto como lo conoces. Voy a ordenar lo que sabes, profundizar solo donde haga falta y mostrarte qué está claro, qué estamos suponiendo y qué conviene validar antes de construir.

## Contrato de experiencia

Al comenzar, comunica en pocas líneas:

- para qué se utilizará la información;
- que la sesión puede pausarse y retomarse;
- que el operador puede hablar, escribir o aportar materiales;
- que no necesita responder todo ni usar lenguaje técnico;
- que las inferencias siempre se mostrarán para su corrección;
- que no debe compartir contraseñas, secretos ni datos personales innecesarios;
- si se graba o transcribe audio, qué se conservará y cómo puede eliminarse.

Ofrece dos ritmos sin convertirlos en formularios distintos:

- **Primera brújula:** 8–12 minutos para obtener dirección y riesgos principales.
- **Mapa profundo:** continuar hasta obtener evidencia, excepciones, límites y preparación operativa.

El operador puede cerrar la primera brújula y volver más tarde. El producto debe indicar el valor de profundizar, no impedirle avanzar.

## Arquitectura de la conversación

### Acto 1 — Abrir con una historia, no con una solución

Pregunta inicial:

> Cuéntame la última vez que este problema ocurrió de verdad. ¿Qué lo detonó, quién intervino y qué pasó al final?

Esta pregunta debe permitir texto, dictado, audio o carga de material. No empieces preguntando qué agente quiere construir ni qué funcionalidades necesita.

De la respuesta extrae candidatos a:

- detonante;
- actores;
- acciones y decisiones;
- herramientas o documentos usados;
- fricción;
- consecuencia;
- resultado deseado;
- términos de dominio que requieran definición.

Muestra inmediatamente una síntesis breve:

> Entendí que [actor] intenta [resultado] cuando [detonante], pero hoy [fricción], lo que provoca [impacto].

Permite confirmar, corregir o marcar “todavía no estoy seguro”.

### Acto 2 — Profundizar de forma adaptativa

No uses una secuencia fija. Después de cada aportación:

1. extrae afirmaciones atómicas;
2. clasifica cada afirmación;
3. actualiza la cobertura del proyecto;
4. detecta huecos, ambigüedades y contradicciones;
5. calcula cuál pregunta desbloquea la decisión más importante;
6. formula una sola pregunta principal;
7. explica en una frase por qué vale la pena responderla.

Selecciona la siguiente pregunta con esta prioridad:

```text
prioridad = impacto_en_decisiones
          × incertidumbre
          × criticidad_del_riesgo
          × facilidad_de_respuesta
          − costo_de_fatiga
```

No es necesario mostrar la fórmula al operador. Sí se debe mostrar el propósito de la pregunta.

Ejemplo:

> Para saber dónde puede ayudar el agente sin romper el proceso, necesito entender quién aprueba hoy esta decisión.

### Acto 3 — Retar y triangular

Cuando exista una primera versión coherente, cambia de “descubrir” a “poner a prueba”. Utiliza selectivamente estas técnicas:

#### Incidente concreto

Sustituye generalidades por un caso real:

- “¿Cuándo ocurrió por última vez?”
- “Llévame paso a paso desde que empezó hasta que terminó.”
- “¿Qué hiciste realmente, aunque no fuera el proceso oficial?”

#### Laddering: del hecho al valor

Conecta una necesidad con su consecuencia:

- “¿Por qué importa?”
- “¿Qué cambia para el negocio si eso mejora?”
- “¿Qué decisión sería distinta?”

No repitas “por qué” mecánicamente. Detente al llegar a un resultado de negocio o humano verificable.

#### Contraste

Hace visibles criterios implícitos:

- “Compárame un caso que salió bien con uno que salió mal.”
- “¿Qué fue diferente?”
- “¿Cuál de esos factores sí pueden controlar?”

#### Contraejemplo y excepción

Busca dónde deja de aplicar una regla:

- “¿Cuándo no funcionaría esto?”
- “¿Qué caso representa el 20% difícil?”
- “¿Qué señal obligaría a detenerse o escalar?”

#### Evidencia

Convierte memoria u opinión en material verificable:

- “¿Tienes un ejemplo, reporte, mensaje, plantilla o dato que podamos revisar?”
- “¿Dónde se registra hoy?”
- “¿Quién es dueño de esa fuente y qué tan actual está?”

#### Cuantificación aproximada

No exijas métricas perfectas. Acepta rangos y márcalos como estimados:

- frecuencia y volumen;
- tiempo por caso;
- retrabajo o errores;
- costo o ingreso afectado;
- tiempo de espera;
- nivel de servicio esperado.

#### Perspectiva ausente

- “¿Quién podría describir esto de forma distinta?”
- “¿Quién opera la solución aunque no la compre?”
- “¿Quién puede bloquearla o aprobarla?”
- “¿Quién absorbe el daño si el agente se equivoca?”

#### Enseñar de vuelta

Parafrasea y pide corrección:

> Voy a explicarlo como si yo fuera nuevo en el equipo. Deténme donde simplifique de más.

#### Priorización forzada

- “Si solo pudiéramos mejorar una de estas tres cosas en 30 días, ¿cuál elegirías?”
- “¿Qué sacrificarías primero: velocidad, cobertura o control?”

No uses esta técnica antes de entender el contexto suficiente.

### Acto 4 — Cerrar con decisiones, no con una celebración vacía

Antes de cerrar:

1. reproduce el proceso actual y el resultado deseado;
2. presenta los hallazgos clave;
3. muestra contradicciones y supuestos importantes;
4. pide al operador corregir lo que cambiaría una decisión;
5. separa lo listo para usar de lo que requiere validación;
6. propone la próxima mejor acción con responsable sugerido.

La celebración debe corresponder a valor real:

> Ya tenemos una primera brújula: entendemos el problema, a quién afecta y qué decisión debe mejorar. Faltan validar dos fuentes y un límite operativo antes de diseñar la prueba.

## Cobertura mínima del mapa de proyecto

El motor debe mantener estas dimensiones, aunque nunca las presente como un cuestionario largo:

1. **Intención y oportunidad:** qué cambio se busca y por qué ahora.
2. **Problema observado:** qué ocurre hoy, con ejemplos reales.
3. **Personas y poder:** afectados, operadores, decisores, aprobadores y detractores.
4. **Proceso y decisiones:** detonante, pasos, handoffs, reglas, esperas y salidas.
5. **Impacto y economía:** frecuencia, volumen, tiempo, costo, riesgo o ingreso.
6. **Éxito:** línea base, señal objetivo, plazo y método de medición.
7. **Información:** fuentes, dueños, acceso, calidad, actualidad y sensibilidad.
8. **Sistemas:** herramientas, integraciones y puntos manuales.
9. **Excepciones:** casos raros, fallos, ambigüedades y recuperación.
10. **Límites y gobernanza:** qué puede hacer el agente, qué requiere aprobación y qué nunca debe hacer.
11. **Adopción:** quién lo usará, en qué momento, qué hábito cambia y quién lo operará.
12. **Aprendizaje:** hipótesis crítica, experimento mínimo y siguiente decisión.

## Modelo de conocimiento y confianza

El contrato actual `confirmed | inferred | missing` es demasiado pobre. Separa **naturaleza**, **estado de validación** y **confianza**.

```ts
type ClaimKind =
  | 'fact'
  | 'estimate'
  | 'opinion'
  | 'hypothesis'
  | 'preference'
  | 'decision'
  | 'constraint';

type ValidationStatus =
  | 'reported'
  | 'evidenced'
  | 'corroborated'
  | 'contradicted'
  | 'needs_validation';

type ConfidenceLevel = 'low' | 'medium' | 'high';

type ProjectClaim = {
  id: string;
  topic: string;
  statement: string;
  kind: ClaimKind;
  validation: ValidationStatus;
  confidence: ConfidenceLevel;
  sourceIds: string[];
  stakeholderIds: string[];
  evidenceIds: string[];
  sensitivity?: 'normal' | 'confidential' | 'restricted';
  rationale?: string;
  createdAt: string;
  updatedAt: string;
};
```

Reglas obligatorias:

- Una afirmación del operador comienza como `reported`, no como `confirmed`.
- Solo usa `evidenced` si existe material verificable asociado.
- Solo usa `corroborated` si hay otra fuente o perspectiva independiente.
- Toda inferencia debe incluir una explicación breve y ofrecer corrección.
- Una contradicción nunca se resuelve escogiendo silenciosamente una versión.
- Conserva el origen exacto de cada afirmación: turno, archivo, audio, enlace o elección.
- El resumen final debe poder enlazar cada conclusión con sus fuentes.

## Modelo de salida para el siguiente agente

Entrega dos representaciones sincronizadas:

### 1. Brief humano

- resumen ejecutivo;
- oportunidad y problema;
- actores y perspectivas;
- proceso actual;
- resultado y métricas;
- propuesta inicial de ayuda del agente;
- límites y aprobaciones;
- riesgos y contradicciones;
- evidencia disponible;
- preguntas abiertas;
- próxima mejor acción.

### 2. Paquete estructurado

```ts
type InceptionPackage = {
  project: {
    id: string;
    title: string;
    status: 'exploring' | 'usable' | 'needs_validation' | 'ready_for_experiment';
    updatedAt: string;
  };
  intent: { change: string; whyNow?: string };
  stakeholders: Stakeholder[];
  currentProcess: ProcessStep[];
  desiredOutcomes: Outcome[];
  claims: ProjectClaim[];
  evidence: EvidenceItem[];
  dataSources: DataSource[];
  systems: SystemReference[];
  constraints: Constraint[];
  decisions: DecisionRecord[];
  contradictions: Contradiction[];
  openQuestions: OpenQuestion[];
  agentDraft: {
    purpose: string;
    capabilities: string[];
    boundaries: string[];
    approvalPoints: string[];
    escalationRules: string[];
    nextBestAction: string;
  };
  handoff: {
    usableNow: string[];
    doNotAssume: string[];
    validationPlan: ValidationTask[];
    recommendedNextAgent: 'strategy' | 'builder' | 'research';
  };
};
```

El siguiente agente debe recibir primero `handoff.doNotAssume`, después el brief y finalmente la evidencia. Esto reduce el riesgo de que convierta inferencias en hechos.

## Indicadores de claridad

No muestres un porcentaje único. Presenta cuatro indicadores independientes:

- **Cobertura:** cuántas dimensiones críticas tienen información utilizable.
- **Evidencia:** cuánto de lo importante está respaldado por ejemplos o materiales.
- **Alineación:** cuántas perspectivas críticas están representadas o pendientes.
- **Preparación:** si existe suficiente claridad para tomar la siguiente decisión.

Usa estados comprensibles:

- Explorando
- Ya tiene forma
- Necesita validación
- Listo para experimentar

Cada indicador debe explicar qué falta. Ejemplo:

> Evidencia: ya tenemos un caso concreto; falta confirmar volumen y revisar la plantilla que usa Operaciones.

## Definition of Ready

No cierres por número de preguntas. Una sesión puede marcarse `usable` cuando:

- existe un problema expresado mediante al menos un caso real;
- el actor afectado, el operador y el decisor están identificados o marcados como ausentes;
- el proceso actual contiene detonante, pasos principales, decisión y resultado;
- hay una señal de éxito con plazo y forma de medición, aunque la línea base sea estimada;
- se identificó al menos una fuente de información y su responsable;
- están explícitos los límites, aprobaciones y daño potencial más importante;
- se distinguieron hechos, estimaciones, hipótesis y decisiones;
- las contradicciones relevantes están visibles;
- el operador confirmó la síntesis final;
- existe una siguiente acción específica.

Solo marca `ready_for_experiment` cuando además:

- la hipótesis crítica está formulada;
- el experimento mínimo y su criterio de éxito están definidos;
- existe un responsable;
- no quedan sin resolver riesgos bloqueantes de privacidad, seguridad o autoridad.

## Comportamiento del entrevistador de IA

Implementa estas instrucciones como política del adaptador de IA:

```text
Eres un facilitador de inception, no un vendedor ni un arquitecto prematuro.

Tu objetivo es convertir conocimiento tácito en afirmaciones trazables y
accionables. Primero comprende hechos y decisiones; después propone.

En cada turno:
1. Reconoce brevemente lo útil de la respuesta.
2. Extrae afirmaciones atómicas sin cambiar su significado.
3. Distingue hechos, estimaciones, opiniones, hipótesis, decisiones y límites.
4. Detecta la ambigüedad o el hueco con mayor impacto.
5. Formula una sola pregunta principal, abierta y neutral.
6. Si ayuda, ofrece hasta tres chips como ejemplos, nunca como únicas opciones.
7. Explica en una frase por qué preguntas eso.
8. Actualiza una micro-síntesis editable.

Prioriza historias recientes, ejemplos concretos, evidencia, excepciones,
perspectivas ausentes y criterios de decisión.

No inventes información. No trates una opinión como hecho. No repitas algo ya
respondido. No hagas preguntas dobles. No uses jerga técnica con el operador.
No propongas funcionalidades hasta comprender problema, proceso, usuario,
resultado y límites. Si aparece información sensible, advierte y ofrece omitirla.

Después de dos preguntas profundas sobre el mismo tema, cambia de dimensión o
pregunta si el operador desea seguir profundizando. Protege el ritmo y la energía.
```

La respuesta del adaptador debe ser estructurada y validada mediante esquema. Como mínimo:

```ts
type InterviewTurnResult = {
  acknowledgement: string;
  extractedClaims: ProjectClaim[];
  summaryPatch: Record<string, unknown>;
  detectedGaps: string[];
  contradictions: string[];
  nextQuestion: {
    text: string;
    reason: string;
    targetDimension: string;
    suggestedChoices?: string[];
  };
};
```

## Reglas de interacción

- Una pregunta principal por pantalla.
- La micro-síntesis aparece después de responder, no antes de continuar.
- Permite editar la frase exacta o corregir con lenguaje natural.
- Los chips aceleran; nunca limitan la respuesta.
- “No lo sé” es una respuesta válida y genera una tarea de validación.
- “Saltar” debe explicar el efecto: “Podrás avanzar; quedará como pendiente”.
- Después de tres o cuatro aportaciones, devuelve un insight útil: patrón, tensión, contradicción o decisión desbloqueada.
- Permite abrir el mapa completo sin perder el punto actual.
- El operador puede volver a cualquier conclusión desde su fuente.
- El autosave conserva texto, transcripción, clasificaciones y confirmaciones.
- Si falla el servicio de IA, conserva el aporte y usa una ruta local de preguntas esenciales.

## Audio, archivos y enlaces

En el PoC actual, seleccionar un audio no basta. Para considerarlo funcional:

- grabar audio desde el navegador o cargarlo;
- mostrar duración, estado de carga y posibilidad de eliminarlo;
- producir una transcripción mock o real;
- permitir corregir la transcripción;
- extraer afirmaciones desde la transcripción;
- mantener vínculo entre afirmación, fragmento y archivo original;
- solicitar consentimiento antes de conservar audio;
- no almacenar el binario en `localStorage`.

Para archivos y enlaces:

- mostrar nombre, tipo, estado y vista previa cuando sea viable;
- generar un resumen claramente marcado como inferido;
- permitir confirmar qué fragmentos son relevantes;
- conservar procedencia y fecha;
- no presentar como leído un recurso que el sistema no pudo procesar.

## Alcance exacto del PoC

Construye una ruta vertical completa con mocks:

1. inicio y contrato de sesión;
2. respuesta inicial mediante texto o audio;
3. extracción mock de afirmaciones;
4. micro-síntesis editable;
5. selección adaptativa de preguntas;
6. cobertura de al menos seis dimensiones mediante una conversación variable;
7. detección de una contradicción o supuesto;
8. asociación de una evidencia mock;
9. vista de claridad con cobertura, evidencia, alineación y preparación;
10. cierre con brief humano y paquete estructurado;
11. autosave y recuperación;
12. continuación hacia Estrategia, Constructor o Validación.

No construyas en esta fase:

- autenticación real;
- colaboración multiusuario en tiempo real;
- almacenamiento productivo de archivos;
- transcripción productiva;
- integraciones reales;
- generación autónoma de un agente desplegable;
- un dashboard administrativo.

Diseña interfaces claras para sustituir cada mock sin reescribir UI o dominio.

## Pruebas de aceptación

Usa al menos tres guiones mock diferentes para demostrar que la conversación se adapta:

1. operador con una idea vaga y sin datos;
2. experto de dominio con proceso y evidencia, pero sin métrica de éxito;
3. sponsor con objetivo claro, pero sin perspectiva del usuario u operador.

El PoC pasa si:

- no presenta la misma secuencia a los tres casos;
- convierte una generalidad en un incidente concreto;
- diferencia una afirmación reportada de una respaldada por evidencia;
- detecta una perspectiva crítica ausente;
- hace visible al menos un supuesto o contradicción;
- permite corregir una inferencia sin reiniciar;
- mantiene trazabilidad desde el brief hasta la fuente;
- recupera toda la sesión después de recargar;
- produce una siguiente acción distinta para cada caso;
- funciona con teclado y móvil;
- no exige descargar JSON para continuar.

## Correcciones obligatorias sobre el PoC actual

- Sustituye las cinco preguntas fijas por un orquestador de preguntas basado en cobertura y riesgo.
- Conserva el lenguaje visual, pero cambia el porcentaje por indicadores de claridad.
- Reemplaza “cinco señales bastan” por una promesa honesta de primera brújula.
- Convierte el panel de ADN en un mapa vivo de conclusiones, evidencia y huecos.
- Implementa micro-síntesis editable después de cada aporte.
- Convierte audio de simple metadata a una fuente con transcripción y procedencia.
- Elimina “Descargar JSON” como acción principal.
- Sustituye el modal final por una vista de revisión y handoff persistente.
- Corrige la codificación UTF-8 visible en los textos actuales.
- Mantén una ruta de demostración completamente local con datos mock.

## Entrega esperada de Astra

1. Implementación funcional de la ruta vertical.
2. README con un solo comando de ejecución.
3. Explicación breve del orquestador de preguntas y sus reglas.
4. Esquemas TypeScript del dominio y del paquete de handoff.
5. Tres sesiones mock completas y reproducibles.
6. Matriz que muestre qué es real y qué está simulado.
7. Verificación de autosave, recarga, teclado, móvil y estados de error.
8. Lista breve de riesgos para pasar de PoC a piloto.

Prioriza la profundidad y trazabilidad de una sesión completa sobre el número de pantallas. La interfaz debe hacer que aportar información se sienta fácil; el modelo interno debe ser riguroso respecto a qué sabe, cómo lo sabe y qué falta validar.
