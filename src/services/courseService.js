import Courses from "../models/Course.js";

const create = (courseData, isOwner) => {
  return Courses.create({ ...courseData, owner: isOwner });
};

const getAll = () => {
  return Courses.find();
};

const getOne = (id) => {
  return Courses.findById(id);
};

const signUp = (courseId, userId) => {
  return Courses.findByIdAndUpdate(courseId, { $push: { signUpList : userId} });
};

export default {
  create,
  getAll,
  getOne,
  signUp,
};
