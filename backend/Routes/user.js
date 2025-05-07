const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// Define routes using controller methods
// Specific routes first


// Generic routes last
router.get('/', userController.getAllUsers);
router.get('/email/:email', userController.getUserByEmail); // Assuming you want to get user by userId
router.get('/:id', userController.getUserById);

router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
