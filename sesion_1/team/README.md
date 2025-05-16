# Team Server - Servidor de Equipo para IA Challenge

## Descripción
Servidor de equipo que se conecta con el servidor central (The Judge) para resolver desafíos mediante IA. Este servidor implementa el flujo completo de registro, solicitud de desafíos, resolución con OpenAI y envío de soluciones.

## Estructura del Proyecto

```
/team
  /public
    index.html          # Interfaz de usuario
  /src
    /utils
      ai.js             # Interacción con OpenAI
      judge.js          # Comunicación con el servidor Judge
    config.js           # Configuración del equipo
    server.js           # Servidor principal
  package.json          # Dependencias y configuración
  README.md             # Documentación
```

## Requisitos

- Node.js v14 o superior
- NPM v6 o superior

## Instalación

1. Clona este repositorio
2. Instala las dependencias:

```bash
cd team
npm install
```

## Ejecución

```bash
npm start
```

El servidor estará disponible en `http://localhost:3001`.

## Configuración

Puedes modificar la información del equipo y otras configuraciones en el archivo `src/config.js`.

## Flujo de Funcionamiento

1. **Registro**: El equipo se registra con el servidor Judge proporcionando su URL de callback.
2. **Obtención de Credenciales**: El Judge devuelve tokens para autenticación y uso de OpenAI.
3. **Solicitud de Desafío**: El equipo solicita un desafío al Judge.
4. **Resolución**: El equipo utiliza OpenAI para resolver el desafío.
5. **Envío de Solución**: El equipo envía la solución al Judge para su evaluación.

## Endpoints

### Endpoints para el Judge
- `GET /team-info`: Devuelve la información del equipo.

### Endpoints para la interfaz web
- `POST /register`: Registra el equipo con el Judge.
- `POST /request-challenge`: Solicita un desafío al Judge.
- `POST /solve-challenge`: Resuelve un desafío y envía la solución.
- `POST /full-flow`: Ejecuta el flujo completo automáticamente.
- `GET /status`: Obtiene el estado actual del equipo.

## Interfaz de Usuario

La aplicación incluye una interfaz web para interactuar con el servidor:

- **Panel de Control**: Botones para cada paso del flujo.
- **Visor de Desafíos**: Muestra el desafío actual.
- **Respuestas de IA**: Visualiza las respuestas generadas.
- **Resultados y Puntuación**: Muestra el resultado de la evaluación.

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE)
