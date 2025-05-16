/**
 * Interacción con la API de OpenAI
 */

require('dotenv').config();
const OpenAI = require('openai');

// Clave de API predeterminada para el Judge (en un entorno real, usaríamos una clave de entorno)
const JUDGE_API_KEY = process.env.OPENAI_API_KEY;

// Cliente OpenAI para evaluación
const openai = new OpenAI({
  apiKey: JUDGE_API_KEY
});

/**
 * Genera un token de OpenAI para un equipo
 * @returns {string} Token generado (simulado para este ejercicio)
 */
function generateOpenAiToken() {
  // En un entorno real, podríamos generar tokens de API restringidos
  // Aquí simplemente generamos una cadena aleatoria para simular
  return process.env.PERSONAL_OPENAI_API_KEY;
}

/**
 * Genera un desafío para un equipo
 * @returns {Object} Objeto con el desafío generado
 */
async function generateChallenge() {
  try {
    // Posibles tipos de desafíos
    const challengeTypes = [
      {
        prompt: "Resume el siguiente texto en una sola frase clara.",
        input: "La inteligencia artificial está transformando todas las industrias, desde la salud hasta la educación. Los recientes avances en aprendizaje profundo y procesamiento del lenguaje natural han permitido aplicaciones que antes eran imposibles. Sin embargo, también plantea desafíos éticos importantes sobre privacidad, sesgo y el futuro del trabajo humano."
      },
      {
        prompt: "Explica el siguiente concepto técnico en términos que un niño de 10 años pueda entender.",
        input: "El aprendizaje por refuerzo es un tipo de aprendizaje automático donde un agente aprende a tomar decisiones interactuando con un entorno y recibiendo recompensas o penalizaciones basadas en sus acciones."
      },
      {
        prompt: "Identifica las palabras clave más importantes en este texto.",
        input: "La computación cuántica utiliza propiedades de la mecánica cuántica, como la superposición y el entrelazamiento, para realizar cálculos que serían imposibles para las computadoras clásicas. Esto podría revolucionar campos como la criptografía, el descubrimiento de fármacos y la simulación de sistemas físicos complejos."
      }, 
      {
        prompt: "Encuentra y corrige los errores gramaticales en este texto.",
        input: "El gato persiguen al raton por el jardin. Los pajaros cantaban muy bonitos en el arbol, pero el niño no podia escucharlos por que tenia los auriculares puestos."
      },
      {
        prompt: "Traduce este texto técnico a un lenguaje más casual y conversacional.",
        input: "La implementación de algoritmos de machine learning requiere una comprensión profunda de estadística y cálculo multivariable. La optimización de hiperparámetros es crucial para maximizar el rendimiento del modelo."
      },
      {
        prompt: "Identifica el tono emocional predominante en este texto.",
        input: "La noticia del cierre de la fábrica cayó como un balde de agua fría entre los trabajadores. Después de 30 años de servicio, muchos no podían imaginar qué harían ahora. Sin embargo, algunos ya comenzaban a ver esto como una oportunidad para reinventarse."
      },
      {
        prompt: "Extrae los datos numéricos relevantes de este texto.",
        input: "El proyecto requirió una inversión inicial de 250,000 euros y empleó a 45 personas durante 18 meses. Al final del primer año, se había recuperado el 60% de la inversión y la productividad aumentó un 35%."
      },
      {
        prompt: "Identifica la relación causa-efecto en este párrafo.",
        input: "Debido al aumento en las temperaturas globales, los glaciares están derritiéndose a un ritmo sin precedentes. Como resultado, el nivel del mar está subiendo y las comunidades costeras enfrentan un riesgo creciente de inundaciones."
      },
      {
        prompt: "Clasifica los elementos mencionados en este texto en categorías lógicas.",
        input: "En el supermercado compramos manzanas, detergente, zanahorias, champú, peras, jabón de manos, lechuga y pasta de dientes. También necesitábamos papel higiénico y tomates, pero estaban agotados."
      },
      {
        prompt: "Convierte este texto técnico en una analogía comprensible.",
        input: "Un firewall en una red de computadoras actúa como un sistema de filtrado que monitorea y controla el tráfico de red entrante y saliente basándose en reglas de seguridad predeterminadas."
      },
      {
        prompt: "Resume los principales argumentos a favor y en contra presentados en este texto.",
        input: "El teletrabajo permite mayor flexibilidad horaria y ahorro en transporte, pero puede llevar al aislamiento social y dificultar la separación entre vida laboral y personal. Algunos estudios muestran aumentos en productividad, mientras otros señalan desafíos en la colaboración en equipo."
      },
      {
        prompt: "Identifica y explica el sesgo potencial en este texto.",
        input: "Los jóvenes de hoy pasan demasiado tiempo en sus dispositivos electrónicos, lo que claramente está afectando su capacidad de socializar y desarrollarse normalmente. A diferencia de generaciones anteriores, carecen de habilidades básicas de comunicación cara a cara."
      },
      {
        prompt: "Reformula este texto para un público internacional, eliminando referencias culturales específicas.",
        input: "Como Pedro por su casa, Juan llegó al cotillón con una tortilla de patatas bajo el brazo, justo a tiempo para ver el partido de la Roja mientras tomaban el vermú de domingo."
      }
    ];

    // Seleccionar aleatoriamente un tipo de desafío
    const selectedChallenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

    return {
      challenge: selectedChallenge.prompt,
      input: selectedChallenge.input,
      expectedKeywords: generateExpectedKeywords(selectedChallenge.input)
    };
  } catch (error) {
    console.error('Error generando desafío:', error);
    throw error;
  }
}

