const errorHandler = (err, req, res, next) => {
  console.error('Erreur serveur :', err.message);
  res.status(500).json({ message: 'Erreur interne du serveur.' });
};

module.exports = errorHandler;
