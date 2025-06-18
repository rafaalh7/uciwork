const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());

// Aplicar el middleware de autenticación
app.use(authenticateJWT);

// Aplicar el manejo de expiración de sesión
app.use(sessionExpirationHandler());

// Ruta de ejemplo protegida
app.get('/api/protected', (req, res) => {
    res.json({
        status: 'success',
        data: {
            user: req.user
        }
    });
});

// Ruta de login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Aquí iría la lógica de autenticación real
    if (username === 'admin' && password === 'password') {
        try {
            const token = await generateToken({
                id: 1,
                role: 'admin'
            });
            
            res.cookie('jwt', token, {
                expires: new Date(
                    Date.now() + parseInt(JWT_EXPIRES_IN) * 1000
                ),
                httpOnly: true,
                secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
            });
            
            return res.json({
                status: 'success',
                token
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar el token'
            });
        }
    }
    
    res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
    });
});

// Ruta de logout
app.get('/api/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({
        status: 'success',
        message: 'Sesión cerrada correctamente'
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});