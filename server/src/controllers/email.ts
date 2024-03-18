import { Response } from "express";
import { validationResult } from "express-validator";
import Email from "../models/Email";
import Account from "../models/Account";
import { AuthenticatedRequest } from "./../middleware/authToken";
import { isValidObjectId } from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
      .populate({
        path: "mailbox.inbox",
        match: { $or: [{ category: "received" }, { category: "sent" }] }, // Include both received and sent emails
        options: { sort: { createdAt: -1 } },
      })
      .populate("mailbox.drafts")
      .populate("mailbox.outbox")
      .populate("mailbox.trash");

    if (!currentUserAccount || !currentUserAccount.mailbox) {
      return response.status(404).json({ message: "Account not found" });
    }

    const inbox: any[] = currentUserAccount.mailbox.inbox;
    const drafts: any[] = currentUserAccount.mailbox.drafts;
    const outbox: any[] = currentUserAccount.mailbox.outbox;
    const trash: any[] = currentUserAccount.mailbox.trash;

    const inboxThreads: { [key: string]: any[] } = {};
    inbox.forEach((email) => {
      const threadId = email.threadId || email._id.toString();
      if (!inboxThreads[threadId]) {
        inboxThreads[threadId] = [];
      }
      inboxThreads[threadId].push(email);
    });

    const inboxThreadArray = Object.values(inboxThreads);

    const inboxCount = inboxThreadArray.length;
    const inboxThreadPage = inboxThreadArray.slice(
      (parsedPage - 1) * parsedPageSize,
      parsedPage * parsedPageSize
    );

    const draftsCount = drafts.length;
    const draftsPage = drafts.slice(
      (parsedPage - 1) * parsedPageSize,
      parsedPage * parsedPageSize
    );

    const outboxCount = outbox.length;
    const outboxPage = outbox.slice(
      (parsedPage - 1) * parsedPageSize,
      parsedPage * parsedPageSize
    );

    const emails = {
      inbox: { items: inboxThreadPage, totalCount: inboxCount },
      drafts: { items: draftsPage, totalCount: draftsCount },
      outbox: { items: outboxPage, totalCount: outboxCount },
      trash: { items: trash, totalCount: trash.length },
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

    const newThreadId = uuidv4();

    const newEmailSend = new Email({
      from: senderAccount.email,
      to: request.body.to,
      subject: request.body.subject,
      message: request.body.message,
      category: "sent",
      threadId: newThreadId, // Assign the same threadId to the sent email
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
      category: "received",
      threadId: newThreadId, // Assign the same threadId to the received email
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

export async function sendDraftAsEmail(
  request: AuthenticatedRequest,
  response: Response
) {
  try {
    const { id } = request.params;

    // Retrieve the latest version of the draft from the database
    const draft = await Email.findById(id);

    if (!draft) {
      return response.status(404).json({ message: "Draft not found" });
    }

    // Update draft data with the payload data
    draft.from = request.body.from;
    draft.to = request.body.to;
    draft.subject = request.body.subject;
    draft.message = request.body.message;
    draft.category = "sent";

    // Save the updated draft
    const updatedDraft = await draft.save();

    // Create a new email using the updated draft content
    const newEmail = new Email({
      from: updatedDraft.from,
      to: updatedDraft.to,
      subject: updatedDraft.subject,
      message: updatedDraft.message,
      category: "sent",
    });

    // Save the new email
    const savedEmail = await newEmail.save();

    // Update the sender's outbox
    const senderAccount = await Account.findOne({ _id: request.user });
    if (!senderAccount || !senderAccount.mailbox) {
      return response.status(404).json({ message: "Sender account not found" });
    }
    senderAccount.mailbox.outbox.push(savedEmail._id);
    await senderAccount.save();

    // Update the sender's inbox
    const receiverAccount = await Account.findOne({ email: request.body.to });
    if (receiverAccount && receiverAccount.mailbox) {
      receiverAccount.mailbox.inbox.push(savedEmail._id);
      await receiverAccount.save();
    }

    // Delete the draft from the database
    const deletedDraft = await Email.findByIdAndDelete(id);

    response.status(201).json({
      message: "Draft sent as new email",
      email: savedEmail,
      deletedDraft,
    });
  } catch (error) {
    console.error("Error sending draft as email:", error);
    response.status(500).json({ message: "Internal server error" });
  }
}

export async function handleReplyMessage(
  request: AuthenticatedRequest,
  response: Response
) {
  try {
    // Extract data from the request body including the threadId
    const { from, to, subject, message, threadId } = request.body;

    // Perform validation using express-validator
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response
        .status(400)
        .json({ success: false, errors: errors.array() });
    }

    // Process the reply message logic
    // Save the reply message to the database with the provided threadId
    const newReply = new Email({
      from,
      to,
      subject,
      message,
      category: "received",
      threadId, // Use the same threadId as the original email
    });

    const savedReply = await newReply.save();

    // Save the reply message in the "received" category as well
    let receiverAccount = await Account.findOne({ email: to });
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
    console.log("test", savedReply._id);
    // Add the reply message to the inbox
    receiverAccount.mailbox.inbox.push(savedReply._id);
    await receiverAccount.save();

    // Log information for debugging
    // console.log("Saved reply:", savedReply);
    // console.log("Receiver account before adding to inbox:", receiverAccount);

    // Send a response back to the client
    response.status(200).json({
      success: true,
      message: "Reply message sent successfully",
      reply: savedReply,
    });
  } catch (error) {
    // Log any errors that occur during reply message handling
    console.error("Error handling reply message:", error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
