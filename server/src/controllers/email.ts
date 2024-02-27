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
    const { page = "1", pageSize = "10", category } = request.query;
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

    // Cast category to string
    const parsedCategory = category as string;

    // Filter emails based on category if provided
    let emailFilter = {};
    if (parsedCategory) {
      if (!["inbox", "outbox", "drafts", "trash"].includes(parsedCategory)) {
        return response.status(400).json({ message: "Invalid category" });
      }
      // Type assertion to inform TypeScript that parsedCategory is a valid key
      emailFilter = {
        _id: {
          $in: currentUserAccount.mailbox[
            parsedCategory as keyof typeof currentUserAccount.mailbox
          ],
        },
      };
    }

    const emailCount = await Email.countDocuments(emailFilter);

    const emails = await Email.find(emailFilter)
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedPageSize)
      .limit(parsedPageSize);

    response
      .status(200)
      .json({ message: "Emails found", emails, totalCount: emailCount });
  } catch (error) {
    console.error("Error fetching emails:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function getEmailById(
  request: AuthenticatedRequest,
  response: Response
) {
  try {
    const { category, categoryId } = request.params;

    // Validate if category and categoryId are provided
    if (!category || !categoryId) {
      return response
        .status(400)
        .json({ message: "Category or categoryId is missing" });
    }

    // Fetch email by category and categoryId
    const email = await Email.findOne({ _id: categoryId });
    if (!email) {
      return response.status(404).json({ message: "Email not found" });
    }

    // Check if the email belongs to the requested category
    if (email.category !== category) {
      return response
        .status(404)
        .json({ message: "Email not found in the specified category" });
    }

    response.status(200).json({ message: "Email found", email });
  } catch (error) {
    console.error("Error fetching email by ID:", error);
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
