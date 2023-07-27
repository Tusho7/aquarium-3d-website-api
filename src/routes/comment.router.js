import express from "express";
import { createComment } from "../controllers/commentcontroller.js";
import { authenticate } from "../controllers/usercontroller.js";
import {
  deleteComment,
  deleteReply,
  likeComment,
  likeReply
} from "../controllers/commentcontroller.js";

const commentRouter = express.Router();

commentRouter.post("/:topicId/comments", authenticate, createComment);
commentRouter.delete("/comments/:commentId", authenticate, deleteComment);
commentRouter.post("/comments/:commentId/like", authenticate, likeComment);

commentRouter.post(
  "/:topicId/comments/:parentCommentId/replies",
  authenticate,
  createComment
);
commentRouter.delete("/:replyId", authenticate, deleteReply);
commentRouter.post("/replies/:replyId/like", authenticate, likeReply);

export default commentRouter;
