import { prisma } from '../config/database.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.sessionId;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No session token provided' });
    }

    const session = await prisma.session.findUnique({
      where: { refresh_token: token },
      include: { user: true },
    });

    if (!session || session.expires_at < new Date()) {
      // If session is expired, we could delete it here
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    }

    req.user = session.user;
    next();
  } catch (error) {
    next(error);
  }
};
