import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { IAuth } from "../model/AuthModel";
import type { AuthRequest } from "../middeware/auth";
import dayjs from "dayjs";

const prisma = new PrismaClient();
const createDepartmentSchema = z.object({
  dept_code: z.string(),
  department: z.string(),
  description: z.string(),
});

export const createDepartment = async (req: AuthRequest, res: Response) => {
  const validationResult = createDepartmentSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }
  const { dept_code, department, description } = validationResult.data;
  try {
    const dept = await prisma.department.create({
      data: {
        dept_code,
        department,
        description,
      },
    });
    res.status(201).json(dept);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteDepartment = async (req: AuthRequest, res: Response) => {
  const { dept_code } = req.params;

  console.log(dept_code);
  
  try {
    const dept = await prisma.department.delete({
      where: {
        dept_code,
      },
    });
    res.status(200).json(dept);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const dept = await prisma.department.findMany();
    res.status(200).json(dept);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getDepartmentById = async (req: AuthRequest, res: Response) => {
  const allDept = await prisma.department.findMany();
  if (allDept.length === 0) {
    return res.status(404).json({ error: "No departments found" });
  }
  const deptCodes = allDept.map((dept) => dept.dept_code);
  const getDepartmentByIdSchema = z.object({
    dept_code: z.enum([deptCodes[0], ...deptCodes.slice(1)] as [
      string,
      ...string[]
    ]),
  });
  const validationResult = getDepartmentByIdSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }
  const { dept_code } = validationResult.data;
  try {
    const dept = await prisma.department.findUnique({
      where: {
        dept_code,
      },
    });
    if (!dept) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.status(200).json(dept);
  } catch (error) {
    res.status(500).json({ error });
  }
};
