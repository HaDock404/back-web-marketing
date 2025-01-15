// Gère la logique métier pour les utilisateurs
const db = require('../config/db');
const bcrypt = require('bcrypt');

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
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mot de passe hashé :', hashedPassword);

    const [result] = await db.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [
      email,
      hashedPassword,
    ]);
    console.log('Résultat de l\'insertion dans la base de données :', result);
  } catch (err) {
    console.error('Erreur lors de l\'insertion de l\'utilisateur :', err);
    throw err;
  }
};

module.exports = { checkEmailExists, createUser };

