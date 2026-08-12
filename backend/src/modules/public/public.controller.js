import { prisma } from '../../config/database.js';

export const getPublicInvitation = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        template: {
          select: { name: true }
        },
        media: true // Include media for the public gallery
      }
    });

    if (!invitation || invitation.status !== 'published') {
      return res.status(404).json({ error: 'Invitation not found or not published' });
    }

    // Only return safe public fields
    const safeData = {
      slug: invitation.slug,
      status: invitation.status,
      data: invitation.data,
      template_name: invitation.template?.name,
      published_at: invitation.published_at,
      media: (invitation.media || []).map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
        position: m.position,
        meta: m.meta
      }))
    };

    res.status(200).json({ invitation: safeData });
  } catch (error) {
    next(error);
  }
};

export const submitRsvp = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { guest_name, status, guest_count, comment } = req.body;

    // 1. Validation
    if (!guest_name || typeof guest_name !== 'string' || guest_name.trim().length < 2 || guest_name.trim().length > 100) {
      return res.status(400).json({ error: 'Имя гостя обязательно (от 2 до 100 символов).' });
    }
    
    if (status !== 'attending' && status !== 'not_attending') {
      return res.status(400).json({ error: 'Недопустимый статус.' });
    }

    const count = parseInt(guest_count, 10);
    if (status === 'attending' && (isNaN(count) || count < 1 || count > 20)) {
      return res.status(400).json({ error: 'Укажите количество гостей (от 1 до 20).' });
    }

    if (comment && comment.length > 1000) {
      return res.status(400).json({ error: 'Комментарий не должен превышать 1000 символов.' });
    }

    // 2. Fetch invitation
    const invitation = await prisma.invitation.findUnique({
      where: { slug }
    });

    if (!invitation || invitation.status !== 'published') {
      return res.status(404).json({ error: 'Invitation not found or not published' });
    }

    const data = typeof invitation.data === 'string' ? JSON.parse(invitation.data) : (invitation.data || {});
    const rsvpEnabled = data.rsvp ? Boolean(data.rsvp.enabled) : false; // Default is false per user requirements

    if (!rsvpEnabled) {
      return res.status(404).json({ error: 'RSVP отключено для этого приглашения.' });
    }

    // 3. Map to Prisma Model (RsvpResponse)
    const finalCount = status === 'not_attending' ? 0 : count;

    await prisma.rsvpResponse.create({
      data: {
        invitation_id: invitation.id,
        guest_name: guest_name.trim(),
        attending: status === 'attending',
        guests_count: finalCount,
        message: comment ? comment.trim() : null
      }
    });

    res.status(201).json({ message: 'RSVP submitted successfully' });
  } catch (error) {
    next(error);
  }
};
