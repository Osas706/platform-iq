import express, { type Request, type Response } from "express";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/inngest.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// make app ready for deployment
// const __dirname = path.resolve();
// if(ENV.NODE_ENV === 'production'){
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("/{*any}", (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//   });
// };

app.use("/api/inngest", serve({client: inngest, functions: functions}))

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
