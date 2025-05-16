/**
 * Utilidades para interactuar con el servidor Judge
 */

const axios = require('axios');
const { judgeURL, teamsMap, challenges } = require('../config');

/**
 * Registra el equipo en el servidor Judge
 * 
 * @param {string} teamId - ID del equipo a registrar
 * @param {string} teamInfoURL - URL del endpoint de información del equipo
 * @returns {Promise<Object>} - Credenciales recibidas del Judge
 */
async function registerTeam(teamId, teamInfoURL) {
  try {
    // Verificar que el equipo existe
    const team = teamsMap[teamId];
    if (!team) {
      throw new Error(`Equipo con ID ${teamId} no encontrado`);
    }

    const response = await axios.post(`${judgeURL}/register`, {
      callbackURL: `${teamInfoURL}?teamId=${teamId}`
    });

    // Guardar credenciales
    team.credentials.openAiToken = response.data.openAiToken;
    team.credentials.authToken = response.data.authToken;
    team.registered = true;
    
    console.log(`Equipo ${teamId} registrado exitosamente con token ${team.credentials.authToken.substring(0, 5)}...`);

    return response.data;
  } catch (error) {
    console.error(`Error al registrar el equipo ${teamId}:`, error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    throw error;
  }
}

/**
 * Obtiene un desafío del servidor Judge para un equipo específico
 * 
 * @param {string} teamId - ID del equipo que solicita el desafío
 * @returns {Promise<Object>} - Desafío recibido
 */
async function getChallenge(teamId) {
  try {
    // Verificar que el equipo existe
    const team = teamsMap[teamId];
    if (!team) {
      throw new Error(`Equipo con ID ${teamId} no encontrado`);
    }

    // Verificar que el equipo tiene un token de autenticación
    if (!team.credentials.authToken) {
      throw new Error(`El equipo ${teamId} no ha sido registrado`);
    }

    const response = await axios.get(`${judgeURL}/challenge`, {
      headers: {
        'Authorization': `Bearer ${team.credentials.authToken}`
      }
    });

    // Guardar el desafío
    const challenge = response.data;
    console.log(`Desafío recibido con ID: ${challenge.challengeId}`);
    
    challenges[challenge.challengeId] = {
      ...challenge,
      teamId: teamId
    };
    
    // Actualizar el desafío activo del equipo
    team.activeChallengeId = challenge.challengeId;
    
    // Verificar que el desafío se guardó correctamente
    console.log(`Desafío guardado: ${JSON.stringify(challenges[challenge.challengeId], null, 2)}`);
    console.log(`Desafíos activos: ${Object.keys(challenges).join(', ')}`);

    return challenge;
  } catch (error) {
    console.error(`Error al obtener el desafío para el equipo ${teamId}:`, error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    throw error;
  }
}

/**
 * Envía una solución al desafío al servidor Judge
 * 
 * @param {string} challengeId - ID del desafío
 * @param {string} response - Respuesta al desafío
 * @returns {Promise<Object>} - Resultado de la evaluación
 */
async function submitSolution(challengeId, response) {
  try {
    // Verificar que el desafío existe
    const challenge = challenges[challengeId];
    if (!challenge) {
      throw new Error(`Desafío con ID ${challengeId} no encontrado`);
    }

    // Obtener el equipo asociado
    const teamId = challenge.teamId;
    const team = teamsMap[teamId];
    if (!team) {
      throw new Error(`Equipo asociado al desafío ${challengeId} no encontrado`);
    }

    // Verificar que el equipo tiene un token de autenticación
    if (!team.credentials.authToken) {
      throw new Error(`El equipo ${teamId} no ha sido registrado`);
    }

    const result = await axios.post(`${judgeURL}/submit`, {
      challengeId,
      response
    }, {
      headers: {
        'Authorization': `Bearer ${team.credentials.authToken}`
      }
    });

    // Limpiar el desafío completado y guardar en historial
    if (team.activeChallengeId === challengeId) {
      // Guardar el desafío en el historial
      team.challengeHistory.push({
        challengeId,
        challenge: challenge.challenge,
        input: challenge.input,
        response,
        result: result.data,
        timestamp: new Date().toISOString()
      });
      
      // Actualizar la puntuación del equipo si hay puntuación en el resultado
      if (result.data.score) {
        console.log(`Actualizando puntuación del equipo ${teamId} a ${team.score + result.data.score} (sumando ${result.data.score} puntos)`);
        team.score += result.data.score;
      }
      
      // Limpiar el desafío activo
      team.activeChallengeId = null;
    }

    return {
      ...result.data,
      teamId
    };
  } catch (error) {
    console.error(`Error al enviar la solución para el desafío ${challengeId}:`, error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    throw error;
  }
}

/**
 * Obtiene el estado actual del juego
 * 
 * @returns {Promise<Object>} - Estado del juego
 */
async function getStatus() {
  try {
    const response = await axios.get(`${judgeURL}/status`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el estado del juego:', error.message);
    throw error;
  }
}

/**
 * Limpia las credenciales de un equipo específico
 * 
 * @param {string} teamId - ID del equipo a reiniciar
 */
function resetTeam(teamId) {
  // Verificar que el equipo existe
  const team = teamsMap[teamId];
  if (!team) {
    throw new Error(`Equipo con ID ${teamId} no encontrado`);
  }

  // Reiniciar credenciales y estado del equipo
  team.credentials.openAiToken = null;
  team.credentials.authToken = null;
  team.activeChallengeId = null;
  team.registered = false;
  team.score = 0;
  team.challengeHistory = [];

  // Limpiar desafíos asociados al equipo
  Object.keys(challenges).forEach(challengeId => {
    if (challenges[challengeId].teamId === teamId) {
      delete challenges[challengeId];
    }
  });

  return { success: true, message: `Estado del equipo ${teamId} reiniciado correctamente` };
}

module.exports = {
  registerTeam,
  getChallenge,
  submitSolution,
  getStatus,
  resetTeam
};