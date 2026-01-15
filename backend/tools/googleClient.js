const { google } = require("googleapis");
const userModel = require("../models/user");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT
);
 
async function getOAuth2Client(userId) {
  const user = await userModel.findById(userId);
  if (user && user.youtubeTokens) {
    oauth2Client.setCredentials({
      access_token: user.youtubeTokens.accessToken,
      refresh_token: user.youtubeTokens.refreshToken,
    });
  } else if (process.env.YOUTUBE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });
  }
  return oauth2Client;
}

module.exports = { oauth2Client, getOAuth2Client };
