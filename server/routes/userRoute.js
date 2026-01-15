import express from "express";
import {
    addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updatedCourseProgress,
  userEnrolledCourse,
} from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/data", getUserData);
userRoute.get("/enrolled-courses", userEnrolledCourse);
userRoute.post("/purchase", purchaseCourse);
userRoute.post("/update-course-progress", updatedCourseProgress);
userRoute.post("/get-course-progress", getUserCourseProgress);
userRoute.post("/add-rating", addUserRating);

export default userRoute;
