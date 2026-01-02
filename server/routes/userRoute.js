import express from "express";
import { getUserData, purchaseCourse, userEnrolledCourse } from "../controllers/userController.js";

const userRoute=express.Router()

userRoute.get('/data',getUserData);
userRoute.get('/enrolled-courses',userEnrolledCourse)
userRoute.post('/purchase',purchaseCourse)


export default userRoute