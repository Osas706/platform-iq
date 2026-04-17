import { Router, type Request, type Response } from "express";

import { protectRoute } from "../middlewares/protectRoute";
import { createSession, getActiveSessions, getRecentSessions, getSessionById, joinSession , endSession} from "../controllers/sessionControllers";


const router = Router();

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/recent-sessions", protectRoute, getRecentSessions);

router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);

export default router;