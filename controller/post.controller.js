const Post = require("../model/post.model");

const getAllPosts = async (req, res) => {
    console.log("hehe");

    try {
        const posts = await Post.find().populate({ path: "leader", select: "username" })
        if (posts.length == 0) {
            return res.status(404).json({ message: "No post found" })
        }
        return res.status(200).json({ posts })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

const getMyPosts = async (req, res) => {


}

const addPost = async (req, res) => {
    console.log(req.body)
    console.log(req.files)
}


module.exports = {
    getAllPosts,
    getMyPosts,
    addPost
}