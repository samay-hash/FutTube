const router = require("express").Router();
const crypto = require("crypto");
const EditorAssignment = require("../models/EditorAssignment");
const { creatorAuth } = require("../middlewares/creatorMiddleware");

router.post("/invite", creatorAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(32).toString("hex");

    const invite = await EditorAssignment.create({
      creatorId: req.userId,
      editorEmail: email,
      inviteToken: token,
    });
    const inviteLink = `http://localhost:3000/join?token=${token}`;
    console.log("SEND THIS TO EDITOR:", inviteLink);
    res.json({
      message: "Invite sent successfully",
      inviteLink,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/verify", async (req, res) => {
  const token = req.query.token;
  const invite = await EditorAssignment.findOne({
    inviteToken: token,
  });
  if (!invite) {
    return res.status(404).json({ message: "Invalid invite link" });
  }
  res.json({
    message: "invite valid, proceed to signup",
    email: invite.editorEmail,
  });
});

module.exports = router;
