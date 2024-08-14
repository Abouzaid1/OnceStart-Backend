const express = require('express');
const router = express.Router();
const { authenticateTokenCheck } = require("../middleware/authCheck")
const postController = require('../controller/post.controller')
const multer = require('multer')
const diskStorage = multer.memoryStorage()
const upload = multer({ storage: diskStorage })
router.route('/').get(authenticateTokenCheck, postController.getAllPosts).post(authenticateTokenCheck, upload.array('photos'), postController.addPost)

router.route('/:id').get(authenticateTokenCheck, postController.likePost)

module.exports = router;