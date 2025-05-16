/**
 * Validadores para diferentes entradas
 */

/**
 * Valida si una URL es válida
 * @param {string} url URL a validar
 * @returns {boolean} Si la URL es válida
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Valida el cuerpo de la solicitud de registro
 * @param {Object} body Cuerpo de la solicitud
 * @returns {Object} Resultado de la validación
 */
function validateRegisterRequest(body) {
  if (!body) {
    return { valid: false, error: 'Cuerpo de la solicitud vacío' };
  }

  if (!body.callbackURL) {
    return { valid: false, error: 'URL de callback requerida' };
  }

  if (!isValidUrl(body.callbackURL)) {
    return { valid: false, error: 'URL de callback inválida' };
  }

  return { valid: true };
}

/**
 * Valida el cuerpo de la solicitud de envío de respuesta
 * @param {Object} body Cuerpo de la solicitud
 * @returns {Object} Resultado de la validación
 */
function validateSubmitRequest(body) {
  if (!body) {
    return { valid: false, error: 'Cuerpo de la solicitud vacío' };
  }

  if (!body.challengeId) {
    return { valid: false, error: 'ID de desafío requerido' };
  }

  if (!body.response) {
    return { valid: false, error: 'Respuesta requerida' };
  }

  return { valid: true };
}

/**
 * Valida el token de autorización
 * @param {string} authHeader Cabecera de autorización
 * @returns {Object} Resultado de la validación y token extraído
 */
function validateAuthToken(authHeader) {
  if (!authHeader) {
    return { valid: false, error: 'Token de autorización requerido' };
  }

  // Formato esperado: Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return { valid: false, error: 'Formato de token inválido' };
  }

  const token = parts[1];
  if (!token) {
    return { valid: false, error: 'Token vacío' };
  }

  return { valid: true, token };
}

module.exports = {
  isValidUrl,
  validateRegisterRequest,
  validateSubmitRequest,
  validateAuthToken
};