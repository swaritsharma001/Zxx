import jwt from "jsonwebtoken";
import User from "../models/user.js";

const tokenSecret = process.env.JWT_SECRET || "your-default-secret"; // Use environment variable for secret

// Function to create token
export default async function Createtoken(user){
  const token = jwt.sign({
    id: user.id,
    _id: user._id
  }, tokenSecret, {
    expiresIn: "30d" // Token expires in 30 days
  });
  return token;
}

// Middleware to verify token
export async function verifyToken(req, res, next){
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Please login first" });

  try {
    // Verify token
    const decoded = jwt.verify(token, tokenSecret);

    // Find user associated with token
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Attach user data to request object
    req.user = user;
    next(); // Continue to next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for debugging purposes
    return res.status(401).json({ message: "Invalid Token" });
  }
}

export async function verifyAdmin(req, res, next){
  const token = req.cookies?.token;
  
  if (!token) return res.status(401).json({ message: "Please login first" });

  try {
    // Verify token
    const decoded = jwt.verify(token, tokenSecret);

    // Find user associated with token
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ message: "User not found" });
    // Check user role ADMIN OR OWNER
  if(user.role !== "ADMIN" && user.role !== "OWNER") return res.status(401).json({ message: "You are not an admin"})
    // Attach user data to request object
    req.user = user;
    next(); // Continue to next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for debugging purposes
    return res.status(401).json({ message: "Invalid Token" });
  }
}
