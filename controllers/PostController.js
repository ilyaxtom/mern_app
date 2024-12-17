import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user").exec();
        res.json(posts);
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Error getting posts",
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: "after" },
        );

        res.json(post);
    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Error getting post",
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Unable to create a post",
        });
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findOneAndDelete({
            _id: postId,
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            })
        }

        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting post",
        })
    }
}