/**
 * Ruta para reiniciar el juego
 * Elimina todos los nodos y desafíos actuales, restableciendo el estado
 */

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const { loadState, saveState } = require('../utils/fileIO');

// Ruta para el archivo de respaldo antes del reinicio
const BACKUP_DIR = path.join(__dirname, '../../data/backups');
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'judge-admin-2025';

/**
 * POST /restart - Reinicia el juego
 * 
 * Cuerpo de la solicitud:
 * {
 *   "secret": "clave-secreta-admin",
 *   "keepHistory": false // opcional, si es true guarda una copia del estado antes de reiniciar
 * }
 */
router.post('/', async (req, res) => {
  try {
    // Verificar la clave secreta
    const { secret, keepHistory = true } = req.body;
    
    if (!secret || secret !== ADMIN_SECRET) {
      console.warn('Intento de reinicio con clave inválida');
      return res.status(401).json({ 
        error: 'No autorizado', 
        message: 'Clave de administrador incorrecta'
      });
    }
    
    // Cargar el estado actual
    const currentState = await loadState();
    
    // Si se solicita guardar el historial, crear un backup
    if (keepHistory) {
      try {
        // Crear la carpeta de backups si no existe
        await fs.mkdir(BACKUP_DIR, { recursive: true });
        
        // Crear nombre de archivo con timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_DIR, `state-backup-${timestamp}.json`);
        
        // Guardar copia del estado actual
        await fs.writeFile(backupFile, JSON.stringify(currentState, null, 2), 'utf8');
        console.log(`Backup creado: ${backupFile}`);
      } catch (backupError) {
        console.error('Error al crear backup:', backupError);
        // No interrumpir el proceso de reinicio si falla el backup
      }
    }
    
    // Estadísticas del estado antes de reiniciar
    const stats = {
      previousNodes: currentState.nodes.length,
      previousChallenges: currentState.challenges.length,
      timestamp: new Date().toISOString()
    };
    
    // Crear nuevo estado limpio
    const newState = {
      nodes: [],
      challenges: [],
      history: currentState.history || [],
      lastRestart: {
        timestamp: new Date().toISOString(),
        nodeCount: currentState.nodes.length,
        challengeCount: currentState.challenges.length
      }
    };
    
    // Si hubiera históricos previos, conservarlos
    if (Array.isArray(currentState.history)) {
      newState.history = [...currentState.history];
    }
    
    // Agregar el estado actual al historial
    newState.history.push({
      timestamp: new Date().toISOString(),
      nodeCount: currentState.nodes.length,
      challengeCount: currentState.challenges.length
    });
    
    // Guardar el nuevo estado
    await saveState(newState);
    
    // Responder con estadísticas
    res.status(200).json({ 
      success: true, 
      message: 'Sistema reiniciado correctamente',
      stats
    });
    
    console.log(`Sistema reiniciado. Eliminados ${stats.previousNodes} nodos y ${stats.previousChallenges} desafíos.`);
  } catch (error) {
    console.error('Error al reiniciar el sistema:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

module.exports = router;
