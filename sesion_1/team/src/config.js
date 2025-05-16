/**
 * Configuración del servidor de equipos múltiples
 */

// Equipos disponibles
const teams = [
  {
    id: "gorilla-team",
    teamName: "Gorilla Team",
    members: ["Felipe Mantilla", "Liliana Franco"],
    logoURL: "https://media.licdn.com/dms/image/v2/D4E0BAQGFYfHqNCprbg/company-logo_200_200/company-logo_200_200/0/1684775515429/gorillalogic_logo?e=2147483647&v=beta&t=1mHrdXmVmtY03KA57vRe4mQxDdx_-dqITRfjhyJ09l4",
    teamDescription: "Equipo especializado en IA y procesamiento de lenguaje natural.",
    credentials: {
      openAiToken: null,
      authToken: null
    },
    activeChallengeId: null,
    challengeHistory: [],
    registered: false,
    score: 0
  },
  {
    id: "tech-titans",
    teamName: "Tech Titans",
    members: ["Ana Rodríguez", "Carlos Pérez"],
    logoURL: "https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png",
    teamDescription: "Equipo experto en algoritmos y computación de alto rendimiento.",
    credentials: {
      openAiToken: null,
      authToken: null
    },
    activeChallengeId: null,
    challengeHistory: [],
    registered: false,
    score: 0
  },
  {
    id: "data-masters",
    teamName: "Data Masters",
    members: ["María Gómez", "Juan López"],
    logoURL: "https://glw-website-strapi-content.s3.amazonaws.com/GL_LOGO_f811ec3bd9.png",
    teamDescription: "Especialistas en análisis de datos y machine learning.",
    credentials: {
      openAiToken: null,
      authToken: null
    },
    activeChallengeId: null,
    challengeHistory: [],
    registered: false,
    score: 0
  }
];

// Mapa de equipos para acceso rápido
const teamsMap = teams.reduce((map, team) => {
  map[team.id] = team;
  return map;
}, {});

// Almacén para los desafíos activos
const challenges = {};

// URL del servidor Judge
const judgeURL = "http://localhost:3000";

// Puerto del servidor
const PORT = process.env.PORT || 3001;

module.exports = {
  teams,
  teamsMap,
  challenges,
  judgeURL,
  PORT
};