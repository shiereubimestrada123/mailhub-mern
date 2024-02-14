import { Response } from "express";
import { validationResult } from "express-validator";
import Email from "../models/Email";
import Account from "../models/Account";
import { AuthenticatedRequest } from "./../middleware/authToken";

import { isValidObjectId } from "mongoose";

export async function getAllEmails(
  request: AuthenticatedRequest,
  response: Response
) {
  try {
    const { page = "1", pageSize = "10" } = request.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedPageSize = parseInt(pageSize as string, 10);

    if (
      isNaN(parsedPage) ||
      isNaN(parsedPageSize) ||
      parsedPage < 1 ||
      parsedPageSize < 1
    ) {
      return response
        .status(400)
        .json({ message: "Invalid page or pageSize parameters" });
    }

    const currentUserAccountId = request.user;
    if (!isValidObjectId(currentUserAccountId)) {
      return response.status(400).json({ message: "Invalid user ID" });
    }

    const currentUserAccount = await Account.findOne({
      _id: currentUserAccountId,
    })
      .populate("mailbox.drafts")
      .populate("mailbox.outbox")
      .populate("mailbox.trash");

    if (!currentUserAccount || !currentUserAccount.mailbox) {
      return response.status(404).json({ message: "Account not found" });
    }

    const inboxCount = await Email.countDocuments({
      _id: { $in: currentUserAccount.mailbox.inbox },
    });

    const outboxCount = await Email.countDocuments({
      _id: { $in: currentUserAccount.mailbox.outbox },
    });

    const inbox = await Email.find({
      _id: { $in: currentUserAccount.mailbox.inbox },
    })
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedPageSize)
      .limit(parsedPageSize);

    const draftsCount = await Email.countDocuments({
      _id: { $in: currentUserAccount.mailbox.drafts },
    });

    const outbox = await Email.find({
      _id: { $in: currentUserAccount.mailbox.outbox },
    })
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedPageSize)
      .limit(parsedPageSize);

    const trashCount = await Email.countDocuments({
      _id: { $in: currentUserAccount.mailbox.trash },
    });

    const emails = {
      inbox: { items: inbox, totalCount: inboxCount },
      drafts: {
        items: currentUserAccount.mailbox.drafts,
        totalCount: draftsCount,
      },
      outbox: {
        items: outbox,
        totalCount: outboxCount,
      },
      trash: {
        items: currentUserAccount.mailbox.trash,
        totalCount: trashCount,
      },
      pageSize: parsedPageSize,
    };

    response.status(200).json({ message: "Emails found", emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    response.status(500).json({ message: "Internal server error" });
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

    const senderAccount = await Account.findOne({ _id: request.user });
    if (!senderAccount) {
      return response.status(404).json({ message: "Sender account not found" });
    }

    if (!senderAccount.mailbox) {
      return response
        .status(404)
        .json({ message: "Mailbox not found for sender account" });
    }

    const newEmailSend = new Email({
      from: senderAccount.email,
      to: request.body.to,
      subject: request.body.subject,
      message: request.body.message,
    });
    const savedEmailSend = await newEmailSend.save();

    const receiverAccount = await Account.findOne({ email: request.body.to });
    if (!receiverAccount) {
      return response
        .status(404)
        .json({ message: "Receiver account not found" });
    }

    if (!receiverAccount.mailbox) {
      return response
        .status(404)
        .json({ message: "Mailbox not found for receiver account" });
    }

    const newEmailReceive = new Email({
      from: senderAccount.email,
      to: receiverAccount.email,
      subject: request.body.subject,
      message: request.body.message,
    });
    const savedEmailIn = await newEmailReceive.save();

    senderAccount.mailbox.outbox.push(savedEmailSend._id);
    receiverAccount.mailbox.inbox.push(savedEmailIn._id);

    await Promise.all([senderAccount.save(), receiverAccount.save()]);

    response.status(201).json({
      message: "Email sent, reply received",
      sent: newEmailSend,
      received: newEmailReceive,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal server error" });
  }
}
