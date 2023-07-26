import express from "express";
import { createComment } from "../controllers/commentcontroller.js";
import { authenticate } from "../controllers/usercontroller.js";
import {
  deleteComment,
  deleteReply,
} from "../controllers/commentcontroller.js";

const commentRouter = express.Router();

commentRouter.post("/:topicId/comments", authenticate, createComment);
commentRouter.delete("/comments/:commentId", authenticate, deleteComment);

commentRouter.post(
  "/:topicId/comments/:parentCommentId/replies",
  authenticate,
  createComment
);
commentRouter.delete("/:replyId", authenticate, deleteReply);

export default commentRouter;
