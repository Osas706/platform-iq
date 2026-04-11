import { StreamChat } from "stream-chat";
import { ENV } from "./env.ts";

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.CLERK_SECRET_KEY

if (!apiKey || !apiSecret) {
  throw new Error("Stream STREAM_API_KEY or CLERK_SECRET_KEY is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// upsertStreamUser
// export const upsertStreamUser = async (userData: any) => {
//   try {
//     if (!userData?.id) {
//       throw new Error("User ID is required");
//     }

//     // 1. Generate token
//     await chatClient.createToken(userData?.id);

//     await chatClient.upsertUser(userData);
//     console.log("Stream user deleted successfully", userData);
//   } catch (error) {
//     console.error("Error upserting Stream user", error);
//   }
// }

export const upsertStreamUser = async (userData: any) => {
  try {
    if (!userData?.id) {
      throw new Error("User ID is required");
    }

    // 1. Generate token (NO await needed, it's sync)
    const token = chatClient.createToken(userData.id);

    // 2. Upsert user (use plural version)
    await chatClient.upsertUsers([
      {
        id: userData.id,
        name: userData.name,
        image: userData.image,
        ...userData,
      },
    ]);

    console.log("✅ Stream user upserted successfully", userData);

    // 3. Return token (important)
    return { token };
  } catch (error) {
    console.error("❌ Error upserting Stream user", error);
    throw error;
  }
};

// deleteStreamUser
export const deleteStreamUser = async (userId: string) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully", userId);
    
  } catch (error) {
    console.error("Error deleting the Stream user", error);
  }
}

 