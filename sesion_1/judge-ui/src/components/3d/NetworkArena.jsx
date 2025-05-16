// NetworkArena.jsx - Escena principal 3D
import React, { useMemo } from 'react';
import TeamNode from './TeamNode';
import CentralNode from './CentralNode';
import DataBeam from './DataBeam';
import BackgroundGrid from './BackgroundGrid';
import BackgroundStars from './BackgroundStars';

const NetworkArena = ({ teams = [], onSelectTeam = () => {}, selectedTeam = null }) => {
  // Distribución de equipos en círculo - optimizado
  const calculatePosition = (index, total) => {
    const safeTotal = total > 0 ? total : 1; // Evitar división por cero
    // Calculamos un radio adaptativo con un mínimo, pero limitando el máximo para evitar espaciado excesivo
    const radius = Math.min(Math.max(15, safeTotal * 1.2), 40);
    
    // Si hay pocos equipos, distribuirlos equitativamente
    if (safeTotal <= 8) {
      const angle = (index / safeTotal) * Math.PI * 2;
      return [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ];
    }
    
    // Para muchos equipos, usar una distribución más densa y en espiral
    // que evite sobrecargar una sola área
    const turns = Math.ceil(safeTotal / 8); // Cuántas "vueltas" de espiral
    const angleStep = (Math.PI * 2) / 8; // Dividir círculo en 8 sectores
    const radiusStep = radius / turns; // Espacio entre anillos
    
    // Calcular en qué anillo y posición va este elemento
    const ring = Math.floor(index / 8);
    const posInRing = index % 8;
    
    // Radio ajustado según el anillo (mayor para anillos exteriores)
    const adjustedRadius = radius - (ring * radiusStep);
    
    // Ángulo basado en la posición en el anillo
    const angle = posInRing * angleStep;
    
    return [
      Math.cos(angle) * adjustedRadius,
      0,
      Math.sin(angle) * adjustedRadius
    ];
  };
  
  // Componentes de fondo memoizados para que solo se rendericen una vez
  const backgroundElements = useMemo(() => {
    return (
      <>
        {/* Fondo con estrellas */}
        <BackgroundStars />
        
        {/* Malla/grid holográfica de fondo */}
        <BackgroundGrid />
      </>
    );
  }, []);
  
  // Nodo central memoizado
  const centralNode = useMemo(() => {
    return <CentralNode position={[0, 0, 0]} />;
  }, []);
  
  // Asegurar que teams es un array
  const safeTeams = Array.isArray(teams) ? teams : [];
  
  // Calcular posiciones para cada equipo (memoizado basado en length)
  const teamPositions = useMemo(() => {
    return safeTeams.map((_, index) => {
      return calculatePosition(index, safeTeams.length);
    });
  }, [safeTeams.length]);
  
  return (
    <group>
      {/* Iluminación ambiental mejorada */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 15, 0]} intensity={1.2} color="#00e5ff" />
      {/* Luces adicionales para mejorar visibilidad de partículas */}
      <pointLight position={[20, 10, 20]} intensity={0.5} color="#ffffff" distance={80} decay={2} />
      <pointLight position={[-20, 10, -20]} intensity={0.5} color="#ffffff" distance={80} decay={2} />
      
      {/* Elementos de fondo memoizados */}
      {backgroundElements}
      
      {/* Nodo central memoizado */}
      {centralNode}
      
      {/* Equipos y sus conexiones */}
      {safeTeams.map((team, index) => {
        const position = teamPositions[index];
        return (
          <React.Fragment key={team.id || index}>
            {/* Nodo de equipo */}
            <TeamNode
              team={team}
              position={position}
              onClick={() => onSelectTeam(team.id)}
              selected={team.id === selectedTeam}
            />
            
            {/* Conexión de datos entre equipo y nodo central */}
            <DataBeam
              start={position}
              end={[0, 0, 0]}
              status={team.status || 'connected'}
              active={true} // Todas las conexiones son visibles
            />
          </React.Fragment>
        );
      })}
    </group>
  );
};

// Exportamos sin memo para permitir actualizaciones frecuentes que mantienen las animaciones activas
export default NetworkArena;

// Comentado el memo que podría estar bloqueando las actualizaciones necesarias para las animaciones
/*
export default React.memo(NetworkArena, (prevProps, nextProps) => {
  // Comparación personalizada para evitar re-renders innecesarios
  // Solo re-renderizar si cambia la selección o si el número de equipos cambia
  const sameSelection = prevProps.selectedTeam === nextProps.selectedTeam;
  
  // Verificar si la longitud de los equipos es la misma
  const prevLength = Array.isArray(prevProps.teams) ? prevProps.teams.length : 0;
  const nextLength = Array.isArray(nextProps.teams) ? nextProps.teams.length : 0;
  const sameLength = prevLength === nextLength;
  
  // Solo verificar cambios de estado si la longitud es igual
  let sameStates = true;
  if (sameLength && prevLength > 0) {
    // Verificar si hay cambios en los estados de los equipos
    for (let i = 0; i < prevLength; i++) {
      if (prevProps.teams[i].status !== nextProps.teams[i].status) {
        sameStates = false;
        break;
      }
    }
  }
  
  // Evitar re-renders si todo es igual
  return sameSelection && sameLength && sameStates;
});
*/