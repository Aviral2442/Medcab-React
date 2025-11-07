import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const generateToken = (
  payload: object | string,
  expiresIn: string | number = "1h"
): string => {
  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] }
  );
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};
