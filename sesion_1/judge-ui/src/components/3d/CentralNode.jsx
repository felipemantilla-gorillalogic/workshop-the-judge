// CentralNode.jsx - Representación 3D del nodo central "The Judge"
import React, { useRef, useState, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";

// Path al modelo 3D de magical_orb
const JUDGE_MODEL_PATH = "/models/magical_orb.glb";

// Componente para cargar y mostrar el modelo 3D del Judge
const JudgeModel = ({ position, scale = [1, 1, 1], rotation = [0, 0, 0] }) => {
  // Estado para rastrear si el modelo existe o no
  const [modelExists, setModelExists] = useState(true);
  
  // Validar parámetros para evitar errores
  const safePosition = position || [0, 0, 0];
  const safeScale = scale || [1, 1, 1];
  const safeRotation = rotation || [0, 0, 0];
  
  // Cargar el modelo
  const gltf = useGLTF(JUDGE_MODEL_PATH, undefined, (error) => {
    console.warn(`Error cargando modelo para The Judge:`, error);
    setModelExists(false);
  });
  
  // Efecto para precargar el modelo
  useEffect(() => {
    try {
      useGLTF.preload(JUDGE_MODEL_PATH);
    } catch (error) {
      console.warn(`No se pudo precargar el modelo Judge: ${JUDGE_MODEL_PATH}`);
      setModelExists(false);
    }
  }, []);
  
  // Renderizar la representación adecuada
  if (!modelExists || !gltf || !gltf.scene) {
    // Representación alternativa si no se puede cargar el modelo
    return (
      <group position={safePosition} scale={safeScale} rotation={safeRotation}>
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial 
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={1.8} 
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
      // Aplicar material según el estado
      onUpdate={(self) => {
        try {
          if (self && self.traverse) {
            self.traverse((child) => {
              if (child && child.isMesh && child.material) {
                // Para array de materiales
                if (Array.isArray(child.material)) {
                  child.material = child.material.map(mat => {
                    if (mat && !mat.__modified) {
                      const newMat = mat.clone();
                      newMat.__modified = true;
                      
                      // Añadir brillo y emisión
                      if (newMat.color) {
                        // Mantener color original pero aumentar brillo
                        const currentColor = newMat.color.getHex();
                        newMat.color.set(currentColor);
                      }
                      if (newMat.emissive) {
                        // Establecer emisión azul cian con intensidad moderada
                        newMat.emissive.set("#00e5ff");
                        newMat.emissiveIntensity = 1.8;
                      }
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
                    
                    // Añadir brillo y emisión
                    if (newMat.color) {
                      // Mantener color original pero aumentar brillo
                      const currentColor = newMat.color.getHex();
                      newMat.color.set(currentColor);
                    }
                    if (newMat.emissive) {
                      // Establecer emisión azul cian con intensidad moderada
                      newMat.emissive.set("#00e5ff");
                      newMat.emissiveIntensity = 1.8;
                    }
                    newMat.needsUpdate = true;
                  } catch (e) {
                    console.warn('Error al modificar material del Judge:', e);
                  }
                }
              }
            });
          }
        } catch (error) {
          console.error('Error en onUpdate del Judge:', error);
        }
      }}
    />
  );
};

const CentralNode = ({ position = [0, 0, 0] }) => {
  const nodeRef = useRef();
  const ringsRef = useRef();
  const pulseRef = useRef();
  const modelRef = useRef();
  
  // Animaciones continuas
  useFrame((state, delta) => {
    try {
      if (nodeRef.current) {
        // Rotación lenta del nodo central
        nodeRef.current.rotation.y += delta * 0.08;
        
        // Leve efecto de flotación
        nodeRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      }
      
      if (modelRef.current) {
        // Aplicar efectos sutiles al modelo 3D
        modelRef.current.rotation.y += delta * 0.1; // Rotación más lenta
      }
      
      if (ringsRef.current) {
        // Rotación independiente de los anillos
        ringsRef.current.children[0].rotation.z += delta * 0.15;
        ringsRef.current.children[1].rotation.z -= delta * 0.12;
        ringsRef.current.children[2].rotation.z += delta * 0.08;
      }
      
      if (pulseRef.current) {
        // Pulso de energía sutil
        pulseRef.current.material.opacity = 
          0.4 * (0.7 + Math.sin(state.clock.elapsedTime * 0.6) * 0.3);
      }
    } catch (error) {
      console.error('Error en useFrame del CentralNode:', error);
    }
  });
  
  return (
    <group position={position}>
      {/* Nodo principal */}
      <group ref={nodeRef}>
        {/* Modelo 3D "magical_orb" */}
        <Suspense fallback={
          <mesh>
            <sphereGeometry args={[3, 32, 32]} />
            <meshStandardMaterial 
              color="#00e5ff"
              emissive="#00e5ff"
              emissiveIntensity={1.8}
            />
          </mesh>
        }>
          <group ref={modelRef}>
            <JudgeModel 
              position={[0, 0, 0]} 
              scale={[2.5, 2.5, 2.5]} 
              rotation={[0, 0, 0]} 
            />
          </group>
        </Suspense>
        
        {/* Base para la luz intensa */}
        <pointLight
          position={[0, 0, 5]}
          color="#00e5ff"
          intensity={2.5}
          distance={30}
          decay={1.8}
        />
        
        {/* Luz superior suave */}
        <pointLight
          position={[0, 2, 0]}
          color="#00e5ff"
          intensity={1.5}
          distance={15}
          decay={2.0}
        />
      </group>
      
      {/* Anillos orbitales flotantes con tamaño ajustado */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <ringGeometry args={[4.0, 4.1, 64]} />
          <meshBasicMaterial 
            color="#00e5ff"
            transparent
            opacity={0.4}
            side={2}
          />
        </mesh>
        
        <mesh rotation={[Math.PI/2, Math.PI/4, Math.PI/6]}>
          <ringGeometry args={[4.5, 4.6, 64]} />
          <meshBasicMaterial 
            color="#00e5ff"
            transparent
            opacity={0.3}
            side={2}
          />
        </mesh>
        
        <mesh rotation={[Math.PI/2, -Math.PI/4, -Math.PI/6]}>
          <ringGeometry args={[5.0, 5.1, 64]} />
          <meshBasicMaterial 
            color="#00e5ff"
            transparent
            opacity={0.2}
            side={2}
          />
        </mesh>
      </group>
      
      {/* Pulso de energía más discreto */}
      <mesh ref={pulseRef} rotation={[Math.PI/2, 0, 0]}>
        <ringGeometry args={[5.2, 5.3, 64]} />
        <meshBasicMaterial 
          color="#00e5ff"
          transparent
          opacity={0.4}
          side={2}
        />
      </mesh>
      
      {/* Etiqueta "THE JUDGE" con estilo más sutil */}
      <Html position={[0, -5, 0]} center wrapperClass="html-label">
        <div className="team-label" style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '8px 15px',
          borderRadius: '5px',
          border: '2px solid #00e5ff',
          boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
          textShadow: '0 0 5px #00e5ff',
          fontSize: '1.3em', 
          fontWeight: 'bold', 
          letterSpacing: '0.2em',
          color: '#FFFFFF'
        }}>
          THE JUDGE
        </div>
      </Html>
    </group>
  );
};

export default CentralNode;