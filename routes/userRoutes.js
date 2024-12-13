const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser,updateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to check authentication

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// Get user details (protected route)
router.get('/profile', authMiddleware, getUser);
router.put('/update', authMiddleware, updateUser);

module.exports = router;
