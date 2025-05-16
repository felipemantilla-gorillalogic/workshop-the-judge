/**
 * Rutas de estado del juego
 */

const express = require('express');
const router = express.Router();

const { loadState } = require('../utils/fileIO');

/**
 * GET /status - Obtiene el estado actual del juego
 */
router.get('/', async (req, res) => {
  try {
    // Cargar el estado actual
    const state = await loadState();

    // Filtrar información sensible de los nodos
    const filteredNodes = state.nodes.map(node => ({
      id: node.id,
      teamName: node.teamName,
      status: node.status,
      score: node.score,
      logoURL: node.logoURL,
      teamDescription: node.teamDescription,
      members: node.members || [],
      position: node.position || null // Incluir posición para el radar
    }));

    // Ordenar por puntuación (de mayor a menor)
    filteredNodes.sort((a, b) => b.score - a.score);

    // Responder con los nodos filtrados
    res.json({
      nodes: filteredNodes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /status/:id - Obtiene el estado de un equipo específico con información detallada
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Cargar el estado actual
    const state = await loadState();

    // Buscar el nodo por ID
    const node = state.nodes.find(n => n.id === id);
    if (!node) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    // Filtrar información sensible pero añadir más detalles que antes
    const filteredNode = {
      id: node.id,
      teamName: node.teamName,
      status: node.status,
      score: node.score,
      logoURL: node.logoURL,
      teamDescription: node.teamDescription,
      members: node.members || [],
      position: node.position || null,
      createdAt: node.createdAt,
      lastStatusChange: node.lastStatusChange,
      statusHistory: node.statusHistory || [], // Añadir historial de estados completo
    };

    // Buscar el desafío actual si está en estado 'challenged'
    let currentChallenge = null;
    if (node.status === 'challenged') {
      const activeChallenge = state.challenges.find(c => 
        c.teamId === id && !c.completed
      );
      
      if (activeChallenge) {
        currentChallenge = {
          challengeId: activeChallenge.challengeId,
          challenge: activeChallenge.challenge,
          input: activeChallenge.input,
          timestamp: activeChallenge.timestamp
        };
      }
    }

    // Buscar desafíos completados para este equipo con información detallada
    const teamChallenges = state.challenges
      .filter(c => c.teamId === id && c.completed)
      .map(c => ({
        challengeId: c.challengeId,
        challenge: c.challenge,
        input: c.input,
        response: c.response, // Añadir la respuesta dada por el equipo
        timestamp: c.timestamp,
        completedAt: c.completedAt,
        score: c.evaluation?.score || 0,
        passed: c.evaluation?.passed || false,
        feedback: c.evaluation?.feedback || ''
      }));

    // Responder con la información detallada del equipo y sus desafíos
    res.json({
      team: filteredNode,
      currentChallenge,
      challenges: teamChallenges
    });
  } catch (error) {
    console.error('Error obteniendo estado del equipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;