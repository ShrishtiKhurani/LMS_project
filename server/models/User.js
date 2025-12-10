import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: { type: String, require: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    imageUrl: { type: String, require: true },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

// mongoDb me user ka data nhi aa raha ...check kar and webhook me jo mistake the sahe kar di and user me koi mistake dikh nhi rahe ek bar fir se dekh ....
