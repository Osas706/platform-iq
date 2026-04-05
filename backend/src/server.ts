import express, { type Request, type Response } from "express";
import { ENV } from "./lib/env.ts";
// import path from "path";
import { connectDB } from "./lib/db.ts";
import console from "console";

const app = express();

// make app ready for deployment
// const __dirname = path.resolve();
// if(ENV.NODE_ENV === 'production'){
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("/{*any}", (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//   });
// };

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({message: "Sucesss, Api running"})
});


const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server running on http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server", error)
  };
};

startServer();