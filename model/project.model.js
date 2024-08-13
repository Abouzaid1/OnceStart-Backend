const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    passcode: {
        type: String,
        required: true
    },
    color: {
        type: String,
        enum: {
            values: ['green', 'yellow', 'red', 'orange', 'pink', 'white'],
            message: '{VALUE} is not a valid color'
        },
        default: "white",
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        default: []
    }
    ],
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

}, { timeStamp: true })

const Project = mongoose.model('Project', projectSchema)
module.exports = Project