import { Router } from "express";
import courseService from "../services/courseService.js";

const router = Router();

router.get("/", async (req, res) => {
  const courses = await courseService.getAll().lean();
  
  courses.reverse();

  if (courses.length > 3) {
    courses.length = 3;
  }

  
  
  res.render("home", { title: "", courses });
});

export default router;
