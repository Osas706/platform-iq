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
import problemRoutes from "./routes/problemRoutes";
import aiRoutes from "./routes/aiRoutes";

const app = express();

// const clientOrigin = ENV.CLIENT_URL?.replace(/\/$/, "") ?? "";

const allowedOrigins = [
  ENV.CLIENT_URL?.replace(/\/$/, ""),
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean) as string[];


// middlewares
app.use(express.json());
// app.use(
//   cors({
//     origin(origin, callback) {
//       // Reflect the request origin so it matches exactly (avoids trailing-slash mismatches)
//       if (!origin || origin.replace(/\/$/, "") === clientOrigin) {
//         callback(null, origin ?? clientOrigin);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );
app.use(
  cors({
    origin(origin, callback) {
      console.log("Request origin:", origin); // add this
      console.log("Allowed origins:", allowedOrigins); // add this
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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
app.use("/api/problems", problemRoutes);
app.use("/api/ai", aiRoutes);

app.get("/health", (req: Request, res: Response) => {
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
