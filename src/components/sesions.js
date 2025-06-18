/**
 * Maneja la expiración de sesión y renueva tokens cuando sea necesario
 */
function sessionExpirationHandler() {
    return async (req, res, next) => {
        if (!req.user) return next();
        
        try {
            // Verificar si el token está próximo a expirar
            const now = Math.floor(Date.now() / 1000);
            const expiresIn = req.user.exp - now;
            
            if (expiresIn < 300) { // Últimos 5 minutos
                // Renovar el token
                const newToken = await generateToken({
                    id: req.user.id,
                    role: req.user.role
                });
                
                // Enviar el nuevo token
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
            next(err);
        }
    };
}