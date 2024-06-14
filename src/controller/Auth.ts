import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import Auth, { type IAuth } from "../model/AuthModel";
import type { AuthRequest } from "../middeware/auth";

const prisma = new PrismaClient();

const createAuthSchema = z.object({
  email: z.string().email(),
  employee: z.string(),
  emp_name: z.string(),
  role: z.enum(["admin", "user"]).optional(),
  controll: z.object({
    read: z.boolean(),
    write: z.boolean(),
    delete: z.boolean(),
  }),
  password: z.string().min(6),
});

const loginAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createAuth = async (req: Request, res: Response) => {
  const validationResult = createAuthSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }
  try {
    const authDoc = new Auth(validationResult.data);
    const token = await authDoc.generateAuthToken();
    res.status(201).json({ auth: authDoc.toJSON(), token });
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

export const loginAuth = async (req: Request, res: Response) => {
  const validationResult = loginAuthSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }
  const { email, password } = validationResult.data;
  try {
    const auth = await Auth.findByCredentials(email, password);
    const token = await auth.generateAuthToken();
    res.status(200).json({ auth: auth.toJSON(), token });
  } catch (e) {
    res.status(400).json({ error: "email or password is wrong" });
  }
};

export const logoutAuth = async (req: AuthRequest, res: Response) => {
  const { token } = req;
  const user = req.user as IAuth;

  if (!token) {
    return res.status(400).send({ error: "Token is required" });
  }

  try {
    await user.removeAuthToken(token);
    res.send();
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getYourSelf = async (req: AuthRequest, res: Response) => {
  const user = req.user as IAuth;
  res.send(user);
};
