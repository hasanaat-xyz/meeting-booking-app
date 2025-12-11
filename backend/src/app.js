// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import slotRoutes from "./routes/slot-routes.js";
import eventRoutes from "./routes/event-route.js"
// 1. Import the new authentication route file
import authRoutes from "./routes/auth-routes.js"; 

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Register Slot Routes
app.use("/api/slots", slotRoutes);

// Register Event Routes
app.use("/api/event", eventRoutes);

// 2. Register the Authentication Routes
// This line makes all routes in auth-routes.js accessible under /api/auth
app.use("/api/auth", authRoutes); 

export default app;