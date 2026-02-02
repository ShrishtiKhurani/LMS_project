import express from "express";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updatedCourseProgress,
  userEnrolledCourse,
} from "../controllers/userController.js";
import { requireAuth } from "@clerk/express";

const userRoute = express.Router();

userRoute.get("/data", requireAuth(), getUserData);
userRoute.get("/enrolled-courses", requireAuth(), userEnrolledCourse);
userRoute.post("/purchase", requireAuth(), purchaseCourse);
userRoute.post("/update-course-progress", requireAuth(), updatedCourseProgress);
userRoute.post("/get-course-progress", requireAuth(), getUserCourseProgress);
userRoute.post("/add-rating", requireAuth(), addUserRating);

export default userRoute;
