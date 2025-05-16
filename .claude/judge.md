# Proyecto: THE JUDGE - Backend Completo

## Objetivo General
Desarrollar un servidor central que gestione la validación de múltiples servidores de equipos participantes en un reto de programación IA. Este servidor (The Judge) se conecta a servidores externos, entrega desafíos, valida respuestas y visualiza el estado del juego.

---

## Tecnologías Sugeridas

- **Lenguaje:** JavaScript o TypeScript
- **Framework:** Node.js con Express
- **Persistencia:** Archivo JSON (`/data/state.json`)
- **Librerías útiles:** `uuid`, `fs`, `axios`, `zod` (opcional para validación)

---

## Estructura de Carpetas

```
/project-root
  /data
    state.json
  /src
    server.js
    routes/
      register.js
      challenge.js
      submit.js
      status.js
    utils/
      fileIO.js
      validators.js
      openai.js
  package.json
```

---

## Persistencia de Datos

### Archivo: `/data/state.json`

```json
{
  "nodes": [],
  "challenges": []
}
```

### Modelo: Nodo

```json
{
  "id": "uuid",
  "teamName": "string",
  "callbackURL": "string",
  "logoURL": "string",
  "teamDescription": "string",
  "authToken": "string",
  "openAiToken": "string",
  "status": "connected | challenged | validated | failed",
  "score": number
}
```

### Modelo: Challenge

```json
{
  "challengeId": "uuid",
  "teamId": "uuid",
  "challenge": "string",
  "input": "string",
  "expectedKeywords": ["string"]
}
```

---

## Endpoints

### 1. POST /register

**Body:**
```json
{
  "callbackURL": "https://team-server.com/team-info"
}
```

**Flujo:**
- Valida que `callbackURL` sea una URL válida.
- Hace `GET` a `callbackURL` para obtener:
```json
{
  "teamName": "...",
  "members": ["..."],
  "logoURL": "...",
  "teamDescription": "..."
}
```
- Genera `uuid`, `authToken`, `openAiToken`.
- Persiste el nodo en `state.json`.

**Response:**
```json
{
  "openAiToken": "sk-...",
  "authToken": "xyz..."
}
```

---

### 2. GET /challenge

**Headers:**
```
Authorization: Bearer {authToken}
```

**Flujo:**
- Valida token.
- Genera desafío:
```json
{
  "challengeId": "abc123",
  "challenge": "Resume este texto...",
  "input": "La IA permite..."
}
```
- Persiste en `challenges[]`.

**Response:**
```json
{
  "challengeId": "...",
  "challenge": "...",
  "input": "..."
}
```

---

### 3. POST /submit

**Body:**
```json
{
  "challengeId": "...",
  "response": "..."
}
```

**Flujo:**
- Busca challenge.
- Usa OpenAI para evaluar la respuesta.
- Si es satisfactoria:
  - Actualiza `status` del nodo.
  - Asigna `score`.
- Persiste resultado.

**Response:**
```json
{
  "status": "success | failed",
  "message": "...",
  "score": number
}
```

---

### 4. GET /status

**Response:**
```json
{
  "nodes": [
    {
      "teamName": "...",
      "status": "...",
      "score": 100,
      "logoURL": "...",
      "teamDescription": "..."
    }
  ]
}
```

---

## Utilidades

### fileIO.js
- `loadState()`: lee `state.json`
- `saveState(data)`: guarda en `state.json`

### openai.js
- `evaluateResponse(challenge, response)`: evalúa si la respuesta es válida mediante API de OpenAI.

---

## Consideraciones

- Validar inputs con Zod o lógica manual.
- En entorno local, usa `fs.promises` para lectura/escritura.
- Considera usar `setInterval` para backups del JSON si el juego dura mucho.
- Para producción, evalúa migrar de JSON a base de datos.

---