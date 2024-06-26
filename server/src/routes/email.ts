import express from "express";
import {
  sendEmail,
  getAllEmails,
  saveDraft,
  editDraft,
  sendDraftAsEmail,
} from "../controllers/email";
import { authenticateToken } from "../middleware/authToken";
import { emailValidations } from "../middleware/validation";

const router = express.Router();

router.get("/:category", authenticateToken, getAllEmails);
router.post("/sent", authenticateToken, [...emailValidations], sendEmail);
router.post("/draft", authenticateToken, saveDraft);
router.put("/draft/:id", authenticateToken, editDraft);
router.post("/draft/send/:id", authenticateToken, sendDraftAsEmail);

export default router;
