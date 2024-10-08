const express = require('express');
const router = express.Router();
const multer = require('multer')
const storage = multer.diskStorage({

    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})
const upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 } })
const userController = require('../controller/user.controller')

router.route('/signup').post(upload.single('photo'), userController.signUp)
router.route('/login').post(userController.login)
module.exports = router;