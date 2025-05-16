// BackgroundGrid.jsx - Malla de fondo estilo rejilla holográfica
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BackgroundGrid = () => {
  const gridRef = useRef();
  const pointsRef = useRef();
  
  // Crear geometría de la rejilla
  const createGridGeometry = () => {
    const size = 200; // Aumentado de 100 a 200
    const divisions = 40; // Aumentado de 30 a 40 para mantener la densidad adecuada
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Crear líneas horizontales y verticales
    for (let i = -size/2; i <= size/2; i += size/divisions) {
      // Línea horizontal
      vertices.push(-size/2, i, 0);
      vertices.push(size/2, i, 0);
      
      // Línea vertical
      vertices.push(i, -size/2, 0);
      vertices.push(i, size/2, 0);
    }
    
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    
    return geometry;
  };
  
  // Crear geometría de puntos para intersecciones
  const createPointsGeometry = () => {
    const size = 200; // Aumentado de 100 a 200
    const divisions = 40; // Aumentado de 30 a 40
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Crear puntos en las intersecciones
    for (let i = -size/2; i <= size/2; i += size/divisions) {
      for (let j = -size/2; j <= size/2; j += size/divisions) {
        vertices.push(i, j, 0);
      }
    }
    
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    
    return geometry;
  };
  
  // Animación de la rejilla
  useFrame((state, delta) => {
    if (gridRef.current) {
      // Leve ondulación
      const time = state.clock.elapsedTime;
      const positions = gridRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Añadir una pequeña ondulación en z
        positions[i+2] = Math.sin(positions[i]/15 + time/3) * Math.cos(positions[i+1]/15 + time/3) * 0.8;
      }
      
      gridRef.current.geometry.attributes.position.needsUpdate = true;
      
      // También actualizar los puntos
      if (pointsRef.current) {
        const pointPositions = pointsRef.current.geometry.attributes.position.array;
        
        for (let i = 0; i < pointPositions.length; i += 3) {
          pointPositions[i+2] = Math.sin(pointPositions[i]/15 + time/3) * 
                              Math.cos(pointPositions[i+1]/15 + time/3) * 0.8;
        }
        
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });
  
  return (
    <group rotation={[Math.PI/2, 0, 0]} position={[0, -8, 0]}>
      {/* Líneas de la rejilla */}
      <lineSegments ref={gridRef} geometry={createGridGeometry()}>
        <lineBasicMaterial 
          color="#00e5ff"
          transparent
          opacity={0.15}
        />
      </lineSegments>
      
      {/* Puntos en las intersecciones */}
      <points ref={pointsRef} geometry={createPointsGeometry()}>
        <pointsMaterial 
          color="#00e5ff"
          size={0.6}
          transparent
          opacity={0.25}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};

export default BackgroundGrid;