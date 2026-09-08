# Astra Medium Build Brief — GNX Project Inception Agent

## Mandato

Construye sobre el PoC actual una experiencia de **project inception guiada por IA** para un operador de negocio no técnico. El operador debe sentir que está conversando con un sistema inteligente que entiende su proyecto, hace las preguntas correctas y va dando forma a un agente de trabajo.

El producto no debe parecer un formulario, un CRM ni una herramienta para desarrolladores. Debe sentirse como una **sesión de incubación**: clara, elegante, rápida y con pequeños momentos de descubrimiento.

El resultado de la sesión se guarda automáticamente y queda disponible para los dos flujos del proyecto:

1. **Estrategia:** problema, oportunidad, resultado esperado, usuarios, prioridades, métricas y decisiones.
2. **Constructor:** capacidades necesarias, fuentes de información, integraciones, restricciones, riesgos y siguientes acciones técnicas.

## Usuario y promesa

El usuario es un operador, líder de negocio o experto de dominio. Puede conocer muy bien el problema, pero no debe saber de arquitectura, agentes, APIs o JSON.

Promesa de producto:

> “Cuéntame lo que sabes de tu proyecto. Yo lo ordeno, detecto lo que falta y preparo un agente para ayudarte a moverlo.”

El sistema debe hacer todo lo posible automáticamente: guardar avances, estructurar respuestas, proponer síntesis, detectar huecos, sugerir la siguiente pregunta y construir el brief del proyecto. No pedir al operador que descargue archivos, copie JSON, configure campos técnicos o haga tareas de mantenimiento.

## Experiencia requerida

### Entrada

Mantén una interfaz de una sola sesión, responsive y con sensación de progreso. Ofrece varias formas de aportar información:

- Respuesta corta o larga en lenguaje natural.
- Selección rápida de opciones/chips cuando ayude a decidir.
- Audio grabado desde el navegador y carga de nota de voz.
- Pegado de texto, enlaces y notas existentes.
- Opcionalmente, carga de archivos de referencia con nombre y vista previa.

La entrada debe ser tolerante: permitir respuestas incompletas, pausas y volver atrás sin perder datos.

### Flujo inteligente

No mostrar siempre una lista rígida de preguntas. Empezar con una pregunta de alto valor y adaptar el siguiente paso según la respuesta. Como mínimo, cubrir:

1. **Intención:** qué quiere cambiar el proyecto.
2. **Problema y contexto:** qué ocurre hoy y por qué importa.
3. **Personas:** quién sufre el problema, quién decide y quién operará la solución.
4. **Resultado:** cómo se sabrá que funcionó en 30/60/90 días.
5. **Proceso actual:** cómo se resuelve hoy, incluyendo fricciones y trabajo manual.
6. **Información y sistemas:** dónde viven los datos y qué fuentes son confiables.
7. **Restricciones:** seguridad, privacidad, presupuesto, tiempo, regulación o dependencias.
8. **Modo de ayuda:** qué debería hacer el agente y qué nunca debe hacer sin aprobación.
9. **Evidencia:** audios, documentos, ejemplos, enlaces o historias concretas.

Después de cada respuesta, mostrar una micro-síntesis editable: “Esto es lo que entendí”. El operador confirma, corrige o amplía con un toque.

### Gamificación con propósito

Usar visuales de progreso y “minting” sin convertir la experiencia en un juego infantil:

- Un mapa vivo del proyecto o “ADN del agente”.
- Señales que se iluminan al completar intención, contexto, personas, prueba y límites.
- Progreso expresado como claridad ganada, no como porcentaje vacío.
- Lenguaje visual cálido: incubación, señales, criterio, pulso, mapa, listo para probar.
- Celebración breve al alcanzar un hito, sin bloquear el flujo.
- Un indicador de confianza que distinga “confirmado”, “inferido” y “falta validar”.

La interfaz debe responder a la pregunta “¿por qué me pregunta esto?” con una explicación breve y contextual, no con documentación técnica.

### Cierre automático

Al reunir suficiente información, el sistema debe presentar una vista final de “agente listo para trabajar” con:

- Nombre sugerido y propósito.
- Resumen ejecutivo del proyecto en lenguaje de negocio.
- Usuarios, proceso y resultado esperado.
- Capacidades iniciales del agente.
- Límites, riesgos y preguntas abiertas.
- Nivel de confianza por sección.
- Próxima mejor acción sugerida.

