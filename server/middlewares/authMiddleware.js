import { clerkClient } from "@clerk/express";

// middleware (Educator protect routes)
export const protectEducator = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    next();

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
