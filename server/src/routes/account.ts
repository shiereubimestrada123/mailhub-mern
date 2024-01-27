import express from 'express';
import { register, login } from '../controllers/account';
import {
  registerValidations,
  loginValidations,
} from '../middleware/validation';

const router = express.Router();

router.post('/register', [...registerValidations], register);
router.post('/login', [...loginValidations], login);

export default router;
