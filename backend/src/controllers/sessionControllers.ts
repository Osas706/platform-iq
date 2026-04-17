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
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({success: true, sessions });
  } catch (error) {
    console.error("Error in getActiveSessions controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// getRecentSessions controller
export const getRecentSessions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const userObjectId = new Types.ObjectId(userId);

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userObjectId }, { participant: userObjectId }],
    }).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({success: true, sessions });
  } catch (error) {
    console.error("Error in getRecentSessions controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// getSessionById controller
export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({success: false, message: "Session not found" });

    res.status(200).json({success: true, session });
  } catch (error) {
    console.error("Error in getSessionById controller", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// joinSession controller
export const joinSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const userObjectId = new Types.ObjectId(userId);

    const clerkId = req.user?.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({success: false, message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ success: false, message: "Cannot join a completed session" });
    };

    const alreadyJoined = session.participants.some(
      (id) => id.toString() === userObjectId.toString()
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined" });
    };

    if (session.host.toString() === userObjectId.toString()) {
      return res.status(400).json({ success: false, message: "Host cannot join their own session as participant" });
    };

    // check if session is already full - has a participant
    if (session.participants.length >= 1) return res.status(409).json({ message: "Session is full" });

    session.participants.push(userObjectId);
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);

    if (!clerkId) {
      throw new Error("User not authenticated");
    };
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });

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
