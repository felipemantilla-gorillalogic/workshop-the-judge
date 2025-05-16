/**
 * Utilidad para limpiar nodos que permanecen en estado "connecting" por demasiado tiempo
 */

const { loadState, saveState } = require('./fileIO');

/**
 * Tiempo máximo (en milisegundos) que un nodo puede permanecer en estado "connecting"
 */
const MAX_CONNECTING_TIME = 10000; // 10 segundos

/**
 * Limpia los nodos que han estado en estado "connecting" por más del tiempo límite
 * @returns {Promise<Array>} Nodos que fueron eliminados
 */
async function cleanupStaleConnectingNodes() {
  try {
    // Cargar el estado actual
    const state = await loadState();
    const currentTime = Date.now();
    const removedNodes = [];

    // Filtrar nodos para remover aquellos en estado "connecting" por demasiado tiempo
    const updatedNodes = state.nodes.filter(node => {
      // Si el nodo no está en estado "connecting", lo mantenemos
      if (node.status !== 'connecting') {
        return true;
      }

      // Calcular cuánto tiempo ha estado en estado "connecting" utilizando el historial
      const connectionTime = currentTime - new Date(node.lastStatusChange).getTime();
      
      // Si ha estado demasiado tiempo, lo eliminamos
      if (connectionTime > MAX_CONNECTING_TIME) {
        console.log(`Eliminando nodo ${node.id} (${node.teamName}) por tiempo de conexión excedido: ${connectionTime}ms`);
        
        // Agregar información de eliminación al historial del nodo antes de eliminarlo
        const now = new Date().toISOString();
        
        // Actualizar la duración del último estado
        if (node.statusHistory && node.statusHistory.length > 0) {
          const lastStatusEntry = node.statusHistory[node.statusHistory.length - 1];
          if (lastStatusEntry.status === 'connecting') {
            lastStatusEntry.duration = connectionTime;
          }
        }
        
        // Agregar estado final de "removed_timeout"
        if (node.statusHistory) {
          node.statusHistory.push({
            status: 'removed_timeout',
            timestamp: now,
            duration: 0,
            reason: `Conexión excedida (${connectionTime}ms > ${MAX_CONNECTING_TIME}ms)`
          });
        }
        
        // Añadir a la lista de nodos eliminados
        removedNodes.push(node);
        return false;
      }
      
      return true;
    });

    // Si se eliminaron nodos, actualizar el estado
    if (removedNodes.length > 0) {
      state.nodes = updatedNodes;
      
      // Registrar en el historial general
      if (!state.history) {
        state.history = [];
      }
      
      state.history.push({
        action: 'auto_remove_stale_nodes',
        timestamp: new Date().toISOString(),
        removedNodeCount: removedNodes.length,
        removedNodeIds: removedNodes.map(node => node.id),
        removedNodes: removedNodes.map(node => ({
          id: node.id,
          teamName: node.teamName,
          statusHistory: node.statusHistory
        }))
      });
      
      await saveState(state);
      
      console.log(`Se eliminaron ${removedNodes.length} nodos en estado "connecting" por timeout`);
    }

    return removedNodes;
  } catch (error) {
    console.error('Error durante la limpieza de nodos:', error);
    return [];
  }
}

module.exports = {
  cleanupStaleConnectingNodes,
  MAX_CONNECTING_TIME
};
