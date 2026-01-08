import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import Stripe from "stripe";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//User enrolled courses with lecture link
export const userEnrolledCourse = async (req, res) => {
  try {
    const { userId } = req.auth();
    const userData = await User.findById(userId).populate("enrolledCourses");
    res.json({ success: true, enrolledCourse: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = req.auth();
    
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data not found" });
    }

    const amount =
      courseData.coursePrice -
      ((courseData.discount || 0) * courseData.coursePrice) / 100;

    // Create DB record with pending status
    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
      status: "pending",           
    });

    // Stripe Setup
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // Line items
    const line_items = [
      {
        price_data: {
          currency,
          product_data: { name: courseData.courseTitle },
          unit_amount: Math.floor(amount * 100),
        },
        quantity: 1,
      },
    ];

    // Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/loading/my-enrollment?session_id={CHECKOUT_SESSION_ID}`, // important: pass session_id
      cancel_url: `${origin}/`,
      payment_intent_data: {
        metadata: {
          purchaseId: newPurchase._id.toString(), 
        },
      },
    });

    // Save Checkout Session ID to DB
    newPurchase.checkoutSessionId = session.id;
    await newPurchase.save();

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("PurchaseCourse Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

