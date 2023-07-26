import Comment from "../models/Comment.js";
import Topic from "../models/Topic.js";

export const createComment = async (req,res) => {
    const { content } = req.body;

    try {
        const createdBy = req.user.id;
        const newComment = new Comment({
            content,
            createdBy,
        })

        const savedComment = await newComment.save();

        await Topic.findByIdAndUpdate(req.params.topicID, {
            $push: { comments: savedComment._id}
        });

        res.status(201).json({ message: "Comment created successfully", comment: savedComment });
    }catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Unable to create comment.An error occurred while saving."})
    }
}