

const express = require('express');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());

// Estado del servidor
let authToken = process.env.AUTH_TOKEN;
let openAiToken = process.env.OPENAI_API_KEY;

let openai = new OpenAI({
  apiKey: openAiToken
});

console.log(authToken);
console.log(openAiToken);

// Configuración del equipo
const teamConfig = {
  teamName: "Mi Equipo",
  members: ["Miembro 1", "Miembro 2"],
  logoURL: "https://ejemplo.com/logo.png",
  teamDescription: "Descripción de nuestro equipo"
};

// Endpoint de información del equipo
app.get('/team-info', (req, res) => {
  res.json(teamConfig);
});

// Registro inicial con The Judge
async function registerWithJudge() {
  try {
    const response = await axios.post('http://localhost:3000/register', {
      callbackURL: 'http://localhost:4000/team-info'
    });

    authToken = response.data.authToken;
    openAiToken = response.data.openAiToken;

    // Inicializar cliente OpenAI
    openai = new OpenAI({
      apiKey: openAiToken
    });

    console.log('Registro exitoso');
  } catch (error) {
    console.error('Error en registro:', error.message);
  }
}

// Solicitar un desafío
async function requestChallenge() {
  try {
    const response = await axios.get('http://localhost:3000/challenge', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error solicitando desafío:', error.message);
    return null;
  }
}

// Procesar desafío con OpenAI
async function processChallenge(challenge) {
  try {
    const prompt = `
${challenge.challenge}

Texto de entrada:
${challenge.input}

Por favor, responde siguiendo exactamente las instrucciones anteriores.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { "role": "system", "content": "Eres un asistente experto en análisis de texto." },
        { "role": "user", "content": prompt }
      ],
      temperature: 0.3,
      max_tokens: 150
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error procesando con OpenAI:', error.message);
    return null;
  }
}

// Enviar solución
async function submitSolution(challengeId, response) {
  try {
    const result = await axios.post('http://localhost:3000/submit', {
      challengeId,
      response
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return result.data;
  } catch (error) {
    console.error('Error enviando solución:', error.message);
    return null;
  }
}

// Ciclo principal del servidor
async function mainLoop() {
  while (true) {
    const challenge = await requestChallenge();
    if (challenge) {
      const solution = await processChallenge(challenge);
      if (solution) {
        const result = await submitSolution(challenge.challengeId, solution);
        console.log('Resultado:', result);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 20000)); // Esperar 5 segundos entre desafíos
  }
}

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  //await registerWithJudge();
  mainLoop();
});
