import express from "express";
import { getUserData, purchaseCourse, userEnrolledCourse, verifyPurchase } from "../controllers/userController.js";

const userRoute=express.Router()

userRoute.get('/data',getUserData);
userRoute.get('/enrolled-courses',userEnrolledCourse)
userRoute.post('/purchase',purchaseCourse)
userRoute.get("/verify-purchase", verifyPurchase);


export default userRoute