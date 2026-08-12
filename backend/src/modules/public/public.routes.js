import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getPublicInvitation, submitRsvp } from './public.controller.js';

const publicRouter = Router();

// Basic rate limiter for RSVP submission
const rsvpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

publicRouter.get('/invitations/:slug', getPublicInvitation);
publicRouter.post('/invitations/:slug/rsvp', rsvpLimiter, submitRsvp);

export { publicRouter };
