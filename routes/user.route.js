const express = require('express');
const router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 } })
const userController = require('../controller/user.controller')

router.route('/signup').post(upload.single('photo'), userController.signUp)
router.route('/login').post(userController.login)
module.exports = router;