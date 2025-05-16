// App.jsx - Componente principal de la aplicación
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import MainScene from './components/3d/MainScene';
import ControlPanel from './components/ui/ControlPanel';
import TeamDetailsModal from './components/ui/TeamDetailsModal';
import RestartModal from './components/ui/RestartModal';
import LoadingScreen from './components/ui/LoadingScreen';
import { fetchStatus } from './utils/api';

const App = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    validated: 0,
    challenged: 0,
    failed: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
    
    // Configurar actualización periódica
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Función para cargar datos
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchStatus();
      setTeams(data.nodes || []);
      
      // Calcular estadísticas
      const validatedCount = data.nodes.filter(node => node.status === 'validated').length;
      const challengedCount = data.nodes.filter(node => node.status === 'challenged').length;
      const failedCount = data.nodes.filter(node => node.status === 'failed').length;
      
      setStats({
        total: data.nodes.length,
        validated: validatedCount,
        challenged: challengedCount,
        failed: failedCount
      });
      
      setError(null);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección de equipo
  const handleTeamSelect = (teamId) => {
    if (selectedTeam === teamId) {
      setSelectedTeam(null);
    } else {
      setSelectedTeam(teamId);
    }
  };

  // Equipo seleccionado
  const selectedTeamData = selectedTeam 
    ? teams.find(team => team.id === selectedTeam) 
    : null;

  return (
    <div className="app-container">
      {/* Canvas 3D para Three.js */}
      <Canvas shadows camera={{ position: [0, 30, 30], fov: 50 }}>
        <color attach="background" args={['#0a1929']} />
        
        {/* Iluminación */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        
        {/* Fondo */}
        <Stars radius={100} depth={50} count={5000} factor={4} />
        
        {/* Escena principal */}
        <MainScene 
          teams={teams} 
          onSelectTeam={handleTeamSelect} 
          selectedTeam={selectedTeam}
        />
        
        {/* Mensaje de error */}
        {error && (
          <Html center position={[0, 0, 0]}>
            <div className="error-message">
              {error}
              <button onClick={loadData}>Reintentar</button>
            </div>
          </Html>
        )}
        
        {/* Controles de cámara */}
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
      </Canvas>
      
      {/* Panel de control superpuesto */}
      <ControlPanel 
        stats={stats}
        onRefresh={loadData}
        onRestart={() => setShowRestartModal(true)}
      />
      
      {/* Modal de detalles del equipo */}
      {selectedTeamData && (
        <TeamDetailsModal 
          team={selectedTeamData} 
          onClose={() => setSelectedTeam(null)} 
        />
      )}
      
      {/* Modal de reinicio */}
      {showRestartModal && (
        <RestartModal 
          onClose={() => setShowRestartModal(false)} 
          onRestart={loadData} 
        />
      )}
      
      {/* Pantalla de carga */}
      {loading && <LoadingScreen />}
    </div>
  );
};

export default App;

// components/3d/MainScene.jsx
import React from 'react';
import TeamNode from './TeamNode';
import CentralTower from './CentralTower';
import ChallengeBeam from './ChallengeBeam';

const MainScene = ({ teams, onSelectTeam, selectedTeam }) => {
  // Distribuir equipos en un círculo
  const calculatePosition = (index, total) => {
    const radius = Math.max(15, total * 2); // Radio adaptativo según cantidad de equipos
    const angle = (index / total) * Math.PI * 2;
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ];
  };
  
  return (
    <group>
      {/* Torre central */}
      <CentralTower position={[0, 0, 0]} />
      
      {/* Piso/grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
          color="#101624" 
          metalness={0.8}
          roughness={0.5}
          wireframe
        />
      </mesh>
      
      {/* Equipos y sus conexiones */}
      {teams.map((team, index) => (
        <React.Fragment key={team.id}>
          <TeamNode
            team={team}
            position={calculatePosition(index, teams.length)}
            onClick={() => onSelectTeam(team.id)}
            selected={team.id === selectedTeam}
          />
          
          {/* Conexión visual para equipos en desafío */}
          {team.status === 'challenged' && (
            <ChallengeBeam
              start={calculatePosition(index, teams.length)}
              end={[0, 10, 0]} // Punta de la torre central
              color="#ff9800"
            />
          )}
        </React.Fragment>
      ))}
    </group>
  );
};

