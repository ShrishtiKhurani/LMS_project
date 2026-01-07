import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongoDb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRoute from "./routes/userRoute.js";

//Initilize express
const app = express();

// connect to Db
await connectDB();
await connectCloudinary();


app.post("/stripe",express.raw({type:'application/json'}),stripeWebhooks)


//Middleware
app.use(cors());
app.use(clerkMiddleware());

//Routes
app.get("/", (req, res) => res.send("API working..."));
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user",express.json(),userRoute)


//Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running of ${PORT}`);
});
