const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin");

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const hashed = await bcrypt.hash(password, 6);
  await adminModel.create({
    email,
    password: hashed,
    name,
  });
  res.json({ message: "Admin Created" });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({
    email,
  });
  if (!admin) {
    return res.status(404).json({ message: "not found" });
  } else {
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ message: "invalid" });
    } else {
      const token = jwt.sign(
        {
          id: admin._id,
        },
        process.env.JWT_SECRET_ADMIN
      );
      res.json({ token });
    }
  }
});
module.exports = router;
