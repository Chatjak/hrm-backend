import jwt from "jsonwebtoken";
import type { IAuth } from "../model/AuthModel";
import type { NextFunction, Request, Response } from "express";
import Auth from "../model/AuthModel";

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: IAuth;
  token?: string;
}

const admin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw new Error("Authentication token missing");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET!);
    const user = await Auth.findOne({
      _id: (decoded as any)._id,
      "tokens.token": token,
      role: "admin",
    });

    if (!user) {
      throw new Error("User not found");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "This user not admin authenticate" });
  }
};

export default admin;
