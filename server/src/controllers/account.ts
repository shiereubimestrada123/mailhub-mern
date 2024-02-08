import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Account from "../models/Account";
import { generateToken, AuthenticatedRequest } from "./../middleware/authToken";

export async function register(request: Request, response: Response) {
  try {
    const validationErrors = validationResult(request);

    if (!validationErrors.isEmpty()) {
      return response.status(400).json({
        success: false,
        message: "Invalid data, see response.data.errors for more information",
        errors: validationErrors.array(),
      });
    }

    const foundAccount = await Account.findOne({ email: request.body.email });

    if (foundAccount) {
      return response.status(400).json({
        success: false,
        message: "Email is already taken",
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
      message: "Account created successfully",
      data: { email: savedAccount.email },
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function login(request: Request, response: Response) {
  try {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty())
      return response.status(400).json({
        success: false,
        message: "Invalid data, see response.data.errors for more information",
        errors: validationErrors.array(),
      });

    const foundAccount = await Account.findOne({ email: request.body.email });
    if (!foundAccount)
      return response
        .status(401)
        .json({ success: false, message: "Bad credentials" });

    const isPasswordOk = await bcrypt.compare(
      request.body.password,
      foundAccount.password
    );
    if (!isPasswordOk)
      return response
        .status(401)
        .json({ success: false, message: "Bad credentials" });

    const token = generateToken(foundAccount._id);
    response
      .status(200)
      .json({ success: true, message: "Login success", token });
  } catch (error) {
    console.log(error);
    response.status(500);
  }
}

export async function getUser(
  request: AuthenticatedRequest,
  response: Response
) {
  try {
    const foundAccount = await Account.findOne({ _id: request.user }).select(
      "-password -mailbox"
    );

    response.status(200).json({ message: "Account found", user: foundAccount });
  } catch (error) {
    console.log(error);
    response.status(500);
  }
}
