const { Router } = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/user")
const EditorAssignment = require("../models/EditorAssignment");

const router = Router();


router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    email,
    password: hashed,
    role: "editor"
  });

  const invite = await EditorAssignment.findOne({
    editorEmail: email,
    status: "invited"
  });

  if (invite) {
    invite.status = "accepted";
    invite.editorId = newUser._id;
    await invite.save();
  }

  res.json({
    message: "Editor signup successful"
  });
});

module.exports = router;
