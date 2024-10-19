import { Schema, Types, model } from "mongoose";

const courseModel = new Schema({
  title: {
    type: String,
    required: [true, "Title is required!"],
  },
  type: {
    type: String,
    required: [true, "Type is required!"],
  },
  certificate: {
    type: String,
    required: [true, "Certificate is required!"],
  },
  image: {
    type: String,
    required: [true, "Image is required!"],
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  price: {
    type: Number,
    required: [true, "Price is required!"],
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
