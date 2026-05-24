import { Router } from "express";
import { createProblem , getProblems} from "../controllers/problemController";

const router = Router();

router.post("/", createProblem);
router.get("/", getProblems);
// router.get("/:id", getProblemById);

export default router;