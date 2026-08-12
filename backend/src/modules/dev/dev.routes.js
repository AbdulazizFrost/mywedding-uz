import { Router } from 'express';
import { simulatePaymentSuccess } from './dev.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

const devRouter = Router();

devRouter.post('/payments/:id/success', requireAuth, simulatePaymentSuccess);

export { devRouter };

