/**
 * Servidor principal de The Judge
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Rutas
const registerRoutes = require('./routes/register');
const challengeRoutes = require('./routes/challenge');
const submitRoutes = require('./routes/submit');
const statusRoutes = require('./routes/status');
const restartRoutes = require('./routes/restart');
const disconnectRoutes = require('./routes/disconnect');
const winnerRoutes = require('./routes/winner');

// Utilidades
const { loadState } = require('./utils/fileIO');
const { cleanupStaleConnectingNodes } = require('./utils/cleanupNodes');
const cors = require('cors');

// Crear app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/register', registerRoutes);
app.use('/challenge', challengeRoutes);
app.use('/submit', submitRoutes);
app.use('/status', statusRoutes);
app.use('/restart', restartRoutes);
app.use('/disconnect', disconnectRoutes);
app.use('/winner', winnerRoutes);

// Ruta para servir un frontend simple
app.get('/', async (req, res) => {
  try {
    // Intentar cargar un index.html si existe
    const htmlPath = path.join(__dirname, '../public/index.html');
    try {
      await fs.access(htmlPath);
      res.sendFile(htmlPath);
    } catch (error) {
      // Si no existe el archivo, mostrar un dashboard simple generado dinámicamente
      const state = await loadState();
      
      const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>The Judge - Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
          }
          .node-card {
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .node-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          .node-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          .node-logo {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 15px;
            background-color: #eee;
          }
          .node-name {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
          }
          .node-status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            margin-top: 5px;
          }
          .status-connected { background-color: #e0f7fa; color: #006064; }
          .status-challenged { background-color: #fff9c4; color: #ffd600; }
          .status-validated { background-color: #c8e6c9; color: #1b5e20; }
          .status-failed { background-color: #ffcdd2; color: #b71c1c; }
          .node-score {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
          }
          .node-description {
            color: #666;
            font-size: 0.9em;
            margin-top: 10px;
          }
          .refresh-button {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
          }
          .refresh-button:hover {
            background-color: #555;
          }
          .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>The Judge - Dashboard</h1>
        
        <button class="refresh-button" onclick="location.reload()">Refresh Dashboard</button>
        
        <div class="dashboard">
          ${state.nodes.length === 0 ? 
            `<div class="empty-state">
              <h2>No hay equipos registrados aún</h2>
              <p>Los equipos aparecerán aquí cuando se registren.</p>
            </div>` :
            state.nodes.map(node => `
              <div class="node-card">
                <div class="node-header">
                  <img class="node-logo" src="${node.logoURL || 'https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png'}" 
                    alt="${node.teamName} logo" onerror="this.src='https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png'">
                  <div>
                    <div class="node-name">${node.teamName}</div>
                    <div class="node-status status-${node.status}">${node.status}</div>
                  </div>
                </div>
                <div class="node-score">${node.score}</div>
                <div class="node-description">${node.teamDescription || 'Sin descripción'}</div>
              </div>
            `).join('')
          }
        </div>
        
        <script>
          // Actualizar automáticamente cada 10 segundos
          setTimeout(() => {
            location.reload();
          }, 10000);
        </script>
      </body>
      </html>
      `;
      
      res.send(html);
    }
  } catch (error) {
    console.error('Error en ruta principal:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta por defecto para 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor The Judge iniciado en puerto ${PORT}`);
  console.log('Rutas disponibles:');
  console.log('- POST /register - Registrar un nuevo equipo');
  console.log('- GET /challenge - Obtener un desafío (requiere autenticación)');
  console.log('- POST /submit - Enviar respuesta a un desafío (requiere autenticación)');
  console.log('- GET /status - Ver estado de todos los equipos');
  console.log('- GET /status/:id - Ver estado de un equipo específico');
  console.log('- GET /winner - Determinar ganador con análisis de IA');
  console.log('- POST /restart - Reiniciar el juego (requiere clave de administrador)');
  console.log('- POST /disconnect/:id - Desconectar un equipo específico (requiere clave de administrador)');
});

// Programar tarea de limpieza para ejecutar cada 5 segundos
const cleanupInterval = setInterval(async () => {
  console.log('Verificando nodos en estado "connecting" por más de 10 segundos...');
  try {
    const removedNodes = await cleanupStaleConnectingNodes();
    if (removedNodes.length > 0) {
      console.log(`Limpieza programada: Se eliminaron ${removedNodes.length} nodos en estado "connecting" por timeout`);
      removedNodes.forEach(node => {
        const connectionTime = node.statusHistory
          .find(entry => entry.status === 'removed_timeout')?.reason || 'Timeout';
        console.log(`- Nodo ${node.id} (${node.teamName}): ${connectionTime}`);
      });
    }
  } catch (error) {
    console.error('Error en la tarea programada de limpieza:', error);
  }
}, 5000); // Revisar cada 5 segundos

// Manejar señales de cierre
process.on('SIGINT', () => {
  console.log('Deteniendo tareas programadas...');
  clearInterval(cleanupInterval);
  console.log('Servidor detenido');
  process.exit(0);
});

module.exports = app;