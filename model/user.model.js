const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    photo: {
        type: String,
        required: true,
    },
    username: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    projectsErolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ],
    individualTasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ]
})

const User = mongoose.model('User', userSchema)
module.exports = User