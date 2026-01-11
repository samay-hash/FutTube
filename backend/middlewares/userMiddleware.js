const jwt = require("jsonwebtoken");

const UserMiddleware = function (req, res, next) {
  try {
    const token = req.headers.token || (req.cookies && req.cookies.auth);
    if (!token) return res.status(403).json({ message: "Unauthorised" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Unauthorised" });
  }
};

module.exports = UserMiddleware;
