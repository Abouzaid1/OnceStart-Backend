const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    startsIn: {
        type: Date
    },
    endsIn: {
        type: Date,
    },
    completed: {
        type: Boolean,
        default: false
    },
    userCreated: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    projectIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema)
module.exports = Task