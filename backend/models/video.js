const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  fileUrl: String,
  title: String,
  description: String,

  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  editorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "uploaded"],
    default: "pending",
  },
});

const videoModel = mongoose.model("Video", videoSchema);

module.exports = videoModel;
