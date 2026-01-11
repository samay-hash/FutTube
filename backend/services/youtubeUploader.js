const { google } = require("googleapis");
const oauth2Client = require("../tools/googleClient");
const fs = require("fs");

async function uploadToYoutube(video) {
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
  const res = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title: video.title,
        description: video.description,
      },
      status: {
        privacyStatus: "private",
      },
    },
    media: {
      body: fs.createReadStream(video.fileUrl),
    },
  });
  return res.data;
}

module.exports = uploadToYoutube;
