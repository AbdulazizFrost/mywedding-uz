import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth.js';
import { requireRole } from '../../middlewares/requireRole.js';
import {
  getStats,
  getUsers,
  getOrders,
  getTemplates,
  getInvitations,
  toggleTemplateStatus
} from './admin.controller.js';

export const adminRouter = Router();

// Apply auth and admin role check to all routes in this router
adminRouter.use(requireAuth, requireRole('admin'));

// Stats
adminRouter.get('/stats', getStats);

// Users
adminRouter.get('/users', getUsers);

// Orders
adminRouter.get('/orders', getOrders);

// Templates
adminRouter.get('/templates', getTemplates);
adminRouter.patch('/templates/:id/toggle', toggleTemplateStatus);

// Invitations
adminRouter.get('/invitations', getInvitations);
