const jwt = require('jsonwebtoken');

// Middleware pour authentifier un utilisateur
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const errorMessage =
        err.name === 'TokenExpiredError'
          ? 'Le token a expiré. Veuillez vous reconnecter.'
          : 'Token invalide.';
      return res.status(403).json({ message: errorMessage });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
