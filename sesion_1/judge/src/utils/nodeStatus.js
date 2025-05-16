/**
 * Utilidades para gestionar cambios de estado de los nodos
 */

const { loadState, saveState } = require('./fileIO');

/**
 * Actualiza el estado de un nodo y registra el cambio en su historial
 * @param {string} nodeId - ID del nodo a actualizar
 * @param {string} newStatus - Nuevo estado del nodo
 * @param {Object} [additionalData={}] - Datos adicionales opcionales para el registro de historial
 * @returns {Promise<Object|null>} Nodo actualizado o null si no se encontró
 */
async function updateNodeStatus(nodeId, newStatus, additionalData = {}) {
  try {
    // Cargar el estado actual
    const state = await loadState();
    
    // Buscar el nodo
    const nodeIndex = state.nodes.findIndex(node => node.id === nodeId);
    if (nodeIndex === -1) {
      console.log(`No se encontró el nodo con ID ${nodeId} para actualizar estado`);
      return null;
    }
    
    const node = state.nodes[nodeIndex];
    const now = new Date().toISOString();
    const previousStatus = node.status;
    
    // Si el estado es el mismo, no hacer nada
    if (previousStatus === newStatus) {
      console.log(`El nodo ${nodeId} ya tiene el estado ${newStatus}`);
      return node;
    }
    
    // Actualizar la duración del estado anterior en el historial
    if (node.statusHistory && node.statusHistory.length > 0) {
      const lastStatusEntry = node.statusHistory[node.statusHistory.length - 1];
      if (!lastStatusEntry.duration) {
        const startTime = new Date(lastStatusEntry.timestamp).getTime();
        const endTime = new Date(now).getTime();
        lastStatusEntry.duration = endTime - startTime;
      }
    }
    
    // Actualizar estado actual del nodo
    node.status = newStatus;
    node.lastStatusChange = now;
    
    // Actualizar campos adicionales si están presentes
    if (additionalData.score !== undefined) {
      // Opción 1: Reemplazar el puntaje
      // node.score = additionalData.score;
      
      // Opción 2: Acumular puntaje (cada desafío suma puntos)
      node.score = (node.score || 0) + additionalData.score;
      console.log(`Actualizando puntaje del nodo ${nodeId} a ${node.score} (sumando ${additionalData.score} puntos)`);
    }
    
    // Registrar la transición en el historial
    if (!node.statusHistory) {
      node.statusHistory = [];
    }
    
    // Agregar nueva entrada al historial
    node.statusHistory.push({
      status: newStatus,
      timestamp: now,
      duration: null, // Se calculará cuando cambie a otro estado
      previousStatus,
      ...additionalData
    });
    
    // Guardar cambios
    await saveState(state);
    
    console.log(`Nodo ${nodeId} (${node.teamName}): Estado actualizado de ${previousStatus} a ${newStatus}`);
    return node;
  } catch (error) {
    console.error(`Error actualizando estado del nodo ${nodeId}:`, error);
    return null;
  }
}

/**
 * Obtiene la duración en milisegundos que un nodo ha estado en su estado actual
 * @param {Object} node - Objeto del nodo
 * @returns {number} Duración en milisegundos
 */
function getCurrentStateDuration(node) {
  if (!node || !node.lastStatusChange) {
    return 0;
  }
  
  const startTime = new Date(node.lastStatusChange).getTime();
  const now = Date.now();
  return now - startTime;
}

module.exports = {
  updateNodeStatus,
  getCurrentStateDuration
};
