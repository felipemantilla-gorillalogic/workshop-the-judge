# Proyecto: THE JUDGE - Sistema de Validación IA Distribuida

## Contexto Narrativo
En un entorno de validación distribuido, múltiples servidores autónomos intentan establecer comunicación con un servidor central denominado **The Judge**, que se encarga de autenticar, desafiar e interpretar la respuesta de cada nodo. Sólo los que logren resolver los desafíos mediante el uso de IA serán aceptados en la red de validación cognitiva.

---

## Objetivo General
Permitir que varios **servidores externos (equipos)** se conecten a un **servidor central (Judge)**, validen su identidad, reciban un desafío generado por IA, y respondan correctamente usando IA para completar la validación.

---

## Actores

### A. The Judge (Servidor Central)
- Recibe intentos de conexión de los equipos.
- Valida datos de registro.
- Envía desafíos personalizados.
- Evalúa las respuestas (opcionalmente con ayuda de otra IA).
- Muestra el estado en una interfaz visual en tiempo real.

### B. Servidores de los Equipos (Nodos Participantes)
- Envían solicitudes de registro al Judge.
- Reciben desafíos.
- Usan IA (OpenAI) para resolver el problema y retornar la respuesta.

---

## Fases del Flujo del Juego

### Fase 1 — Registro Inicial de Nodo (Descubrimiento)

#### Paso 1.1 – El equipo genera su servidor
Exponen un `GET /team-info` que devuelve:

```json
{
  "teamName": "Iberel",
  "members": ["Ana", "Luis", "Zoe"],
  "logoURL": "https://team-server.com/logo.png",
  "teamDescription": "Somos un equipo de IA creativa."
}
```

#### Paso 1.2 – Petición inicial de conexión
Petición `POST /register` al Judge:

```json
{
  "callbackURL": "https://team-server.com/team-info"
}
```

#### Paso 1.3 – Validación
El Judge hace un `GET` a `callbackURL`. Si todo está bien:
- Nodo registrado y visible.
- Equipo “conectado a la red”.

---

### Fase 2 — Entrega de Tokens

El Judge responde al `POST /register`:

```json
{
  "openAiToken": "sk-abc...",
  "authToken": "challenge-auth-xyz"
}
```

---

### Fase 3 — Solicitud del Desafío

Petición `GET /challenge`:

```
Headers:
  Authorization: Bearer challenge-auth-xyz
```

Respuesta:

```json
{
  "challengeId": "abc123",
  "challenge": "Resume el siguiente texto en una sola frase clara.",
  "input": "La inteligencia artificial está transformando..."
}
```

---

### Fase 4 — Resolución del Desafío

- El equipo llama a OpenAI con su token.
- Envía `POST /submit`:

```json
{
  "challengeId": "abc123",
  "response": "La IA está revolucionando la tecnología."
}
```

---

### Fase 5 — Validación Final

El Judge usa OpenAI para validar:

```json
{
  "status": "success",
  "message": "¡Challenge superado! Nodo validado exitosamente.",
  "score": 100
}
```

O en caso de fallo:

```json
{
  "status": "failed",
  "message": "Respuesta inválida o incoherente con el reto.",
  "score": 40
}
```

---

## Estados Visuales del Juego

| Estado               | Visual Interfaz        | Backend                  |
|----------------------|------------------------|---------------------------|
| Descubierto          | Nodo aparece difuso    | Registro recibido         |
| Validado             | Nodo sólido            | Callback validado         |
| Autenticado          | Nodo iluminado         | Tokens enviados           |
| En desafío           | Nodo parpadeando       | Desafío emitido           |
| Evaluando respuesta  | Nodo orbitando         | Validación IA activa      |
| Validado por IA      | Nodo brillante         | Score positivo            |
| Fallo en challenge   | Nodo se apaga          | Score bajo / nulo         |

---

## Extensiones Posibles

- **Rondas múltiples**
- **Leaderboard en tiempo real**
- **Análisis de prompts**

---