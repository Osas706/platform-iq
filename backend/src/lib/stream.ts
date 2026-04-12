import { StreamChat } from "stream-chat";
import type { UserResponse } from "stream-chat";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export type UpsertStreamUserInput = Pick<UserResponse, "id" | "name" | "image">;

export const upsertStreamUser = async (userData: UpsertStreamUserInput) => {
  if (!userData?.id) {
    throw new Error("User ID is required");
  }

  const payload: UserResponse = {
    id: userData.id,
    ...(userData.name != null && userData.name !== "" ? { name: userData.name } : {}),
    ...(userData.image != null && userData.image !== ""
      ? { image: userData.image }
      : {}),
  };

  await chatClient.upsertUser(payload);
};

export const createStreamUserToken = (
  userId: string,
  exp?: number,
  iat?: number,
): string => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  return chatClient.createToken(userId, exp, iat);
};

export const deleteStreamUser = async (userId: string) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully", userId);
  } catch (error) {
    console.error("Error deleting the Stream user", error);
  }
};
