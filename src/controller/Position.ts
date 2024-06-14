import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { IAuth } from "../model/AuthModel";
import type { AuthRequest } from "../middeware/auth";
import dayjs from "dayjs";

const prisma = new PrismaClient();

const createPositionSchema = z.object({
  position: z.string(),
  description: z.string(),
});

const checkPositionSchema = z.object({
  position: z.string(),
});

export const createPosition = async (req: AuthRequest, res: Response) => {
  const validationResult = createPositionSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }

  const { position, description } = validationResult.data;

  const result = await prisma.position.upsert({
    where: {
      position: position,
    },
    update: {
      description: description,
    },
    create: {
      position: position,
      description: description,
    },
  });

  res.json(result);
};

export const deletePosition = async (req: AuthRequest, res: Response) => {
  const validationResult = checkPositionSchema.safeParse(req.params);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }
  const { position } = validationResult.data;

  const result = await prisma.position.delete({
    where: {
      position: position,
    },
  });

  res.json(result);
};

export const getAllPositon = async (req: AuthRequest, res: Response) => {
  const result = await prisma.position.findMany();
  res.json(result);
};
