import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("RAW BODY =>", req.body.toString());

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(req.body.toString(), {
      "svix-id": req.headers["svix-id"],
      "svix-signature": req.headers["svix-signature"],
      "svix-timestamp": req.headers["svix-timestamp"],
    });

    const { data, type } = JSON.parse(req.body.toString());

    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
    }

    res.json({ ok: true });

  } catch (err) {
    console.log("WEBHOOK ERROR =>", err.message);
    res.status(400).json({ error: err.message });
  }
};
