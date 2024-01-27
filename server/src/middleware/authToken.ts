import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export const generateToken = (id: ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
};
