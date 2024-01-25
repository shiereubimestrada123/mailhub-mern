import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Account from '../models/Account';

export async function register(request: Request, response: Response) {
  try {
    const validationErrors = validationResult(request);

    if (!validationErrors.isEmpty()) {
      return response.status(400).json({
        success: false,
        message: 'Invalid data, see response.data.errors for more information',
        errors: validationErrors.array(),
      });
    }

    const foundAccount = await Account.findOne({ email: request.body.email });

    if (foundAccount) {
      return response.status(400).json({
        success: false,
        message: 'Email is already taken',
        email: foundAccount.email,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(request.body.password, salt);

    const newAccount = new Account({
      email: request.body.email,
      password: encryptedPassword,
      name: {
        firstName: request.body.firstName,
        middleName: request.body.middleName,
        lastName: request.body.lastName,
      },
    });

    const savedAccount = await newAccount.save();

    response.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { email: savedAccount.email },
    });
  } catch (error) {
    // console.error('Error during registration:', error);
    response.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
