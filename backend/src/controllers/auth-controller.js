import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

export const register = async (req, res) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY); // move here

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send welcome email
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Welcome to Xvent 🎉",
      html: `<p>Hi ${name}, welcome to Xvent!</p>`,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const login = async (req, res) => {
  try {
    console.log("--- DEBUG: LOGIN REQUEST RECEIVED ---");

    const { email, password } = req.body;

    const user = await User.findOne({ email }); // <-- Correctly retrieving into 'user'
    
    // Check if user exists (already correct)
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    console.log("--- DEBUG: DB QUERY COMPLETE ---");

    // 1. 🟢 FIX: Use 'user.password' instead of 'User.password'
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    console.log("--- DEBUG: JWT SECRET VALUE:", process.env.JWT_SECRET); 

    // 2. 🟢 FIX: Use 'user._id' instead of 'User._id'
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    console.log("--- DEBUG: JWT TOKEN CREATED SUCCESSFULLY ---"); 

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
      })
      .status(200)
      .json({ 
        message: "Login successful", 
        user,
        token // Also return token in response body for localStorage
      });
      
  } catch (error) {
    console.error(error); // This will now catch the error if the fix fails
    res.status(500).json({ message: "Something went wrong" });
  }
};