# GNX Contexto 360 — MVP

## Ejecutar

Node.js 22 o superior. Primera vez: `npm install`. Después:

```sh
npm start
```

Abrir http://localhost:4173. `PORT` permite cambiar el puerto. El servidor escucha solo en la máquina local.

## Incluido

- Interfaz responsive en español con rutas para proyectos, clientes, prospectos y contextos mixtos. Clasificación sugerida a partir del primer aporte, corregible por el operador.
- Hasta 12 dimensiones y 16 aspectos: situación, roles, métrica, proceso, fuentes, límites, relación, valor, excepciones, sistemas, adopción, prueba, perspectiva ausente, evidencia, decisión comercial y aceptación.
- Motor local con prioridades de riesgo y relación, exploración amplia seguida de profundidad, sin repetir aspectos respondidos o aplazados. Las menciones del primer aporte orientan las preguntas sin equivaler a respuestas verificadas.
- Revisión editable, texto original conservado, pendientes y brief persistente.
- Autosave de borradores, sesiones independientes y tres ejemplos.
- Archivos guardados en IndexedDB; vista previa de TXT, MD y CSV pequeños.
- Grabación local con permiso, reproducción y eliminación. Para incorporar un audio, el operador escribe el fragmento relevante: no hay transcripción automática.
- Markdown completo para Estrategia y Constructor: cobertura, preguntas pendientes, evidencia disponible, fuentes originales y aportes revisados. Guardado automáticamente, vista previa, copia y descarga `.md`. El paquete JSON permanece como opción secundaria.

## Límites de esta entrega

Con `OPENAI_API_KEY` en `.env`, el servidor consulta OpenAI Responses con `gpt-5.6-luna` y razonamiento `high`: síntesis editable y siguiente pregunta contextual. Sin clave, funciona el motor local. La clave nunca llega al cliente. Solo texto y contexto previo se envían a OpenAI, con `store:false`; los adjuntos permanecen locales. Errores conservan el borrador y permiten reintentar. No hay agente ejecutor conectado. Los adjuntos no se consideran evidencia corroborada automáticamente. Persistencia solo en este navegador: no hay cuentas ni sincronización. Borrar los datos del navegador elimina las sesiones y archivos.

Configura `.env` siguiendo `.env.example` y reinicia `npm start`. La clave previamente utilizada fue revocada y retirada del entorno local. Esta entrega corre sin clave. El adaptador generativo recibe tipo de contexto, pregunta actual, cobertura y candidatos pendientes; su respuesta no puede saltarse el control de repetición del dominio. Ante errores puede reintentarse o elegirse «Continuar sin IA».

`node tests/ai-live.mjs` hace una llamada real con datos ficticios y consume tokens: requiere una clave nueva. Las pruebas automáticas no llaman a OpenAI. La versión final del prompt se verificó con transporte simulado; no se afirma una nueva prueba real con la clave revocada.

Responder todo significa cobertura reportada, nunca corroboración externa. «No lo sé» y las estimaciones quedan pendientes en el Markdown. Las sesiones antiguas se conservan y pueden ampliarse con los nuevos aspectos.

## Estructura

`src/domain.ts`: aportes y paquete. `src/flow.ts`: clasificación, cobertura y selección. `src/markdown.ts`: documento trazable. `src/storage.ts`: persistencia. `src/app.ts`: interfaz. `ui.css` y `flow-ui.css`: presentación. `server.mjs`: recursos públicos, `/health` y `/api/interview`. `ai.mjs`: integración OpenAI exclusivamente del lado del servidor.

## Verificación

`npm test`: compilación, dominio, tres rutas y contrato OpenAI simulado. `npm run test:ui`: regresión del MVP, síntesis simulada y recuperación de errores, recorrido completo y descarga/verificación Markdown; requiere Microsoft Edge y servicio iniciado en modo local. Capturas en `test-results/` (no versionadas).

Entrega desarrollada y comprobada en `mayas-alas/PoC`, preparada para integración en `main` por solicitud del usuario.
