import express from "express";
import { createAuth, loginAuth, logoutAuth } from "../controller/Auth";
import { createSwiping } from "../controller/Swiping";
import auth from "../middeware/auth";

const swipingRouter = express.Router();

swipingRouter.post("/swiping", auth, createSwiping);

export default swipingRouter;
