// Gère les requêtes HTTP
const userService = require('../services/userService');

const createUserHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    console.log('Vérification de l\'email :', email);

    // Vérifier si l'email existe déjà
    const emailExists = await userService.checkEmailExists(email);
    if (emailExists) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    console.log('Création de l\'utilisateur avec l\'email :', email);

    // Créer l'utilisateur
    await userService.createUser(email, password);
    console.log('Utilisateur créé avec succès.');

    return res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur :', err);
    next(err);
  }
};

module.exports = { createUserHandler };


