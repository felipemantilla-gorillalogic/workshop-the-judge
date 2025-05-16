/**
 * Rutas de registro de equipos
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const router = express.Router();

const { loadState, saveState } = require('../utils/fileIO');
const { validateRegisterRequest } = require('../utils/validators');
const { generateOpenAiToken } = require('../utils/openai');
const { updateNodeStatus } = require('../utils/nodeStatus');

/**
 * POST /register - Registra un nuevo equipo
 */
router.post('/', async (req, res) => {
  try {
    // Validar el cuerpo de la solicitud
    const validation = validateRegisterRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const { callbackURL } = req.body;

    // Cargar el estado actual
    const state = await loadState();

    // Verificar si el equipo ya está registrado (por callbackURL)
    const existingNode = state.nodes.find(node => node.callbackURL === callbackURL);
    if (existingNode) {
      return res.status(409).json({ 
        error: 'Equipo ya registrado',
        openAiToken: existingNode.openAiToken,
        authToken: existingNode.authToken
      });
    }

    // Hacer GET a callbackURL para obtener información del equipo
    try {
      const response = await axios.get(callbackURL, { timeout: 5000 });
      const teamInfo = response.data;

      // Validar la información del equipo
      if (!teamInfo || !teamInfo.teamName) {
        return res.status(400).json({ error: 'Información de equipo inválida' });
      }

      // Generar tokens y UUID
      const id = uuidv4();
      const authToken = uuidv4();
      const openAiToken = generateOpenAiToken();
      

      // Generar fecha actual para los timestamps
      const now = new Date().toISOString();
      
      // Crear el nuevo nodo con historial de estados
      const newNode = {
        id,
        teamName: teamInfo.teamName,
        callbackURL,
        logoURL: teamInfo.logoURL || '',
        teamDescription: teamInfo.teamDescription || '',
        members: teamInfo.members || [],
        authToken,
        openAiToken,
        status: 'connecting',
        score: 0,
        // Registrar el timestamp de inicio
        createdAt: now,
        lastStatusChange: now,
        // Crear un historial de estados para seguimiento completo
        statusHistory: [
          {
            status: 'connecting',
            timestamp: now,
            duration: null // Se calculará cuando cambie el estado
          }
        ]
      };

      // Agregar nodo al estado
      state.nodes.push(newNode);
      await saveState(state);

      // Esperar 5 segundos antes de actualizar el estado
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Actualizar estado del nodo a conectado
      console.log('Actualizando estado del nodo a conectado');
      await updateNodeStatus(newNode.id, 'connected', {
        message: 'Conexión establecida correctamente'
      });

      // Responder con tokens
      res.status(201).json({
        openAiToken,
        authToken
      });

    } catch (error) {
      console.error('Error obteniendo información del equipo:', error);
      return res.status(502).json({ error: 'No se puede conectar con el servidor del equipo' });
    }
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;