import { getAuth } from "@clerk/express";
import User from "../models/User";
import { type Request, type Response, type NextFunction } from "express";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

    const user = await User.findOne({ clerkId });

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};