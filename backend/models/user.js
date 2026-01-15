const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, 
  },
  role: {
    type: String,
    enum: ["creator", "editor", "admin"],
    default: "creator",
  },
  youtubeTokens: {
    accessToken: String,
    refreshToken: String,
    updatedAt: Date,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
