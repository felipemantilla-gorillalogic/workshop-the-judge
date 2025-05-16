/**
 * Servidor principal de equipos múltiples
 */

const express = require('express');
const path = require('path');
const { teams, teamsMap, challenges, PORT } = require('./config');
const { registerTeam, getChallenge, submitSolution, resetTeam } = require('./utils/judge');
const { solveChallenge } = require('./utils/ai');

// Crear app Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

/**
 * GET /teams
 * Devuelve la lista de equipos disponibles
 */
app.get('/teams', (req, res) => {
  // Devolver información básica sin credenciales
  const teamsInfo = teams.map(team => ({
    id: team.id,
    teamName: team.teamName,
    members: team.members,
    logoURL: team.logoURL,
    teamDescription: team.teamDescription,
    registered: team.registered || !!team.credentials.authToken,
    activeChallengeId: team.activeChallengeId,
    score: team.score,
    challengesCompleted: team.challengeHistory.length,
    hasActiveChallenge: !!team.activeChallengeId
  }));

  res.json({ teams: teamsInfo });
});

/**
 * GET /team-info
 * Devuelve la información de un equipo específico
 */
app.get('/team-info', (req, res) => {
  const { teamId } = req.query;
  
  if (!teamId) {
    return res.status(400).json({
      success: false,
      message: 'Debe especificar un ID de equipo'
    });
  }
  
  const team = teamsMap[teamId];
  if (!team) {
    return res.status(404).json({
      success: false,
      message: `Equipo con ID ${teamId} no encontrado`
    });
  }
  
  // Excluir las credenciales de la respuesta
  const { credentials, activeChallengeId, ...teamInfo } = team;
  
  res.json(teamInfo);
});

/**
 * GET /
 * Página principal de gestión de equipos
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * POST /register
 * Registra un equipo en el servidor Judge
 */
app.post('/register', async (req, res) => {
  try {
    const { teamId } = req.body;
    
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar un ID de equipo'
      });
    }
    
    const team = teamsMap[teamId];
    if (!team) {
      return res.status(404).json({
        success: false,
        message: `Equipo con ID ${teamId} no encontrado`
      });
    }
    
    // Construir la URL del endpoint de información del equipo
    const teamInfoURL = `http://${req.headers.host}/team-info`;
    
    // Registrar el equipo
    const result = await registerTeam(teamId, teamInfoURL);
    
    res.json({
      success: true,
      message: `Equipo ${team.teamName} registrado correctamente`,
      credentials: {
        openAiToken: team.credentials.openAiToken ? 'sk-***' : null,
        authToken: team.credentials.authToken ? team.credentials.authToken.substring(0, 5) + '***' : null
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el equipo',
      error: error.message
    });
  }
});

/**
 * POST /request-challenge
 * Solicita un desafío al servidor Judge para un equipo específico
 */
app.post('/request-challenge', async (req, res) => {
  try {
    const { teamId } = req.body;
    
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar un ID de equipo'
      });
    }
    
    const team = teamsMap[teamId];
    if (!team) {
      return res.status(404).json({
        success: false,
        message: `Equipo con ID ${teamId} no encontrado`
      });
    }
    
    // Verificar que el equipo está registrado
    if (!team.credentials.authToken) {
      return res.status(400).json({
        success: false,
        message: `El equipo ${team.teamName} no está registrado todavía`
      });
    }
    
    // Obtener un desafío
    const challenge = await getChallenge(teamId);
    
    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error('Error al solicitar desafío:', error);
    res.status(500).json({
      success: false,
      message: 'Error al solicitar el desafío',
      error: error.message
    });
  }
});

/**
 * POST /solve-challenge
 * Resuelve un desafío usando IA y lo envía al servidor Judge
 */
app.post('/solve-challenge', async (req, res) => {
  try {
    const { challengeId, teamId } = req.body;
    
    // Si se proporciona challengeId, lo usamos
    let activeChallenge;
    
    if (challengeId) {
      // Verificar que el desafío existe
      activeChallenge = challenges[challengeId];
      console.log(`Buscando desafío con ID: ${challengeId}`);
    } else if (teamId) {
      // Si no hay challengeId pero hay teamId, intentamos buscar el desafío activo del equipo
      const team = teamsMap[teamId];
      if (!team) {
        return res.status(404).json({
          success: false,
          message: `Equipo con ID ${teamId} no encontrado`
        });
      }
      
      if (!team.activeChallengeId) {
        return res.status(400).json({
          success: false,
          message: `El equipo ${team.teamName} no tiene un desafío activo`
        });
      }
      
      activeChallenge = challenges[team.activeChallengeId];
      console.log(`Buscando desafío activo del equipo ${teamId}: ${team.activeChallengeId}`);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Falta el parámetro challengeId o teamId'
      });
    }
    
    // Verificar que el desafío existe
    if (!activeChallenge) {
      console.error(`Desafío no encontrado. Desafíos disponibles: ${Object.keys(challenges).join(', ')}`);
      return res.status(404).json({
        success: false,
        message: challengeId 
          ? `Desafío con ID ${challengeId} no encontrado` 
          : `Desafío activo para el equipo ${teamId} no encontrado`
      });
    }
    
    // Obtener el equipo asociado
    const activeTeamId = activeChallenge.teamId;
    const team = teamsMap[activeTeamId];
    
    // Verificar que el equipo está registrado
    if (!team.credentials.authToken || !team.credentials.openAiToken) {
      return res.status(400).json({
        success: false,
        message: `El equipo ${team.teamName} no está registrado o no tiene credenciales válidas`
      });
    }
    
    // Usar el ID del desafío activo encontrado
    const activeChallengId = activeChallenge.challengeId;
    console.log(`Resolviendo desafío con ID: ${activeChallengId}`);
    
    // Resolver el desafío con OpenAI
    const response = await solveChallenge(activeChallengId);
    
    // Enviar la solución al Judge
    const result = await submitSolution(activeChallengId, response);
    
    res.json({
      success: true,
      teamId: activeTeamId,
      teamName: team.teamName,
      response,
      result
    });
  } catch (error) {
    console.error('Error al resolver el desafío:', error);
    res.status(500).json({
      success: false,
      message: 'Error al resolver o enviar el desafío',
      error: error.message
    });
  }
});

