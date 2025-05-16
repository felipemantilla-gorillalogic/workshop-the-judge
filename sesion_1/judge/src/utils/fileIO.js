/**
 * Utilidades para lectura y escritura de archivos
 */

const fs = require('fs').promises;
const path = require('path');

const STATE_FILE = path.join(__dirname, '../../data/state.json');

/**
 * Carga el estado del archivo JSON
 * @returns {Promise<Object>} Estado de la aplicación
 */
async function loadState() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Estado no encontrado, se creará uno nuevo');
      const initialState = { nodes: [], challenges: [] };
      await saveState(initialState);
      return initialState;
    }
    throw error;
  }
}

/**
 * Guarda el estado en el archivo JSON
 * @param {Object} data Datos a guardar
 * @returns {Promise<void>}
 */
async function saveState(data) {
  try {
    await fs.writeFile(STATE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error guardando estado:', error);
    throw error;
  }
}

module.exports = {
  loadState,
  saveState
};