// RestartModal.jsx - Modal de reinicio del juego
import React, { useState } from 'react';
import './RestartModal.css';
import { restartGame } from '../../utils/api';

const RestartModal = ({ onClose, onRestart }) => {
  const [secret, setSecret] = useState('');
  const [keepHistory, setKeepHistory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!secret) {
      setError('Por favor, ingresa la clave de administrador');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await restartGame(secret, keepHistory);
      
      if (result.success) {
        alert('El juego ha sido reiniciado correctamente');
        onClose();
        onRestart();
      } else {
        setError(result.message || 'Error al reiniciar el juego');
      }
    } catch (err) {
      console.error('Error al reiniciar el juego:', err);
      setError('Error al comunicarse con el servidor');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="restart-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Reiniciar Juego</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="warning-box">
            <div className="warning-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="warning-text">
              <p>Esta acción reiniciará el estado del juego para todos los equipos.</p>
              <p>Se requiere autorización de administrador.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="secret">Clave de Administrador</label>
              <input
                type="password"
                id="secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Ingresa la clave secreta"
              />
            </div>
            
            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={keepHistory}
                  onChange={(e) => setKeepHistory(e.target.checked)}
                />
                <span className="checkmark"></span>
                Mantener historial de equipos
              </label>
              <small>Si se desmarca, se eliminará todo el historial de desafíos.</small>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="restart-button" disabled={loading}>
                {loading ? 'Reiniciando...' : 'Confirmar Reinicio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestartModal;