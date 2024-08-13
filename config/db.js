const mongoose = require('mongoose')
require('dotenv').config()


const dbConnection = () => {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("Mongo Connected");
    })
}

module.exports = dbConnection;