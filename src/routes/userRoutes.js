const express = require('express');
const { createUserHandler, validateCodeHandler } = require('../controllers/userController');

const router = express.Router();

router.post('/create-user', createUserHandler);

router.post('/validate-code', validateCodeHandler);

module.exports = router;
