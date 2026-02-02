import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.role = "educator";
    await user.save();

    return res.json({ success: true, message: "You are now an Educator" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Add new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const { userId: educatorId } = req.auth();

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail not attached" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    return res.json({ success: true, message: "New Course Added" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get educator's all courses
export const getEducatorCourses = async (req, res) => {
  try {
    const { userId: educator } = req.auth();
    const courses = await Course.find({ educator });

    return res.json({ success: true, courses });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get educator dashboard data
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId: educator } = req.auth();
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    return res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get enrolled students with purchase data
export const getEnrolledStudentData = async (req, res) => {
  try {
    const { userId: educator } = req.auth();
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId?.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    return res.json({ success: true, enrolledStudents });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
