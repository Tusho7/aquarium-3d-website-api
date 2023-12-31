import express from "express";
import {
  createComment,
  createReply,
  getCommentsByTopicId,
  getRepliesByCommentId,
} from "../controllers/commentcontroller.js";
import { authenticate } from "../controllers/usercontroller.js";
import {
  deleteComment,
  deleteReply,
  likeComment,
  likeReply,
  editComment,
  editReply,
  commentCreationRateLimit,
} from "../controllers/commentcontroller.js";

const commentRouter = express.Router();

commentRouter.post(
  "/:topicId/comments",
  authenticate,
  commentCreationRateLimit,
  createComment
);
commentRouter.delete("/comments/:commentId", authenticate, deleteComment);
commentRouter.post("/comments/:commentId/like", authenticate, likeComment);
commentRouter.put("/comments/:commentId", authenticate, editComment);
commentRouter.get("/topics/:topicId/comments", getCommentsByTopicId);

commentRouter.post(
  "/:topicId/comments/:parentCommentId/replies",
  authenticate,
  commentCreationRateLimit,
  createReply
);
commentRouter.delete("/:replyId", authenticate, deleteReply);
commentRouter.post("/replies/:replyId/like", authenticate, likeReply);
commentRouter.put("/:replyId", authenticate, editReply);
commentRouter.get("/comments/:commentId/replies", getRepliesByCommentId);

export default commentRouter;
