import { Router } from "express";
import { runCode } from "../controllers/aiControllers";
import { protectRoute } from "../middlewares/protectRoute";

const router = Router();

router.post("/execute", protectRoute, runCode);

export default router;
