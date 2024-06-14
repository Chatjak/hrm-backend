import express from "express";
import {
  createAuth,
  getYourSelf,
  loginAuth,
  logoutAuth,
} from "../controller/Auth";
import auth from "../middeware/auth";

const authRouter = express.Router();

authRouter.post("/auth", createAuth);
authRouter.post("/auth/login", loginAuth);
authRouter.post("/auth/logout", auth, logoutAuth);
authRouter.get("/auth/me", auth, getYourSelf);
export default authRouter;
