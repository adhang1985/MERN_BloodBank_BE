const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { createInventory, getAllInventory } = require('../controllers/inventoryControllers');

const router = express.Router();

// Add inventory
router.post('/create-inventory',verifyToken,createInventory);

// Get all blood records
router.get('/get-inventory', verifyToken, getAllInventory);

module.exports = router;