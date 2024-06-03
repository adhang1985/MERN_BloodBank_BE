const express = require('express');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authControllers');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/currentUser',verifyToken,getCurrentUser);

module.exports = router;