// Gère la logique métier pour les utilisateurs
const db = require('../config/db');
const bcrypt = require('bcrypt');
const RandomNumber = require('../random_number');

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

module.exports = { checkEmailExists, createUser, validateUserCode, activateUser };