/**
 * Genera palabras clave esperadas de un texto
 * @param {string} text Texto para extraer palabras clave
 * @returns {string[]} Array de palabras clave
 */
function generateExpectedKeywords(text) {
  // Aquí simularíamos la extracción de palabras clave importantes
  // En un sistema real, usaríamos NLP o la API de OpenAI

  // Simplificación: dividir por espacios, filtrar palabras comunes y tomar palabras largas
  const words = text.toLowerCase().replace(/[.,;:!?]/g, '').split(' ');
  const commonWords = ['el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'de', 'del', 'a', 'en', 'que', 'con', 'para'];
  const keywords = words
    .filter(word => !commonWords.includes(word) && word.length > 5)
    .slice(0, 5);

  return [...new Set(keywords)]; // Eliminar duplicados
}

/**
 * Evalúa la respuesta de un equipo a un desafío
 * @param {Object} challenge Objeto del desafío
 * @param {string} response Respuesta del equipo
 * @returns {Object} Resultado de la evaluación
 */
async function evaluateResponse(challenge, response) {
  try {
    // Preparamos el prompt para la evaluación por GPT
    const prompt = `
    Estás evaluando la respuesta de un equipo a un desafío de IA.

    DESAFÍO: ${challenge.challenge}
    TEXTO DE ENTRADA: ${challenge.input}
    PALABRAS CLAVE ESPERADAS (al menos algunas deberían estar presentes): ${challenge.expectedKeywords.join(', ')}
    
    RESPUESTA DEL EQUIPO: ${response}

    Evalúa esta respuesta en una escala del 0 al 100 basándote en:
    1. Si la respuesta aborda directamente el desafío planteado
    2. Precisión y relevancia respecto al texto de entrada
    3. Presencia de las palabras clave esperadas
    4. Calidad general de la respuesta

    Responde SOLO con un objeto JSON con este formato exacto:
    {
      "score": (número entre 0 y 100),
      "passed": (booleano, true si el score es mayor o igual a 70),
      "feedback": "(breve explicación de la evaluación)"
    }

    no uses los acentos en el json como si fuera un markdown, solo usa el json
    `;

    // Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { "role": "system", "content": "Eres un evaluador experto de respuestas a desafíos de IA." },
        { "role": "user", "content": prompt }
      ],
      temperature: 0.3,
      max_tokens: 150
    });

    // Extraer y parsear la respuesta
    const evaluationText = completion.choices[0].message.content.trim();

    console.log('evaluacionText', evaluationText);
    
    try {
      // Intentar parsear como JSON
      const evaluation = JSON.parse(evaluationText);
      
      // Verificar que tiene los campos requeridos
      if (
        typeof evaluation.score === 'number' && 
        typeof evaluation.passed === 'boolean' && 
        typeof evaluation.feedback === 'string'
      ) {
        return evaluation;
      } else {
        throw new Error('Formato de evaluación incorrecto');
      }
    } catch (parseError) {
      // Si no se puede parsear correctamente, proporcionar una evaluación de fallback
      console.error('Error al parsear la evaluación:', parseError);
      
      // Evaluación de fallback basada en palabras clave
      const keywordsFound = challenge.expectedKeywords.filter(
        keyword => response.toLowerCase().includes(keyword.toLowerCase())
      );
      
      const keywordScore = Math.round((keywordsFound.length / challenge.expectedKeywords.length) * 70);
      const lengthScore = response.length > 20 ? 20 : Math.round((response.length / 20) * 20);
      const totalScore = keywordScore + lengthScore;
      
      return {
        score: totalScore,
        passed: totalScore >= 70,
        feedback: `Evaluación automática: ${keywordsFound.length} de ${challenge.expectedKeywords.length} palabras clave encontradas.`
      };
    }
  } catch (error) {
    console.error('Error evaluando respuesta:', error);
    
    // En caso de error con la API, proporcionar una evaluación de fallback
    return {
      score: 50,
      passed: false,
      feedback: "No se pudo evaluar completamente la respuesta debido a un error técnico."
    };
  }
}

module.exports = {
  generateOpenAiToken,
  generateChallenge,
  evaluateResponse
};