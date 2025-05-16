# Modelos 3D para The Judge

Este directorio contiene los modelos 3D utilizados para representar los diferentes estados de los nodos del equipo en The Judge.

## Estructura de archivos requerida

Para que la aplicación funcione correctamente, debes tener los siguientes archivos de modelo en este directorio:

- `connecting_node.glb`: Modelo para equipos en estado "connecting"
- `connected_node.glb`: Modelo para equipos en estado "connected"
- `challenging_node.glb`: Modelo para equipos en estado "challenging"
- `validated_node.glb`: Modelo para equipos en estado "validated"
- `failed_node.glb`: Modelo para equipos en estado "failed"
- `default_node.glb`: Modelo de respaldo por defecto

## Creando tus propios modelos

Puedes crear tus propios modelos 3D usando software como Blender, Maya, o 3ds Max, y luego exportarlos en formato GLB (versión binaria de glTF).

### Recomendaciones para los modelos:

1. **Tamaño y escala**: Mantén los modelos centrados en el origen (0,0,0) y escalados aproximadamente a 1-2 unidades de diámetro.
2. **Complejidad**: Mantén los modelos relativamente simples (menos de 10k polígonos) para un buen rendimiento.
3. **Materiales**: Usa materiales PBR estándar que sean compatibles con glTF.
4. **Colores sugeridos**:
   - Connecting: Gris (#888888)
   - Connected: Azul cian (#00e5ff)
   - Challenging: Naranja (#ff9800)
   - Validated: Verde (#4caf50)
   - Failed: Rojo (#ff4336)

## Exportando desde Blender

1. Selecciona tu modelo
2. Ve a File > Export > glTF 2.0 (.glb/.gltf)
3. Configura:
   - Format: GLB
   - Include: Selected Objects
   - Transform: +Y Up
   - Check "Apply Modifiers"
4. Haz clic en "Export GLB"

## Ejemplos de diseño

Aquí hay algunas ideas para diseños de modelos por estado:

- **Connecting**: Una esfera simple con efecto de desvanecimiento o parpadeo
- **Connected**: Una esfera estable con anillos orbitales
- **Challenging**: Una forma dinámica con partes móviles que sugieran actividad intensa
- **Validated**: Una forma que transmita éxito, como una estrella o un escudo con un checkmark
- **Failed**: Una forma que muestre error, como una esfera agrietada o con una X

## Fallback automático

Si alguno de estos modelos no está presente, la aplicación mostrará automáticamente una esfera simple con el color correspondiente al estado.
