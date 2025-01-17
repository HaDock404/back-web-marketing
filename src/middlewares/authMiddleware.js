const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.authToken; // Récupère le token depuis les cookies

  if (!token) {
    return res.status(401).json({ success: false, message: 'Accès non autorisé, token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token
    req.user = decoded; // Stocke les informations de l'utilisateur dans `req.user`
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré.' });
  }
};

module.exports = authenticateUser;
