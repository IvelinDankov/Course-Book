import { Schema, Types, model } from "mongoose";

const courseModel = new Schema({
  title: {
    type: String,
    required: [true, ""],
  },
  type: {
    type: String,
    required: [true, ""],
  },
  certificate: {
    type: String,
    required: [true, ""],
  },
  image: {
    type: String,
    required: [true, ""],
  },
  description: {
    type: String,
    required: [true, ""],
  },
  price: {
    type: Number,
    required: [true, ""],
  },
  signUpList: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Courses = model("Courses", courseModel);

export default Courses;
