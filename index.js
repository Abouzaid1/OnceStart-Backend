require('dotenv').config()
const express = require('express')
const multer = require('multer')
const path = require('path');
const cors = require('cors');
const app = express()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const bodyParser = require('body-parser');
const dbConnection = require('./config/db')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
dbConnection()
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: "API is working" });
});
//routes
const userRouter = require('./routes/user.route')
const taskRouter = require('./routes/task.route')
const projectRouter = require('./routes/project.route')
const postRouter = require('./routes/post.route')

app.use('/api/auth', userRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/projects', projectRouter)
app.use('/api/posts', postRouter)

app.listen(process.env.PORT || 4000, () => {
    console.log('listening on port: ' + process.env.PORT);
});