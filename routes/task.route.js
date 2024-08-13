const express = require('express');
const router = express.Router();
const { authenticateTokenCheck } = require("../middleware/authCheck")
const taskController = require('../controller/task.controller')

router.route('/').get(authenticateTokenCheck, taskController.getAllTasks).post(authenticateTokenCheck, taskController.addTasks)
router.route('/:id').delete(authenticateTokenCheck, taskController.deleteTask).put(authenticateTokenCheck, taskController.updateTask)
module.exports = router;