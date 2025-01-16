// Gère les requêtes HTTP
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const validateCodeHandler = async (req, res, next) => {
  try {
    // Récupérer le token temporaire depuis le cookie
    const tempToken = req.cookies.temp_token;

    if (!tempToken) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const userEmail = decoded.email; // Récupérer l'email de l'utilisateur depuis le token

    // Récupérer le code envoyé par l'utilisateur
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code requis.' });
    }

    // Vérifier si le code correspond dans la base de données
    const isValid = await userService.validateUserCode(userEmail, code);
    if (!isValid) {
      return res.status(400).json({ message: 'Code invalide.' });
    }

    // Ajouter d'autres informations ou mettre à jour le statut de l'utilisateur
    await userService.activateUser(userEmail);

    // Supprimer le cookie temporaire
    //res.clearCookie('temp_token');

    return res.status(200).json({ message: 'Code validé avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la validation du code :', err);
    next(err);
  }
};

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

    // Générer un token temporaire
    const tempToken = jwt.sign(
      { email }, // Payload
      process.env.JWT_SECRET, // Clé secrète
      { expiresIn: process.env.JWT_EXPIRES } // Expiration
    );
    console.log('Token temporaire généré :', tempToken);

    // Envoyer le token dans un cookie sécurisé
    res.cookie('temp_token', tempToken, {
      httpOnly: true, // Inaccessible par JavaScript
      secure: process.env.NODE_ENV === 'production', // Transmis uniquement via HTTPS en production
      sameSite: 'Strict', // Protège contre les attaques CSRF
      maxAge: 30 * 60 * 1000, // Expire après 30 minutes
    });

    return res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur :', err);
    next(err);
  }
};

module.exports = { createUserHandler, validateCodeHandler };


