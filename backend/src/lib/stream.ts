import { StreamChat } from "stream-chat";
import { ENV } from "./env.ts";

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.CLERK_SECRET_KEY

if (!apiKey || !apiSecret) {
  throw new Error("Stream STREAM_API_KEY or CLERK_SECRET_KEY is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// upsertStreamUser
export const upsertStreamUser = async (userData: any) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream user deleted successfully", userData);
  } catch (error) {
    console.error("Error upserting Stream user", error);
  }
}

// deleteStreamUser
export const deleteStreamUser = async (userId: string) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully", userId);
    
  } catch (error) {
    console.error("Error deleting the Stream user", error);
  }
}

 