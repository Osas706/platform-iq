import mongoose, { Document, Types } from "mongoose";

export interface ISession extends Document {
  problemTitle: string;
  difficulty: string;
  host: Types.ObjectId;
  participants: Types.ObjectId[];
  status: "active" | "completed";
  callId: string;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    problemTitle: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    // stream vid call ID
    callId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;