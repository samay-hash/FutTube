const router = require("express").Router();
const crypto = require("crypto");
const EditorAssignment = require("../models/EditorAssignment");
const userModel = require("../models/user");
const { creatorAuth } = require("../middlewares/creatorMiddleware");
const { sendInviteEmail } = require("../services/emailService");

router.post("/invite", creatorAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(32).toString("hex");

    const invite = await EditorAssignment.create({
      creatorId: req.userId,
      editorEmail: email,
      inviteToken: token,
    });
    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
    const inviteLink = `${frontendUrl}/join?token=${token}`;

    // Fetch creator name for the email
    const creator = await userModel.findById(req.userId);
    const creatorName = creator ? creator.name : "A Creator";

    console.log("SEND THIS TO EDITOR (Fallback):", inviteLink);

    // Send Email
    try {
      await sendInviteEmail(email, inviteLink, creatorName);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // We continue even if email fails, so the user can copy the link manually if needed
    }

    res.json({
      message: "Invite sent successfully (check email)",
      inviteLink, // Keep returning it for now in case details are needed in frontend
    });
  } catch (err) {
    console.error(err);
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
    creatorId: invite.creatorId,
  });
});

module.exports = router;
