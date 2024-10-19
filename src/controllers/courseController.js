import { Router } from "express";
import courseService from "../services/courseService.js";

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
    console.log(err.message);
  }
});

export default router;
