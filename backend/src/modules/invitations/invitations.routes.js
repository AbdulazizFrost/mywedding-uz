import { Router } from 'express';
import { 
  getMyInvitations,
  getInvitationById,
  updateInvitation, 
  publishInvitation, 
  unpublishInvitation,
  getInvitationRsvps,
  deleteInvitationRsvp
} from './invitations.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import { mediaRouter } from './media.routes.js';

const invitationsRouter = Router();

invitationsRouter.use(requireAuth);

invitationsRouter.get('/', getMyInvitations);
invitationsRouter.get('/:id', getInvitationById);
invitationsRouter.patch('/:id', updateInvitation);
invitationsRouter.post('/:id/publish', publishInvitation);
invitationsRouter.post('/:id/unpublish', unpublishInvitation);

// RSVP owner routes
invitationsRouter.get('/:id/rsvp', getInvitationRsvps);
invitationsRouter.delete('/:id/rsvp/:responseId', deleteInvitationRsvp);

// Mount media router
invitationsRouter.use('/:id/media', mediaRouter);

export { invitationsRouter };
