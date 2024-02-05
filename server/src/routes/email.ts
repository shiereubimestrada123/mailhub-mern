import express from "express";
import { sendEmail } from "../controllers/email";
import { authenticateToken } from "../middleware/authToken";
import { emailValidations } from "../middleware/validation";

const router = express.Router();

router.post("/send", authenticateToken, [...emailValidations], sendEmail);

export default router;
