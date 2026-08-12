import { Router } from 'express';
import { createOrder, getMyOrders, getMyOrderById } from './orders.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

const ordersRouter = Router();

// All order endpoints require authentication
ordersRouter.use(requireAuth);

ordersRouter.post('/', createOrder);
ordersRouter.get('/', getMyOrders);
ordersRouter.get('/:id', getMyOrderById);

export { ordersRouter };