export default MainScene;

// components/3d/TeamNode.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import { gsap } from 'gsap';

// Configuraciones visuales según estado
const STATUS_CONFIGS = {
  connected: {
    color: '#2196f3',
    intensity: 1.5,
    pulsate: true,
    height: 0,
    particleColor: '#57c1ff'
  },
  challenged: {
    color: '#ff9800',
    intensity: 2.2,
    pulsate: false,
    height: 0.5,
    particleColor: '#ffcc80'
  },
  validated: {
    color: '#4caf50',
    intensity: 2.0,
    pulsate: false,
    height: 1.2,
    particleColor: '#a5d6a7'
  },
  failed: {
    color: '#f44336',
    intensity: 1.8,
    pulsate: true,
    height: -0.5,
    particleColor: '#e57373'
  }
};

const TeamNode = ({ team, position, onClick, selected }) => {
  const nodeRef = useRef();
  const lightRef = useRef();
  const particlesRef = useRef();
  const [hovered, setHovered] = useState(false);
  const statusConfig = STATUS_CONFIGS[team.status];
  
  // Cargar logo como textura
  const logo = useTexture(team.logoURL || '/placeholder-logo.png');
  
  // Manejar cambios de estado
  useEffect(() => {
    if (nodeRef.current) {
      // Animar cambio de altura según estado
      gsap.to(nodeRef.current.position, {
        y: statusConfig.height,
        duration: 1.2,
        ease: 'elastic.out(1, 0.75)'
      });
      
      // Animar cambio de escala según puntuación
      const scale = 1 + (team.score / 100) * 0.5;
      gsap.to(nodeRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 0.8
      });
    }
  }, [team.status, team.score, statusConfig.height]);
  
  // Animaciones continuas
  useFrame((state, delta) => {
    if (lightRef.current) {
      // Efecto de pulsación si corresponde al estado
      if (statusConfig.pulsate) {
        lightRef.current.intensity = 
          statusConfig.intensity * (1 + 0.2 * Math.sin(state.clock.elapsedTime * 2));
      }
      
      // Rotación suave constante
      nodeRef.current.rotation.y += delta * 0.1;
      
      // Animar partículas
      if (particlesRef.current && particlesRef.current.children) {
        particlesRef.current.children.forEach((particle, i) => {
          // Movimiento orbital
          const time = state.clock.elapsedTime + i * 0.2;
          const radius = 2 + i * 0.05;
          particle.position.x = Math.cos(time) * radius;
          particle.position.z = Math.sin(time) * radius;
          particle.position.y = Math.sin(time * 2) * 0.5;
        });
      }
    }
  });
  
  // Partículas según estado
  const renderParticles = () => {
    const particleCount = team.status === 'validated' ? 12 : 
                         team.status === 'challenged' ? 8 : 5;
    
    return Array.from({ length: particleCount }).map((_, i) => (
      <mesh key={i} position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={statusConfig.particleColor} />
      </mesh>
    ));
  };
  
  return (
    <group position={position}>
      {/* Base flotante */}
      <group 
        ref={nodeRef} 
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Plataforma base */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <cylinderGeometry args={[2, 2.2, 0.2, 8]} />
          <meshStandardMaterial 
            color={hovered ? '#ffffff' : '#aaaaaa'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Estructura central con logo */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1, 1.5]} />
          <meshStandardMaterial map={logo} />
        </mesh>
        
        {/* Partículas orbitales */}
        <group ref={particlesRef}>
          {renderParticles()}
        </group>
        
        {/* Luz de estado */}
        <pointLight
          ref={lightRef}
          position={[0, 2, 0]}
          color={statusConfig.color}
          intensity={statusConfig.intensity}
          distance={10}
        />
        
        {/* Aura según estado */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2.3, 16, 16]} />
          <meshBasicMaterial
            color={statusConfig.color}
            transparent={true}
            opacity={0.15}
          />
        </mesh>
        
        {/* Indicador de puntuación */}
        <Html position={[0, 2.5, 0]} center>
          <div className="score-badge">
            {team.score}
          </div>
        </Html>
        
        {/* Efecto de selección */}
        {selected && (
          <mesh position={[0, -0.2, 0]}>
            <ringGeometry args={[2.3, 2.5, 32]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        )}
        
        {/* Título flotante */}
        <Html position={[0, -2, 0]} center>
          <div className="team-name-badge">
            {team.teamName}
          </div>
        </Html>
      </group>
    </group>
  );
};

