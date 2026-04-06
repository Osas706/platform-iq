import { Inngest } from "inngest";
import { connectDB } from "./db.ts";
import User from "../models/User.ts";
import { deleteStreamUser, upsertStreamUser } from "./stream.ts";

export const inngest = new Inngest({ id: "platform-iq"});

// sync user func
export const syncUser = inngest.createFunction(
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

    await User.create(newUser)


    await upsertStreamUser({
      id: newUser?.clerkId?.toString(),
      name: newUser.name,
      image: newUser.profileImage
    })
  }
);

//
export const deleteUser = inngest.createFunction(
  {id: "delete-user-from-db-v2", triggers: [{ event: "clerk/user.deleted" }]},
  // {event: "clerk/user.delected" as const},
  async ({ event } : { event: any }) => {
    await connectDB();
    
    const {id} = event.data;

    await User.deleteOne({clerkId: id})

    await deleteStreamUser( id.toString())
  }
);

export const functions = [syncUser, deleteUser];