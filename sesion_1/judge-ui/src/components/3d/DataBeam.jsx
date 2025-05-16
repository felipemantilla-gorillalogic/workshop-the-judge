import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DataBeam = ({ start = [0, 0, 0], end = [0, 0, 0], status = 'connected', active = false }) => {
  const mainBeamRef = useRef();
  const glowBeamRef = useRef();
  const particlesRef = useRef();
  
  // Manejar compatibilidad entre estados
  let beamStatus = status;
  if (status === 'challenged') {
    beamStatus = 'challenging';
  }
  
  // Configuración según estado
  const getBeamConfig = () => {
    switch(beamStatus) {
      case 'connecting':
        return {
          color: '#aaaaaa', // Gris más intenso
          glowColor: '#cccccc', // Gris claro
          width: 2.5,
          particleSpeed: 0.4,
          particleCount: 6, // Incrementado
          particleSize: 0.4, // Duplicado
          opacity: 0.8,
          glowOpacity: 0.4,
          flowDirection: 1, // Hacia el equipo
          glowRadius: 1.5,
          particleTrail: 0.2, // Nuevo - longitud de la estela
          useCustomParticles: true // Usar partículas personalizadas
        };
      case 'challenging':
        return {
          color: '#ff9800', // Naranja brillante
          glowColor: '#ffcc80', // Naranja claro
          width: 3.5,
          particleSpeed: 1.5,
          particleCount: 10, // Incrementado
          particleSize: 0.5, // Duplicado
          opacity: 1.0,
          glowOpacity: 0.6,
          flowDirection: 1, // Hacia el equipo
          glowRadius: 2.0,
          particleTrail: 0.3, // Nuevo - longitud de la estela
          useCustomParticles: true // Usar partículas personalizadas
        };
      case 'validated':
        return {
          color: '#4caf50', // Verde brillante
          glowColor: '#a5d6a7', // Verde claro
          width: 3.5,
          particleSpeed: 0.8,
          particleCount: 8, // Incrementado
          particleSize: 0.5, // Duplicado
          opacity: 1.0,
          glowOpacity: 0.6,
          flowDirection: 0, // Bidireccional
          glowRadius: 2.0,
          particleTrail: 0.25, // Nuevo - longitud de la estela
          useCustomParticles: true // Usar partículas personalizadas
        };
      case 'failed':
        return {
          color: '#ff4336', // Rojo brillante
          glowColor: '#ffcdd2', // Rojo claro
          width: 3.0,
          particleSpeed: 1.0,
          particleCount: 7, // Incrementado
          particleSize: 0.4, // Duplicado
          opacity: 1.0,
          glowOpacity: 0.6,
          flowDirection: -1, // Hacia el centro
          glowRadius: 1.8,
          particleTrail: 0.3, // Nuevo - longitud de la estela
          useCustomParticles: true // Usar partículas personalizadas
        };
      case 'connected':
      default:
        return {
          color: '#00e5ff', // Cian
          glowColor: '#80deea', // Cian claro
          width: 3.0,
          particleSpeed: 0.9,
          particleCount: 8, // Incrementado
          particleSize: 0.45, // Duplicado
          opacity: 1.0,
          glowOpacity: 0.5,
          flowDirection: 0, // Bidireccional
          glowRadius: 1.8,
          particleTrail: 0.25, // Nuevo - longitud de la estela
          useCustomParticles: true // Usar partículas personalizadas
        };
    }
  };
  
  const config = getBeamConfig();
  
  // Referencias a la geometría de las líneas
  const mainBeamGeometryRef = useRef(new THREE.BufferGeometry());
  const glowBeamGeometryRef = useRef(new THREE.BufferGeometry());
  
  // Asegurar que start y end son arrays válidos
  const safeStart = Array.isArray(start) && start.length >= 3 ? start : [0, 0, 0];
  const safeEnd = Array.isArray(end) && end.length >= 3 ? end : [0, 0, 0];
  
  // Estado local para curva y puntos
  const curveRef = useRef();
  const curvePointsRef = useRef([]);
  
  // Actualizar la curva y puntos cuando cambien las posiciones
  useEffect(() => {
    // Calcular un punto de control para la curva 
    const midPoint = [
      (safeStart[0] + safeEnd[0]) * 0.5,
      (safeStart[1] + safeEnd[1]) * 0.5 + 0.5, // Ligeramente elevado
      (safeStart[2] + safeEnd[2]) * 0.5
    ];
    
    // Crear una curva cuadrática
    curveRef.current = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...safeStart),
      new THREE.Vector3(...midPoint),
      new THREE.Vector3(...safeEnd)
    );
    
    // Actualizar puntos
    curvePointsRef.current = curveRef.current.getPoints(50);
    
    // Actualizar geometrías
    if (mainBeamGeometryRef.current && glowBeamGeometryRef.current) {
      mainBeamGeometryRef.current.setFromPoints(curvePointsRef.current);
      mainBeamGeometryRef.current.computeBoundingSphere();
      
      glowBeamGeometryRef.current.setFromPoints(curvePointsRef.current);
      glowBeamGeometryRef.current.computeBoundingSphere();
    }
  }, [safeStart, safeEnd]); // La dependencia garantiza actualización cuando cambian las posiciones

  // Actualizar posición y animación
  useFrame((state, delta) => {
    // Solo procesar si tenemos una curva válida
    if (!curveRef.current) return;
    
    // Actualizar las líneas
    if (mainBeamRef.current) {
      // Efecto pulsante para la línea principal
      const pulse = Math.sin(state.clock.elapsedTime * 5) * 0.5 + 0.5;
      mainBeamRef.current.material.opacity = config.opacity * (0.7 + pulse * 0.3);
      // Forzar actualización del material para asegurar refresco
      mainBeamRef.current.material.needsUpdate = true;
    }
    
    if (glowBeamRef.current) {
      // Efecto pulsante para el halo
      const glowPulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
      glowBeamRef.current.material.opacity = config.glowOpacity * (0.5 + glowPulse * 0.5);
      // Forzar actualización del material para asegurar refresco
      glowBeamRef.current.material.needsUpdate = true;
    }
    
    // Animar partículas a lo largo de la curva
    if (particlesRef.current && particlesRef.current.children && particlesRef.current.children.length > 0) {
    particlesRef.current.children.forEach((particle, i) => {
    // Determinar si es una partícula principal o una estela
    const isTrail = i >= config.particleCount;
    if (isTrail) {
      // Estelas siguen a sus partículas principales
      const mainParticleIndex = i % config.particleCount;
      const mainParticle = particlesRef.current.children[mainParticleIndex];
      if (mainParticle) {
        // Calcular la posición de la partícula principal en la curva
        let mainT = ((state.clock.elapsedTime * config.particleSpeed) + mainParticleIndex / config.particleCount) % 1;
        
        // Aplicar la misma lógica de dirección que para las partículas principales
        if (config.flowDirection < 0) {
          mainT = 1 - mainT; // Hacia el centro
        } else if (config.flowDirection === 0) {
          // Si es bidireccional, distribuir partículas en ambas direcciones
          const isReverse = mainParticleIndex >= config.particleCount / 2;
          if (isReverse) {
            mainT = 1 - mainT; // Invertir dirección para la mitad de las partículas
          }
        }
        
        // Posicionar ligeramente detrás de la partícula principal
        const direction = config.flowDirection === 0 ? 
            (i < config.particleCount * 2 ? -1 : 1) : // Dirección basada en posición para bidireccional
            config.flowDirection; // Usar la dirección configurada
        
        // Calcular desplazamiento desde la partícula principal
        const trailIndex = Math.floor((i - config.particleCount) / config.particleCount);
        const trailOffset = (trailIndex + 1) * 0.05; // Pequeño offset fijo para la estela
        
        // Calcular posición en la curva para la estela
        const trailT = Math.max(0, Math.min(1, mainT - (trailOffset * direction)));
        const point = curveRef.current.getPointAt(trailT);
        particle.position.copy(point);
        
          // Escalar y desvanecer la estela
            const trailFactor = 1 - ((trailIndex + 1) / 3); // Se desvanece con la distancia
            const trailScale = config.particleSize * trailFactor * 0.8;
            particle.scale.set(trailScale, trailScale, trailScale);
            
            // Desvanecer estela
            if (particle.material) {
              particle.material.opacity = 0.5 * trailFactor;
              // Hacer que las estelas emitan más luz
              particle.material.emissive = new THREE.Color(config.color);
              particle.material.emissiveIntensity = 0.5;
            }
          }
        } else {
          // Partículas principales - comportamiento mejorado
          // Calcular posición en la curva con mayor distribución
          let t = ((state.clock.elapsedTime * config.particleSpeed) + i / config.particleCount) % 1;
          
          // Modificar dirección según la configuración
          if (config.flowDirection < 0) {
            t = 1 - t; // Hacia el centro
          } else if (config.flowDirection === 0) {
            // Si es bidireccional, distribuir partículas en ambas direcciones
            const isReverse = i >= config.particleCount / 2;
            if (isReverse) {
              t = 1 - t; // Invertir dirección para la mitad de las partículas
            }
          }
          
          // Obtener punto en la curva
          const point = curveRef.current.getPointAt(t);
          particle.position.set(point.x, point.y, point.z);
          
          // Efectos mejorados de tamaño y brillo para las partículas
          const pulseFrequency = 2 + (i % 3); // Variación en la frecuencia
          const basePulse = Math.sin(state.clock.elapsedTime * pulseFrequency + i * 0.7) * 0.5 + 0.5;
          const scale = config.particleSize * (0.9 + basePulse * 0.4);
          particle.scale.set(scale, scale, scale);
          
          // También actualizar la intensidad del material
          if (particle.material) {
            particle.material.opacity = 0.8 + basePulse * 0.2;
            // Hacer que las partículas emitan luz
            if (config.useCustomParticles) {
              particle.material.emissive = new THREE.Color(config.color);
              particle.material.emissiveIntensity = 0.7 + basePulse * 0.3;
            }
          }
        }
      });
    }
  });
  
  return (
    <group>
      {/* Línea principal (más definida) */}
      <line ref={mainBeamRef}>
        <bufferGeometry 
          ref={mainBeamGeometryRef}
          attach="geometry"
        />
        <lineBasicMaterial
          color={config.color}
          transparent
          opacity={config.opacity}
          linewidth={config.width}
        />
      </line>
      
      {/* Efecto de halo/resplandor alrededor de la línea */}
      <line ref={glowBeamRef}>
        <bufferGeometry 
          ref={glowBeamGeometryRef}
          attach="geometry"
        />
        <lineBasicMaterial
          color={config.glowColor}
          transparent
          opacity={config.glowOpacity}
          linewidth={config.width + config.glowRadius}
        />
      </line>
      
      {/* Partículas en la línea con efectos mejorados */}
      <group ref={particlesRef}>
        {/* Partículas principales */}
        {Array.from({ length: active ? config.particleCount : 0 }).map((_, i) => (
          <mesh key={i} position={[0, 0, 0]}>
            {config.useCustomParticles ? (
              // Geometría personalizada más detallada para mejor aspecto visual
              <dodecahedronGeometry args={[config.particleSize, 1]} />
            ) : (
              <sphereGeometry args={[config.particleSize, 10, 10]} />
            )}
            <meshPhongMaterial 
              color={config.color}
              transparent
              opacity={0.9}
              emissive={config.color}
              emissiveIntensity={0.7}
              shininess={80}
            />
          </mesh>
        ))}
        
        {/* Estelas de partículas para efecto de movimiento más fluido */}
        {Array.from({ length: active && config.useCustomParticles ? config.particleCount * 2 : 0 }).map((_, i) => (
          <mesh key={`trail-${i}`} position={[0, 0, 0]}>
            <sphereGeometry args={[config.particleSize * 0.7, 8, 8]} />
            <meshPhongMaterial 
              color={config.color}
              transparent
              opacity={0.5}
              emissive={config.color}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>
      

    </group>
  );
};

export default DataBeam;