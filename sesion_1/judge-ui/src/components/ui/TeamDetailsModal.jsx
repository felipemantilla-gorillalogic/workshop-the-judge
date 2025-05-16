import React, { useState, useEffect } from 'react';
import './TeamDetailsModal.css';
import { fetchTeamDetails } from '../../utils/api';
import DisconnectModal from './DisconnectModal';

const TeamDetailsModal = ({ team, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [activeTab, setActiveTab] = useState('challenges'); // Tabs: challenges, statusHistory
  
  // Función para mostrar el modal de desconexión
  const handleShowDisconnectModal = () => {
    setShowDisconnectModal(true);
  };
  
  // Función para cerrar el modal de desconexión
  const handleCloseDisconnectModal = () => {
    setShowDisconnectModal(false);
  };
  
  // Manejar la desconexión exitosa
  const handleDisconnectSuccess = () => {
    onClose(); // Cerrar el modal de detalles del equipo
  };
  
  // Cargar detalles del equipo
  useEffect(() => {
    const loadTeamDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchTeamDetails(team.id);
        setDetails(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando detalles del equipo:', err);
        setError('No se pudieron cargar los detalles del equipo');
      } finally {
        setLoading(false);
      }
    };
    
    loadTeamDetails();
  }, [team.id]);
  
  // Determinar clase de estado
  const getStatusClass = (status) => {
    const statusMap = {
      'connected': 'status-connected',
      'challenged': 'status-challenged',
      'challenging': 'status-challenged',
      'validated': 'status-validated',
      'failed': 'status-failed',
      'connecting': 'status-connecting'
    };
    return statusMap[status] || '';
  };
  
  // Texto legible del estado
  const getStatusText = (status) => {
    const statusMap = {
      'connected': 'Conectado',
      'challenged': 'En Desafío',
      'challenging': 'En Desafío',
      'validated': 'Validado',
      'failed': 'Fallido',
      'connecting': 'Conectando'
    };
    return statusMap[status] || status;
  };

  // Formatear fecha y hora
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Formatear duración
  const formatDuration = (durationMs) => {
    if (!durationMs) return 'En curso';
    
    const seconds = Math.floor(durationMs / 1000);
    if (seconds < 60) return `${seconds} seg`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes} min ${remainingSeconds} seg`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} h ${remainingMinutes} min`;
  };
  
  return (
    <div className="team-details-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Detalles del Equipo</h2>
          <div className="modal-actions">
            <button 
              className="disconnect-button" 
              onClick={handleShowDisconnectModal}
              title="Desconectar este equipo"
            >
              <i className="fas fa-plug"></i> Desconectar
            </button>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
        </div>
        
        <div className="team-header">
          <img 
            className="team-logo" 
            src={team.logoURL || team.iconUrl || 'https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png'}
            alt={`${team.teamName} logo`}
            onError={(e) => { e.target.src = 'https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png' }}
          />
          <div className="team-info">
            <h3>{team.teamName}</h3>
            <div className={`team-status ${getStatusClass(team.status)}`}>
              <span className="status-indicator"></span>
              {getStatusText(team.status)}
            </div>
            <div className="team-score">
              <span>{team.score || 0}</span>
              <small>puntos</small>
            </div>
            {details?.team?.createdAt && (
              <div className="team-registration-time">
                <small>Registrado: {formatDateTime(details.team.createdAt)}</small>
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando detalles...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="team-details">
            <div className="team-description">
              <h4>Descripción</h4>
              <p>{team.teamDescription || 'Sin descripción'}</p>
            </div>
            
            {team.members && team.members.length > 0 && (
              <div className="team-members">
                <h4>Miembros</h4>
                <div className="members-list">
                  {team.members.map((member, index) => (
                    <span key={index} className="member-badge">{member}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Pestañas de navegación */}
            <div className="tabs-container">
              <div className="tabs-header">
                <button 
                  className={`tab-button ${activeTab === 'challenges' ? 'active' : ''}`}
                  onClick={() => setActiveTab('challenges')}
                >
                  <i className="fas fa-trophy"></i> Desafíos
                </button>
                <button 
                  className={`tab-button ${activeTab === 'statusHistory' ? 'active' : ''}`}
                  onClick={() => setActiveTab('statusHistory')}
                >
                  <i className="fas fa-history"></i> Historial de Estados
                </button>
              </div>
              
              {/* Contenido de las pestañas */}
              <div className="tab-content">
                {/* Pestaña de Desafíos */}
                {activeTab === 'challenges' && (
                  <div className="tab-pane">
                    {/* Mostrar el desafío actual si está en estado "challenged" */}
                    {(team.status === 'challenged' || team.status === 'challenging') && details.currentChallenge && (
                      <div className="current-challenge">
                        <h4><i className="fas fa-bolt"></i> Desafío Actual</h4>
                        <div className="challenge-card">
                          <div className="challenge-header">
                            <span className="challenge-timestamp">{formatDateTime(details.currentChallenge.timestamp)}</span>
                          </div>
                          <p className="challenge-title">{details.currentChallenge.challenge}</p>
                          <div className="challenge-input">{details.currentChallenge.input}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Desafíos completados */}
                    {details.challenges && details.challenges.length > 0 ? (
                      <div className="team-challenges">
                        <h4><i className="fas fa-check-circle"></i> Desafíos Completados</h4>
                        <div className="challenges-list">
                          {details.challenges.map((challenge, index) => (
                            <div key={index} className={`challenge-card ${challenge.passed ? 'success' : 'failed'}`}>
                              <div className="challenge-header">
                                <span className={`challenge-result-badge ${challenge.passed ? 'success' : 'failed'}`}>
                                  {challenge.passed ? 'Exitoso' : 'Fallido'}
                                </span>
                                <span className="challenge-timestamp">{formatDateTime(challenge.completedAt)}</span>
                                <span className="challenge-score">{challenge.score} puntos</span>
                              </div>
                              <p className="challenge-title">{challenge.challenge}</p>
                              <div className="challenge-input">{challenge.input}</div>
                              <div className="challenge-response">
                                <h5>Respuesta:</h5>
                                <p>{challenge.response}</p>
                              </div>
                              <div className="challenge-feedback">
                                <h5>Feedback:</h5>
                                <p>{challenge.feedback}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="no-challenges">
                        <p>Este equipo aún no ha completado ningún desafío.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Pestaña de Historial de Estados */}
                {activeTab === 'statusHistory' && (
                  <div className="tab-pane">
                    <div className="status-history">
                      <h4><i className="fas fa-history"></i> Historial de Estados</h4>
                      {details.team && details.team.statusHistory && details.team.statusHistory.length > 0 ? (
                        <table className="status-history-table">
                          <thead>
                            <tr>
                              <th>Estado</th>
                              <th>Inicio</th>
                              <th>Duración</th>
                              <th>Estado Anterior</th>
                              <th>Detalles</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...details.team.statusHistory].reverse().map((entry, index) => (
                              <tr key={index} className={`status-row ${getStatusClass(entry.status)}`}>
                                <td>
                                  <span className="status-cell">
                                    <span className="status-dot"></span>
                                    {getStatusText(entry.status)}
                                  </span>
                                </td>
                                <td>{formatDateTime(entry.timestamp)}</td>
                                <td>{formatDuration(entry.duration)}</td>
                                <td>{entry.previousStatus ? getStatusText(entry.previousStatus) : '-'}</td>
                                <td className="status-details">
                                  {entry.challengeId && <div><strong>Challenge ID:</strong> {entry.challengeId}</div>}
                                  {entry.challengeType && <div><strong>Tipo:</strong> {entry.challengeType}</div>}
                                  {entry.score !== undefined && <div><strong>Puntuación:</strong> {entry.score}</div>}
                                  {entry.result && <div><strong>Resultado:</strong> {entry.result}</div>}
                                  {entry.feedback && <div><strong>Feedback:</strong> {entry.feedback}</div>}
                                  {entry.message && <div><strong>Mensaje:</strong> {entry.message}</div>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="no-history">
                          <p>No hay historial de estados disponible.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de desconexión */}
      {showDisconnectModal && (
        <DisconnectModal 
          team={team} 
          onClose={handleCloseDisconnectModal}
          onDisconnect={handleDisconnectSuccess}
        />
      )}
    </div>
  );
};

export default TeamDetailsModal;