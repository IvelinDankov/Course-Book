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
  return Courses.findByIdAndUpdate(courseId, { $push: { signUpList: userId } });
};

const remove = (courseId) => {
  return Courses.findByIdAndDelete(courseId);
};

const edit = (id, data) => {
  return Courses.findByIdAndUpdate(id, data);
};

export default {
  create,
  getAll,
  getOne,
  signUp,
  remove,
  edit,
};
