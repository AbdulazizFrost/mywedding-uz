import { prisma } from '../../config/database.js';

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const totalInvitations = await prisma.invitation.count();
    const publishedInvitations = await prisma.invitation.count({
      where: { status: 'published' }
    });
    const pendingOrders = await prisma.order.count({
      where: { status: 'pending' }
    });
    
    const revenueResult = await prisma.order.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true }
    });
    
    // Convert Decimal to number for JSON response
    const revenue = revenueResult._sum.amount ? Number(revenueResult._sum.amount) : 0;

    const recentActivity = await prisma.order.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { full_name: true, email: true } },
        template: { select: { name: true } }
      }
    });

    res.status(200).json({
      stats: {
        totalUsers,
        totalOrders,
        totalInvitations,
        publishedInvitations,
        pendingOrders,
        revenue
      },
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { full_name: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: { orders: true, invitations: true }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limitNumber,
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { full_name: true, email: true } },
          template: { select: { name: true } }
        }
      }),
      prisma.order.count()
    ]);

    res.status(200).json({
      orders,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTemplates = async (req, res, next) => {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { orders: true, invitations: true }
        }
      }
    });
    res.status(200).json({ templates });
  } catch (error) {
    next(error);
  }
};

export const toggleTemplateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: { is_active: !template.is_active }
    });

    res.status(200).json({ template: updatedTemplate });
  } catch (error) {
    next(error);
  }
};

export const getInvitations = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        skip,
        take: limitNumber,
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { full_name: true, email: true } },
          template: { select: { name: true } }
        }
      }),
      prisma.invitation.count()
    ]);

    res.status(200).json({
      invitations,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    next(error);
  }
};
