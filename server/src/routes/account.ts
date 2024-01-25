import express from 'express';
import { register } from '../controllers/account';
import { registerValidations } from '../middleware/validation';

const router = express.Router();

router.post('/register', [...registerValidations], register);

export default router;
