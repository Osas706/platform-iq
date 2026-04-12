import type { AuthObject } from "@clerk/backend";
import type { Document } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      auth: () => AuthObject;

      user?: Document & {
        clerkId: string;
        email: string;
        name: string;
        profileImage: string;
      };
    }
  }
}