import { Router } from "express";
import courseService from "../services/courseService.js";
import { getErrorMessage } from "../utils/getErrMsg.js";
import authService from "../services/authService.js";

const router = Router();

/**********************
 ******* CREATE *******
 **********************/

router.get("/create", (req, res) => {
  res.render("courses/create", { title: "Create Page" });
});

router.post("/create", async (req, res) => {
  const courseData = req.body;
  const isOwner = req.user._id;

  try {
    await courseService.create(courseData, isOwner);

    res.redirect("/");
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("courses/create", {
      title: "Create Page",
      data: courseData,
      error,
    });
  }
});

/**********************
 ******* CATALOG *******
 **********************/
router.get("/catalog", async (req, res) => {
  try {
    const courses = await courseService.getAll().lean();
    res.render("courses/catalog", { title: "Catalog Page", courses });
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("courses/catalog", { title: "Catalog Page", courses, error });
  }
});

/**********************
 ******* DETAILS *******
 **********************/
router.get("/:courseId/details", async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const course = await courseService.getOne(courseId).lean();
    const signUp = course.signUpList.some((userId) => userId == req.user?._id);

    const isOwner = req.user?._id == course.owner;
    const owner = await authService.getOne(course.owner).lean();
    let signCourseUser = course.signUpList.map((userId) => userId);

    signCourseUser = await authService.getOne(signCourseUser);

    const ownerEmail = owner.email;

    res.render("courses/details", {
      title: "Details Page",
      course,
      isOwner,
      ownerEmail,
      signUp,
      signCourseUser,
    });
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("courses/details", error);
  }
});

/**********************
 ******* SIGN UP *******
 **********************/

router.get("/:courseId/signup", async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  await courseService.signUp(courseId, userId);

  res.redirect(`/courses/${courseId}/details`);
});

/**********************
 ******* EDIT *******
 **********************/
router.get("/:courseId/edit", async (req, res) => {
  const courseId = req.params.courseId;

  const course = await courseService.getOne(courseId).lean();

  res.render("courses/edit", { title: "Edit Page", course });
});

router.post("/:courseId/edit", async (req, res) => {
  const courseId = req.params.courseId;
  const courseData = req.body;

  try {
    await courseService.edit(courseId, courseData).lean();
    res.redirect(`/courses/${courseId}/details`);
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("courses/edit", { title: "Edit Page", course, error });
  }
});

/**********************
 ******* DELETE *******
 **********************/
router.get("/:courseId/delete", async (req, res) => {
  const courseId = req.params.courseId;

  try {
    await courseService.remove(courseId);
    res.redirect("/courses/catalog");
  } catch (err) {
    const error = getErrorMessage(err);
    res.render(`courses/${courseId}delete`, error);
  }
});

export default router;
