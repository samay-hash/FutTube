const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const hashed = await bcrypt.hash(password, 7);
  const newUser = await userModel.create({
    email,
    password: hashed,
    name,
  });
  res.json({
    message: "User Created",
    user: {
      _id: newUser._id,
      email: newUser.email,
    },
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email,
  });
  if (!user) {
    return res.status(404).json({ message: "not found" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "invalid" });
  }
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_USER
  );

  // Set httpOnly cookie for improved security (also return token for compatibility)
  res.cookie("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  res.json({ token });
  console.log("SIGN IN EMAIL:", email);
});

module.exports = router;
