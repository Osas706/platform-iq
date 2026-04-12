/// <reference types="@clerk/express/env" />

import { Document } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: Document & {
        clerkId: string;
        email: string;
        name: string;
        profileImage: string;
      };
    }
  }
}