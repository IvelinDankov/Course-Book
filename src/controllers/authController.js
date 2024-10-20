import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, loginUser } from "../middlewares/authMiddleware.js";
import courseService from "../services/courseService.js";

const router = Router();

/***********************
######## REGISTER ######
************************/
// GET
router.get("/register", loginUser, (req, res) => {
  res.render("auth/register");
});

// POST
router.post("/register", loginUser, async (req, res) => {
  const { username, email, password, rePass } = req.body;

  await authService.register(username, email, password, rePass);

  res.redirect("/auth/login");
});

/*##################
####### LOGIN ###
###################*/

// GET

router.get("/login", loginUser, (req, res) => {
  res.render("auth/login");
});

// POST
router.post("/login", loginUser, async (req, res) => {
  const { email, password } = req.body;

  const token = await authService.login(email, password);

  res.cookie("auth", token);

  res.redirect("/");
});

/*##################
####### LOGOUT ###
###################*/

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie("auth");

  res.redirect("/");
});

/*##################
####### PROFILE ###
###################*/

router.get("/profile", async (req, res) => {
  const user = req.user;

  res.render("auth/profile", { user });
});

export default router;
