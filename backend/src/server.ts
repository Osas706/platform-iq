import express, { type Request, type Response } from "express";
import { ENV } from "./lib/env.ts";

const app = express();

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({message: "Sucesss, Api running"})
});

app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`);
});