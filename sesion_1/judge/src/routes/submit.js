/**
 * Rutas de envío de respuestas
 */

const express = require('express');
const router = express.Router();

const { loadState, saveState } = require('../utils/fileIO');
const { validateSubmitRequest, validateAuthToken } = require('../utils/validators');
const { evaluateResponse } = require('../utils/openai');
const { updateNodeStatus } = require('../utils/nodeStatus');

/**
 * POST /submit - Envía una respuesta a un desafío
 */
router.post('/', async (req, res) => {
  try {
    // Validar token de autorización
    const auth = validateAuthToken(req.headers.authorization);
    if (!auth.valid) {
      return res.status(401).json({ error: auth.error });
    }

    // Validar el cuerpo de la solicitud
    const validation = validateSubmitRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const { challengeId, response } = req.body;

    // Cargar el estado actual
    const state = await loadState();

    // Buscar nodo por authToken
    const node = state.nodes.find(n => n.authToken === auth.token);
    if (!node) {
      return res.status(401).json({ error: 'Equipo no autorizado' });
    }

    // Buscar el desafío
    const challenge = state.challenges.find(c => 
      c.challengeId === challengeId && 
      c.teamId === node.id &&
      !c.completed
    );

    if (!challenge) {
      return res.status(404).json({ error: 'Desafío no encontrado o ya completado' });
    }

    // Evaluar la respuesta con OpenAI
    const evaluation = await evaluateResponse(challenge, response);

    // Actualizar el desafío con la respuesta
    challenge.completed = true;
    challenge.response = response;
    challenge.evaluation = evaluation;
    challenge.completedAt = new Date().toISOString();

    // Actualizar estado del nodo según el resultado
    const newStatus = evaluation.passed ? 'validated' : 'failed';
    console.log(`Evaluación recibida para ${node.teamName}: Score ${evaluation.score}, Passed: ${evaluation.passed}`);
    
    const updatedNode = await updateNodeStatus(node.id, newStatus, {
      challengeId: challengeId,
      score: evaluation.score,
      result: evaluation.passed ? 'success' : 'failed',
      feedback: evaluation.feedback.substring(0, 100) + '...' // Guardar una muestra del feedback
    });
    
    // Actualizar el nodo en el estado actual
    if (updatedNode) {
      const nodeIndex = state.nodes.findIndex(n => n.id === node.id);
      if (nodeIndex !== -1) {
        // Actualizar el nodo completo en el estado
        state.nodes[nodeIndex] = updatedNode;
        // No es necesario actualizar node.score aquí porque ya hemos reemplazado todo el nodo
      } else {
        // Si por alguna razón no encontramos el nodo, actualizamos la puntuación en el objeto original
        node.score = evaluation.score;
      }
    } else {
      // Si updateNodeStatus falló, actualizamos manualmente la puntuación
      node.score = evaluation.score;
    }

    // Guardar el estado actualizado
    await saveState(state);

    // Responder con el resultado de la evaluación
    res.json({
      status: evaluation.passed ? 'success' : 'failed',
      message: evaluation.feedback,
      score: evaluation.score
    });
  } catch (error) {
    console.error('Error en envío de respuesta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;