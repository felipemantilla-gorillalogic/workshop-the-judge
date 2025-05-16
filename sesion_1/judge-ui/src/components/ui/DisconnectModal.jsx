// DisconnectModal.jsx - Modal para desconectar un equipo
import React, { useState } from 'react';
import './DisconnectModal.css'; // Usamos nuestro propio archivo CSS
import './RestartModal.css'; // Mantenemos los estilos base
import { disconnectNode } from '../../utils/api';
import ModalPortal from './ModalPortal';

const DisconnectModal = ({ team, onClose, onDisconnect }) => {
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
      
      const result = await disconnectNode(team.id, secret, keepHistory);
      
      if (result.success) {
        alert(`El equipo "${team.teamName}" ha sido desconectado correctamente`);
        onClose();
        onDisconnect();
      } else {
        setError(result.message || 'Error al desconectar el equipo');
      }
    } catch (err) {
      console.error('Error al desconectar el equipo:', err);
      setError('Error al comunicarse con el servidor');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ModalPortal>
      <div className="restart-modal"> {/* Reutilizamos clases de estilos */}
        <div className="modal-content">
          <div className="modal-header">
            <h2>Desconectar Equipo</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          
          <div className="modal-body">
            <div className="warning-box">
              <div className="warning-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="warning-text">
                <p>Esta acción desconectará al equipo <strong>{team.teamName}</strong> del juego.</p>
                <p>El equipo será eliminado y ya no podrá participar a menos que vuelva a registrarse.</p>
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
                  Mantener historial (crear backup)
                </label>
                <small>Si se desmarca, no se creará copia de seguridad del estado actual.</small>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="restart-button" disabled={loading} style={{ backgroundColor: '#d32f2f' }}>
                  {loading ? 'Desconectando...' : 'Confirmar Desconexión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default DisconnectModal;