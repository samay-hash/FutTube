const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./db");
const userRoutes = require("./routes/authUser");
const adminRoutes = require("./routes/authAdmin");
const videoRoutes = require("./routes/video");
const editorRoutes = require("./routes/editor");
const inviteRoutes = require("./routes/invite");

const { google } = require("googleapis");
const googleAuthRoutes = require("./routes/googleAuth");

const app = express();

// Clean up the frontend URL (remove trailing slash if present)
const frontend = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
console.log("CORS Origin Allowed:", frontend);

app.use(
  cors({
    origin: [frontend, "http://localhost:3000"], // Allow both production and local
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/editor", editorRoutes);
app.use("/api/v1", inviteRoutes);
app.use("/auth", googleAuthRoutes);

app.get("/oauth2callback", async (req, res) => {
  try {
    const code = req.query.code;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT
    );

    const { tokens } = await oauth2Client.getToken(code);

    console.log("TOKENS ===>", tokens);

    // Redirect to frontend callback with tokens (frontend should handle storing securely)
    const frontend = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const params = new URLSearchParams();
    if (tokens.access_token) params.append("access_token", tokens.access_token);
    if (tokens.refresh_token)
      params.append("refresh_token", tokens.refresh_token);
    if (tokens.scope) params.append("scope", tokens.scope);

    return res.redirect(
      `${frontend.replace(/\/$/, "")}/oauth2callback?${params.toString()}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Token exchange failed",
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
