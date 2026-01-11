const router = require("express").Router();

const { google } = require("googleapis");
const oauth2Client = require("../tools/googleClient");
const youtube = google.youtube({ version: "v3", auth: oauth2Client });

const multer = require("multer");
const videoModel = require("../models/video");
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

router.get("/pending", async (req, res) => {
  const videos = await videoModel.find({
    status: "pending",
  });
  res.json(videos);
});

router.post("/:id/approve", userAuth, async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: " video Not Found" });
    }
    video.status = "approved";
    await video.save();
    //uploaded to youtube succesfully:
    const yt = await uploadToYoutube(video);
    video.status = "uploaded";
    video.youtubeId = yt.id;
    await video.save();

    res.json({ message: "Video approved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
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

module.exports = router;
