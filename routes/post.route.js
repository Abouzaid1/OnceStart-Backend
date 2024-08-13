const express = require('express');
const router = express.Router();
const { authenticateTokenCheck } = require("../middleware/authCheck")
const postController = require('../controller/post.controller')
const multer = require('multer')
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})
const upload = multer({ storage: diskStorage })
router.route('/').get(authenticateTokenCheck, postController.getAllPosts).post(authenticateTokenCheck, upload.array('photos'), postController.addPost)

router.route('/:id').get(authenticateTokenCheck, postController.getMyPosts)

module.exports = router;