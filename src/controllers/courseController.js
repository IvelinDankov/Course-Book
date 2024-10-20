import { Router } from "express";
import courseService from "../services/courseService.js";
import { getErrorMessage } from "../utils/getErrMsg.js";
import authService from "../services/authService.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = Router();

/**********************
 ******* CREATE *******
 **********************/

router.get("/create", isAuth, (req, res) => {
  res.render("courses/create", { title: "Create Page" });
});

router.post("/create", isAuth, async (req, res) => {
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


    const signUpList = course.signUpList.map(userId => userId)

    let singUpUser = ''
    for (const id of signUpList) {
      const users = await authService.getOne(id);

      singUpUser += users.username + ", ";
    }


    res.render("courses/details", {
      title: "Details Page",
      course,
      isOwner,
      ownerEmail,
      signUp,

      singUpUser,
    });
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("courses/details", error);
  }
});

/**********************
 ******* SIGN UP *******
 **********************/

router.get("/:courseId/signup", isAuth, async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  const isOwner = isCourseOwner(courseId, userId);
  if (isOwner) {
    return res.redirect("/404");
  }

  try {
    await courseService.signUp(courseId, userId);

    res.redirect(`/courses/${courseId}/details`);
  } catch (err) {
    const error = getErrorMessage(err);
    res.render(`courses/${courseId}/signup`, { error });
  }
});

/**********************
 ******* EDIT *******
 **********************/
router.get("/:courseId/edit", isAuth, async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  const course = await courseService.getOne(courseId).lean();

  const isOwner = isCourseOwner(courseId, userId);
  if (!isOwner) {
    res.redirect("/404");
  }

  res.render("courses/edit", { title: "Edit Page", course });
});

router.post("/:courseId/edit", isAuth, async (req, res) => {
  const courseId = req.params.courseId;
  const courseData = req.body;
  const userId = req.user._id;

  const isOwner = isCourseOwner(courseId, userId);
  if (!isOwner) {
    res.redirect("/404");
  }

  try {
    await courseService.edit(courseId, courseData).lean();
    res.redirect(`/courses/${courseId}/details`);
  } catch (err) {
    const error = getErrorMessage(err);
    res.render("courses/edit", {
      title: "Edit Page",
      course: courseData,
      error,
    });
  }
});

/**********************
 ******* DELETE *******
 **********************/
router.get("/:courseId/delete", isAuth, async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  const isOwner = isCourseOwner(courseId, userId);
  if (!isOwner) {
    res.redirect("/404");
  }

  try {
    await courseService.remove(courseId);
    res.redirect("/courses/catalog");
  } catch (err) {
    const error = getErrorMessage(err);
    res.render(`courses/${courseId}delete`, { error });
  }
});

/**********************
 ******* HELP FUNC *******
 **********************/

async function isCourseOwner(courseId, userId) {
  const course = await courseService.getOne(courseId);
  const isOwner = course.owner.toString() === userId;

  return isOwner;
}

export default router;
