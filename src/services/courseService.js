import Courses from "../models/Course.js";

const create = (courseData, isOwner) => {
  return Courses.create({ ...courseData, owner: isOwner });
};

const getAll = () => {
  return Courses.find()
}

export default {
  create,
  getAll
};
