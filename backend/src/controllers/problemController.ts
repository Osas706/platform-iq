// controllers/problem.controller.ts
import { Request, Response } from "express";
import Problem from "../models/Problem";

// createProblem
export const createProblem = async (req: Request, res: Response) => {
  try {
    const existing = await Problem.findOne({ id: req.body.id });
    if (existing) {
      return res.status(400).json({ message: "Problem with this ID already exists" });
    }

    const problem = await Problem.create(req.body);
    return res.status(201).json({ message: "Problem created successfully", data: problem });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// getProblems
export const getProblems = async (req: Request, res: Response) => {
  try {
    const { difficulty, category, page = 1, limit = 20 } = req.query;

    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = { $regex: category, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const [problems, total] = await Promise.all([
      Problem.find(filter).skip(skip).limit(Number(limit)).select("-starterCode -expectedOutput"),
      Problem.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Problems retrieved successfully",
      data: problems,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// export const getProblemById = async (req: Request, res: Response) => {
//   try {
//     const problem = await Problem.findOne({ id: req.params.id });
//     if (!problem) {
//       return res.status(404).json({ message: "Problem not found" });
//     }
//     return res.status(200).json({ message: "Problem retrieved successfully", data: problem });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// };