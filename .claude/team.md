# Especificación del Servidor de Equipo - NODO IBEREL

## Objetivo
Servidor creado por un equipo participante que permite establecer conexión con el servidor central (The Judge) y resolver un desafío mediante IA.

---

## Endpoints del Servidor de Equipo

### 1. GET /team-info
**Descripción:** Expone los datos de identidad del equipo, usados por el Judge para validar la conexión.

**Response:**
```json
{
  "teamName": "Iberel",
  "members": ["Ana", "Luis", "Zoe"],
  "logoURL": "https://team-server.com/logo.png",
  "teamDescription": "Somos un equipo de IA creativa."
}
```

---

## Conexión al Servidor Judge

### Paso 1: Envío de petición de registro
Realiza un `POST` a:

```
POST https://thejudge.com/register
```

**Body:**
```json
{
  "callbackURL": "https://team-server.com/team-info"
}
```

**Judge responde:**
```json
{
  "openAiToken": "sk-abc...",
  "authToken": "challenge-auth-xyz"
}
```

---

## Obtención y Resolución del Desafío

### Paso 2: Solicitud del desafío
```
GET https://thejudge.com/challenge
Authorization: Bearer challenge-auth-xyz
```

**Response:**
```json
{
  "challengeId": "abc123",
  "challenge": "Resume el siguiente texto...",
  "input": "La inteligencia artificial..."
}
```

### Paso 3: Llamada a OpenAI
- Usar el `openAiToken` recibido para generar una solución con la API de OpenAI.

### Paso 4: Envío de la solución
```
POST https://thejudge.com/submit
```

**Body:**
```json
{
  "challengeId": "abc123",
  "response": "La IA está revolucionando la tecnología."
}
```

---

## Requisitos del Servidor
- Debe estar en línea y accesible desde el Judge.
- Responder correctamente al `GET /team-info`.
- Manejar tokens de autenticación y validación.
- Ejecutar la integración con OpenAI correctamente.

---