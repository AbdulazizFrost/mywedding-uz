import { Router } from 'express';
import { createPayment, getPayment } from './payments.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

const paymentsRouter = Router();

paymentsRouter.use(requireAuth);

paymentsRouter.post('/', createPayment);
paymentsRouter.get('/:id', getPayment);

export { paymentsRouter };
