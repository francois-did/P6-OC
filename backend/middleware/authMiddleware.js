const jwt = require('jsonwebtoken');

// Middleware pour authentifier un utilisateur
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Récupérer le token à partir du header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide.' });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
