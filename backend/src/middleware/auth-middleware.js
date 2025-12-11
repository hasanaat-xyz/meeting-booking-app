// src/middleware/auth-middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

// Protect routes middleware
export const authMiddleware = async (req, res, next) => {
  let token;

  try {
    // Check if token exists in cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
