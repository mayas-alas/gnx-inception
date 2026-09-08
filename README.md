# GNX Inception MVP

## Ejecutar

Node.js 22 o superior. Primera vez: `npm install`. Después:

```sh
npm start
```

Abrir http://localhost:4173. `PORT` permite cambiar el puerto. El servidor escucha solo en la máquina local.

## Incluido

- Interfaz responsive en español con ocho dimensiones y mapa navegable.
- Motor local determinista que adapta la siguiente pregunta a señales de riesgo, proceso y objetivo.
- Revisión editable, texto original conservado, pendientes y brief persistente.
- Autosave de borradores, sesiones independientes y tres ejemplos.
- Archivos guardados en IndexedDB; vista previa de TXT, MD y CSV pequeños.
- Grabación local con permiso, reproducción y eliminación. Para incorporar un audio, el operador escribe el fragmento relevante: no hay transcripción automática.
- Contexto estructurado para Estrategia, Constructor o Validación, guardado en la sesión y copiable.

## Límites de esta entrega

Con `OPENAI_API_KEY` en `.env`, el servidor consulta OpenAI Responses con `gpt-5.6-luna` y razonamiento `high`: síntesis editable y siguiente pregunta contextual. Sin clave, funciona el motor local. La clave nunca llega al cliente. Solo texto y contexto previo se envían a OpenAI, con `store:false`; los adjuntos permanecen locales. Errores conservan el borrador y permiten reintentar. No hay agente ejecutor conectado. Los adjuntos no se consideran evidencia corroborada automáticamente. Persistencia solo en este navegador: no hay cuentas ni sincronización. Borrar los datos del navegador elimina las sesiones y archivos.

Configura `.env` siguiendo `.env.example` y reinicia `npm start`. `node tests/ai-live.mjs` hace una llamada real con datos ficticios y consume tokens. Pruebas de navegador normales usan modo local sin gasto.

## Estructura

`src/domain.ts`: preguntas, reglas y paquete. `src/storage.ts`: persistencia. `src/app.ts`: interfaz. `ui.css`: presentación. `server.mjs`: servidor estático limitado a recursos públicos y `/health`.

## Verificación

`npm test`: compilación y pruebas de dominio. `npm run test:ui`: flujo de navegador y capturas desktop/móvil; requiere Microsoft Edge y servicio iniciado. Capturas en `test-results/` (no versionadas).

Desarrollo y entrega en la rama `mayas-alas/PoC`. La propuesta fue publicada previamente en `main`; esta implementación no se integra allí sin revisión.
