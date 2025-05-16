// ControlPanel.jsx - Panel de control superpuesto
import React, { useState } from 'react';
import './ControlPanel.css';

const ControlPanel = ({ stats, teams = [], onRefresh, onRestart, onFinishGame, onSelectTeam }) => {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' o 'teams'
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <h1><i className="fas fa-gavel"></i> THE JUDGE</h1>
        <div className="control-buttons">
          <button className="finish-game-button" onClick={onFinishGame}>
            <i className="fas fa-trophy"></i> Finalizar Juego
          </button>
          <button className="restart-button" onClick={onRestart}>
            <i className="fas fa-redo-alt"></i> Reiniciar
          </button>
        </div>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`} 
          onClick={() => setActiveTab('stats')}
        >
          <i className="fas fa-chart-pie"></i> Estadísticas
        </button>
        <button 
          className={`tab ${activeTab === 'teams' ? 'active' : ''}`} 
          onClick={() => setActiveTab('teams')}
        >
          <i className="fas fa-users"></i> Equipos
        </button>
      </div>
      
      {activeTab === 'stats' ? (
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-users"></i></div>
          <div className="stat-content">
            <h3>{stats.total || 0}</h3>
            <p>Equipos Registrados</p>
          </div>
        </div>
        
        <div className="stat-card validated">
          <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
          <div className="stat-content">
            <h3>{stats.validated || 0}</h3>
            <p>Validados</p>
          </div>
        </div>
        
        <div className="stat-card challenging">
          <div className="stat-icon"><i className="fas fa-brain"></i></div>
          <div className="stat-content">
            <h3>{stats.challenging || 0}</h3>
            <p>En Desafío</p>
          </div>
        </div>
        
        <div className="stat-card connected">
          <div className="stat-icon"><i className="fas fa-plug"></i></div>
          <div className="stat-content">
            <h3>{stats.connected || 0}</h3>
            <p>Conectados</p>
          </div>
        </div>
        
        <div className="stat-card connecting">
          <div className="stat-icon"><i className="fas fa-spinner fa-pulse"></i></div>
          <div className="stat-content">
            <h3>{stats.connecting || 0}</h3>
            <p>Conectando</p>
          </div>
        </div>
        
        <div className="stat-card failed">
          <div className="stat-icon"><i className="fas fa-times-circle"></i></div>
          <div className="stat-content">
            <h3>{stats.failed || 0}</h3>
            <p>Fallidos</p>
          </div>
        </div>
      </div>
      ) : (
        <div className="teams-container">
          <div className="teams-filter">
            <input 
              type="text" 
              placeholder="Buscar equipo..." 
              className="team-search"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          
          <div className="teams-list">
            {teams.length === 0 ? (
              <div className="no-teams">No hay equipos disponibles</div>
            ) : (
              (() => {
                const filteredTeams = teams.filter(team => {
                  // Filtrar por término de búsqueda (nombre del equipo)
                  const searchMatch = !searchTerm ||
                    (team.teamName && team.teamName.toLowerCase().includes(searchTerm.toLowerCase()));
                  return searchMatch;
                });
                
                if (filteredTeams.length === 0) {
                  return <div className="no-teams">No se encontraron equipos que coincidan con la búsqueda</div>;
                }
                
                return filteredTeams.map((team) => (
                <div 
                  key={team.id} 
                  className={`team-item ${team.status}`}
                  onClick={() => onSelectTeam && onSelectTeam(team.id)}
                >
                  <div className="team-item-header">
                    {(team.logoURL || team.iconUrl) ? (
                      <img 
                        src={team.logoURL || team.iconUrl} 
                        alt={`${team.teamName} logo`} 
                        className="team-logo-small"
                        onError={(e) => { e.target.src = 'https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png' }}
                      />
                    ) : (
                      <div className="team-logo-placeholder">
                        {team.teamName ? team.teamName.charAt(0) : 'T'}
                      </div>
                    )}
                    <div className="team-item-info">
                      <h4>{team.teamName || "Equipo sin nombre"}</h4>
                      <div className="team-status-indicator">
                        <span className={`status-dot ${team.status}`}></span>
                        <span className="status-text">
                          {team.status === 'connected' && 'Conectado'}
                          {team.status === 'connecting' && 'Conectando'}
                          {team.status === 'challenging' && 'En Desafío'}
                          {team.status === 'challenged' && 'En Desafío'}
                          {team.status === 'validated' && 'Validado'}
                          {team.status === 'failed' && 'Fallido'}
                        </span>
                      </div>
                    </div>
                    <div className="team-score-badge">
                      {team.score || 0}
                    </div>
                  </div>
                </div>
              ));
              })()
            )}  
          </div>
        </div>
      )}
      
      <div className="footer-text">
        <p>Sistema de Validación IA Distribuida</p>
      </div>
    </div>
  );
};

export default ControlPanel;