const Project = require('../model/project.model')
const Task = require('../model/task.model')
//Get all Projects
const getAllProjects = async (req, res) => {
    const userId = req.user.id
    try {
        const projects = await Project.find({
            $or: [
                { members: userId },
                { leader: userId }
            ]
        }).populate({ path: "leader", select: "username" })
        if (projects.length == 0) {
            return res.status(404).json({ message: "No projects found" })
        }
        return res.status(200).json({ projects })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}
//get specific Project
const getSpecificProject = async (req, res) => {
    const projectId = req.params.id
    try {
        // const project = await Project.find({ _id: projectId }).populate({
        //     path: "tasks", populate: {
        //         path: 'userCreated', // Populate nested references if needed
        //         select: 'username'
        //     }
        // }).populate({ path: "members", select: ["username", "email", " _id", "photo"] }).populate("leader")
        const project = await Project.find({ _id: projectId })
            .populate({
                path: "tasks",
                populate: {
                    path: 'userCreated', // Field in the 'tasks' collection to populate
                    select: 'username email photo' // Fields to select from the 'userCreated' documents
                }
            })
            .populate({
                path: "members", // Field in the 'Project' collection to populate
                select: ["username", "email", "_id", "photo"] // Fields to select from the 'members' documents
            })
            .populate("leader")


        if (project.length == 0) {
            return res.status(404).json({ message: "No projects found" })
        }
        return res.status(200).json({ project: project[0] })

    } catch (error) {
        return res.status(500).json({ message: "Server Error" })
    }
}
//add Project
const addProject = async (req, res) => {
    const userId = req.user.id
    const newReqProject = req.body
    try {
        const newProject = new Project({ ...newReqProject, leader: userId })
        await newProject.save()
        const project = await Project.findOne({ _id: newProject._id }).populate({ path: "leader", select: "username" })

        return res.status(201).json({ message: "Project added successfully", project })


    } catch (e) {
        return res.status(500).json({ message: "Can't add this Project" })
    }
}
//add task to Project
const addTaskToProject = async (req, res) => {
    const taskData = req.body
    try {
        const existingProject = await Project.findById(req.params.id)
        if (!existingProject || existingProject.length === 0) {
            return res.status(404).json({ message: "Project not found" })
        }
        const newTask = new Task({ ...taskData, userCreated: req.user.id, projectIn: existingProject._id })
        await newTask.save()
        existingProject.tasks.push(newTask._id)
        await existingProject.save();
        const populatedTasks = await Task.findById(newTask._id).populate({
            path: 'userCreated',
            select: 'username email photo _id'
        })
        return res.status(200).json({ message: "Task added successfully", populatedTasks })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Can't add this Project" })
    }
}
const searchForProjects = async (req, res) => {
    const query = req.query.search
    try {
        const existingProjects = await Project.find({ name: { $regex: query, $options: 'i' }, $nor: [{ members: req.user.id }, { leader: req.user.id }] })
        if (existingProjects.length === 0) {
            return res.status(404).json({ message: "No projects found" })
        }
        console.log(existingProjects);
        return res.status(200).json({ message: "OK", projects: existingProjects })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Can't find this Project" })
    }
}
//update Project
const updateProject = async (req, res) => {
    const { projectId, personId } = req.body
    const userId = req.user.id
    try {
        const existingProject = await Project.findById(projectId).populate({ path: "leader", select: "username _id email" })
        if (!existingProject || existingProject.length === 0) {
            return res.status(404).json({ message: "Project not found" })
        }
        if (existingProject.leader._id != userId) {
            return res.status(409).json({ message: "You are not the Project Leader :)" });
        }
        existingProject.members.pull(personId)
        await existingProject.save();
        return res.status(200).json({ message: "user removed successfully", project: existingProject })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Can't add this Project" })
    }

}
//join Project
const joinProject = async (req, res) => {
    const userId = req.user.id
    try {
        const existingProject = await Project.findById(req.params.id)
        if (!existingProject || existingProject.length === 0) {
            return res.status(404).json({ message: "Project not found" })
        }
        if (existingProject.members.some(member => member.toString() === userId)) {
            return res.status(409).json({ message: "User already exists in the project" });
        }
        if (existingProject.passcode != req.body.passcode) {
            return res.status(409).json({ message: "The passcode you entered is wrong" });
        }
        existingProject.members.push(userId)
        await existingProject.save();
        return res.status(200).json({ message: "user added successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Can't add this Project" })
    }
}
//delete Project
const deleteProject = async (req, res) => {
    const userId = req.user.id
    const projectId = req.params.id
    try {
        const existingProject = await Project.findById(projectId)
        if (!existingProject || existingProject.length === 0) {
            return res.status(404).json({ message: "Project not found" })
        }
        // if (existingProject.leader != userId) {
        //     return res.status(409).json({ message: "You are not allowed to delete this project" });
        // }
        if (existingProject.leader == userId) {
            return res.status(409).json({ message: "You are not allowed to delete this project" });
        }
        if (existingProject.members.some(member => member.toString() === userId)) {
            existingProject.members.pull(userId)
            await existingProject.save();
            return res.status(200).json({ message: "User Leaved the project" });
        }
        await Project.deleteOne({ _id: projectId })
        return res.status(200).json({ message: "Project deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Can't delete this Project" })
    }
}

module.exports = {
    getAllProjects,
    getSpecificProject,
    addProject,
    addTaskToProject,
    searchForProjects,
    joinProject,
    updateProject,
    deleteProject,
}