export default TeamNode;

// components/3d/CentralTower.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const CentralTower = ({ position }) => {
  const towerRef = useRef();
  const ringsRef = useRef();
  
  // Animación de la torre
  useFrame((state, delta) => {
    if (towerRef.current) {
      // Rotación lenta
      towerRef.current.rotation.y += delta * 0.1;
    }
    
    if (ringsRef.current) {
      // Rotación independiente de los anillos flotantes
      ringsRef.current.rotation.y -= delta * 0.2;
      ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Base de la torre */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[4, 5, 1, 8]} />
        <meshStandardMaterial 
          color="#2d3748"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Torre principal */}
      <group ref={towerRef}>
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[1, 2, 9, 8]} />
          <meshStandardMaterial 
            color="#ffd700"
            metalness={0.9}
            roughness={0.1}
            emissive="#ffa000"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Punta de la torre */}
        <mesh position={[0, 10, 0]} castShadow>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Luz central */}
        <pointLight
          position={[0, 11, 0]}
          color="#ffffff"
          intensity={1.5}
          distance={20}
        />
      </group>
      
      {/* Anillos flotantes */}
      <group ref={ringsRef} position={[0, 6, 0]}>
        <mesh>
          <torusGeometry args={[3.5, 0.2, 16, 32]} />
          <meshStandardMaterial 
            color="#4fc3f7"
            transparent
            opacity={0.7}
            emissive="#4fc3f7"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        <mesh position={[0, 1, 0]} rotation={[Math.PI/4, 0, 0]}>
          <torusGeometry args={[4, 0.15, 16, 32]} />
          <meshStandardMaterial 
            color="#4fc3f7"
            transparent
            opacity={0.5}
            emissive="#4fc3f7"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};

export default CentralTower;

// components/3d/ChallengeBeam.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ChallengeBeam = ({ start, end, color = '#ff9800' }) => {
  const beamRef = useRef();
  
  // Actualizar la posición y forma del beam
  useFrame((state) => {
    if (beamRef.current) {
      // Actualizar las posiciones del beam
      beamRef.current.geometry.setFromPoints([
        new THREE.Vector3(...start),
        new THREE.Vector3(...end)
      ]);
      
      // Efecto de pulsación para el beam
      const pulse = Math.sin(state.clock.elapsedTime * 5) * 0.5 + 0.5;
      beamRef.current.material.dashOffset = state.clock.elapsedTime * 5;
      beamRef.current.material.opacity = 0.3 + pulse * 0.2;
    }
  });
  
  return (
    <>
      {/* Línea de energía */}
      <line ref={beamRef}>
        <bufferGeometry />
        <lineDashedMaterial
          color={color}
          linewidth={1}
          scale={1}
          dashSize={0.5}
          gapSize={0.3}
          transparent
          opacity={0.5}
        />
      </line>
      
      {/* Partículas flotando a lo largo del beam */}
      <ParticlesAlongBeam start={start} end={end} color={color} />
    </>
  );
};

