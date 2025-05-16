/**
 * Rutas para determinar el ganador del desafío
 */

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

const { loadState } = require('../utils/fileIO');

// Inicializar cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * GET /winner - Determina el ganador utilizando IA
 */
router.get('/', async (req, res) => {
  try {
    // Cargar el estado actual
    const state = await loadState();
    
    // Verificar si hay suficientes equipos para determinar un ganador
    if (!state.nodes || state.nodes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay equipos registrados para determinar un ganador'
      });
    }

    // Crear un resumen detallado de cada equipo para el análisis de IA
    const teamsData = state.nodes.map(node => {
      // Calcular estadísticas relevantes del equipo
      const successfulChallenges = state.challenges.filter(c => 
        c.teamId === node.id && c.completed && c.evaluation && c.evaluation.passed
      );
      
      const failedChallenges = state.challenges.filter(c => 
        c.teamId === node.id && c.completed && c.evaluation && !c.evaluation.passed
      );
      
      // Calcular tiempo promedio de resolución (solo para desafíos exitosos)
      let averageResolutionTime = 0;
      if (successfulChallenges.length > 0) {
        const totalTime = successfulChallenges.reduce((sum, challenge) => {
          const startTime = new Date(challenge.timestamp).getTime();
          const endTime = new Date(challenge.completedAt).getTime();
          return sum + (endTime - startTime);
        }, 0);
        averageResolutionTime = totalTime / successfulChallenges.length;
      }
      
      // Obtener historial de estados
      const statusTransitions = node.statusHistory || [];
      
      // Retornar objeto con datos relevantes del equipo
      return {
        id: node.id,
        teamName: node.teamName,
        score: node.score || 0,
        createdAt: node.createdAt,
        currentStatus: node.status,
        totalChallenges: successfulChallenges.length + failedChallenges.length,
        successfulChallenges: successfulChallenges.length,
        failedChallenges: failedChallenges.length,
        successRate: successfulChallenges.length > 0 
          ? successfulChallenges.length / (successfulChallenges.length + failedChallenges.length) * 100 
          : 0,
        averageScore: successfulChallenges.length > 0 
          ? successfulChallenges.reduce((sum, c) => sum + (c.evaluation?.score || 0), 0) / successfulChallenges.length 
          : 0,
        averageResolutionTimeMs: averageResolutionTime,
        averageResolutionTimeFormatted: formatTime(averageResolutionTime),
        timeRegistered: node.createdAt 
          ? new Date().getTime() - new Date(node.createdAt).getTime()
          : 0,
        timeRegisteredFormatted: node.createdAt 
          ? formatTime(new Date().getTime() - new Date(node.createdAt).getTime()) 
          : 'Desconocido',
        statusTransitionsCount: statusTransitions.length,
        members: node.members || [],
        teamDescription: node.teamDescription || ''
      };
    });
    
    // Ordenar equipos por puntaje (mayor a menor)
    teamsData.sort((a, b) => b.score - a.score);
    
    // Determinar el ganador basado en el puntaje más alto (criterio principal)
    const sortedTeams = [...teamsData].sort((a, b) => b.score - a.score);
    const highestScoringTeam = sortedTeams[0];
    const tiedTeams = sortedTeams.filter(team => team.score === highestScoringTeam.score);
    
    // Aplicar criterios de desempate si es necesario
    let winnerTeam = highestScoringTeam;
    if (tiedTeams.length > 1) {
      // Desempatar por tiempo promedio de resolución (más rápido gana)
      winnerTeam = tiedTeams.reduce((fastest, team) => 
        team.averageResolutionTimeMs < fastest.averageResolutionTimeMs ? team : fastest
      , tiedTeams[0]);
    }
    
    // Crear prompt para OpenAI con el ganador ya determinado
    const prompt = `
    Eres el juez principal de una competencia de inteligencia artificial. Tu tarea es analizar los datos de los equipos y explicar por qué el equipo "${winnerTeam.teamName}" (ID: ${winnerTeam.id}) es el ganador de la competencia.

    Aquí están los datos de los equipos participantes:
    
    ${JSON.stringify(teamsData, null, 2)}
    
    IMPORTANTE: El ganador oficial es "${winnerTeam.teamName}" (ID: ${winnerTeam.id}). Este equipo DEBE ser mencionado en tu explicación como el ganador indiscutible.
    
    Por favor, analiza los siguientes factores para explicar por qué "${winnerTeam.teamName}" es el ganador:
    1. Puntaje total
    2. Tasa de éxito en los desafíos
    3. Puntaje promedio en desafíos exitosos
    4. Tiempo promedio de resolución
    5. Cantidad total de desafíos resueltos
    6. Otros factores relevantes que puedas identificar
    
    Si hay empate en la puntuación, explica que el criterio de desempate fue el tiempo promedio de resolución más rápido.
    
    Luego, presenta tu decisión con el siguiente formato:
    1. Anuncio oficial del ganador "${winnerTeam.teamName}" (con entusiasmo y estilo de torneo)
    2. Ranking completo de los equipos
    3. Explicación detallada de por qué "${winnerTeam.teamName}" fue seleccionado como ganador
    4. Menciones especiales para equipos destacados en categorías específicas
    5. Estadísticas notables (récords, logros especiales, etc.)
    
    Asegúrate de ser imparcial al discutir los logros de todos los equipos, pero manteniendo a "${winnerTeam.teamName}" como el ganador oficial en tu explicación.
    `;
    
    // Llamar a la API de OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          "role": "system", 
          "content": "Eres el juez principal de una competencia de inteligencia artificial, responsable de determinar el ganador basado en un análisis objetivo de datos."
        },
        { 
          "role": "user", 
          "content": prompt 
        }
      ],
      temperature: 0.5, // Balancear creatividad con consistencia
      max_tokens: 1000
    });
    
    // Extraer y procesar la respuesta
    const aiAnalysis = completion.choices[0].message.content;
    
    // Enviar respuesta con análisis de IA y datos de respaldo
    res.json({
      success: true,
      winner: {
        id: winnerTeam.id,
        teamName: winnerTeam.teamName,
        score: winnerTeam.score
      },
      aiAnalysis: aiAnalysis,
      teams: teamsData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error determinando ganador:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno al determinar el ganador',
      error: error.message
    });
  }
});

/**
 * Formatea un tiempo en milisegundos a un formato legible
 * @param {number} ms - Tiempo en milisegundos
 * @returns {string} - Tiempo formateado
 */
function formatTime(ms) {
  if (!ms) return 'N/A';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

module.exports = router;