/**
 * GET /team-history
 * Obtiene el historial de desafíos resueltos por un equipo
 */
app.get('/team-history', (req, res) => {
  const { teamId } = req.query;
  
  if (!teamId) {
    return res.status(400).json({
      success: false,
      message: 'Debe especificar un ID de equipo'
    });
  }
  
  const team = teamsMap[teamId];
  if (!team) {
    return res.status(404).json({
      success: false,
      message: `Equipo con ID ${teamId} no encontrado`
    });
  }
  
  res.json({
    success: true,
    teamId,
    teamName: team.teamName,
    challengeHistory: team.challengeHistory,
    totalChallenges: team.challengeHistory.length,
    score: team.score
  });
});

/**
 * GET /team-status
 * Obtiene el estado actual de un equipo específico
 */
app.get('/team-status', (req, res) => {
  const { teamId } = req.query;
  
  if (!teamId) {
    return res.status(400).json({
      success: false,
      message: 'Debe especificar un ID de equipo'
    });
  }
  
  const team = teamsMap[teamId];
  if (!team) {
    return res.status(404).json({
      success: false,
      message: `Equipo con ID ${teamId} no encontrado`
    });
  }
  
  // Preparar información de desafío activo si existe
  let activeChallenge = null;
  if (team.activeChallengeId) {
    const challenge = challenges[team.activeChallengeId];
    if (challenge) {
      activeChallenge = {
        challengeId: challenge.challengeId,
        challenge: challenge.challenge,
        input: challenge.input
      };
    }
  }
  
  res.json({
    success: true,
    teamInfo: {
      id: team.id,
      teamName: team.teamName,
      members: team.members,
      logoURL: team.logoURL,
      teamDescription: team.teamDescription,
      score: team.score,
      challengesCompleted: team.challengeHistory.length
    },
    registered: team.registered || !!team.credentials.authToken,
    credentials: {
      openAiToken: team.credentials.openAiToken ? 'sk-***' : null,
      authToken: team.credentials.authToken ? team.credentials.authToken.substring(0, 5) + '***' : null
    },
    activeChallenge
  });
});

/**
 * POST /full-flow
 * Ejecuta el flujo completo para un equipo: registra, solicita desafío y lo resuelve
 */
app.post('/full-flow', async (req, res) => {
  try {
    const { teamId } = req.body;
    
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar un ID de equipo'
      });
    }
    
    const team = teamsMap[teamId];
    if (!team) {
      return res.status(404).json({
        success: false,
        message: `Equipo con ID ${teamId} no encontrado`
      });
    }
    
    const results = {
      registration: null,
      challenge: null,
      solution: null
    };
    
    // Paso 1: Registrar el equipo si no está registrado
    if (!team.credentials.authToken) {
      // Construir la URL del endpoint de información del equipo
      const teamInfoURL = `http://${req.headers.host}/team-info`;
      
      // Registrar el equipo
      const regResult = await registerTeam(teamId, teamInfoURL);
      
      results.registration = {
        success: true,
        message: `Equipo ${team.teamName} registrado correctamente`
      };
    } else {
      results.registration = {
        success: true,
        message: `Equipo ${team.teamName} ya registrado`
      };
    }
    
    // Paso 2: Solicitar un desafío
    const challenge = await getChallenge(teamId);
    results.challenge = challenge;
    
    // Paso 3: Resolver el desafío
    const response = await solveChallenge(challenge.challengeId);
    
    // Paso 4: Enviar la solución
    const result = await submitSolution(challenge.challengeId, response);
    results.solution = {
      response,
      result
    };
    
    res.json({
      success: true,
      teamId,
      teamName: team.teamName,
      results
    });
  } catch (error) {
    console.error('Error en el flujo completo:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el flujo completo',
      error: error.message
    });
  }
});

/**
 * POST /reset-team
 * Reinicia el estado de un equipo, limpiando sus credenciales
 */
app.post('/reset-team', (req, res) => {
  try {
    const { teamId } = req.body;
    
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar un ID de equipo'
      });
    }
    
    // Reiniciar el equipo
    const result = resetTeam(teamId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error al reiniciar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reiniciar el estado del equipo',
      error: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor de equipos múltiples iniciado en puerto ${PORT}`);
  console.log(`Panel de control: http://localhost:${PORT}/`);
  console.log(`Equipos disponibles: ${teams.map(team => team.teamName).join(', ')}`);
});

module.exports = app;