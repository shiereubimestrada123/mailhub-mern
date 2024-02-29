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

    const draftsCount = await Email.countDocuments({
      _id: { $in: currentUserAccount.mailbox.drafts },
    });

    const trashCount = await Email.countDocuments({
      _id: { $in: currentUserAccount.mailbox.trash },
    });

    const inbox = await Email.find({
      _id: { $in: currentUserAccount.mailbox.inbox },
    })
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedPageSize)
      .limit(parsedPageSize);

    const outbox = await Email.find({
      _id: { $in: currentUserAccount.mailbox.outbox },
    })
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedPageSize)
      .limit(parsedPageSize);

    const drafts = await Email.find({
      _id: { $in: currentUserAccount.mailbox.drafts },
    })
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedPageSize)
      .limit(parsedPageSize);

    const emails = {
      inbox: { items: inbox, totalCount: inboxCount },
      drafts: { items: drafts, totalCount: draftsCount },
      outbox: { items: outbox, totalCount: outboxCount },
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
      category: "sent",
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
      category: "received", // Assuming the category for received emails is "received"
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

export async function saveDraft(
  request: AuthenticatedRequest,
  response: Response
) {
  try {
    let newDraft = new Email({
      from: request.body.from,
      to: request.body.to,
      subject: request.body.subject,
      message: request.body.message,
      category: "drafts",
    });

    const savedDraft = await newDraft.save();
    response.status(201).json({ message: "Draft saved", draft: savedDraft });

    const foundAccount = await Account.findOne({ _id: request.user });
    if (!foundAccount) return;
    if (!foundAccount.mailbox) {
      foundAccount.mailbox = {
        inbox: [],
        outbox: [],
        drafts: [],
        trash: [],
      };
    }
    foundAccount.mailbox.drafts.push(savedDraft._id);
    await foundAccount.save();
  } catch (error) {
    console.log(error);
    response.status(500);
  }
}

export async function editDraft(
  request: AuthenticatedRequest,
  response: Response
) {
  try {
    const { id } = request.params;
    const { from, to, subject, message } = request.body;

    if (!isValidObjectId(id) || !from || !to || !subject || !message) {
      return response.status(400).json({ message: "Invalid request data" });
    }

    const draft = await Email.findByIdAndUpdate(
      id,
      {
        from,
        to,
        subject,
        message,
      },
      { new: true }
    );

    if (!draft) {
      return response.status(404).json({ message: "Draft not found" });
    }

    response.status(200).json({ message: "Draft edited successfully", draft });
  } catch (error) {
    console.error("Error editing draft:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}
