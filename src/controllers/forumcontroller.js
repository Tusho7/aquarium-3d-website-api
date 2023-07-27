import moment from "moment-timezone";
import Topic from "../models/Topic.js";

export const createTopic = (req, res) => {
  const { title, content } = req.body;
  const createdBy = req.user.id;

  const timezone = "Asia/Tbilisi";
  const createdAtLocal = moment().tz(timezone).toDate();

  const newTopic = new Topic({
    title,
    content,
    createdBy: createdBy,
    createdAt: createdAtLocal,
  });

  newTopic
    .save()
    .then((savedTopic) => {
      const createdAtFormatted = moment(createdAtLocal).format();

      const responseTopic = {
        ...savedTopic.toObject(),
        createdAt: createdAtFormatted,
      };

      res
        .status(201)
        .json({ message: "Topic created successfully", topic: responseTopic });
    })
    .catch((error) => {
      console.error("Error creating topic:", error);
      res.status(500).json({
        error: "Unable to create topic. An error occurred while saving.",
      });
    });
};

export const deleteTopic = async (req, res) => {
  const { topicId } = req.params;
  const userId = req.user.id;

  try {
    const topic = await Topic.findOne({ _id: topicId, createdBy: userId });
    if (!topic) {
      return res.status(404).json({
        error: "Topic not found or you do not have permission to delete it.",
      });
    }

    await topic.deleteOne();
    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({
      error: "Unable to delete topic. An error occurred while deleting.",
    });
  }
};

export const likeTopic = async (req, res) => {
  const { topicId } = req.params;
  const userId = req.user.id;

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    const userIndex = topic.likes.indexOf(userId);

    if (userIndex === -1) {
      topic.likes.push(userId);
      topic.totalLikes += 1;
    } else {
      topic.likes.splice(userIndex, 1);
      topic.totalLikes -= 1;
    }

    await topic.save();
    res.status(200).json({ message: "Topic liked/unliked successfully" });
  } catch (error) {
    console.error("Error liking/unliking topic:", error);
    res
      .status(500)
      .json({
        error: "Unable to like/unlike topic. An error occurred while saving.",
      });
  }
};

export const editTopic = async (req, res) => {
  const { topicId } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const topic = await Topic.findOne({ _id: topicId, createdBy: userId });
    if (!topic) {
      return res
        .status(404)
        .json({
          error: "Topic not found or you do not have permission to edit it.",
        });
    }

    topic.title = title;
    topic.content = content;
    topic.edited = true;
    topic.updatedAt = new Date();

    await topic.save();
    res.status(200).json({ message: "Topic edited successfully", topic });
  } catch (error) {
    console.error("Error editing topic:", error);
    res
      .status(500)
      .json({ error: "Unable to edit topic. An error occurred while saving." });
  }
};
