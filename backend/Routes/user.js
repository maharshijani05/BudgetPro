const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// Define routes using controller methods
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
