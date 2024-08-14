const Post = require("../model/post.model");
const User = require("../model/user.model");

const getAllPosts = async (req, res) => {
    console.log("hehe");

    try {
        const posts = await Post.find().populate({ path: "author", select: "username email photo" }).populate("photo").populate({ path: "likes", select: "username _id email" })
        console.log(posts);

        if (posts.length == 0) {
            return res.status(404).json({ message: "No post found" })
        }
        console.log(posts.photo);
        const reversedPosts = posts.reverse();
        console.log(reversedPosts);

        return res.status(200).json({ posts: reversedPosts })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

const likePost = async (req, res) => {
    const userId = req.user.id
    const postId = req.params.id
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        const isLiked = post.likes.includes(userId)
        if (isLiked) {
            post.likes.pull(userId)
        } else {
            post.likes.push(userId)
        }
        await post.save()
        const newPost = await Post.findById(postId).populate({ path: "likes", select: "username _id email" }).populate({ path: "author", select: "username email photo" })
        console.log(newPost);

        return res.status(200).json({ message: "like is added", newPost })

    } catch (error) {
        return res.status(500).json({ message: "Server Error" })
    }

}

const addPost = async (req, res) => {
    const { content } = req.body
    console.log(req.body);

    const files = req.files
    console.log(files);

    const userId = req.user.id
    try {
        if (!content) return res.status(400).json({ message: "Content is required" })
        if (!files) return res.status(400).json({ message: "Please upload a file" })
        let filenames = []
        files.forEach(file => {
            filenames.push(file.filename)
        });
        const newPost = new Post({ content, photo: filenames, author: userId })
        await newPost.save()
        const newPostSent = await Post.findById(newPost._id).populate({ path: "likes", select: "username _id email" }).populate({ path: "author", select: "username email photo" })
        console.log(newPost);
        return res.status(200).json({ message: "Uploaded successfuly", newPost: newPostSent })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}


module.exports = {
    getAllPosts,
    likePost,
    addPost
}