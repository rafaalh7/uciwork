/**
 * Middleware para validar JWT en las solicitudes
 */
async function authenticateJWT(req, res, next) {
    // Obtener el token del header, query string o cookies
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No se proporcionó un token de autenticación'
        });
    }

    try {
        // Verificar el token
        const decoded = await verifyToken(token, JWT_SECRET);

        // Añadir el usuario decodificado al request
        req.user = decoded;
        
        // Verificar si el token está próximo a expirar (últimos 15 minutos)
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = decoded.exp - now;
        
        if (expiresIn < 900) { // 15 minutos en segundos
            // Renovar el token
            const newToken = await signToken(
                { id: decoded.id, role: decoded.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );
            
            // Enviar el nuevo token en la respuesta
            res.set('Authorization', `Bearer ${newToken}`);
            res.cookie('jwt', newToken, {
                expires: new Date(
                    Date.now() + parseInt(JWT_EXPIRES_IN) * 1000
                ),
                httpOnly: true,
                secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
            });
        }

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Sesión expirada, por favor inicie sesión nuevamente',
                expiredAt: err.expiredAt
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'Token inválido, por favor inicie sesión nuevamente'
            });
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Error al autenticar el token'
            });
        }
    }
}