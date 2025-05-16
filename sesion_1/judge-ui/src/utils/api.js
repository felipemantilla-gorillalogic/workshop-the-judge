// api.js - Funciones para llamadas a la API

// URL base (debería configurarse según el entorno)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3050';

/**
 * Obtener el estado global de todos los equipos
 * @param {AbortSignal} signal - Señal para cancelar la petición
 */
export const fetchStatus = async (signal) => {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, { signal });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    // Si es un error de cancelación, propagarlo adecuadamente
    if (error.name === 'AbortError') {
      console.log('Petición cancelada por timeout');
      throw error; // Mantener el error de tipo AbortError
    }
    
    console.error('Error fetching status:', error);
    throw error;
  }
};

/**
 * Obtener información detallada de un equipo específico
 */
export const fetchTeamDetails = async (teamId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/status/${teamId}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching team details for ${teamId}:`, error);
    throw error;
  }
};

/**
 * Obtener el ganador con análisis de IA
 */
export const fetchWinner = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/winner`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching winner:', error);
    throw error;
  }
};

/**
 * Reiniciar el sistema
 */
export const restartGame = async (secret, keepHistory = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}/restart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret,
        keepHistory
      })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, message: 'Clave de administrador incorrecta' };
      }
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Error restarting game:', error);
    return { success: false, message: 'Error de conexión con el servidor' };
  }
};

/**
 * Registrar un nuevo equipo (podría ser usado por la interfaz de administración)
 */
export const registerTeam = async (callbackURL) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ callbackURL })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error registering team:', error);
    throw error;
  }
};

/**
 * Obtener un desafío específico (podría ser usado por la interfaz de administración)
 */
export const fetchChallenge = async (challengeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/challenge/${challengeId}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching challenge ${challengeId}:`, error);
    throw error;
  }
};

/**
 * Desconectar un nodo específico
 */
export const disconnectNode = async (nodeId, secret, keepHistory = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}/disconnect/${nodeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret,
        keepHistory
      })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, message: 'Clave de administrador incorrecta' };
      }
      if (response.status === 404) {
        return { success: false, message: 'Nodo no encontrado' };
      }
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error(`Error disconnecting node ${nodeId}:`, error);
    return { success: false, message: 'Error de conexión con el servidor' };
  }
};