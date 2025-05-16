// TeamNode.jsx - Representación 3D de un equipo
import React, { useRef, useState, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { gsap } from "gsap";

// Path al modelo compartido para todos los estados
// Para rutas en desarrollo, la ruta debe ser relativa a la carpeta pública
const SHARED_MODEL_PATH = "/models/cyber_orb.glb";

// Función para precargar modelos
const MODEL_PATHS = {
  connecting: SHARED_MODEL_PATH,
  connected: SHARED_MODEL_PATH,
  challenging: SHARED_MODEL_PATH,
  validated: SHARED_MODEL_PATH,
  failed: SHARED_MODEL_PATH,
  // Modelo por defecto si no hay coincidencia
  default: SHARED_MODEL_PATH
};

// Componente para cargar y mostrar un modelo 3D
// Con manejo de fallback para modelos que no existan
const Model3D = ({ status, position, scale, rotation }) => {
  // Validar parámetros para evitar errores
  const safeStatus = status || 'connected';
  const safePosition = position || [0, 0, 0];
  const safeScale = scale || [1, 1, 1];
  const safeRotation = rotation || [0, 0, 0];
  
  // Determinar qué modelo cargar basado en el estado
  const modelPath = MODEL_PATHS[safeStatus] || MODEL_PATHS.default;
  
  // Estado para rastrear si el modelo existe o no
  const [modelExists, setModelExists] = useState(true);
  
  // Siempre llamar a useGLTF de manera incondicional 
  // (no dentro de try/catch ni if/else)
  const gltf = useGLTF(modelPath, undefined, (error) => {
    console.warn(`Error cargando modelo para estado ${safeStatus}:`, error);
    setModelExists(false);
  });
  
  // Efecto para precargar el modelo
  useEffect(() => {
    // useGLTF.preload no es un Hook, es una función estática, 
    // así que es seguro ponerlo en un try/catch
    try {
      useGLTF.preload(modelPath);
    } catch (error) {
      console.warn(`No se pudo precargar el modelo: ${modelPath}`);
      setModelExists(false);
    }
  }, [modelPath]);
  
  // Renderizar la representación adecuada
  if (!modelExists || !gltf || !gltf.scene) {
    // Representación alternativa: esfera simple con el color adecuado
    return (
      <group position={safePosition} scale={safeScale} rotation={safeRotation}>
        <mesh>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial 
            color={STATUS_CONFIGS[safeStatus]?.color || "#00e5ff"}
            emissive={STATUS_CONFIGS[safeStatus]?.color || "#00e5ff"}
            emissiveIntensity={2.0} // Mayor emisividad
            needsUpdate={true}
          />
        </mesh>
      </group>
    );
  }
  
  // Si llegamos aquí, tenemos un modelo válido
  return (
    <primitive 
      object={gltf.scene.clone()} 
      position={safePosition} 
      scale={safeScale} 
      rotation={safeRotation}
      // Aplicar material según el estado del equipo
      onUpdate={(self) => {
        try {
          // Obtener el color según el estado
          const color = STATUS_CONFIGS[safeStatus]?.color || "#00e5ff";
          
          // Aplicar color a todas las partes para mayor visibilidad
          if (self && self.traverse) {
            self.traverse((child) => {
              if (child && child.isMesh && child.material) {
                // Aplicar a todas las partes para máxima visibilidad
                // Para array de materiales
                if (Array.isArray(child.material)) {
                  child.material = child.material.map(mat => {
                    if (mat && !mat.__modified) {
                      const newMat = mat.clone();
                      newMat.__modified = true;
                      
                      // Cambiar color con más intensidad
                      if (newMat.color) newMat.color.set(color);
                      if (newMat.emissive) newMat.emissive.set(color);
                      newMat.emissiveIntensity = 2.0;
                      newMat.needsUpdate = true;
                      
                      return newMat;
                    }
                    return mat;
                  });
                } 
                // Para material único
                else if (child.material && !child.material.__modified) {
                  try {
                    const newMat = child.material.clone();
                    newMat.__modified = true;
                    child.material = newMat;
                    
                    // Cambiar color con más intensidad
                    if (newMat.color) newMat.color.set(color);
                    if (newMat.emissive) newMat.emissive.set(color);
                    newMat.emissiveIntensity = 2.0;
                    newMat.needsUpdate = true;
                  } catch (e) {
                    console.warn('Error al modificar material:', e);
                  }
                }
              }
            });
          }
        } catch (error) {
          console.error('Error en onUpdate:', error);
        }
      }}
    />
  );
};

  // Estados visuales definidos por colores y animaciones según especificación
const STATUS_CONFIGS = {
  connecting: {
    color: "#aaaaaa", // Más brillante
    intensity: 2.0, // Aumentado
    pulsate: true,
    height: -0.3,
    particleCount: 2, // Reducido para rendimiento
    particleColor: "#aaaaaa", // Más brillante
    blur: false, // Eliminado el blur
    iconOpacity: 0.8, // Mayor opacidad
    showParticles: true
  },
  connected: {
    color: "#33eeff", // Más brillante
    intensity: 3.0, // Duplicado
    pulsate: true,
    height: 0,
    particleCount: 3, // Reducido para rendimiento
    particleColor: "#33eeff", // Más brillante
    blur: false,
    iconOpacity: 1.0,
    showParticles: true
  },
  challenging: {
    color: "#ffb846", // Más brillante
    intensity: 4.0, // Casi duplicado
    pulsate: true,
    height: 0.5,
    particleCount: 4, // Reducido para rendimiento
    particleColor: "#ffb846", // Más brillante
    blur: false,
    iconOpacity: 1.0,
    showParticles: true
  },
  validated: {
    color: "#66ff70", // Más brillante
    intensity: 4.5, // Casi duplicado
    pulsate: false,
    height: 0.8,
    particleCount: 5, // Reducido para rendimiento
    particleColor: "#66ff70", // Más brillante
    blur: false,
    iconOpacity: 1.0,
    showParticles: true,
    showSuccessIndicator: true
  },
  failed: {
    color: "#ff6b60", // Más brillante
    intensity: 3.5, // Casi duplicado
    pulsate: true,
    height: -0.5,
    particleCount: 3, // Reducido para rendimiento
    particleColor: "#ff6b60", // Más brillante
    blur: false,
    iconOpacity: 0.9, // Mayor opacidad
    showParticles: true,
    showFailureIndicator: true
  }
};

const TeamNode = ({ team = {}, position = [0, 0, 0], onClick = () => {}, selected = false }) => {
  const nodeRef = useRef();
  const particlesRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Asegurar que team.status existe, o usar un valor por defecto
  let status = team.status || "connected";
  
  // Manejar compatibilidad entre 'challenged' y 'challenging'
  if (status === 'challenged') {
    status = 'challenging';
  }
  
  const statusConfig = STATUS_CONFIGS[status] || STATUS_CONFIGS['connected'];
  
  // Manejar cambios de estado
  useEffect(() => {
    if (nodeRef.current) {
      // Asegurar que statusConfig existe y que position[1] es accesible
      const currentHeight = statusConfig ? statusConfig.height : 0;
      
      // Animar cambio de altura según estado
      gsap.to(nodeRef.current.position, {
        y: currentHeight,
        duration: 1.2,
        ease: "elastic.out(1, 0.75)"
      });
      
      // Animar cambio de escala según puntuación
      const score = team.score || 0;
      const scale = 1 + (score / 100) * 0.5;
      gsap.to(nodeRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
    }
  }, [team.status, team.score, statusConfig]);
  
  // Animaciones continuas
  useFrame((state, delta) => {
    try {
      if (nodeRef.current) {
        // Asegurar que position y statusConfig existen
        const posY = position ? position[1] || 0 : 0;
        const configHeight = statusConfig ? statusConfig.height || 0 : 0;
        
        // Rotación suave constante
        nodeRef.current.rotation.y += delta * 0.2;
        
        // Efecto de flotación sutil con validación
        nodeRef.current.position.y = posY + configHeight + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        
        // Animar partículas si existen
        if (particlesRef.current && particlesRef.current.children && particlesRef.current.children.length > 0) {
          particlesRef.current.children.forEach((particle, i) => {
            if (particle) {
              try {
                // Movimiento orbital de partículas
                const speed = statusConfig && statusConfig.pulsate ? 2 : 1;
                const time = state.clock.elapsedTime * speed + i * 0.5;
                const radius = 1.5 + (i % 3) * 0.2;
                const heightOffset = (i % 5) * 0.1;
                
                particle.position.x = Math.cos(time) * radius;
                particle.position.z = Math.sin(time) * radius;
                particle.position.y = Math.sin(time * 1.5) * 0.2 + heightOffset;
                
                // Pulsar tamaño
                const scale = 0.12 + Math.sin(time * 3) * 0.03;
                particle.scale.set(scale, scale, scale);
              } catch (e) {
                console.warn('Error animando partícula:', e);
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error en useFrame:', error);
    }
  });

  // Para garantizar que position es un array válido
  const safePosition = Array.isArray(position) ? position : [0, 0, 0];
  const configHeight = statusConfig ? statusConfig.height : 0;
  
  return (
    <group position={safePosition}>
      {/* Nodo principal */}
      <group 
        ref={nodeRef} 
        position={[0, configHeight, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Modelo 3D según el estado */}
        <Suspense fallback={null}>
          <Model3D 
            status={status || "connected"} 
            position={[0, 0, 0]} 
            scale={[1.2, 1.2, 1.2]} 
            rotation={[0, 0, 0]} 
          />
        </Suspense>
        
        {/* Círculo exterior (aura/glow) - Eliminado o reducido */}
        {false && (
          <mesh>
            <sphereGeometry args={[1.8, 32, 32]} />
            <meshBasicMaterial 
              color={statusConfig ? statusConfig.color : "#00e5ff"}
              transparent
              opacity={0.15}
            />
            {/* Luz interna que emite el color del estado */}
            <pointLight 
              color={statusConfig ? statusConfig.color : "#00e5ff"}
              intensity={statusConfig ? statusConfig.intensity : 1.5}
              distance={8}
              decay={2}
            />
          </mesh>
        )}
        
        {/* Luz puntual directamente dentro del modelo para iluminar desde el centro - OPTIMIZADO */}
        <pointLight 
          color={statusConfig ? statusConfig.color : "#00e5ff"}
          intensity={statusConfig ? statusConfig.intensity * 1.5 : 3.0} // Reducido para mejor rendimiento
          distance={12} 
          decay={2} 
        />
        

        
        {/* Partículas orbitando el nodo - optimizadas para rendimiento */}
        <group ref={particlesRef}>
          {Array.from({ length: statusConfig ? Math.min(statusConfig.particleCount, 5) : 2 }).map((_, i) => (
            <mesh key={i} position={[0, 0, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} /> {/* Geometría simplificada */}
              <meshBasicMaterial 
                color={statusConfig ? statusConfig.particleColor : "#00e5ff"} 
              />
            </mesh>
          ))}
        </group>
        
        {/* Etiqueta HTML para mostrar el icono del equipo si existe */}
        {team?.iconUrl && (
          <Html position={[0, 0, 0.1]} transform occlude>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundImage: `url(${team.iconUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: `2px solid ${statusConfig.color || "rgba(255, 255, 255, 0.2)"}`,
              filter: statusConfig.blur ? 'blur(3px)' : 'none',
              opacity: statusConfig.iconOpacity,
              transition: 'all 0.3s ease'
            }} />
          </Html>
        )}
        
        {/* Indicador de éxito */}
        {statusConfig.showSuccessIndicator && (
          <Html position={[0, 0.8, 0.2]} transform occlude>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#4caf50',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid white',
              boxShadow: '0 0 10px rgba(76, 175, 80, 0.8)'
            }}>
              <svg style={{ width: '20px', height: '20px', fill: 'white' }} viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
          </Html>
        )}
        
        {/* Indicador de fracaso */}
        {statusConfig.showFailureIndicator && (
          <Html position={[0, 0.8, 0.2]} transform occlude>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#ff4336',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid white',
              boxShadow: '0 0 10px rgba(255, 67, 54, 0.8)'
            }}>
              <svg style={{ width: '20px', height: '20px', fill: 'white' }} viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </div>
          </Html>
        )}
        
        {/* Efecto de selección */}
        {selected && (
          <mesh rotation={[0, 0, 0]} position={[0, 0, -0.05]}>
            <ringGeometry args={[1.5, 1.6, 32]} />
            <meshBasicMaterial 
              color="#ffffff"
              transparent
              opacity={0.6 + Math.sin(Date.now() * 0.005) * 0.4}
            />
          </mesh>
        )}
        
        {/* Etiqueta de nombre y puntuación - más visible */}
        <Html position={[0, -2, 0]} center wrapperClass="html-label">
          <div className="team-label" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '5px 10px',
            borderRadius: '5px',
            border: `2px solid ${statusConfig ? statusConfig.color : '#00e5ff'}`,
            textShadow: `0 0 5px ${statusConfig ? statusConfig.color : '#00e5ff'}`
          }}>
            <span className="team-name" style={{ fontWeight: 'bold', color: '#ffffff' }}>
              {team.teamName || "Equipo"}
            </span>
            <span className="team-score" style={{ 
              fontWeight: 'bold', 
              color: statusConfig ? statusConfig.color : '#00e5ff',
              marginLeft: '8px'
            }}>
              {team.score || 0}
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
};

export default TeamNode;