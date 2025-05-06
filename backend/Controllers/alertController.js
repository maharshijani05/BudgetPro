const Alert = require('../models/alert');
const Account = require('../models/account');

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve alerts', error });
  }
};

// Get alert by ID
exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve alert', error });
  }
};

// Get alerts by accountId
exports.getAlertsByAccountId = async (req, res) => {
  try {
    const alerts = await Alert.find({ accountId: req.params.accountId });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve alerts by account ID', error });
  }
};

// Get alerts by userId (via accounts)
exports.getAlertsByUserId = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.params.userId }).select('_id');
    const accountIds = accounts.map(acc => acc._id);
    const alerts = await Alert.find({ accountId: { $in: accountIds } });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve alerts by user ID', error });
  }
};

// Create a new alert
exports.createAlert = async (req, res) => {
  try {
    const alert = new Alert(req.body);
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create alert', error });
  }
};

// Update an alert by ID
exports.updateAlert = async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedAlert) return res.status(404).json({ message: 'Alert not found' });
    res.status(200).json(updatedAlert);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update alert', error });
  }
};

// Delete an alert by ID
exports.deleteAlert = async (req, res) => {
  try {
    const deletedAlert = await Alert.findByIdAndDelete(req.params.id);
    if (!deletedAlert) return res.status(404).json({ message: 'Alert not found' });
    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete alert', error });
  }
};
