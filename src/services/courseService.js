import Courses from "../models/Course.js";

const create = (courseData, isOwner) => {
  return Courses.create({ ...courseData, owner: isOwner });
};

export default {
  create,
};
