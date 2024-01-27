import express from 'express';
import { register, login, getUser } from '../controllers/account';
import {
  registerValidations,
  loginValidations,
} from '../middleware/validation';
import { authenticateToken } from '../middleware/authToken';

const router = express.Router();

router.post('/register', [...registerValidations], register);
router.post('/login', [...loginValidations], login);
router.get('/user', authenticateToken, getUser);

export default router;
