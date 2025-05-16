/**
 * Rutas de desafíos
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { loadState, saveState } = require('../utils/fileIO');
const { validateAuthToken } = require('../utils/validators');
const { generateChallenge } = require('../utils/openai');
const { updateNodeStatus } = require('../utils/nodeStatus');

/**
 * GET /challenge - Obtiene un desafío para un equipo
 */
router.get('/', async (req, res) => {
  try {
    // Validar token de autorización
    const auth = validateAuthToken(req.headers.authorization);
    if (!auth.valid) {
      return res.status(401).json({ error: auth.error });
    }

    // Cargar el estado actual
    const state = await loadState();

    // Buscar nodo por authToken
    const node = state.nodes.find(n => n.authToken === auth.token);
    if (!node) {
      return res.status(401).json({ error: 'Equipo no autorizado' });
    }

    // Verificar si ya hay un desafío activo para este equipo
    const existingChallenge = state.challenges.find(c => 
      c.teamId === node.id && 
      !c.completed
    );

    if (existingChallenge) {
      // Devolver el desafío existente (sin las palabras clave esperadas)
      return res.json({
        challengeId: existingChallenge.challengeId,
        challenge: existingChallenge.challenge,
        input: existingChallenge.input
      });
    }

    // Generar un nuevo desafío
    const challengeData = await generateChallenge();
    const challengeId = uuidv4();

    // Crear el objeto de desafío
    const newChallenge = {
      challengeId,
      teamId: node.id,
      challenge: challengeData.challenge,
      input: challengeData.input,
      expectedKeywords: challengeData.expectedKeywords,
      timestamp: new Date().toISOString(),
      completed: false
    };

    // Actualizar estado del nodo a "challenged"
    const updatedNode = await updateNodeStatus(node.id, 'challenged', {
      challengeId: challengeId,
      challengeType: challengeData.challenge.substring(0, 50) + '...' // Guardar una muestra del desafío
    });

    // Actualizar el nodo en el estado actual
    if (updatedNode) {
      const nodeIndex = state.nodes.findIndex(n => n.id === node.id);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex] = updatedNode;
      }
    }

    // Actualizar el estado
    state.challenges.push(newChallenge);
    await saveState(state);

    // Responder con el desafío (sin las palabras clave esperadas)
    res.json({
      challengeId,
      challenge: challengeData.challenge,
      input: challengeData.input
    });
  } catch (error) {
    console.error('Error en obtención de desafío:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;