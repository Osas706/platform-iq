import { RequestHandler , type Request, type Response} from "express";
import Session from "../models/Session";
import { Types } from "mongoose";
import { chatClient, streamClient } from "../lib/stream";

// createSession controller
export const createSession = async (req: Request, res: Response) => {
  try {
    const {problemTitle, difficulty} = req.body;
    const userId = req.user?._id;
    const clerkId = req.user?.clerkId;

    if(!problemTitle || !difficulty){
      return res.status(400).json({ message: "Problem title and difficulty are required", success: false });
    };

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create session in db
    const session = await Session.create({
      problemTitle,
      difficulty,
      host: new Types.ObjectId(userId),
      callId,
    })

    if (!clerkId) {
      throw new Error("User not authenticated");
    }

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data : {
        created_by_id: clerkId,
        custom: {
          problemTitle,
          difficulty,
          sessionId: session._id.toString()
        },
      }
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problemTitle} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    } as any);

    await channel.create();

    // send email

    res.status(201).json({success: true, session: session})
  } catch (error) {
    console.error("Error in createSession controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// getActiveSessions controller
export const getActiveSessions = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error("Error in getActiveSessions controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// getRecentSessions controller
export const getRecentSessions = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error("Error in getActiveSessions controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// getSessionById controller
export const getSessionById = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error("Error in getSessionById controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// joinSession controller
export const joinSession = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error("Error in joinSession controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// endSession controller
export const endSession = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error("Error in endSession controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
