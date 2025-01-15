const express = require('express');
const { createUserHandler } = require('../controllers/userController');

const router = express.Router();

router.post('/create-user', createUserHandler);

module.exports = router;
