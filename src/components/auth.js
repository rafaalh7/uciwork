const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; // Ejemplo: 1 hora

// Promisificar las funciones de JWT para usar async/await
const verifyToken = promisify(jwt.verify);
const signToken = promisify(jwt.sign);