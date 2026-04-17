import { Inngest, type InngestFunction } from "inngest";
import { connectDB } from "./db";
import User from "../models/User";
import { deleteStreamUser, upsertStreamUser } from "./stream";

export const inngest = new Inngest({ id: "platform-iq"});

// sync user func
export const syncUser: InngestFunction.Any = inngest.createFunction(
  {id: "sync-user", triggers: [{ event: "clerk/user.created" }]},
  // {event: "clerk/user.created" as const},
  async ({ event } : { event: any }) => {
    await connectDB();
    
    const {id, email_addresses, first_name, last_name, image_url} = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url
    };

    await User.create(newUser);

    await upsertStreamUser({
      id: newUser?.clerkId?.toString(),
      name: newUser.name,
      image: newUser.profileImage
    });

    // send a welcome message to the user
  }
);

// deleteUser
export const deleteUser: InngestFunction.Any = inngest.createFunction(
  {id: "delete-user-from-db", triggers: [{ event: "clerk/user.deleted" }]},
  // {event: "clerk/user.delected" as const},
  async ({ event } : { event: any }) => {
    await connectDB();
    
    const {id} = event.data;

    await User.deleteOne({clerkId: id})

    await deleteStreamUser( id.toString())
  }
);

export const functions = [syncUser, deleteUser];