import express from "express";
import { oauth2Client } from "../utils/googlecalendar.js";
import GoogleToken from "../models/google-token-model.js";

const router = express.Router();

router.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });

  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).send("Authorization code missing");
    }

    const { tokens } = await oauth2Client.getToken(code);

    // Save or update tokens in DB
    await GoogleToken.findOneAndUpdate(
      {},
      tokens,
      { upsert: true, new: true }
    );

    console.log("GOOGLE TOKENS SAVED:", tokens);

    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #059669;">✅ Google Calendar Connected!</h1>
          <p>Your Google Calendar has been successfully connected.</p>
          <p>You can close this window and return to the application.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error in Google callback:", error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #dc2626;">❌ Connection Failed</h1>
          <p>There was an error connecting to Google Calendar.</p>
          <p>Please try again.</p>
        </body>
      </html>
    `);
  }
});

export default router;
