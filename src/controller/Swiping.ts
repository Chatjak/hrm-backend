import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { IAuth } from "../model/AuthModel";
import type { AuthRequest } from "../middeware/auth";
import dayjs from "dayjs";

const prisma = new PrismaClient();

const createSwipingSchema = z.object({
  record_type: z.enum(["on_work", "get_off_work"]),
});

export const createSwiping = async (req: AuthRequest, res: Response) => {
  const validationResult = createSwipingSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }
  const { record_type } = validationResult.data;
  const user = req.user as IAuth;
  const record_date = dayjs().format("YYYY-MM-DD");
  try {
    const swiping = await prisma.swiping.upsert({
      where: {
        employee_record_date_record_type: {
          employee: user.employee,
          record_date,
          record_type,
        },
      },
      update: {
        record_date,
        record_type,
      },
      create: {
        employee: user.employee,
        record_date,
        record_type,
      },
    });

    if (swiping) {
      const res = await prisma.swiping_history.create({
        data: {
          employee: user.employee,
          record_date,
          record_type,
        },
      });
      if (res) {
        console.log("swiping_history created");
      } else {
        console.log("swiping_history not created");
      }
    }
    res.status(201).json(swiping);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