Guardar este resultado automáticamente en el proyecto. La interfaz debe ofrecer “seguir refinando” o “empezar el siguiente paso”; no depender de una descarga manual.

## Arquitectura lean

Usa TypeScript cuando sea viable; si el entorno actual no lo soporta, conserva JavaScript modular con tipos/documentación clara. Mantén HTML semántico, CSS moderno y dependencias mínimas. No introduzcas un framework pesado para resolver el PoC.

### Capas

- `ui/`: componentes pequeños y accesibles para preguntas, chips, audio, progreso, síntesis y resumen.
- `state/`: estado de sesión, respuestas, historial y persistencia automática.
- `domain/`: modelo de inception, reglas de completitud, confianza y selección de próxima pregunta.
- `services/`: adaptador de IA, almacenamiento y archivos/audio. Deben poder funcionar con mocks durante el PoC.
- `styles/`: tokens visuales, layout responsive, estados y motion.

### Contrato de dominio mínimo

Modelar una sesión con:

```ts
type Confidence = 'confirmed' | 'inferred' | 'missing';

type InceptionSignal = {
  id: string;
  value: string | string[];
  source: 'text' | 'audio' | 'file' | 'link' | 'choice';
  confidence: Confidence;
  updatedAt: string;
};

type ProjectInception = {
  id: string;
  title?: string;
  signals: InceptionSignal[];
  openQuestions: string[];
  agentDraft: {
    purpose?: string;
    capabilities: string[];
    boundaries: string[];
    nextBestAction?: string;
  };
  status: 'in_progress' | 'ready' | 'needs_review';
};
```

### Persistencia y automatización

- Autosave después de cada respuesta o evidencia recibida.
- Recuperación de sesión al volver al navegador.
- Debounce para evitar llamadas repetidas al servicio de IA.
- Cola local de eventos si el servicio no está disponible.
- Modo demo con respuestas mock para que el flujo sea demostrable sin backend.
- Adaptador preparado para conectar después un endpoint real sin reescribir la UI.
- No exponer secretos o claves de IA en el cliente.

## Dirección visual

Conservar la identidad del PoC actual: fondo cálido, tinta oscura, lima ácida y violeta como acento. Mejorar la jerarquía, el ritmo y la sensación de producto premium.

Principios:

- Una decisión o pregunta principal por pantalla.
- Mucho espacio, tipografía expresiva y copy humano.
- El estado del proyecto siempre visible sin competir con la pregunta.
- Animaciones cortas y funcionales: aparición, avance, pulso, confirmación.
- Excelente experiencia móvil y teclado.
- Accesibilidad WCAG AA: foco visible, labels, contraste, estados no dependientes solo del color y soporte para lectores de pantalla.
- Evitar dashboards saturados, tablas técnicas, jerga de IA y modales innecesarios.

## Criterios de aceptación del PoC

El build se considera válido cuando:

- Un operador puede completar una sesión sin instrucciones externas.
- Puede responder con texto, selección y audio.
- El sistema adapta o recomienda la siguiente pregunta.
- Todo se guarda automáticamente y se recupera al recargar.
- El usuario ve en todo momento qué se entendió y qué falta.
- Al final existe un brief de proyecto legible y un agente inicial con propósito, capacidades, límites y siguiente acción.
- Estrategia y Constructor pueden leer el mismo modelo de inception sin reinterpretar manualmente las respuestas.
- La experiencia funciona sin backend mediante mocks y tiene un punto claro de integración para IA/persistencia real.
- No existe como acción principal descargar JSON ni completar tareas técnicas.
- `npm`/tooling, si se usa, debe ser mínimo; el proyecto debe poder ejecutarse localmente con un comando sencillo.

## Entrega esperada de Astra

1. Implementación funcional sobre el PoC actual.
2. Estructura de carpetas y módulos explicada brevemente.
3. README de ejecución local y variables necesarias.
4. Datos mock suficientes para demostrar el flujo completo.
5. Lista corta de decisiones técnicas y próximos riesgos.
6. Verificación del flujo principal en desktop y móvil.

Prioriza una experiencia vertical completa y convincente sobre construir muchas pantallas. Si una solución más simple logra la misma sensación y trazabilidad, elige la solución más simple.
