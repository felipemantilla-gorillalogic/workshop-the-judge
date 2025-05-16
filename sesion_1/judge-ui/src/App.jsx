// App.jsx - Componente principal de la aplicación
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import NetworkArena from './components/3d/NetworkArena';
import ControlPanel from './components/ui/ControlPanel';
import TeamDetailsModal from './components/ui/TeamDetailsModal';
import RestartModal from './components/ui/RestartModal';
import GameFinishModal from './components/ui/GameFinishModal';
import LoadingScreen from './components/ui/LoadingScreen';
import { fetchStatus } from './utils/api';
import './App.css';

const App = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Añadido un estado para forzar re-renders y mantener las animaciones activas
  const [animationTick, setAnimationTick] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    validated: 0,
    challenging: 0,
    connecting: 0,
    connected: 0,
    failed: 0
  });

  // Función para cargar datos (carga manual o desde boton de refresco)
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchStatus();
      
      // Usar la misma lógica que en silentDataUpdate para actualizar
      setTeams(prevTeams => {
        // Conservar posiciones si hay equipos existentes
        if (prevTeams.length > 0) {
          return data.nodes.map(newNode => {
            const existingNode = prevTeams.find(old => old.id === newNode.id);
            if (existingNode) {
              return {
                ...newNode,
                position: existingNode.position || newNode.position
              };
            }
            return newNode;
          });
        }
        return data.nodes || [];
      });
      
      // Actualizar estadísticas si hay datos válidos
      if (data && data.nodes && Array.isArray(data.nodes)) {
        const validatedCount = data.nodes.filter(node => node.status === 'validated').length;
        const challengingCount = data.nodes.filter(node => 
          node.status === 'challenging' || node.status === 'challenged'
        ).length;
        const connectingCount = data.nodes.filter(node => node.status === 'connecting').length;
        const failedCount = data.nodes.filter(node => node.status === 'failed').length;
        const connectedCount = data.nodes.filter(node => node.status === 'connected').length;
        
        setStats({
          total: data.nodes.length,
          validated: validatedCount,
          challenging: challengingCount,
          connecting: connectingCount,
          connected: connectedCount,
          failed: failedCount
        });
      }
      
      setError(null);
      return data; // Devolver datos para uso en initialLoad
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar datos');
      throw err; // Relanzar para manejo en initialLoad
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Actualización silenciosa sin indicadores de carga (optimizada)
  const silentDataUpdate = useCallback(async () => {
    try {
      // Usar AbortController para cancelar requests pendientes si tarda demasiado
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // Timeout de 1.5s
      
      const data = await fetchStatus(controller.signal);
      clearTimeout(timeoutId);
      
      // Usar una función de actualización para evitar actualizaciones parciales
      setTeams(prevTeams => {
        // Si no hay cambios, no actualizar el estado para evitar renders innecesarios
        if (JSON.stringify(data?.nodes?.map(n => n.id)?.sort()) === 
            JSON.stringify(prevTeams?.map(t => t.id)?.sort())) {
            
          // Solo actualizar estados de los equipos sin cambiar el array completo
          const needsUpdate = data.nodes.some((newNode, idx) => {
            const matchingTeam = prevTeams.find(pt => pt.id === newNode.id);
            return matchingTeam && matchingTeam.status !== newNode.status;
          });
          
          if (!needsUpdate) {
            // No hay cambios ni en la lista ni en los estados, mantener referencia anterior
            return prevTeams;
          }
          
          // Hay cambios de estado, actualizar conservando posiciones
          return prevTeams.map(prevTeam => {
            const updatedTeam = data.nodes.find(n => n.id === prevTeam.id);
            if (updatedTeam) {
              return {
                ...updatedTeam,
                position: prevTeam.position || updatedTeam.position
              };
            }
            return prevTeam;
          });
        }
        
        // La lista de equipos ha cambiado, recalcular todo pero conservar posiciones
        if (prevTeams.length > 0) {
          return data.nodes.map(newNode => {
            const existingNode = prevTeams.find(old => old.id === newNode.id);
            if (existingNode) {
              // Conservar posición anterior para evitar saltos
              return {
                ...newNode,
                position: existingNode.position || newNode.position
              };
            }
            return newNode;
          });
        }
        
        return data.nodes || [];
      });
      
      // Calcular estadísticas - sólo si hay datos válidos
      if (data && data.nodes && Array.isArray(data.nodes)) {
        const validatedCount = data.nodes.filter(node => node.status === 'validated').length;
        const challengingCount = data.nodes.filter(node => 
          node.status === 'challenging' || node.status === 'challenged'
        ).length;
        const connectingCount = data.nodes.filter(node => node.status === 'connecting').length;
        const failedCount = data.nodes.filter(node => node.status === 'failed').length;
        const connectedCount = data.nodes.filter(node => node.status === 'connected').length;
        
        setStats({
          total: data.nodes.length,
          validated: validatedCount,
          challenging: challengingCount,
          connecting: connectingCount,
          connected: connectedCount,
          failed: failedCount
        });
      }
    } catch (err) {
      // Si es un error de abort, ignorarlo (es esperado cuando cancelamos)
      if (err.name === 'AbortError') {
        console.log('Actualización cancelada por timeout');
        return;
      }
      
      console.error('Error en actualización silenciosa:', err);
      // No mostrar error en actualizaciones silenciosas para evitar parpadeos
    }
  }, []);
  
  // Carga inicial con pantalla de carga
  const initialLoad = useCallback(async () => {
    try {
      setLoading(true);
      await loadData();
    } catch (err) {
      console.error('Error en carga inicial:', err);
      setError('Error al cargar datos iniciales');
    } finally {
      setLoading(false); 
    }
  }, [loadData]);
  
  // Cargar datos iniciales
  useEffect(() => {
    // Primera carga inicial con indicador de carga
    initialLoad();
    
    // Configurar actualización periódica cada 1000ms para mejor rendimiento
    // y para mantener las animaciones activas
    let active = true; // Flag para evitar actualizaciones cuando el componente está desmontado
    let frameRequest = null;
    let animationFrameId = null;
    
    // Función para forzar renders continuos que mantienen las animaciones activas
    const updateAnimationTick = () => {
      if (!active) return;
      
      // Incrementar un contador para forzar actualizaciones de estado
      // que mantienen el ciclo de renderizado activo
      setAnimationTick(prev => (prev + 1) % 1000);
      
      // Solicitar el siguiente frame
      animationFrameId = requestAnimationFrame(updateAnimationTick);
    };
    
    // Iniciar el ciclo de animación
    animationFrameId = requestAnimationFrame(updateAnimationTick);
    
    const updateLoop = () => {
      if (!active) return;
      
      silentDataUpdate().finally(() => {
        // Programar la próxima actualización usando setTimeout para mejor control
        frameRequest = setTimeout(() => {
          updateLoop();
        }, 1000);
      });
    };
    
    // Iniciar el ciclo de actualización de datos
    updateLoop();
    
    return () => {
      active = false; // Marcar como inactivo
      if (frameRequest) clearTimeout(frameRequest);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [initialLoad, silentDataUpdate]);

  // Manejar selección de equipo (memoizado para evitar re-renders)
  const handleTeamSelect = useCallback((teamId) => {
    setSelectedTeam(prev => prev === teamId ? null : teamId);
  }, []);

  // Actualizar datos manualmente (memoizado)
  const handleManualRefresh = useCallback(() => {
    loadData();
  }, []);
  
  // Mostrar modal de reinicio (memoizado)
  const handleShowRestartModal = useCallback(() => {
    setShowRestartModal(true);
  }, []);
  
  // Cerrar modal de reinicio (memoizado)
  const handleCloseRestartModal = useCallback(() => {
    setShowRestartModal(false);
  }, []);
  
  // Mostrar modal de finalización (memoizado)
  const handleShowFinishModal = useCallback(() => {
    setShowFinishModal(true);
  }, []);
  
  // Cerrar modal de finalización (memoizado)
  const handleCloseFinishModal = useCallback(() => {
    setShowFinishModal(false);
  }, []);
  
  // Cerrar modal de detalles de equipo (memoizado)
  const handleCloseTeamDetails = useCallback(() => {
    setSelectedTeam(null);
  }, []);

  // Equipo seleccionado (memoizado para evitar cálculos repetidos)
  const selectedTeamData = useMemo(() => {
    return selectedTeam ? teams.find(team => team.id === selectedTeam) : null;
  }, [selectedTeam, teams]);

  return (
    <div className="app-container">
      {/* Canvas 3D para React Three Fiber - Optimizado */}
      <Canvas 
        shadows={false} // Desactivado para rendimiento
        camera={{ position: [0, 30, 30], fov: 50 }}
        gl={{ 
          antialias: false, // Cambiado a false para mejor rendimiento
          alpha: true,
          powerPreference: 'high-performance', // Optimización para rendimiento
          precision: 'lowp', // Precisión baja para mejorar rendimiento
          depth: false, // Desactivar buffer de profundidad para mejorar rendimiento
          stencil: false // Desactivar buffer de stencil para mejorar rendimiento
        }}
        frameloop="always" // Modificado: Siempre renderiza para mantener las animaciones
        performance={{ min: 0.5 }} // Modificado: Menor degradación de rendimiento
        dpr={0.75} // Mantener resolución de renderizado reducida
        className="canvas-3d"
        onCreated={({ gl }) => {
          // Deshabilitar antialiasing para mejor rendimiento
          gl.setPixelRatio(window.devicePixelRatio * 0.75);
          // Eliminar la detención del loop de animación
          // gl.setAnimationLoop(() => null); // Comentado para mantener animaciones funcionando
        }}
      >
        <color attach="background" args={['#02060e']} />
        
        {/* Escena principal */}
        <NetworkArena 
          teams={teams} 
          onSelectTeam={handleTeamSelect} 
          selectedTeam={selectedTeam}
        />
        
        {/* Post-procesado - Mejorado para destacar partículas */}
        <EffectComposer>
          <Bloom 
            intensity={0.8} // Incrementado para mayor brillo
            luminanceThreshold={0.2} // Reducido para capturar más elementos brillantes
            luminanceSmoothing={0.9} // Incrementado para una transición más suave
            kernelSize={3} // Tamaño de kernel más grande para mayor difusión
            mipmapBlur={true} // Activar para mejor calidad de bloom
          />
        </EffectComposer>
        
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
        teams={teams}
        onRefresh={handleManualRefresh}
        onRestart={handleShowRestartModal}
        onFinishGame={handleShowFinishModal}
        onSelectTeam={handleTeamSelect}
      />
      
      {/* Modal de detalles del equipo */}
      {selectedTeamData && (
        <TeamDetailsModal 
          team={selectedTeamData} 
          onClose={handleCloseTeamDetails} 
          onDisconnect={handleManualRefresh} 
        />
      )}
      
      {/* Modal de reinicio */}
      {showRestartModal && (
        <RestartModal 
          onClose={handleCloseRestartModal} 
          onRestart={handleManualRefresh} 
        />
      )}
      
      {/* Modal de finalización del juego */}
      {showFinishModal && (
        <GameFinishModal 
          onClose={handleCloseFinishModal} 
        />
      )}
      
      {/* Pantalla de carga */}
      {loading && !teams.length && <LoadingScreen />}
      
      {/* Mensaje de error */}
      {error && (
        <div className="error-overlay">
          <div className="error-message">
            {error}
            <button onClick={handleManualRefresh}>Reintentar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;