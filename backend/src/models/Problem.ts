import mongoose, { Schema, Document } from "mongoose";

export interface IProblem extends Document {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: { text: string; notes: string[] };
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: { javascript?: string; python?: string; java?: string };
  expectedOutput: { javascript?: string; python?: string; java?: string };
}

const ProblemSchema = new Schema<IProblem>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    category: { type: String, required: true },
    description: {
      text: { type: String, required: true },
      notes: [{ type: String }],
    },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    constraints: [{ type: String }],
    starterCode: {
      javascript: { type: String },
      python: { type: String },
      java: { type: String },
    },
    expectedOutput: {
      javascript: { type: String },
      python: { type: String },
      java: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProblem>("Problem", ProblemSchema);