import { Router, type Request, type Response } from "express";
import { getStreamToken } from "../controllers/chatControllers";
import { protectRoute } from "../middlewares/protectRoute";


const router = Router();

router.get("/token", protectRoute, getStreamToken);

export default router;