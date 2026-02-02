import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentData, updateRoleToEducator } from '../controllers/educatorContoller.js'
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import { requireAuth } from "@clerk/express";

const educatorRouter = express.Router()

//Add educator router
educatorRouter.get('/update-role', requireAuth(), updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)
educatorRouter.get('/courses', protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentData)

export default educatorRouter;
