import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";


export function generateAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}


export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
}

export function authenticateJWT(roles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token as string, ACCESS_TOKEN_SECRET, (err, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Token is invalid or expired" });
      }

      if (roles.length && (!user.role || !roles.includes(user.role as string))) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      (req as any).user = user.id;
      (req as any).role = user.role;
      next();
    }); 
  };
}


export function verifyRefreshToken(token: string) {
  return jwt.verify(token as string, REFRESH_TOKEN_SECRET);
}
