import { Webhook } from "svix";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import Stripe from "stripe";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.log("WEBHOOK ERROR =>", err.message);
    res.status(400).json({ error: err.message });
  }
};

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

        // Find purchase by Checkout Session ID or Payment Intent ID
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