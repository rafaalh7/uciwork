/**
 * Genera un nuevo JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {Promise<String>} - Token JWT firmado
 */
async function generateToken(payload) {
    try {
        const token = await signToken(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });
        return token;
    } catch (err) {
        throw new Error('Error al generar el token');
    }
}