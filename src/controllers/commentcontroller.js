import Comment from "../models/Comment.js";
import Topic from "../models/Topic.js";

export const createComment = async (req, res) => {
  const { content } = req.body;
  const { topicId, parentCommentId } = req.params;
  const createdBy = req.user.id;

  try {
    const newComment = new Comment({
      content,
      createdBy,
    });

    const savedComment = await newComment.save();

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found" });
      }

      await parentComment.updateOne({
        $push: { replies: savedComment._id },
      });

      res.status(201).json({
        message: "Reply created successfully",
        parentCommentId,
        reply: savedComment,
      });
    } else {
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
    res.status(500).json({
      error: "Unable to create comment. An error occurred while saving.",
    });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const comment = await Comment.findOne({
      _id: commentId,
      createdBy: userId,
    });
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found or you do not have permission to delete it.",
      });
    }

    await comment.deleteOne();

    await Topic.findByIdAndUpdate(comment.topicId, {
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      error: "Unable to delete comment. An error occurred while deleting.",
    });
  }
};

export const deleteReply = async (req, res) => {
  const { replyId } = req.params;
  const userId = req.user.id;

  try {
    const reply = await Comment.findOne({ _id: replyId, createdBy: userId });
    if (!reply) {
      return res.status(404).json({
        error: "Reply not found or you do not have permission to delete it.",
      });
    }

    await reply.deleteOne();
    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).json({
      error: "Unable to delete reply. An error occurred while deleting.",
    });
  }
};

export const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    const userIndex = comment.likes.indexOf(userId);

    if (userIndex === -1) {
      comment.likes.push(userId);
      comment.totalLikes += 1;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.totalLikes -= 1;
    }

    await comment.save();
    res.status(200).json({ message: "Comment liked/unliked successfully" });
  } catch (error) {
    console.error("Error liking/unliking comment:", error);
    res.status(500).json({ error: "Unable to like/unlike comment. An error occurred while saving." });
  }
};


export const likeReply = async (req, res) => {
  const { replyId } = req.params;
  const userId = req.user.id;

  try {
    const reply = await Comment.findById(replyId);
    if (!reply) {
      return res.status(404).json({ error: "Reply not found." });
    }

    const userIndex = reply.likes.indexOf(userId);

    if (userIndex === -1) {
      reply.likes.push(userId);
      reply.totalLikes += 1;
    } else {
      reply.likes.splice(userIndex, 1);
      reply.totalLikes -= 1;
    }

    await reply.save();
    res.status(200).json({ message: "Reply liked/unliked successfully" });
  } catch (error) {
    console.error("Error liking/unliking reply:", error);
    res.status(500).json({ error: "Unable to like/unlike reply. An error occurred while saving." });
  }
};

