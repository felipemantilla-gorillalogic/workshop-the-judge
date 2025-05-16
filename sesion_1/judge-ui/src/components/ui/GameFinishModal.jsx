import React, { useState, useEffect } from 'react';
import './GameFinishModal.css';
import { fetchWinner } from '../../utils/api';
import confetti from 'canvas-confetti';

const GameFinishModal = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [winnerData, setWinnerData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Lanzar confeti para celebrar al ganador
  const shootConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Confeti desde ambos lados
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  };
  
  // Cargar datos del ganador al montar el componente
  useEffect(() => {
    const loadWinnerData = async () => {
      try {
        setLoading(true);
        const data = await fetchWinner();
        setWinnerData(data);
        setError(null);
        
        // Lanzar confeti cuando se carguen los datos
        if (data.success) {
          setTimeout(() => {
            shootConfetti();
          }, 500);
        }
      } catch (err) {
        console.error('Error cargando datos del ganador:', err);
        setError('No se pudieron cargar los resultados');
      } finally {
        setLoading(false);
      }
    };
    
    loadWinnerData();
  }, []);
  
  // Formatear tiempo en milisegundos a formato legible
  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === 'N/A') return 'N/A';
    return timeStr;
  };
  
  // Renderizar el podio de ganadores
  const renderPodium = () => {
    if (!winnerData || !winnerData.teams || winnerData.teams.length === 0) return null;
    
    // Ordenar equipos por puntuación
    const sortedTeams = [...winnerData.teams].sort((a, b) => b.score - a.score);
    
    // Obtener los 3 primeros equipos (o menos si no hay suficientes)
    const topTeams = sortedTeams.slice(0, Math.min(3, sortedTeams.length));
    
    // Encontrar al equipo ganador
    const winner = winnerData.winner;
    
    return (
      <div className="winner-podium">
        {topTeams.map((team, index) => {
          const position = index + 1;
          const isWinner = team.id === winner.id;
          
          return (
            <div 
              key={team.id} 
              className={`podium-position position-${position} ${isWinner ? 'winner' : ''}`}
              style={{ 
                order: position === 1 ? 2 : position === 2 ? 1 : 3 
              }}
            >
              <div className="position-number">{position}</div>
              <div className="team-avatar">
                <img 
                  src={team.logoURL || `https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png`} 
                  alt={team.teamName}
                  onError={(e) => { e.target.src = `https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png` }}
                />
                {isWinner && <div className="winner-crown"><i className="fas fa-crown"></i></div>}
              </div>
              <div className="podium-team-name">{team.teamName}</div>
              <div className="podium-score">{team.score} pts</div>
              <div className="podium-block" style={{ height: `${20 + (team.score * 0.8)}px` }}></div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Renderizar la tabla de clasificación completa
  const renderLeaderboard = () => {
    if (!winnerData || !winnerData.teams || winnerData.teams.length === 0) return null;
    
    // Ordenar equipos por puntuación
    const sortedTeams = [...winnerData.teams].sort((a, b) => b.score - a.score);
    
    return (
      <div className="leaderboard-container">
        <h3><i className="fas fa-list-ol"></i> Clasificación Final</h3>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Equipo</th>
              <th>Puntos</th>
              <th>Desafíos</th>
              <th>Tasa Éxito</th>
              <th>Prom. Punt.</th>
              <th>Tiempo Resp.</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr key={team.id} className={index === 0 ? 'winner-row' : ''}>
                <td className="position-cell">{index + 1}</td>
                <td className="team-cell">
                  <div className="team-cell-content">
                    <img 
                      src={team.logoURL || `https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png`} 
                      alt={team.teamName}
                      className="team-mini-avatar"
                      onError={(e) => { e.target.src = `https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png` }}
                    />
                    <span>{team.teamName}</span>
                    {index === 0 && <i className="fas fa-trophy winner-trophy"></i>}
                  </div>
                </td>
                <td className="score-cell">{team.score}</td>
                <td>{team.successfulChallenges}/{team.totalChallenges}</td>
                <td>{team.successRate.toFixed(0)}%</td>
                <td>{team.averageScore.toFixed(1)}</td>
                <td>{formatTime(team.averageResolutionTimeFormatted)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="game-finish-modal">
      <div className="finish-modal-content">
        <div className="finish-modal-header">
          <h2><i className="fas fa-trophy"></i> Resultados Finales</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Analizando resultados...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="finish-modal-body">
            <div className="tabs-container">
              <div className="tabs-header">
                <button 
                  className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  <i className="fas fa-trophy"></i> Resumen
                </button>
                <button 
                  className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analysis')}
                >
                  <i className="fas fa-chart-bar"></i> Análisis Detallado
                </button>
                <button 
                  className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('leaderboard')}
                >
                  <i className="fas fa-list-ol"></i> Tabla de Posiciones
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'summary' && (
                  <div className="tab-pane">
                    <div className="winner-announcement">
                      <h3>¡Tenemos un Ganador!</h3>
                      <div className="winner-name">
                        <span>{winnerData.winner.teamName}</span>
                      </div>
                      <div className="winner-score">{winnerData.winner.score} PUNTOS</div>
                    </div>
                    
                    {renderPodium()}
                    
                    <div className="winner-summary">
                      <h3>Análisis del Ganador</h3>
                      <p>
                        {/* Buscar el párrafo en el análisis que menciona al equipo ganador */}
                        {(() => {
                          // Intentar encontrar un párrafo que claramente mencione al ganador
                          const paragraphs = winnerData.aiAnalysis.split('\n\n');
                          
                          // Buscar la explicación detallada sobre el ganador (usualmente el tercer párrafo)
                          // pero verifiquemos que realmente mencione al equipo ganador correcto
                          const explanationParagraph = paragraphs.find(p => 
                            p.includes(`${winnerData.winner.teamName}`) && 
                            (p.includes('ganador') || p.includes('primer lugar') || p.includes('victoria'))
                          );
                          
                          if (explanationParagraph) {
                            return explanationParagraph;
                          } else {
                            // Si no encontramos un párrafo adecuado, generamos uno de respaldo
                            return `El equipo ${winnerData.winner.teamName} ha demostrado un rendimiento excepcional 
                            a lo largo de la competencia, logrando la puntuación más alta con un total de 
                            ${winnerData.winner.score} puntos. Su destacada participación y efectividad 
                            en la resolución de desafíos los ha convertido en los campeones indiscutibles.`;
                          }
                        })()} 
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'analysis' && (
                  <div className="tab-pane">
                    <div className="ai-analysis">
                      <h3><i className="fas fa-robot"></i> Análisis de Inteligencia Artificial</h3>
                      <div className="analysis-content">
                        {(() => {
                          // Comprobar si el análisis de IA menciona correctamente al ganador
                          const paragraphs = winnerData.aiAnalysis.split('\n\n');
                          
                          // Si alguna parte del análisis parece contradecir al ganador oficial,
                          // mejor generamos un análisis estándar propio
                          const hasContradiction = paragraphs.some(p => {
                            // Buscar párrafos que mencionen a algún otro equipo como ganador
                            const mentionsOtherTeamAsWinner = winnerData.teams
                              .filter(team => team.id !== winnerData.winner.id)
                              .some(team => 
                                p.includes(team.teamName) && 
                                (p.includes('ganador') || p.includes('primer lugar') || p.includes('victoria'))
                              );
                            return mentionsOtherTeamAsWinner;
                          });
                          
                          if (hasContradiction) {
                            // Si hay contradicción, generamos nuestro propio análisis
                            const winner = winnerData.winner;
                            const winnerTeamData = winnerData.teams.find(t => t.id === winner.id);
                            
                            // Analizar si hubo empate
                            const tiedTeams = winnerData.teams.filter(t => t.score === winner.score);
                            const hasTie = tiedTeams.length > 1;
                            
                            // Generar análisis personalizado
                            return [
                              <p key="announcement">
                                <strong>¡Tenemos un ganador!</strong> Tras un exhaustivo análisis, 
                                el equipo <strong>{winner.teamName}</strong> se proclama como el campeón 
                                de esta competencia de inteligencia artificial con un impresionante total 
                                de {winner.score} puntos.
                              </p>,
                              <p key="ranking">
                                <strong>Ranking final:</strong> {winnerData.teams
                                  .sort((a, b) => b.score - a.score)
                                  .map((team, idx) => 
                                    `${idx+1}. ${team.teamName} (${team.score} pts)`
                                  ).join(', ')}
                              </p>,
                              <p key="explanation">
                                <strong>Explicación detallada:</strong> {winner.teamName} ha demostrado un 
                                rendimiento excepcional a lo largo de la competencia. 
                                Con una tasa de éxito del {winnerTeamData.successRate.toFixed(0)}% en la resolución 
                                de desafíos y un tiempo promedio de resolución de {winnerTeamData.averageResolutionTimeFormatted}, 
                                este equipo ha destacado por su eficiencia y precisión.
                                {hasTie ? ` Aunque hubo un empate en puntuación con ${tiedTeams
                                  .filter(t => t.id !== winner.id)
                                  .map(t => t.teamName)
                                  .join(', ')}, ${winner.teamName} ganó por tener el mejor tiempo promedio de resolución.` : ''}
                              </p>,
                              <p key="mentions">
                                <strong>Menciones especiales:</strong> Todos los equipos han demostrado gran 
                                habilidad y dedicación. {winnerData.teams
                                  .filter(t => t.id !== winner.id)
                                  .slice(0, 2)
                                  .map(t => 
                                    `${t.teamName} destacó en ${t.successfulChallenges} desafíos completados con éxito.`
                                  ).join(' ')}
                              </p>,
                              <p key="stats">
                                <strong>Estadísticas notables:</strong> En total, todos los equipos resolvieron 
                                {winnerData.teams.reduce((sum, t) => sum + t.successfulChallenges, 0)} desafíos 
                                con un tiempo promedio de {winnerData.teams
                                  .filter(t => t.averageResolutionTimeMs > 0)
                                  .reduce((sum, t) => sum + t.averageResolutionTimeMs, 0) / 
                                  winnerData.teams.filter(t => t.averageResolutionTimeMs > 0).length / 1000} segundos.
                              </p>
                            ];
                          } else {
                            // Si no hay contradicción, usamos el análisis de la IA
                            return paragraphs.map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ));
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'leaderboard' && (
                  <div className="tab-pane">
                    {renderLeaderboard()}
                    
                    <div className="stats-cards">
                      <h3><i className="fas fa-chart-line"></i> Estadísticas Destacadas</h3>
                      <div className="stats-grid">
                        {winnerData.teams.map(team => (
                          <div key={team.id} className="stat-card">
                            <div className="stat-card-header">
                              <img 
                                src={team.logoURL || `https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png`} 
                                alt={team.teamName}
                                className="team-mini-avatar"
                                onError={(e) => { e.target.src = `https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png` }}
                              />
                              <h4>{team.teamName}</h4>
                            </div>
                            <div className="stat-card-content">
                              <div className="stat-item">
                                <div className="stat-label">Total desafíos:</div>
                                <div className="stat-value">{team.totalChallenges}</div>
                              </div>
                              <div className="stat-item">
                                <div className="stat-label">Completados:</div>
                                <div className="stat-value">{team.successfulChallenges}</div>
                              </div>
                              <div className="stat-item">
                                <div className="stat-label">Fallidos:</div>
                                <div className="stat-value">{team.failedChallenges}</div>
                              </div>
                              <div className="stat-item">
                                <div className="stat-label">Tasa de éxito:</div>
                                <div className="stat-value">{team.successRate.toFixed(0)}%</div>
                              </div>
                              <div className="stat-item">
                                <div className="stat-label">Tiempo promedio:</div>
                                <div className="stat-value">{formatTime(team.averageResolutionTimeFormatted)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="finish-actions">
              <button className="download-report-btn" onClick={() => window.print()}>
                <i className="fas fa-download"></i> Descargar Reporte
              </button>
              <button className="close-finish-btn" onClick={onClose}>
                <i className="fas fa-times-circle"></i> Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameFinishModal;