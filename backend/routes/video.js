const router = require("express").Router();

const { google } = require("googleapis");
const { getOAuth2Client } = require("../tools/googleClient");

const multer = require("multer");
const videoModel = require("../models/video");
const userModel = require("../models/user");
const adminAuth = require("../middlewares/adminMiddleware");
const userAuth = require("../middlewares/userMiddleware");
const uploadToYoutube = require("../services/youtubeUploader");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("video"), async (req, res) => {
  console.log("BODY ===>", req.body);
  console.log("FILE ===>", req.file);
  try {
    const video = await videoModel.create({
      fileUrl: req.file.path,
      title: req.body.title,
      description: req.body.description,
      editorId: req.body.editorId,
      creatorId: req.body.creatorId,
    });
    res.json({ message: "uploaded", video });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "upload failed", error: err.message });
  }
});

router.get("/pending", userAuth, async (req, res) => {
  let filter = { status: "pending"};
  if (req.role === "creator") {
    filter.creatorId = req.userId;
  } else if (req.role === "editor") {
    // For editors, show videos they uploaded or assigned to their creator
    const user = await userModel.findById(req.userId);
    if (!user || !user.creatorId) {
      return res.json([]); // No videos if no creator associated
    }
    filter.creatorId = user.creatorId;
  }
  const videos = await videoModel.find(filter);
  res.json(videos);
});

router.post("/:id/approve", userAuth, async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video Not Found" });
    }

    // Check if user has connected YouTube
    const user = await userModel.findById(req.userId);
    if (!user || !user.youtubeTokens || !user.youtubeTokens.refreshToken) {
      return res.status(400).json({
        message: "YouTube account not connected. Please go to Settings and connect your channel."
      });
    }

    video.status = "approved";
    await video.save();

    // Upload to YouTube
    try {
      const yt = await uploadToYoutube(video, req.userId);
      video.status = "uploaded";
      video.youtubeId = yt.id;
      await video.save();
      res.json({ message: "Video approved and uploaded to YouTube!" });
    } catch (uploadErr) {
      console.error("YouTube Upload Error:", uploadErr);
      // Revert status if upload fails, or keep as approved but not uploaded?
      // For now, let's keep it approved but warn the user.
      // video.status = "pending"; await video.save(); 
      res.status(500).json({
        message: "Video approved locally, but YouTube upload failed. Check your YouTube connection.",
        error: uploadErr.message
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Approval process failed", error: err.message });
  }
});

router.post("/:id/reject", userAuth, async (req, res) => {
  const video = await videoModel.findById(req.params.id);
  if (!video) {
    return res.status(404).json({ message: "not found" });
  }
  video.status = "rejected";
  await video.save();

  res.json({ message: "Video Rejected" });
});

// Store YouTube tokens for user
router.post("/store-youtube-tokens", userAuth, async (req, res) => {
  const { accessToken, refreshToken } = req.body;
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.youtubeTokens = {
      accessToken,
      refreshToken,
      updatedAt: new Date(),
    };
    await user.save();

    res.json({ message: "YouTube tokens stored successfully" });
  } catch (error) {
    console.error("Error storing YouTube tokens:", error);
    res.status(500).json({ message: "Failed to store tokens" });
  }
});

module.exports = router;
