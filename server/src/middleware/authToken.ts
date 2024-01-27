import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export interface AuthenticatedRequest extends Request {
  user?: ObjectId;
}

export const generateToken = (id: ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const authenticateToken = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    request.user = decoded.id;
    next();
  } catch (error) {
    response.status(401).json({
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
