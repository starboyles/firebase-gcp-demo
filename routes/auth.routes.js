// Authentication routes
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

router.post('/register', AuthController.register);
router.get('/profile', authenticateUser, AuthController.getProfile);

module.exports = router;