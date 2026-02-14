import { getProfile, login, register } from '#controller/auth.controller.ts';
import { authenticateToken } from '#middlewares/auth.middleware.ts';
import { validate } from '#middlewares/zod.middleware.ts';
import { loginSchema, registerSchema } from '#validators/auth.validator.ts';
import { Router } from 'express';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.get('/profile', authenticateToken, getProfile);

export default router;
