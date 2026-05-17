import OpenAI from "openai";
import { ENV } from "./env";

const openai = new OpenAI({
  apiKey: ENV.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export default openai;
