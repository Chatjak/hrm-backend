import express from "express";
import admin from "../middeware/admin";
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartmentById,
} from "../controller/Department";

const departmentRouter = express.Router();

departmentRouter.post("/department", admin, createDepartment);
departmentRouter.delete("/department/:dept_code", admin, deleteDepartment);
departmentRouter.get("/department", getDepartment);
departmentRouter.get("/department/:dept_code", getDepartmentById);

export default departmentRouter;
