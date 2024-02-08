import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Email from "../models/Email";
import Account from "../models/Account";
import { AuthenticatedRequest } from "./../middleware/authToken";

export async function getAllEmails(
  request: AuthenticatedRequest,
  response: Response
) {
  try {
    const account = await Account.findOne({ _id: request.user })
      .select("mailbox")
      .populate("mailbox.inbox mailbox.outbox mailbox.drafts mailbox.trash");
    if (account) {
      const mailbox = account.mailbox;
      const emails = {
        inbox: mailbox?.inbox,
        outbox: mailbox?.outbox,
        drafts: mailbox?.drafts,
        trash: mailbox?.trash,
      };
      response.status(200).json({ message: "Emails found", emails });
    } else {
      response.status(404).json({ message: "Account not found" });
    }
  } catch (error) {
    console.log(error);
    response.status(500);
  }
}
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

    const newEmailSend = new Email({
      from: request.body.from,
      to: request.body.to,
      subject: request.body.subject,
      message: request.body.message,
    });
    const savedEmailSend = await newEmailSend.save();

    const newEmailReceive = new Email({
      from: request.body.to,
      to: request.body.from,
      subject: "Re: " + request.body.subject,
      message: request.body.message,
    });
    const savedEmailIn = await newEmailReceive.save();

    response.status(201).json({
      message: "Email sent, reply received",
      sent: newEmailSend,
      received: savedEmailIn,
    });

    const foundAccount = await Account.findOne({ _id: request.user });
    if (foundAccount?.mailbox) {
      foundAccount.mailbox.outbox.push(savedEmailSend._id);
      foundAccount.mailbox.inbox.push(savedEmailIn._id);
      await foundAccount.save();
    }
  } catch (error) {
    console.log(error);
  }
}
