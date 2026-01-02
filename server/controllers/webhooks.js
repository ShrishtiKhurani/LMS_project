import { Webhook } from "svix";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

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

      case "user.deleted":{
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


const stripeInstance = new String(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(req, res)=>{
 const sig = req.headers['stripe-signature']

 let event;
 try {
  event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
 } catch (error) {
  res.status(400).send(`Webhook Error: ${error.message}`)
 }

 // Handle the event
    switch (event.type){
      case 'payment_intent_succeeded':{
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.session.list({
          payment_intend: paymentIntentId
        })

        const {purchaseId}= session.data[0].metadata;

        const purchaseData = await Purchase.findById(purchaseId)
        const userData = await User.findById(purchaseData.userId)
        const courseData = await Course.findById(purchaseData.courseId.toString())

        courseData.enrolledStudents.push(userData)
        await courseData.save()

        userData.enrolledStudents.push(courseData._id)
        await userData.save()

        purchaseData.status ='completed'
        await purchaseData.save()

        break; 
      }

      case 'payment_intent.payment_failed':{
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.session.list({
          payment_intend: paymentIntentId
        })

        const {purchaseId}= session.data[0].metadata;
        const purchaseData = await Purchase.findById(purchaseId)
        purchaseData.status ='failed'
        await purchaseData.save()

        break;

      }
      default:
        console.log(`Unhandle event type ${event.type}`);
    }

    res.json({received: true});
}