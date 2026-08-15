import { prisma } from '../../config/database.js';

export const getMyInvitations = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const invitations = await prisma.invitation.findMany({
      where: { user_id },
      include: {
        template: {
          select: { name: true, thumbnail: true, preview_image: true }
        }
      },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json({ invitations });
  } catch (error) {
    next(error);
  }
};

export const getInvitationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        template: {
          select: { name: true }
        }
      }
    });

    if (!invitation || invitation.user_id !== user_id) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    res.status(200).json({ invitation });
  } catch (error) {
    next(error);
  }
};

export const updateInvitation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation || invitation.user_id !== user_id) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const { data: updateData, last_updated } = req.body;
    
    // Concurrency control: prevent older requests from overwriting newer ones
    if (last_updated && new Date(invitation.updated_at) > new Date(last_updated)) {
      return res.status(409).json({ error: 'Conflict: Invitation was updated by another request', current_invitation: invitation });
    }

    if (!updateData || typeof updateData !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const currentData = typeof invitation.data === 'string' 
      ? JSON.parse(invitation.data) 
      : (invitation.data || {});

    // Expanded allowlist for Step 7 & 8
    const allowedFields = [
      'groom_name', 'bride_name', 'groom_description', 'bride_description',
      'wedding_date', 'wedding_time', 'ceremony_time', 'reception_time',
      'venue_name', 'address', 'map_url',
      'story', 'music', 'rsvp', 'design'
    ];

    const newData = { ...currentData };

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        if (typeof updateData[key] === 'object' && updateData[key] !== null && !Array.isArray(updateData[key])) {
          newData[key] = {
            ...(newData[key] || {}),
            ...updateData[key]
          };
          
          if (key === 'design') {
            const validThemes = ['elegant', 'classic', 'minimal', 'dark'];
            const validFonts = ['serif', 'sans', 'script'];
            
            if (newData.design.theme && !validThemes.includes(newData.design.theme)) newData.design.theme = 'elegant';
            if (newData.design.font && !validFonts.includes(newData.design.font)) newData.design.font = 'serif';
            
            delete newData.design.custom_css;
            delete newData.design.custom_html;
          }
        } else {
          newData[key] = updateData[key];
        }
      }
    }

    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: { data: newData },
    });

    res.status(200).json({ invitation: updatedInvitation });
  } catch (error) {
    next(error);
  }
};

export const publishInvitation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation || invitation.user_id !== user_id) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const data = typeof invitation.data === 'string' 
      ? JSON.parse(invitation.data) 
      : (invitation.data || {});

    if (!data.groom_name || !data.bride_name || !data.wedding_date || !data.venue_name) {
      return res.status(400).json({ 
        error: 'Missing required fields for publication: groom_name, bride_name, wedding_date, venue_name' 
      });
    }

    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: {
        status: 'published',
        published_at: new Date(),
      },
    });

    res.status(200).json({ invitation: updatedInvitation });
  } catch (error) {
    next(error);
  }
};

export const unpublishInvitation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation || invitation.user_id !== user_id) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: {
        status: 'draft',
        published_at: null,
      },
    });

    res.status(200).json({ invitation: updatedInvitation });
  } catch (error) {
    next(error);
  }
};

export const getInvitationRsvps = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation || invitation.user_id !== user_id) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const rsvps = await prisma.rsvpResponse.findMany({
      where: { invitation_id: id },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json({ rsvps });
  } catch (error) {
    next(error);
  }
};

export const deleteInvitationRsvp = async (req, res, next) => {
  try {
    const { id, responseId } = req.params;
    const user_id = req.user.id;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation || invitation.user_id !== user_id) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const rsvp = await prisma.rsvpResponse.findUnique({
      where: { id: responseId },
    });

    if (!rsvp || rsvp.invitation_id !== id) {
      return res.status(404).json({ error: 'RSVP not found' });
    }

    await prisma.rsvpResponse.delete({
      where: { id: responseId },
    });

    res.status(200).json({ message: 'RSVP deleted successfully' });
  } catch (error) {
    next(error);
  }
};
