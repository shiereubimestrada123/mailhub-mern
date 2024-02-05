import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Email from "../models/Email";
import Account from "../models/Account";
import { AuthenticatedRequest } from "./../middleware/authToken";

export async function sendEmail(
  request: AuthenticatedRequest,
  response: Response
) {
  try {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty())
      return response.status(400).json({
        message: "Invalid data, see response.data.errors for more information",
        errors: validationErrors.array(),
      });

    const newEmailOut = new Email({
      from: request.body.from,
      to: request.body.to,
      subject: request.body.subject,
      message: request.body.message,
    });

    const savedEmailOut = await newEmailOut.save();
    response
      .status(201)
      .json({ message: "Email sent, reply received", sent: savedEmailOut });

    const foundAccount = await Account.findOne({ _id: request.user });
    if (foundAccount?.mailbox) {
      foundAccount.mailbox.inbox.push(savedEmailOut._id);
      await foundAccount.save();
    }
  } catch (error) {
    console.log(error);
  }
}
