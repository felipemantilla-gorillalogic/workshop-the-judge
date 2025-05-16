# Plan de Taller: Automatización Inteligente con IA (3 horas)

## Descripción General
Este taller práctico guiará a los participantes a través de la creación de un sistema de automatización inteligente utilizando n8n como orquestador, Flowise para construir agentes IA, y técnicas avanzadas de Prompt Engineering. Los participantes terminarán con un "Asistente de Categorización de Tickets" completamente funcional.

## Requisitos Previos
- Conocimientos básicos de programación
- Laptop con Docker instalado (o acceso a versiones cloud de n8n y Flowise)
- Cuenta de API de OpenAI (se proporcionarán claves temporales a quienes no dispongan de una)

## Programa Detallado

### 0. Introducción Enfocada (5 minutos)
**Objetivo**: Establecer el contexto y la meta del taller

**Actividades**:
- Demostración del proyecto final funcionando
- Presentación del caso práctico: "Asistente de categorización de tickets"
- Visión general del stack tecnológico y su integración

### 1. Fundamentos de n8n como Orquestador (30 minutos)
**Objetivo**: Dominar la creación de flujos de trabajo automatizados con n8n

**Teoría** (5 min):
- Qué es un orquestador y por qué n8n
- Arquitectura básica de un flujo de trabajo

**Componentes clave** (10 min):
- Nodo Webhook: Punto de entrada para datos
- Nodo HTTP Request: Comunicación con APIs externas
- Nodos Set e IF: Manipulación de datos y lógica condicional

**Ejercicio práctico** (15 min):
- Crear un flujo que recibe texto vía webhook
- Procesar el texto para identificar palabras clave
- Bifurcar el flujo basado en condiciones simples

### 2. Ingeniería de Prompts Efectivos (35 minutos)
**Objetivo**: Construir prompts robustos para tareas de automatización

**Patrones efectivos de prompts** (15 min):
- Estructura de un prompt robusto
- Uso de delimitadores y formato JSON
- Ejemplos few-shot para mejorar la consistencia
- Técnicas de Chain-of-Thought para razonamiento

**Optimización de prompts** (10 min):
- Estrategias para reducir alucinaciones
- Balancear creatividad y precisión
- Extracción estructurada de información

**Ejercicio práctico** (10 min):
- Diseñar prompts para categorización de tickets
- Probar con ejemplos reales y refinar la precisión
- Implementar salida estructurada en JSON

### 3. Flowise y Agentes IA (35 minutos)
**Objetivo**: Implementar agentes IA visuales que puedan realizar tareas complejas

**Configuración rápida** (10 min):
- Introducción a la interfaz de Flowise
- Conexión con modelo de lenguaje (OpenAI/Ollama)
- Diferencia entre cadenas y agentes

**Integración de herramientas** (10 min):
- Añadir herramientas de búsqueda y cálculo
- Configurar memoria para conversaciones contextuales
- Exposición como API REST

**Ejercicio práctico** (15 min):
- Configurar un agente para categorización
- Integrar prompts desarrollados anteriormente
- Conectar con n8n mediante HTTP Request

### 4. Proyecto Integrador - Asistente de Categorización (60 minutos)
**Objetivo**: Construir un sistema completo integrando todos los componentes

**Fase 1: Configuración del flujo base** (20 min):
- Crear webhook de entrada para tickets
- Implementar llamada al agente de Flowise
- Establecer rutas para diferentes categorías

**Fase 2: Mejora de la categorización** (20 min):
- Implementar extracción de entidades clave
- Desarrollar sistema de priorización automática
- Mejorar precisión con reglas de negocio específicas

**Fase 3: Ampliación con herramientas** (20 min):
- Incorporar búsqueda en base de conocimiento
- Añadir calculadora para estimación de tiempos
- Implementar notificaciones basadas en prioridad

### 5. Cierre y Bonus: Técnicas Avanzadas (15 minutos)
**Objetivo**: Consolidar aprendizajes y presentar conceptos avanzados

**Revisión del proyecto** (5 min):
- Análisis del sistema completo construido
- Discusión de posibles mejoras

**Bonus: Introducción a MCP** (5 min):
- Qué es Model Context Protocol
- Cómo mejora la retención de contexto en interacciones largas
- Casos de uso ideales para MCP

**Recursos para continuar** (5 min):
- Repositorio GitHub con templates adicionales
- Documentación recomendada para MCP y técnicas avanzadas
- Comunidad de práctica

## Materiales y Recursos
- Repositorio GitHub: Con todos los ejemplos pre-configurados
- Guía paso a paso: Para seguir independientemente
- Templates de prompts: Colección lista para usar y adaptar
- Configuraciones de n8n y Flowise: Pre-construidas para cada ejercicio
- Solución completa: Versión final del proyecto para referencia
- Recursos bonus: Introducción a MCP y ejemplos básicos

## Estrategia Pedagógica
- Cada sección comienza con una breve demostración
- Los participantes trabajan con templates parcialmente completados
- Checkpoints claros para asegurar que nadie se quede atrás
- Material de respaldo en caso de problemas técnicos
- Equilibrio entre explicación conceptual y aplicación práctica

## Resultados Esperados
Al finalizar este taller, los participantes podrán:
- Crear flujos de automatización con n8n
- Diseñar prompts efectivos para diferentes tareas
- Implementar agentes IA con Flowise
- Integrar todos los componentes en soluciones prácticas
- Adaptar lo aprendido a sus propios casos de uso
- Conocer la existencia de técnicas avanzadas como MCP para futura exploración