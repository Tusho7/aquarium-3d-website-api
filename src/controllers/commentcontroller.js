import Comment from "../models/Comment.js";
import Topic from "../models/Topic.js";
import Reply from "../models/Reply.js";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";

export const commentCreationRateLimit = rateLimit({
  windowMs: 7000,
  max: 2,
  message: "Too many comment creation requests. Please try again later.",
});

export const createComment = async (req, res) => {
  const { content } = req.body;
  const { topicId } = req.params;
  const createdBy = req.user.username;

  try {
    const newComment = new Comment({
      content,
      createdBy: {
        id: req.user.id,
        username: createdBy,
      },
      topicId,
    });

    await newComment.save();

    const user = await User.findOne({ username: createdBy });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const username = user.username;

    await Topic.findByIdAndUpdate(topicId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({
      message: "Comment created successfully",
      topicId,
      comment: {
        ...newComment.toObject(),
        createdBy: username,
      },
    });
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

export const editComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const comment = await Comment.findOne({
      _id: commentId,
      createdBy: userId,
    });
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found or you do not have permission to edit it.",
      });
    }

    comment.content = content;
    comment.edited = true;
    comment.updatedAt = new Date();

    await comment.save();
    res.status(200).json({ message: "Comment edited successfully", comment });
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({
      error: "Unable to edit comment. An error occurred while saving.",
    });
  }
};

export const getCommentsByTopicId = async (req, res) => {
  const { topicId } = req.params;
  try {
    const comments = await Comment.find({ topicId: topicId })
    .populate({
      path: "replies",
      model: "Reply",
      populate: {
        path: "createdBy",
        model: "User",
      },
    })
    .populate("createdBy")
    .exec();
    if (comments.length === 0) {
      return res
        .status(404)
        .json({ error: "There are no comments for this topic." });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Unable to fetch comments." });
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
    res.status(500).json({
      error: "Unable to like/unlike comment. An error occurred while saving.",
    });
  }
};

export const likeReply = async (req, res) => {
  const { replyId } = req.params;
  const userId = req.user.id;

  try {
    const reply = await Reply.findById(replyId);
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
    res.status(500).json({
      error: "Unable to like/unlike reply. An error occurred while saving.",
    });
  }
};

export const editReply = async (req, res) => {
  const { replyId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const reply = await Comment.findOne({ _id: replyId, createdBy: userId });
    if (!reply) {
      return res.status(404).json({
        error: "Reply not found or you do not have permission to edit it.",
      });
    }

    reply.content = content;
    reply.edited = true;
    reply.updatedAt = new Date();

    await reply.save();
    res.status(200).json({ message: "Reply edited successfully", reply });
  } catch (error) {
    console.error("Error editing reply:", error);
    res
      .status(500)
      .json({ error: "Unable to edit reply. An error occurred while saving." });
  }
};

export const getRepliesByCommentId = async (req, res) => {
  const { commentId } = req.params;
  console.log(commentId);

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    const replyIds = comment.replies;
    if (replyIds.length === 0) {
      return res
        .status(404)
        .json({ error: "There are no replies for this comment." });
    }

    const replies = await Comment.find({ _id: { $in: replyIds } });
    console.log(replies);
    res.status(200).json(replies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ error: "Unable to fetch replies." });
  }
};

export const createReply = async (req, res) => {
  const { content } = req.body;
  const { topicId, parentCommentId } = req.params;
  const createdBy = req.user.username;

  try {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return res.status(404).json({ error: "Parent comment not found" });
    }

    const newReply = new Reply({
      content,
      createdBy: {
        id: req.user.id,
        username: createdBy,
      }
    });
    await newReply.save();

    parentComment.replies.push(newReply);
    await parentComment.save();

    res.status(201).json({
      message: "Reply created successfully",
      parentCommentId,
      reply: newReply,
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({
      error: "Unable to create reply. An error occurred while saving.",
    });
  }
};
