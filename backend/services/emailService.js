const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendInviteEmail = async (toEmail, inviteLink, creatorName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "You've been invited to join a MwareX Workspace",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Welcome to MwareX</h2>
        <p style="font-size: 16px; color: #555;">
          Hello,
        </p>
        <p style="font-size: 16px; color: #555;">
          <strong>${creatorName || "A creator"}</strong> has invited you to collaborate on their video content as an editor.
        </p>
        <p style="font-size: 16px; color: #555;">
          Click the button below to accept the invitation and set up your secure workspace.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Join Workspace
          </a>
        </div>
        <p style="font-size: 14px; color: #999; margin-top: 30px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${inviteLink}" style="color: #0066cc;">${inviteLink}</a>
        </p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendInviteEmail };
