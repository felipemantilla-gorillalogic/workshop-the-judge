/**
 * Utilidades para interacción con OpenAI
 */

const OpenAI = require('openai');
const { teamsMap, challenges } = require('../config');

/**
 * Resuelve un desafío utilizando OpenAI
 * 
 * @param {string} challengeId - ID del desafío
 * @returns {Promise<string>} - Respuesta generada por OpenAI
 */
async function solveChallenge(challengeId) {
  try {
    // Obtener el desafío
    console.log(`Intentando resolver desafío con ID: ${challengeId}`);
    console.log(`Desafíos disponibles: ${Object.keys(challenges).join(', ')}`);
    
    const challenge = challenges[challengeId];
    if (!challenge) {
      console.error(`Desafío con ID ${challengeId} no encontrado en la lista de desafíos`);
      throw new Error(`Desafío con ID ${challengeId} no encontrado`);
    }
    
    console.log(`Desafío encontrado: ${JSON.stringify(challenge, null, 2)}`);

    // Obtener el equipo asociado
    const teamId = challenge.teamId;
    const team = teamsMap[teamId];
    if (!team) {
      throw new Error(`Equipo asociado al desafío ${challengeId} no encontrado`);
    }

    // Verificar que tenemos un token válido
    if (!team.credentials.openAiToken) {
      throw new Error(`El equipo ${teamId} no tiene un token de OpenAI válido`);
    }

    // Inicializar cliente de OpenAI con el token recibido
    const openai = new OpenAI({
      apiKey: team.credentials.openAiToken,
    });

    // Construir el prompt para OpenAI
    const prompt = `
${challenge.challenge}

Texto de entrada:
${challenge.input}

Por favor, responde siguiendo exactamente las instrucciones anteriores. 
Sé preciso y asegúrate de cumplir con todos los requisitos del desafío.
`;

    // Realizar la llamada a la API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { "role": "system", "content": "Eres un asistente experto en análisis de texto y resúmenes. Tu tarea es responder exactamente lo que se te pide de la manera más precisa posible." },
        { "role": "user", "content": prompt }
      ],
      temperature: 0.3,
      max_tokens: 150
    });

    // Extraer y retornar la respuesta
    const response = completion.choices[0].message.content.trim();
    return response;
  } catch (error) {
    console.error(`Error al resolver el desafío ${challengeId} con OpenAI:`, error);
    
    // Si hay un error con la API, generamos una respuesta de fallback
    return generateFallbackResponse(challengeId);
  }
}

/**
 * Genera una respuesta de fallback en caso de error con OpenAI
 * 
 * @param {string} challengeId - ID del desafío
 * @returns {string} - Respuesta generada
 */
function generateFallbackResponse(challengeId) {
  // Obtener el desafío
  const challenge = challenges[challengeId];
  if (!challenge) {
    return "No se pudo generar una respuesta para este desafío.";
  }

  // Extraer palabras clave del texto de entrada para simular una respuesta
  const words = challenge.input.split(/\s+/);
  const keywords = words
    .filter(word => word.length > 5)
    .filter(word => !['sobre', 'entre', 'cuando', 'aunque', 'también'].includes(word.toLowerCase()));
  
  // Tomar hasta 10 palabras clave
  const selectedKeywords = keywords.slice(0, 10);
  
  // Crear una respuesta simple basada en el tipo de desafío
  if (challenge.challenge.toLowerCase().includes('resume')) {
    return `El texto trata principalmente sobre ${selectedKeywords.slice(0, 5).join(', ')}.`;
  } else if (challenge.challenge.toLowerCase().includes('explica')) {
    return `${selectedKeywords[0]} se refiere a un proceso que involucra ${selectedKeywords.slice(1, 4).join(' y ')}.`;
  } else {
    return `Las palabras clave importantes son: ${selectedKeywords.join(', ')}.`;
  }
}

module.exports = {
  solveChallenge
};