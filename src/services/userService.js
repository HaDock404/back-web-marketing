// Gère la logique métier pour les utilisateurs
const db = require('../config/db');
const bcrypt = require('bcrypt');
const RandomNumber = require('../random_number');
const jwt = require('jsonwebtoken');

const checkEmailExists = async (email) => {
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    console.log('Vérification de l\'existence de l\'email, résultats :', rows);
    return rows.length > 0;
  } catch (err) {
    console.error('Erreur lors de la vérification de l\'email :', err);
    throw err;
  }
};

const createUser = async (email, password) => {
  try {
    const code = RandomNumber()
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mot de passe hashé :', hashedPassword);

    const [result] = await db.query('INSERT INTO users (email, password_hash, code) VALUES (?, ?, ?)', [
      email,
      hashedPassword,
      code,
    ]);
    console.log('Résultat de l\'insertion dans la base de données :', result);
  } catch (err) {
    console.error('Erreur lors de l\'insertion de l\'utilisateur :', err);
    throw err;
  }
};

const loginUser = async (email, password, res) => {
  try {
    // Nettoyage de l'email pour éviter les erreurs dues aux espaces
    const cleanEmail = email.trim();

    // Exécute la requête
    const [rows] = await db.query('SELECT id, password_hash FROM users WHERE email = ?', [cleanEmail]);

    // Vérification si l'utilisateur existe
    if (rows.length === 0) {
      console.log('Utilisateur non trouvé pour l\'email :', cleanEmail);
      return { success: false, message: 'Email ou mot de passe incorrect.' };
    }

    const user = rows[0];

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Mot de passe valide :', passwordMatch);

    if (!passwordMatch) {
      console.log('Mot de passe incorrect pour l\'email :', cleanEmail);
      return { success: false, message: 'Email ou mot de passe incorrect.' };
    }

    // Génération du JWT
    console.log('Génération du JWT...');
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT généré :', token);

    // Configuration du cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    console.log('Connexion réussie.');
    return { success: true, message: 'Connexion réussie.' };
  } catch (err) {
    console.error('Erreur lors de la connexion de l\'utilisateur :', err);
    throw err;
  }
};

const validateUserCode = async (email, code) => {
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ? AND code = ?', [email, code]);
    return rows.length > 0; // Retourne true si le code est valide
  } catch (err) {
    console.error('Erreur lors de la validation du code :', err);
    throw err;
  }
};

const activateUser = async (email) => {
  try {
    await db.query('UPDATE users SET verified = 1 WHERE email = ?', [email]);
    console.log('Utilisateur activé avec succès.');
  } catch (err) {
    console.error('Erreur lors de l\'activation de l\'utilisateur :', err);
    throw err;
  }
};

module.exports = { checkEmailExists, createUser, loginUser, validateUserCode, activateUser };

