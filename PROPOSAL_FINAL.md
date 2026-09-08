# GNX Inception — MVP entregable

Una sesión cálida y enfocada: una pregunta, espacio para contar, una síntesis editable y un mapa vivo. El operador obtiene valor desde su primera respuesta y puede regresar sin perder el borrador.

## Decisiones finales de UX

- Entrada inmediata con un caso real; si el proyecto aún es una idea, se permite describir la intención.
- Preguntas seleccionadas por cobertura y señales de riesgo, con explicación contextual.
- Confirmación explícita de la interpretación, sin convertirla en evidencia externa.
- Mapa navegable de ocho dimensiones; pendientes visibles y cierre permitido en cualquier momento.
- Tres escenarios de ejemplo cargados como sesiones separadas; nunca reemplazan trabajo real.
- Brief persistente y paquete para el siguiente agente, con fuentes, límites y preguntas pendientes.
- Texto, grabación y archivos locales. Audios se conservan en IndexedDB y se pueden reproducir/eliminar; transcripción manual explícita en esta versión.

## Entrega

TypeScript para dominio/UI, HTML y CSS sin framework, servidor Node en JavaScript. `npm install` y `npm start`. Motor local determinista rotulado en la interfaz: no requiere API ni envía información a servicios externos. La IA generativa y la ejecución del siguiente agente quedan como integración posterior, sin simular que están conectadas.

Se comprobarán compilación, reglas adaptativas, conservación de fuentes, corrección, navegación, recarga y presentación en desktop/móvil. La V2 describe la visión; este documento fija el alcance de la entrega actual.
