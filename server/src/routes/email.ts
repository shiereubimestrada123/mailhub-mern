import express from "express";
import { sendEmail, getAllEmails, saveDraft } from "../controllers/email";
import { authenticateToken } from "../middleware/authToken";
import { emailValidations } from "../middleware/validation";

const router = express.Router();

router.get("/", authenticateToken, getAllEmails);
router.post("/sent", authenticateToken, [...emailValidations], sendEmail);
router.post("/draft", authenticateToken, saveDraft);

export default router;
