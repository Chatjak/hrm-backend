import { effect, z } from "zod";
import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { IAuth } from "../model/AuthModel";
import type { AuthRequest } from "../middeware/auth";
import dayjs from "dayjs";

const prisma = new PrismaClient();

const createEmployeeSchema = z.object({
  department: z.string(),
  position: z.string(),
  email: z.string().email(),
  gender: z.enum(["male", "female"]),
  id_card: z.string().max(13),
  phone: z.string().max(10),
  active_date: z.string().date(),
  expired_date: z.string().date(),
});

const createSalarySchema = z.object({
  department: z.string(),
  emp_position: z.string(),
  salary: z.number(),
  effect_date: z.string().date(),
  house: z.number(),
  position: z.number(),
  special: z.number(),
  interpreter: z.number(),
  have_social: z.boolean(),
  social: z.number(),
  have_diligence: z.boolean(),
  diligence: z.enum(["Indirect", "Direct"]),
});

export const UpdateInformation = async (req: AuthRequest, res: Response) => {
  const validationResult = createEmployeeSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }

  const {
    department,
    position,
    email,
    id_card,
    phone,
    active_date,
    expired_date,
    gender,
  } = validationResult.data;
  const user = req.user as IAuth;
  try {
    const employee = await prisma.employee_information.upsert({
      where: {
        employee: user.employee,
      },
      update: {
        employee: user.employee,
        name: user.emp_name,
        gender,
        department,
        position,
        email,
        id_card,
        phone,
        active_date: new Date(active_date),
        expired_date: new Date(expired_date),
      },
      create: {
        employee: user.employee,
        name: user.emp_name,
        department,
        gender,
        position,
        email,
        id_card,
        phone,
        active_date: new Date(active_date),
        expired_date: new Date(expired_date),
      },
    });
    if (employee) {
      const history = await prisma.employee_information_history.create({
        data: {
          employee: user.employee,
          name: user.emp_name,
          department,
          position,
          email,
          id_card,
          gender,
          phone,
          active_date: new Date(active_date),
          expired_date: new Date(expired_date),
        },
      });
      if (history) {
        console.log("employee_information_history created");
        res.status(200).json(employee);
      } else {
        console.log("employee_information_history not created");
      }
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

export const UpdateSalary = async (req: AuthRequest, res: Response) => {
  const validationResult = createSalarySchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }

  const {
    department,
    emp_position,
    salary,
    effect_date,
    house,
    position,
    special,
    interpreter,
    have_social,
    social,
    have_diligence,
    diligence,
  } = validationResult.data;
  const user = req.user as IAuth;
  try {
    const employee_salary = await prisma.employee_salary.upsert({
      where: {
        employee: user.employee,
      },
      update: {
        employee: user.employee,
        emp_name: user.emp_name,
        department,
        emp_position,
        salary,
        effect_date: new Date(effect_date),
        house,
        position,
        special,
        interpreter,
        have_social,
        social,
        have_diligence,
        diligence,
      },
      create: {
        employee: user.employee,
        emp_name: user.emp_name,
        department,
        emp_position,
        salary,
        effect_date: new Date(effect_date),
        house,
        position,
        special,
        interpreter,
        have_social,
        social,
        have_diligence,
        diligence,
      },
    });
    if (salary) {
      const history = await prisma.employee_salary_history.create({
        data: {
          employee: user.employee,
          emp_name: user.emp_name,
          department,
          emp_position,
          salary,
          effect_date: new Date(effect_date),
          house,
          position,
          special,
          interpreter,
          have_social,
          social,
          have_diligence,
          diligence,
        },
      });
      if (history) {
        console.log("salary_history created");
        res.status(200).json(employee_salary);
      } else {
        console.log("salary_history not created");
      }
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
