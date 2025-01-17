const express = require('express');
const { createUserHandler, validateCodeHandler, loginUserHandler } = require('../controllers/userController');

const router = express.Router();

router.post('/create-user', createUserHandler);

router.post('/validate-code', validateCodeHandler);

router.post('/login-user', loginUserHandler);

module.exports = router;
