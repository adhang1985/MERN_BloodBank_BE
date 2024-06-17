const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { createInventory, getAllInventory, getAllDonars } = require('../controllers/inventoryControllers');

const router = express.Router();

// Add inventory
router.post('/create-inventory',verifyToken,createInventory);

// Get all blood records
router.get('/get-inventory', verifyToken, getAllInventory);

// Get donars record
router.get('/get-donars', verifyToken, getAllDonars);

module.exports = router;