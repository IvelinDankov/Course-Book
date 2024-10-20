import { Schema, Types, model } from "mongoose";

const courseModel = new Schema({
  title: {
    type: String,
    required: [true, "Title is required!"],
    minLength: 5,
  },
  type: {
    type: String,
    required: [true, "Type is required!"],
    minLength: 3
  },
  certificate: {
    type: String,
    required: [true, "Certificate is required!"],
    minLength: 2
  },
  image: {
    type: String,
    required: [true, "Image is required!"],
    validate: /^https?:\/\//
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
  },
  price: {
    type: Number,
    required: [true, "Price is required!"],
    min: 1
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
