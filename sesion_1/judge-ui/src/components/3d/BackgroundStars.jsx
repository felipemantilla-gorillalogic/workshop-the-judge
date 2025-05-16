// BackgroundStars.jsx - Efecto de estrellas de fondo
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BackgroundStars = ({ count = 4000 }) => {
  const starsRef = useRef();
  
  // Crear geometría de las estrellas memoizada para que no cambie con cada renderizado
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const sizes = [];
    const colors = []; // Añadimos array de colores
    
    // Mejor función de aleatoriedad con semilla
    const seededRandom = function(seed) {
      let value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return value - Math.floor(value);
    };
    
    // Colores posibles para estrellas (mayormente blancas pero con tonos sutiles)
    const starColors = [
      new THREE.Color(0xffffff), // Blanco puro
      new THREE.Color(0xffffee), // Blanco cálido
      new THREE.Color(0xeeeeff), // Blanco azulado
      new THREE.Color(0xddeeff), // Azul muy claro
      new THREE.Color(0xffeeee), // Rojo muy claro
      new THREE.Color(0xffffdd)  // Amarillo muy claro
    ];
    
    // Distribuir estrellas de forma más aleatoria pero consistente
    const radius = 80; // Aumentar radio para más distribución
    
    // Diferentes semillas para diferentes cuadrantes del espacio
    // esto evita patrones lineales
    const seeds = [];
    for (let i = 0; i < 10; i++) {
      seeds.push(i * 100 + 17);
    }
    
    for (let i = 0; i < count; i++) {
      // Diferentes semillas para cada coordenada
      const seedIndex = i % seeds.length;
      const seedX = seeds[seedIndex] + i * 0.3;
      const seedY = seeds[(seedIndex + 3) % seeds.length] + i * 0.7;
      const seedZ = seeds[(seedIndex + 7) % seeds.length] + i * 0.5;
      
      // Coordenadas aleatorias en espacio cúbico
      let x = (seededRandom(seedX) * 2 - 1) * radius;
      let y = (seededRandom(seedY) * 2 - 1) * radius;
      let z = (seededRandom(seedZ) * 2 - 1) * radius;
      
      // Normalización parcial para mantener algo de distribución esférica
      // pero evitando patrones demasiado regulares
      const distSq = x*x + y*y + z*z;
      if (distSq > radius * radius) {
        const scale = radius / Math.sqrt(distSq) * seededRandom(i + 5000);
        x *= scale;
        y *= scale;
        z *= scale;
      }
      
      vertices.push(x, y, z);
      
      // Tamaño variable con semilla diferente
      const sizeSeed = seeds[(seedIndex + 5) % seeds.length] + i;
      const size = seededRandom(sizeSeed) * 0.4 + 0.1;
      sizes.push(size);
      
      // Asignar color a la estrella
      const colorSeed = seeds[(seedIndex + 8) % seeds.length] + i;
      const colorIndex = Math.floor(seededRandom(colorSeed) * starColors.length);
      const starColor = starColors[colorIndex];
      
      // Guardar color RGB
      colors.push(starColor.r, starColor.g, starColor.b);
    }
    
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    
    geometry.setAttribute(
      'size',
      new THREE.Float32BufferAttribute(sizes, 1)
    );
    
    // Añadir atributo de color
    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );
    
    return geometry;
  }, [count]); // Solo se regenera si cambia el count
  
  // Animación de las estrellas con centelleo mejorado
  useFrame((state, delta) => {
    if (starsRef.current) {
      const time = state.clock.elapsedTime;
      const sizes = starsRef.current.geometry.attributes.size;
      
      // Actualizar uniform de tiempo para animaciones en shader
      if (uniforms.time) {
        uniforms.time.value = time;
      }
      
      // Animar tamaño para crear centelleo más natural
      for (let i = 0; i < sizes.count; i++) {
        // Usar frecuencias variables para cada estrella
        const frequency = 0.1 + (i % 5) * 0.02;
        const phase = i * 0.25;
        
        // Base size inicial variable
        const baseSize = 0.1 + (i % 7) * 0.03;
        
        // Combinar dos ondas sinusoidales para un centelleo más natural
        const twinkle1 = Math.sin(time * frequency + phase) * 0.2;
        const twinkle2 = Math.sin(time * frequency * 1.3 + phase * 1.5) * 0.1;
        
        sizes.array[i] = baseSize * (1.0 + twinkle1 + twinkle2);
      }
      
      sizes.needsUpdate = true;
      
      // Rotar muy lentamente en diferentes ejes para un movimiento más natural
      starsRef.current.rotation.y += delta * 0.005;
      starsRef.current.rotation.x += delta * 0.001;
      starsRef.current.rotation.z += delta * 0.002;
    }
  });
  
  // Definir los shaders memoizados con mejor calidad visual
  const shaders = useMemo(() => {
    return {
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying float vDistance;
        varying vec3 vColor;
        
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vDistance = length(mvPosition.xyz);
          vColor = color; // Pasar color al fragment shader
          gl_PointSize = size * (350.0 / -mvPosition.z); // Ligeramente más grande
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying float vDistance;
        varying vec3 vColor;
        
        void main() {
          // Crear un círculo difuminado más realista para cada estrella
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          
          // Brillo central más intenso
          float intensity = 0.0;
          if (r < 0.5) {
            // Núcleo brillante con desvanecimiento suave
            intensity = smoothstep(0.5, 0.0, r);
            intensity = pow(intensity, 0.8); // Ajuste de potencia para brillo más realista
          }
          
          // Calcular color final con brillo variable dependiendo de la distancia
          float depth = min(1.0, 30.0 / vDistance);
          vec3 finalColor = mix(vColor * 0.8, vColor, depth); // Usa el color de cada estrella
          
          gl_FragColor = vec4(finalColor, intensity);
        }
      `
    };
  }, []);
  
  // Definir los uniformes memoizados - colores de estrellas más realistas
  const uniforms = useMemo(() => {
    return {
      color: { value: new THREE.Color(0xffffff) }, // Color base blanco, mezclas se hacen en shader
      time: { value: 0 } // Usado para animaciones
    };
  }, []);
  
  return (
    <points ref={starsRef} geometry={starsGeometry}>
      <shaderMaterial
        vertexShader={shaders.vertexShader}
        fragmentShader={shaders.fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
};

export default React.memo(BackgroundStars);