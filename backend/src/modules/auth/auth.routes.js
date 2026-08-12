import { Router } from 'express';
import { register, login, logout, me } from './auth.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import rateLimit from 'express-rate-limit';

const authRouter = Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs. High enough for dev, but prevents brute force.
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.use(authLimiter);

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', requireAuth, logout);
authRouter.get('/me', requireAuth, me);

export { authRouter };
