import express from "express";
import {
  sendEmail,
  getAllEmails,
  saveDraft,
  editDraft,
} from "../controllers/email";
import { authenticateToken } from "../middleware/authToken";
import { emailValidations } from "../middleware/validation";

const router = express.Router();

router.get("/:category", authenticateToken, getAllEmails);
router.post("/sent", authenticateToken, [...emailValidations], sendEmail);
router.post("/draft", authenticateToken, saveDraft);
router.put("/draft/:id", authenticateToken, editDraft);

export default router;