// Componente para partículas moviéndose a lo largo del beam
const ParticlesAlongBeam = ({ start, end, color }) => {
  const particlesRef = useRef();
  const particlesCount = 10;
  
  useFrame((state) => {
    if (particlesRef.current && particlesRef.current.children) {
      particlesRef.current.children.forEach((particle, i) => {
        // Calcular posición en la línea
        const t = ((state.clock.elapsedTime * 0.5) + i / particlesCount) % 1;
        particle.position.x = start[0] * (1 - t) + end[0] * t;
        particle.position.y = start[1] * (1 - t) + end[1] * t;
        particle.position.z = start[2] * (1 - t) + end[2] * t;
        
        // Escala pulsante
        particle.scale.setScalar(0.2 + Math.sin(state.clock.elapsedTime * 5 + i) * 0.1);
      });
    }
  });
  
  return (
    <group ref={particlesRef}>
      {Array.from({ length: particlesCount }).map((_, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

export default ChallengeBeam;

// components/ui/ControlPanel.jsx
import React from 'react';
import './ControlPanel.css';

const ControlPanel = ({ stats, onRefresh, onRestart }) => {
  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <h1><i className="fas fa-gavel"></i> The Judge</h1>
        <div className="control-buttons">
          <button className="refresh-button" onClick={onRefresh}>
            <i className="fas fa-sync-alt"></i> Actualizar
          </button>
          <button className="restart-button" onClick={onRestart}>
            <i className="fas fa-redo-alt"></i> Reiniciar Juego
          </button>
        </div>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <h3>{stats.total}</h3>
          <p>Equipos Registrados</p>
        </div>
        
        <div className="stat-card">
          <i className="fas fa-check-circle"></i>
          <h3>{stats.validated}</h3>
          <p>Equipos Validados</p>
        </div>
        
        <div className="stat-card">
          <i className="fas fa-brain"></i>
          <h3>{stats.challenged}</h3>
          <p>En Desafío</p>
        </div>
        
        <div className="stat-card">
          <i className="fas fa-times-circle"></i>
          <h3>{stats.failed}</h3>
          <p>Fallos</p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

// components/ui/TeamDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import './TeamDetailsModal.css';
import { fetchTeamDetails } from '../../utils/api';

const TeamDetailsModal = ({ team, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
      'validated': 'status-validated',
      'failed': 'status-failed'
    };
    return statusMap[status] || '';
  };
  
  // Texto legible del estado
  const getStatusText = (status) => {
    const statusMap = {
      'connected': 'Conectado',
      'challenged': 'En Desafío',
      'validated': 'Validado',
      'failed': 'Fallido'
    };
    return statusMap[status] || status;
  };
  
  return (
    <div className="team-details-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        
        <div className="team-header">
          <img 
            className="team-logo" 
            src={team.logoURL || 'https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png'} 
            alt={`${team.teamName} logo`}
            onError={(e) => { e.target.src = 'https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png' }}
          />
          <div>
            <h2>{team.teamName}</h2>
            <div className={`team-status ${getStatusClass(team.status)}`}>
              {getStatusText(team.status)}
            </div>
          </div>
          <div className="team-score">
            <span>{team.score}</span>
            <small>puntos</small>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Cargando detalles...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="team-description">
              <h3>Descripción</h3>
              <p>{team.teamDescription || 'Sin descripción'}</p>
            </div>
            
            {team.members && team.members.length > 0 && (
              <div className="team-members">
                <h3>Miembros</h3>
                <div className="members-list">
                  {team.members.map((member, index) => (
                    <span key={index} className="member-badge">{member}</span>
                  ))}
                </div>
              </div>
            )}
            
            {details && details.challenges && details.challenges.length > 0 && (
              <div className="team-challenges">
                <h3>Desafíos Completados</h3>
                <table className="challenges-table">
                  <thead>
                    <tr>
                      <th>Desafío</th>
                      <th>Puntuación</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.challenges.map((challenge) => (
                      <tr key={challenge.challengeId}>
                        <td>{challenge.challenge}</td>
                        <td>{challenge.score}</td>
                        <td>{new Date(challenge.completedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamDetailsModal;

// components/ui/RestartModal.jsx
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
        <span className="close-button" onClick={onClose}>&times;</span>
        
        <div className="modal-header">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Reiniciar Juego</h2>
        </div>
        
        