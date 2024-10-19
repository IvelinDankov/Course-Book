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

    const ownerEmail = owner.email;

    res.render("courses/details", {
      title: "Details Page",
      course,
      isOwner,

      ownerEmail,
      signUp,
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

export default router;
