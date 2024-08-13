const Task = require('../model/task.model')
const Project = require('../model/project.model')
//Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ $and: [{ userCreated: req.user.id }, { projectIn: null }] }).populate({ path: "userCreated", select: "username email photo" })
        if (!tasks || tasks.length == 0) {
            return res.status(200).json({ message: "There is no tasks", tasks: [] })
        } else {
            return res.status(200).json({ tasks })
        }
    } catch (e) {
        return res.status(500).json({ message: "Server Error" })
    }
}
//get specific task
const getSpecificTask = async (req, res) => {

}
//add task
const addTasks = async (req, res) => {
    const user = req.user.id
    const taskTitle = req.body
    try {
        const newTask = new Task({ ...taskTitle, userCreated: req.user.id })
        await newTask.save().then(() => {
            return res.status(201).json({ message: "Task added successfully", newTask: newTask })
        })

    } catch (e) {
        return res.status(401).json({ message: "Can't add this task" })
    }
}
//update task
const updateTask = async (req, res) => {
    console.log(req.body);
    const taskId = req.params.id
    try {
        const isExisting = await Task.findById(taskId)
        if (!isExisting || isExisting.length == 0) {
            console.log("Task not found");
            return res.status(404).json({ message: "Task not found" })
        }

        const body = req.body
        const updatedTask = await Task.findByIdAndUpdate(taskId, { ...body }).populate({ path: "userCreated", select: "username email photo" })
        console.log(updatedTask);

        return res.status(200).json({ message: "Task updated successfully", updatedTask })
    } catch (err) {
        console.log("Task nsdfsdasdasdfot found");
        return res.status(500).json({ message: "Server Error" })
    }
}
//delete task
const deleteTask = async (req, res) => {
    const taskId = req.params.id
    const userId = req.user.id
    try {
        const existingTask = await Task.findById(taskId)
        if (existingTask.userCreated._id != userId) {
            return res.status(403).json({ message: "You are not authorized to delete this task" })
        }
        if (existingTask.projectIn != null) {
            const project = await Project.findOne({ _id: existingTask.projectIn, $or: [{ members: userId }, { leader: userId }] })
            console.log(project);
            if (project == null) {
                return res.status(403).json({ message: "You are not authorized to delete this task" })
            }
            project.tasks.pull(existingTask._id)
            await project.save()
            await Task.deleteOne({ _id: taskId })
            return res.status(200).json({ message: "Task is deleted" })
        } else {
            if (!existingTask) {
                return res.status(404).json({ message: "Task not found" })
            }
            if (existingTask.userCreated.toString() !== req.user.id) {
                return res.status(403).json({ message: "You are not authorized to delete this task" })
            }
            await Task.deleteOne({ _id: taskId })
            return res.status(200).json({ message: "Task is deleted" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}
module.exports = {
    getAllTasks,
    getSpecificTask,
    addTasks,
    updateTask,
    deleteTask
}



