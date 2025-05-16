# The Judge - Interfaz 3D para Sistema de Validación IA Distribuida

Esta aplicación proporciona una interfaz gráfica 3D inmersiva para el sistema "The Judge", una plataforma de validación de IA distribuida. La visualización permite monitorear en tiempo real el estado de los equipos participantes y sus desafíos con una estética futurista.

## Características Principales

- **Visualización 3D Futurista**: Representación visual del sistema con estética holográfica y tecnológica.
- **Representación en Tiempo Real**: Actualización automática del estado de los equipos y sus conexiones.
- **Estados Visuales**: Diferenciación clara de los estados de los nodos (conectado, en desafío, validado, fallido).
- **Animaciones y Efectos**: Transiciones suaves, partículas y efectos de iluminación para mejorar la experiencia visual.
- **Panel de Control**: Estadísticas en tiempo real y controles administrativos.
- **Modales Interactivos**: Detalles de equipos y funcionalidades administrativas.

## Tecnologías Utilizadas

- **React**: Para la estructura de componentes y gestión de UI.
- **React Three Fiber (R3F)**: Para la visualización 3D basada en Three.js.
- **GSAP**: Para animaciones avanzadas y transiciones suaves.
- **CSS Moderno**: Estilos responsivos y variables CSS para consistencia.

## Estructura del Proyecto

```
/src
  /components
    /3d
      NetworkArena.jsx   # Escena principal 3D
      TeamNode.jsx       # Representación visual de un equipo
      CentralNode.jsx    # Nodo central "The Judge"
      DataBeam.jsx       # Conexión visual entre equipos y el nodo central
      BackgroundGrid.jsx # Malla de fondo 
      BackgroundStars.jsx # Estrellas de fondo
    /ui
      ControlPanel.jsx     # Panel de control superpuesto
      TeamDetailsModal.jsx # Modal de detalles del equipo
      RestartModal.jsx     # Modal de reinicio del juego
      LoadingScreen.jsx    # Pantalla de carga
  /utils
    api.js            # Funciones para las llamadas a la API
  App.jsx             # Componente principal de la aplicación
  App.css             # Estilos globales
  index.js            # Punto de entrada
```

## Instalación y Ejecución

1. **Instalar dependencias**:
   ```
   npm install
   ```

2. **Configurar variables de entorno** (opcional):
   Crea un archivo `.env` con:
   ```
   REACT_APP_API_URL=http://your-backend-url
   ```

3. **Iniciar la aplicación en modo desarrollo**:
   ```
   npm start
   ```

4. **Crear build para producción**:
   ```
   npm run build
   ```

## Integración con el Backend

La aplicación se comunica con el backend de "The Judge" a través de las siguientes API:

- `GET /status`: Obtener el estado global de todos los equipos
- `GET /status/:id`: Obtener información detallada de un equipo
- `POST /restart`: Reiniciar el sistema

## Personalización

- Los colores y variables visuales se pueden modificar en `App.css` en las variables CSS.
- La frecuencia de actualización se puede ajustar en el componente App.jsx (por defecto, 10 segundos).
- Los efectos visuales pueden ser ajustados en los respectivos componentes 3D.