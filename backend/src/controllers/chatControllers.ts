import { RequestHandler , type Request, type Response} from "express";
import { chatClient } from "../lib/stream";

export const getStreamToken = async (req: Request, res: Response) => {
  try {
    const token = chatClient.createToken(req?.user?.clerkId as string);  // use clerkId for stream not mongoDb id (it should match the id in stream dashboard)
    res.status(200).json({
      token, 
      userId: req?.user?.clerkId,
      success: true,
    });
  } catch (error) {
    console.error("Error in getStreamToken", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
