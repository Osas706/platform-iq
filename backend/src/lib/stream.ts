import { StreamChat } from "stream-chat";
import type { UserResponse } from "stream-chat";
import { ENV } from "./env";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

// stream chat client feature
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// stream calling client feature
export const streamClient = new StreamClient(apiKey, apiSecret);


export type UpsertStreamUserInput = Pick<UserResponse, "id" | "name" | "image">;

// upsertStreamUser
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

// createStreamUserToken
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

// deleteStreamUser
export const deleteStreamUser = async (userId: string) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully", userId);
  } catch (error) {
    console.error("Error deleting the Stream user", error);
  }
};
