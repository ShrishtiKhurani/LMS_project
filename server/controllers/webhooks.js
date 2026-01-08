import Stripe from "stripe";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Must use raw body for signature verification
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Stripe Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      // Payment Intent Success
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const purchaseId = paymentIntent.metadata?.purchaseId;
        if (!purchaseId) break;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) break;

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);

        // Enroll student
        if (courseData && userData) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();

          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        purchaseData.paymentIntentId = paymentIntent.id; 
        await purchaseData.save();

        console.log("PURCHASE COMPLETED via Payment Intent");
        break;
      }

      // Payment Intent Failed
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const purchaseId = paymentIntent.metadata?.purchaseId;

        if (purchaseId) {
          await Purchase.findByIdAndUpdate(purchaseId, { status: "failed" });
          console.log("PURCHASE FAILED");
        }
        break;
      }

      // Checkout Session Complete
      case "checkout.session.completed": {
        const session = event.data.object;
        const purchaseData = await Purchase.findOne({
          $or: [
            { checkoutSessionId: session.id },
            { paymentIntentId: session.payment_intent },
          ],
        });

        if (!purchaseData) break;

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);

        if (courseData && userData) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();

          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        purchaseData.paymentIntentId = session.payment_intent || purchaseData.paymentIntentId;
        await purchaseData.save();

        console.log("PURCHASE COMPLETED via Checkout Session");
        break;
      }

      default:
        console.log("Unhandled event:", event.type);
    }

  
    res.status(200).json({ received: true });
  } catch (err) {
    console.log("Webhook Processing Error:", err);
    res.status(500).send();
  }
};
