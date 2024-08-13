const express = require('express');
const router = express.Router();
const { authenticateTokenCheck } = require("../middleware/authCheck")
const projectController = require('../controller/project.controller')

router.route('/').get(authenticateTokenCheck, projectController.getAllProjects)
    .post(authenticateTokenCheck, projectController.addProject)
    .put(authenticateTokenCheck, projectController.updateProject)



router.route('/search').get(authenticateTokenCheck, projectController.searchForProjects)



router.route('/:id').get(authenticateTokenCheck, projectController.getSpecificProject)
    .post(authenticateTokenCheck, projectController.addTaskToProject)
    .put(authenticateTokenCheck, projectController.joinProject)
    .delete(authenticateTokenCheck, projectController.deleteProject)
module.exports = router;