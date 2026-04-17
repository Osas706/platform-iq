import express, { type Request, type Response } from "express";
import cors from "cors";
import { ENV } from "./lib/env";
import { connectDB } from "./lib/db";
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/inngest";
import { clerkMiddleware } from "@clerk/express";
import { protectRoute } from "./middlewares/protectRoute";
import chatRoutes from "./routes/chatRoutes";
import sessionRoutes from "./routes/sessionRoutes";

const app = express();

// middlewares
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); // this adds auth field to request object i.e req.auth

// make app ready for deployment
// const __dirname = path.resolve();
// if(ENV.NODE_ENV === 'production'){
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("/{*any}", (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//   });
// };

// routes
app.use("/api/inngest", serve({client: inngest, functions: functions}))
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", protectRoute, (req: Request, res: Response) => {
  res.status(200).json({ message: "Sucesss, Api running" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server running on http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server", error);
  }
};

startServer();
