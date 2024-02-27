import express from "express";
import {
  sendEmail,
  getAllEmails,
  saveDraft,
  getEmailById,
} from "../controllers/email"; // assuming you have a controller to handle getting email by ID
import { authenticateToken } from "../middleware/authToken";
import { emailValidations } from "../middleware/validation";

const router = express.Router();

router.get("/:category", authenticateToken, getAllEmails);
router.get("/:category/:categoryId", authenticateToken, getEmailById);
router.post("/sent", authenticateToken, [...emailValidations], sendEmail);
router.post("/draft", authenticateToken, saveDraft);

export default router;
