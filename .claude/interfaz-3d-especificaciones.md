# Especificación de Interfaz 3D para The Judge

## Visión General
Este documento proporciona las especificaciones para crear una interfaz gráfica 3D para "The Judge", una plataforma de validación de IA distribuida. La interfaz utilizará Three.js o React Three Fiber (R3F) con React para visualizar equipos, desafíos y estados en un entorno tridimensional inmersivo con un estilo futurista y tecnológico.

## Estilo Visual de Referencia
La interfaz seguirá un estilo futurista, minimalista y tecnológico similar a las imágenes de referencia proporcionadas:

### Características Clave del Estilo Visual
- **Fondo**: Negro profundo (#02060e) con una sutil red/malla de conexiones en cian muy tenue
- **Elementos Principales**: Círculos/nodos brillantes en cian/turquesa (#00e5ff) con efecto de resplandor
- **Conexiones**: Líneas delgadas brillantes en cian que conectan los nodos al elemento central
- **Iconografía**: Iconos simples, geométricos y minimalistas dentro de círculos para representar equipos y el juez
- **Iluminación**: Uso de efectos de iluminación y resplandor para crear la sensación de tecnología avanzada
- **Estética**: Similar a interfaces de ciencia ficción, tecnología holográfica, o visualizaciones de redes neuronales

## Objetivos
- Visualizar el estado de los equipos participantes en un entorno 3D interactivo con estética futurista
- Representar los desafíos, puntajes y estados de validación de manera intuitiva
- Proporcionar una experiencia visual atractiva que complemente la funcionalidad existente
- Mantener la capacidad de administración del sistema (reinicio, monitoreo)

## Estructura del Proyecto

### Tecnologías Principales
- **Frontend**: React con React Three Fiber (recomendado) o Three.js puro
- **Gestión de Estado**: React Context API o Redux
- **API**: Integración con las APIs existentes de The Judge
- **Despliegue**: Integración con la estructura actual de Express

## Especificaciones de la Interfaz 3D

### 1. Escena Principal: Red Neural de Competición

#### Descripción
Una visualización 3D donde cada equipo se representa como un nodo brillante en un espacio virtual tipo red neural o sistema planetario. El "Judge" está en el centro como un nodo más grande.

#### Características
- **Vista Aérea por Defecto**: La cámara comienza con una vista diagonal del sistema
- **Navegación**: Controles orbitales para rotar, hacer zoom y desplazarse por el espacio
- **Iluminación**: Iluminación ambiental oscura con efectos de resplandor (bloom) para elementos clave
- **Fondo**: Negro profundo (#02060e) con una sutil red/malla de conexiones similar a la imagen de referencia

#### Elementos de Fondo
- **Red/Malla de Conexiones**: Una estructura similar a una telaraña o constelación en el fondo, formada por líneas tenues y puntos de conexión, creando una sensación de red neuronal o espacio digital
- **Partículas Flotantes**: Pequeñas partículas brillantes que flotan lentamente, creando profundidad

#### Representación Central (The Judge)
- **Nodo Central**: Un círculo grande brillante en color cian (#00e5ff) con efecto de resplandor
- **Icono Interior**: Un icono minimalista que representa al "Judge" (similar al de la imagen de referencia 2, con un diseño tipo robot/IA)
- **Anillos Orbitales**: Anillos concéntricos sutiles que giran lentamente alrededor del nodo central
- **Pulsos de Energía**: Ondas de energía que ocasionalmente emanan del centro

#### Representación de Equipos
Cada equipo se visualiza como:
- **Nodo**: Círculo brillante en cian (#00e5ff) más pequeño que el central
- **Icono Interior**: Icono de escudo con una figura humana estilizada (como en la imagen de referencia 1)
- **Conexión**: Línea brillante que conecta cada equipo con el nodo central
- **Etiqueta**: Nombre del equipo debajo del nodo ("TEAM A", "TEAM B", etc.)
- **Estado Visual**:
  - **Conectado**: Pulso de luz cian suave (#00e5ff)
  - **En Desafío**: Pulso de luz naranja (#ff9800) con partículas fluyendo por la conexión hacia el centro
  - **Validado**: Aura brillante cian/verde (#4cffdf) estable, más intensa
  - **Fallido**: Aura roja pulsante (#ff4336)
- **Tamaño**: Proporcional a su puntuación (los equipos con mayor puntuación son más grandes)

### 2. Panel de Control y Estadísticas

#### Descripción
Interfaz superpuesta en 2D que mantiene el estilo futurista de la visualización 3D.

#### Elementos
- **Contador de Equipos**: Visualización minimalista del número total de equipos
- **Contador de Estados**: Número de equipos en cada estado con íconos correspondientes
- **Botón de Reinicio**: Acceso al modal de reinicio del juego
- **Botón de Actualización**: Para refrescar manualmente los datos
- **Filtros de Visualización**: Para mostrar/ocultar equipos según su estado

#### Estilo del Panel de Control
- **Tipografía**: Fuente moderna, sans-serif, preferiblemente con estilo futurista
- **Color de Texto**: Cian brillante (#00e5ff) sobre fondo oscuro semitransparente
- **Botones**: Minimalistas con bordes brillantes y efectos de hover
- **Disposición**: Ubicado en la parte superior o lateral de la pantalla, no intrusivo

### 3. Sistema de Desafíos en 3D

#### Descripción
Visualización 3D de los desafíos activos y completados.

#### Características
- **Conexiones de Desafío**: Cuando un equipo está en desafío, la línea que conecta con el centro pulsa y tiene partículas fluyendo
- **Transferencia de Datos**: Animación de partículas brillantes fluyendo del centro a los nodos (desafío) o de los nodos al centro (respuesta)
- **Historial de Desafíos**: Pequeños satélites orbitando alrededor de cada nodo de equipo representando desafíos completados
- **Visualizador de Detalles**: Al hacer clic en un equipo, se puede ver los detalles de sus desafíos actuales/pasados

### 4. Transiciones y Animaciones

#### Cambios de Estado
- **Asignación de Desafío**: Pulso de energía que viaja desde el centro al nodo del equipo
- **Validación Exitosa**: Explosión de partículas cian/verdes y aumento del brillo/tamaño del nodo
- **Fallo**: Pulso rojo y disminución momentánea del brillo
- **Reinicio del Sistema**: Animación donde todas las conexiones se atenúan y luego vuelven a encenderse secuencialmente

#### Interactividad
- **Hover**: Aumento del brillo y leve pulsación
- **Selección**: La cámara se acerca suavemente al nodo seleccionado
- **Deselección**: Retorno suave a la vista previa

### 5. Modal de Información Detallada

#### Descripción
Al seleccionar un equipo, aparece un panel holográfico flotante con información detallada.

#### Contenido
- **Información del Equipo**: Nombre, descripción, miembros
- **Estado Actual**: Con indicador visual correspondiente
- **Puntuación**: Visualizada con gráfico 3D pequeño
- **Historial de Desafíos**: Lista de desafíos completados con puntuaciones
- **Acceso al Desafío Actual**: Si está en progreso, muestra el desafío actual

#### Estilo del Modal
- **Borde**: Líneas brillantes en cian, delgadas
- **Fondo**: Semitransparente, oscuro
- **Tipografía**: Luminosa, cian sobre fondo oscuro
- **Elementos Interactivos**: Botones y controles con efecto de resplandor al interactuar

### 6. Funcionalidades Administrativas

#### Interfaz de Administración
- **Incorporar el Modal de Reinicio**: Mantener la funcionalidad actual con integración visual coherente
- **Panel de Administración**: Acceso a controles administrativos
- **Configuración Visual**: Opciones para ajustar la visualización (calidad, efectos)

## Especificaciones Técnicas

### Estructura de Componentes React

```
/src
├── components/
│   ├── 3d/
│   │   ├── NetworkArena.jsx      # Escena principal 3D
│   │   ├── TeamNode.jsx          # Representación 3D de un equipo
│   │   ├── CentralNode.jsx       # Nodo central "The Judge"
│   │   ├── DataBeam.jsx          # Conexión visual de desafío
│   │   ├── BackgroundGrid.jsx    # Malla de fondo
│   │   └── EffectsManager.jsx    # Gestión de efectos visuales
│   ├── ui/
│   │   ├── FuturisticPanel.jsx   # Panel de control superpuesto
│   │   ├── TeamDetails.jsx       # Modal de detalles del equipo
│   │   ├── RestartModal.jsx      # Modal de reinicio (existente)
│   │   └── StatisticsDisplay.jsx # Visualización de estadísticas
│   └── layout/
│       ├── MainLayout.jsx        # Estructura principal de la aplicación
│       └── Canvas3D.jsx          # Contenedor del canvas 3D
├── hooks/
│   ├── useTeamsData.js           # Hook para obtener datos de equipos
│   ├── useChallenge.js           # Hook para gestionar desafíos
│   └── use3DEffects.js           # Hook para efectos visuales
├── contexts/
│   ├── TeamsContext.js           # Contexto para los datos de equipos
│   └── AdminContext.js           # Contexto para funcionalidades admin
└── utils/
    ├── api.js                    # Funciones para llamadas a la API
    ├── three/
    │   ├── glowShader.js         # Shader para efectos de resplandor
    │   ├── gridMaterial.js       # Material para la malla de fondo
    │   └── animations.js         # Funciones de animación
    └── helpers.js                # Funciones auxiliares
```

### Integración con API Existente

#### Endpoints Utilizados
- `GET /status` - Obtener el estado global de todos los equipos
- `GET /status/:id` - Obtener información detallada de un equipo
- `POST /restart` - Reiniciar el sistema

#### Polling y Actualizaciones
- Polling automático cada 10 segundos (igual que la implementación actual)
- Actualización inmediata de la visualización 3D al recibir nuevos datos
- Transiciones animadas entre estados

### Efectos Visuales Avanzados

#### Shaders y Postprocesado
- **Bloom Effect**: Para crear el efecto de resplandor en los elementos brillantes
- **Glow Shader**: Para el efecto de brillo alrededor de nodos y conexiones
- **Depth of Field**: Sutil efecto de profundidad para mejorar la inmersión

#### Partículas y Sistemas de Partículas
- **Fondo Espacial**: Partículas para simular estrellas lejanas
- **Flujo de Datos**: Sistemas de partículas para visualizar transferencia de información
- **Efectos de Estado**: Explosiones y efectos de partículas para cambios de estado

### Modelado 3D y Rendimiento

#### Modelos y Geometrías
- Utilizar geometrías primitivas de Three.js para máxima compatibilidad
- Modelos de baja poligonización para mejor rendimiento
- LOD (Level of Detail) para optimizar rendering en vistas distantes

#### Optimización
- Instanciación para elementos repetitivos
- Uso de shaders eficientes
- Implementación de técnicas de culling para escenas grandes

### Mapa de Estados y Transiciones

#### Estados de Equipo
1. **Conectado**
   - Nodo con resplandor cian suave y pulsante (#00e5ff)
   - Línea de conexión estable al centro

2. **En Desafío**
   - Nodo con resplandor naranja pulsante (#ff9800)
   - Línea de conexión con partículas fluyendo hacia/desde el centro
   - Efecto de "descarga de datos" visual

3. **Validado**
   - Nodo con resplandor intenso cian/verde (#4cffdf)
   - Línea de conexión más brillante
   - Pequeñas partículas orbitando el nodo

4. **Fallido**
   - Nodo con resplandor rojo pulsante (#ff4336)
   - Línea de conexión más tenue o intermitente
   - Efecto visual de "error" o "interferencia"

#### Transiciones Animadas
- Todas las transiciones de estado utilizan GSAP o la API de animación de Three.js
- Duración de 1-2 segundos para transiciones suaves
- Easing adecuado para movimientos naturales

## Paleta de Colores y Diseño Visual

### Colores Principales
- **Fondo**: Negro profundo (#02060e)
- **Elementos Principales**: Cian brillante (#00e5ff)
- **Conectado**: Cian (#00e5ff)
- **En Desafío**: Naranja brillante (#ff9800)
- **Validado**: Cian/Verde brillante (#4cffdf)
- **Fallido**: Rojo brillante (#ff4336)
- **UI Elements**: Cian sobre fondo oscuro semitransparente
- **Nodo Central**: Cian brillante con detalles en blanco

### Temas Visuales
- **Estilo**: Futurista, holográfico, minimalista, alta tecnología
- **Elementos Decorativos**: Malla de conexiones, líneas thin, círculos, resplandores
- **Tipografía**: Sans-serif moderna con apariencia tecnológica/futurista

## Interacciones y Controles

### Navegación
- **Rotación de Cámara**: Click izquierdo + arrastrar
- **Zoom**: Rueda del ratón o pinch en móviles
- **Paneo**: Click derecho + arrastrar o dos dedos en móviles

### Interacción con Equipos
- **Selección**: Click en el nodo del equipo
- **Información Rápida**: Hover sobre el nodo muestra tooltip básico
- **Vista Detallada**: Click abre el panel holográfico con toda la información

### Controles Administrativos
- **Botón de Reinicio**: Accesible desde el panel de control, abre el modal estilizado
- **Filtros**: Toggles para mostrar/ocultar equipos por estado
- **Vistas Predefinidas**: Botones para cambiar la cámara a posiciones clave

## Implementación y Despliegue

### Pasos de Implementación
1. **Fase 1**: Configuración básica de Three.js/R3F con React
2. **Fase 2**: Implementación de la escena de red y nodos
3. **Fase 3**: Integración con la API existente
4. **Fase 4**: Implementación de interacciones y animaciones
5. **Fase 5**: Refinamiento visual y optimización

### Integración con Express
- Servir los archivos estáticos de React desde Express
- Mantener las rutas de API existentes
- Asegurar compatibilidad de rutas frontend y backend

### Consideraciones de Dispositivos
- **Computadoras de Escritorio**: Experiencia completa con todos los efectos
- **Tablets**: Ajustes para pantallas táctiles con calidad media
- **Móviles**: Versión simplificada con efectos reducidos para mejor rendimiento

## Ejemplo de Implementación del Nodo de Equipo en R3F

```jsx
// TeamNode.jsx - Representación 3D de un equipo
import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { gsap } from "gsap";
import { MeshDistortMaterial } from "@react-three/drei";

// Estados visuales definidos por colores y animaciones
const STATUS_CONFIGS = {
  connected: {
    color: "#00e5ff",
    intensity: 2.0,
    pulsate: true,
    distort: 0.2
  },
  challenged: {
    color: "#ff9800",
    intensity: 2.5,
    pulsate: true,
    distort: 0.3
  },
  validated: {
    color: "#4cffdf",
    intensity: 3.0,
    pulsate: false,
    distort: 0.1
  },
  failed: {
    color: "#ff4336",
    intensity: 2.0,
    pulsate: true,
    distort: 0.4
  }
};

const TeamNode = ({ team, position, onClick, selected }) => {
  const nodeRef = useRef();
  const glowRef = useRef();
  const iconRef = useRef();
  const [hovered, setHovered] = useState(false);
  const statusConfig = STATUS_CONFIGS[team.status];
  
  // Cargar textura para el icono
  const iconTexture = useTexture('/icons/team-shield.png');
  
  // Efectos para cambios de estado
  useEffect(() => {
    if (nodeRef.current) {
      // Animación de escala según puntuación
      const scale = 1 + (team.score / 100) * 0.5;
      gsap.to(nodeRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
      
      // Animación del material según estado
      if (glowRef.current) {
        gsap.to(glowRef.current.material, {
          emissiveIntensity: statusConfig.intensity,
          duration: 0.5
        });
      }
    }
  }, [team.status, team.score]);
  
  // Animaciones continuas
  useFrame((state, delta) => {
    if (nodeRef.current) {
      // Rotación suave constante
      iconRef.current.rotation.y += delta * 0.2;
      
      // Efecto de flotación
      nodeRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Efecto de pulsación según estado
      if (statusConfig.pulsate) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
        glowRef.current.material.emissiveIntensity = 
          statusConfig.intensity * (0.8 + pulse * 0.4);
      }
    }
  });
  
  return (
    <group position={position}>
      {/* Nodo principal */}
      <group 
        ref={nodeRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Círculo exterior (aura) */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial 
            color={statusConfig.color}
            transparent
            opacity={0.15}
          />
        </mesh>
        
        {/* Círculo principal */}
        <mesh>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial 
            color={statusConfig.color}
            emissive={statusConfig.color}
            emissiveIntensity={statusConfig.intensity}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Icono interior */}
        <mesh ref={iconRef} position={[0, 0, 0.05]}>
          <circleGeometry args={[0.7, 32]} />
          <meshBasicMaterial 
            map={iconTexture}
            transparent
            opacity={0.9}
            color={hovered ? "#ffffff" : "#e0e0e0"}
          />
        </mesh>
        
        {/* Anillo exterior */}
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[1.0, 1.1, 32]} />
          <meshBasicMaterial 
            color={statusConfig.color}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Efecto de selección */}
        {selected && (
          <mesh rotation={[0, 0, 0]} position={[0, 0, -0.05]}>
            <ringGeometry args={[1.3, 1.4, 32]} />
            <meshBasicMaterial 
              color="#ffffff"
              transparent
              opacity={0.6 + Math.sin(Date.now() * 0.005) * 0.4}
            />
          </mesh>
        )}
        
        {/* Partículas de estado */}
        {team.status === 'validated' && (
          <group>
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh 
                key={i} 
                position={[
                  Math.cos(i / 5 * Math.PI * 2) * 0.9,
                  Math.sin(i / 5 * Math.PI * 2) * 0.9,
                  0.1
                ]}
              >
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color={statusConfig.color} />
              </mesh>
            ))}
          </group>
        )}
        
        {/* Etiqueta de nombre */}
        <Html position={[0, -1.8, 0]} center>
          <div className="team-label">
            <span className="team-name">{team.teamName}</span>
            <span className="team-score">{team.score}</span>
          </div>
        </Html>
      </group>
    </group>
  );
};

export default TeamNode;
```

## Componente del Nodo Central

```jsx
// CentralNode.jsx - Representación 3D del nodo central "The Judge"
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

const CentralNode = ({ position = [0, 0, 0] }) => {
  const nodeRef = useRef();
  const ringsRef = useRef();
  const pulseRef = useRef();
  
  // Cargar textura para el icono
  const judgeIconTexture = useTexture('/icons/judge-icon.png');
  
  // Animaciones continuas
  useFrame((state, delta) => {
    if (nodeRef.current) {
      // Rotación lenta del icono
      nodeRef.current.rotation.z += delta * 0.1;
    }
    
    if (ringsRef.current) {
      // Rotación independiente de los anillos
      ringsRef.current.children[0].rotation.z += delta * 0.2;
      ringsRef.current.children[1].rotation.z -= delta * 0.1;
      ringsRef.current.children[2].rotation.z += delta * 0.05;
    }
    
    if (pulseRef.current) {
      // Pulso de energía
      pulseRef.current.material.opacity = 
        0.4 * (0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.5);
      pulseRef.current.scale.x = 
        pulseRef.current.scale.y = 
        pulseRef.current.scale.z = 
        4 + Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
    }
  });
  
  return (
    <group position={position}>
      {/* Nodo principal */}
      <group ref={nodeRef}>
        {/* Círculo principal */}
        <mesh>
          <circleGeometry args={[2.5, 64]} />
          <meshStandardMaterial 
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={2.5}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Icono interior */}
        <mesh position={[0, 0, 0.1]}>
          <circleGeometry args={[1.8, 64]} />
          <meshBasicMaterial 
            map={judgeIconTexture}
            transparent
            opacity={0.9}
            color="#ffffff"
          />
        </mesh>
        
        {/* Texto "JUDGE" */}
        <mesh position={[0, -3, 0]}>
          <planeGeometry args={[5, 1]} />
          <meshBasicMaterial 
            color="#00e5ff"
            transparent
            opacity={0.9}
            map={useTexture('/text/judge-text.png')}
          />
        </mesh>
      </group>
      
      {/* Anillos orbitales */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <ringGeometry args={[2.7, 2.8, 64]} />
          <meshBasicMaterial 
            color="#00e5ff"
            transparent
            opacity={0.6}
            side={2}
          />
        </mesh>
        
        <mesh rotation={[Math.PI/2, Math.PI/4, Math.PI/6]}>
          <ringGeometry args={[3.2, 3.3, 64]} />
          <meshBasicMaterial 
            color="#00e5ff"
            transparent
            opacity={0.4}
            side={2}
          />
        </mesh>
        
        <mesh rotation={[Math.PI/2, -Math.PI/4, -Math.PI/6]}>
          <ringGeometry args={[3.7, 3.8, 64]} />
          <meshBasicMaterial 
            color="#00e5ff"
            transparent
            opacity={0.2}
            side={2}
          />
        </mesh>
      </group>
      
      {/* Pulso de energía */}
      <mesh ref={pulseRef} rotation={[Math.PI/2, 0, 0]}>
        <ringGeometry args={[3.9, 4.0, 64]} />
        <meshBasicMaterial 
          color="#00e5ff"
          transparent
          opacity={0.4}
          side={2}
        />
      </mesh>
    </group>
  );
};

export default CentralNode;
```

## Ejemplo de Implementación de la Malla de Fondo

```jsx
// BackgroundGrid.jsx - Malla de fondo estilo rejilla holográfica
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BackgroundGrid = () => {
  const gridRef = useRef();
  const pointsRef = useRef();
  
  // Crear geometría de la rejilla
  const createGridGeometry = () => {
    const size = 100;
    const divisions = 30;
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
    const size = 100;
    const divisions = 30;
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
        positions[i+2] = Math.sin(positions[i]/10 + time/2) * Math.cos(positions[i+1]/10 + time/2) * 0.5;
      }
      
      gridRef.current.geometry.attributes.position.needsUpdate = true;
      
      // También actualizar los puntos
      if (pointsRef.current) {
        const pointPositions = pointsRef.current.geometry.attributes.position.array;
        
        for (let i = 0; i < pointPositions.length; i += 3) {
          pointPositions[i+2] = Math.sin(pointPositions[i]/10 + time/2) * 
                                Math.cos(pointPositions[i+1]/10 + time/2) * 0.5;
        }
        
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });
  
  return (
    <group rotation={[Math.PI/2, 0, 0]} position={[0, -5, 0]}>
      {/* Líneas de la rejilla */}
      <lineSegments ref={gridRef} geometry={createGridGeometry()}>
        <lineBasicMaterial 
          color="#00e5ff"
          transparent
          opacity={0.1}
          linewidth={1}
        />
      </lineSegments>
      
      {/* Puntos en las intersecciones */}
      <points ref={pointsRef} geometry={createPointsGeometry()}>
        <pointsMaterial 
          color="#00e5ff"
          size={0.5}
          transparent
          opacity={0.2}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};

export default BackgroundGrid;
```

## Ejemplo de Implementación de la Conexión de Datos

```jsx
// DataBeam.jsx - Conexión visual entre equipo y nodo central
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DataBeam = ({ start, end, status = 'connected', active = false }) => {
  const beamRef = useRef();
  const particlesRef = useRef();
  
  // Configuración según estado
  const getBeamConfig = () => {
    switch(status) {
      case 'challenged':
        return {
          color: '#ff9800',
          width: 2,
          particleSpeed: 0.8,
          particleCount: 15,
          opacity: 0.7,
          flowDirection: 1 // Hacia el equipo
        };
      case 'validated':
        return {
          color: '#4cffdf',
          width: 2,
          particleSpeed: 0.2,
          particleCount: 5,
          opacity: 0.9,
          flowDirection: 0 // Estático
        };
      case 'failed':
        return {
          color: '#ff4336',
          width: 1,
          particleSpeed: 0.5,
          particleCount: 8,
          opacity: 0.5,
          flowDirection: -1 // Hacia el centro
        };
      case 'connected':
      default:
        return {
          color: '#00e5ff',
          width: 1,
          particleSpeed: 0.3,
          particleCount: 3,
          opacity: 0.6,
          flowDirection: 0 // Estático
        };
    }
  };
  
  const config = getBeamConfig();
  
  // Actualizar posición y animación
  useFrame((state, delta) => {
    if (beamRef.current) {
      // Actualizar posiciones del beam
      beamRef.current.geometry.setFromPoints([
        new THREE.Vector3(...start),
        new THREE.Vector3(...end)
      ]);
      
      // Efecto pulsante para la línea
      if (active) {
        const pulse = Math.sin(state.clock.elapsedTime * 5) * 0.5 + 0.5;
        beamRef.current.material.opacity = config.opacity * (0.7 + pulse * 0.3);
      }
      
      // Animar partículas a lo largo de la línea
      if (particlesRef.current) {
        particlesRef.current.children.forEach((particle, i) => {
          // Calcular posición en la línea con offset por índice
          // Para que las partículas estén distribuidas a lo largo de la línea
          let t = ((state.clock.elapsedTime * config.particleSpeed) + i / config.particleCount) % 1;
          
          // Si el flujo es hacia el centro, invertir dirección
          if (config.flowDirection < 0) {
            t = 1 - t;
          } else if (config.flowDirection === 0) {
            // Si es estático, hacer que oscilen en lugar de fluir
            t = 0.5 + Math.sin(state.clock.elapsedTime * 2 + i * Math.PI/config.particleCount) * 0.4;
          }
          
          // Interpolación lineal entre inicio y fin
          particle.position.x = start[0] * (1 - t) + end[0] * t;
          particle.position.y = start[1] * (1 - t) + end[1] * t;
          particle.position.z = start[2] * (1 - t) + end[2] * t;
          
          // Pulso de tamaño para partículas
          const scalePulse = 0.08 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.04;
          particle.scale.set(scalePulse, scalePulse, scalePulse);
        });
      }
    }
  });
  
  return (
    <group>
      {/* Línea principal */}
      <line ref={beamRef}>
        <bufferGeometry attach="geometry" />
        <lineBasicMaterial
          color={config.color}
          transparent
          opacity={config.opacity}
          linewidth={config.width}
        />
      </line>
      
      {/* Partículas en la línea */}
      <group ref={particlesRef}>
        {Array.from({ length: active ? config.particleCount : 0 }).map((_, i) => (
          <mesh key={i} position={[0, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial 
              color={config.color}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default DataBeam;
```

## Componente de Escena Principal

```jsx
// NetworkArena.jsx - Escena principal
import React, { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  EffectComposer, 
  Bloom, 
  DepthOfField 
} from "@react-three/drei";
import CentralNode from "./CentralNode";
import TeamNode from "./TeamNode";
import DataBeam from "./DataBeam";
import BackgroundGrid from "./BackgroundGrid";
import BackgroundStars from "./BackgroundStars";
import { useTeamsData } from "../../hooks/useTeamsData";

// Post-procesado para efectos visuales
const Effects = () => {
  const { gl, scene, camera } = useThree();
  
  return (
    <EffectComposer>
      <Bloom 
        intensity={0.4} 
        luminanceThreshold={0.2} 
        luminanceSmoothing={0.9} 
      />
      <DepthOfField 
        focusDistance={0} 
        focalLength={0.02} 
        bokehScale={2} 
        height={480} 
      />
    </EffectComposer>
  );
};

const NetworkArena = () => {
  const { teams, loading, error } = useTeamsData();
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  // Distribución de equipos en círculo
  const calculatePosition = (index, total) => {
    const radius = Math.max(15, total * 2); // Radio adaptativo
    const angle = (index / total) * Math.PI * 2;
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ];
  };
  
  // Manejar selección de equipo
  const handleTeamClick = (teamId) => {
    setSelectedTeam(teamId === selectedTeam ? null : teamId);
  };
  
  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 20, 40], fov: 50 }}
      gl={{ 
        antialias: true,
        alpha: true
      }}
    >
      {/* Iluminación ambiental */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#00e5ff" />
      
      {/* Fondo */}
      <color attach="background" args={["#02060e"]} />
      <BackgroundStars />
      <BackgroundGrid />
      
      {/* Nodo central (Judge) */}
      <CentralNode position={[0, 0, 0]} />
      
      {/* Equipos y conexiones */}
      {teams.map((team, index) => (
        <React.Fragment key={team.id}>
          <TeamNode
            team={team}
            position={calculatePosition(index, teams.length)}
            onClick={() => handleTeamClick(team.id)}
            selected={team.id === selectedTeam}
          />
          
          {/* Conexión al nodo central */}
          <DataBeam
            start={calculatePosition(index, teams.length)}
            end={[0, 0, 0]}
            status={team.status}
            active={team.status !== 'connected'}
          />
        </React.Fragment>
      ))}
      
      {/* Post-procesado */}
      <Effects />
      
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
  );
};

export default NetworkArena;
```

## Conclusión

Esta especificación proporciona un marco detallado para desarrollar una interfaz 3D visualmente impactante para "The Judge", siguiendo el estilo futurista y tecnológico mostrado en las imágenes de referencia. La implementación aprovecha la arquitectura existente mientras agrega una capa visual inmersiva que mejora la experiencia de monitoreo y administración del sistema.

La visualización 3D no solo hace más atractiva la aplicación, sino que también proporciona una forma más intuitiva de entender el estado del sistema, las relaciones entre equipos y desafíos, y el progreso de la competición, todo ello manteniendo una estética coherente de alta tecnología.

Este proyecto equilibra los aspectos visuales con el rendimiento y la funcionalidad, asegurando que la interfaz sea accesible en una variedad de dispositivos mientras mantiene todas las capacidades administrativas necesarias.