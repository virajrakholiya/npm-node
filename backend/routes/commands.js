const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/', commandController.getAllCommands);
router.post('/', commandController.createCommand);
router.get('/category/:category', commandController.getCommandsByCategory);
router.delete('/:id', commandController.deleteCommand);

module.exports = router;