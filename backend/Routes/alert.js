const express = require('express');
const router = express.Router();
const alertController = require('../Controllers/alertController');

// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get alert by ID
router.get('/:id', alertController.getAlertById);

// Create a new alert
router.post('/', alertController.createAlert);

// Update alert by ID
router.put('/:id', alertController.updateAlert);

// Delete alert by ID
router.delete('/:id', alertController.deleteAlert);

// Get alerts by Account ID
router.get('/accountid/:accountId', alertController.getAlertsByAccountId);

// Get alerts by User ID (via Account -> User)
router.get('/userid/:userId', alertController.getAlertsByUserId);

module.exports = router;
