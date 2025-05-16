/**
 * Ruta para desconectar un nodo específico del juego
 */

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const { loadState, saveState } = require('../utils/fileIO');

// Ruta para el archivo de respaldo antes de la desconexión
const BACKUP_DIR = path.join(__dirname, '../../data/backups');
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'judge-admin-2025';

/**
 * POST /disconnect/:id - Desconecta un nodo específico del juego
 * 
 * Cuerpo de la solicitud:
 * {
 *   "secret": "clave-secreta-admin",
 *   "keepHistory": true // opcional, si es true guarda una copia del estado antes de la desconexión
 * }
 */
router.post('/:id', async (req, res) => {
  try {
    // Obtener el ID del nodo a desconectar
    const nodeId = req.params.id;
    
    // Verificar la clave secreta
    const { secret, keepHistory = true } = req.body;
    
    if (!secret || secret !== ADMIN_SECRET) {
      console.warn(`Intento de desconexión del nodo ${nodeId} con clave inválida`);
      return res.status(401).json({ 
        error: 'No autorizado', 
        message: 'Clave de administrador incorrecta'
      });
    }
    
    // Cargar el estado actual
    const currentState = await loadState();
    
    // Verificar si el nodo existe
    const nodeIndex = currentState.nodes.findIndex(node => node.id === nodeId);
    
    if (nodeIndex === -1) {
      return res.status(404).json({
        error: 'Nodo no encontrado',
        message: `No se encontró un nodo con ID ${nodeId}`
      });
    }
    
    // Obtener el nodo a desconectar
    const nodeToDisconnect = currentState.nodes[nodeIndex];
    
    // Si se solicita guardar el historial, crear un backup
    if (keepHistory) {
      try {
        // Crear la carpeta de backups si no existe
        await fs.mkdir(BACKUP_DIR, { recursive: true });
        
        // Crear nombre de archivo con timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_DIR, `node-disconnect-${nodeId}-${timestamp}.json`);
        
        // Guardar copia del estado actual
        await fs.writeFile(backupFile, JSON.stringify(currentState, null, 2), 'utf8');
        console.log(`Backup creado: ${backupFile}`);
      } catch (backupError) {
        console.error('Error al crear backup:', backupError);
        // No interrumpir el proceso de desconexión si falla el backup
      }
    }
    
    // Eliminar el nodo del arreglo de nodos
    const now = new Date().toISOString();
    
    // Actualizar la duración del último estado si existe historial
    if (nodeToDisconnect.statusHistory && nodeToDisconnect.statusHistory.length > 0) {
      const lastStatusEntry = nodeToDisconnect.statusHistory[nodeToDisconnect.statusHistory.length - 1];
      const lastStatusTime = new Date(lastStatusEntry.timestamp).getTime();
      const currentTime = new Date().getTime();
      lastStatusEntry.duration = currentTime - lastStatusTime;
    }
    
    // Agregar estado final de "disconnected"
    if (nodeToDisconnect.statusHistory) {
      nodeToDisconnect.statusHistory.push({
        status: 'disconnected',
        timestamp: now,
        duration: 0,
        reason: 'Desconexión manual por administrador'
      });
    }
    
    // Agregar información de desconexión en el historial general
    if (!currentState.history) {
      currentState.history = [];
    }
    
    currentState.history.push({
      action: 'manual_disconnect_node',
      timestamp: now,
      nodeId: nodeId,
      teamName: nodeToDisconnect.teamName,
      previousStatus: nodeToDisconnect.status
    });
    
    // Eliminar el nodo del arreglo
    currentState.nodes.splice(nodeIndex, 1);
    
    // Guardar el estado actualizado
    await saveState(currentState);
    
    // Responder con éxito
    res.status(200).json({ 
      success: true, 
      message: `Nodo ${nodeId} (${nodeToDisconnect.teamName}) desconectado correctamente`,
      nodeDetails: {
        id: nodeToDisconnect.id,
        teamName: nodeToDisconnect.teamName,
        previousStatus: nodeToDisconnect.status
      }
    });
    
    console.log(`Nodo ${nodeId} (${nodeToDisconnect.teamName}) desconectado manualmente.`);
  } catch (error) {
    console.error('Error al desconectar el nodo:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

module.exports = router;