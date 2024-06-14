import express from "express";
import { createAuth, loginAuth, logoutAuth } from "../controller/Auth";
import { createSwiping } from "../controller/Swiping";
import auth from "../middeware/auth";
import { UpdateInformation, UpdateSalary } from "../controller/Employee";

const employeeRouter = express.Router();

employeeRouter.post("/employee/information", auth, UpdateInformation);
employeeRouter.post("/employee/salary", auth, UpdateSalary);

export default employeeRouter;
