import Comment from "../models/Comment.js";
import Topic from "../models/Topic.js";

export const createComment = async (req, res) => {
  const { content } = req.body;
  const { topicId, parentCommentId } = req.params;

  try {
    const createdBy = req.user.id;

    const newComment = new Comment({
      content,
      createdBy,
    });

    const savedComment = await newComment.save();

    if (parentCommentId) {
      // If a parentCommentId is provided, it means this comment is a reply
      // Add the reply to the parent comment's replies array
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: savedComment._id },
      });

      res.status(201).json({
        message: "Reply created successfully",
        parentCommentId,
        reply: savedComment,
      });
    } else {
      // If there's no parentCommentId, the comment is a top-level comment in the topic
      await Topic.findByIdAndUpdate(topicId, {
        $push: { comments: savedComment._id },
      });

      res.status(201).json({
        message: "Comment created successfully",
        topicId,
        comment: savedComment,
      });
    }
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ error: "Unable to create comment. An error occurred while saving." });
  }
};
