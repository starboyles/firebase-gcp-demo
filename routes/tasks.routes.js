const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

router.use(authenticateUser);
router.post('/', TaskController.createTask);
router.patch('/:taskId/status', TaskController.updateTaskStatus);
router.post('/:taskId/comments', TaskController.addComment);

module.exports = router;