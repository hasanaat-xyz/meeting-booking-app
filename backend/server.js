// server.js
import path from "path";
import dotenv from "dotenv";

// Load .env first
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
console.log("API KEY:", process.env.RESEND_API_KEY); // should print your key

import app from "./src/app.js"; // import the app AFTER dotenv

import mongoose from "mongoose";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
