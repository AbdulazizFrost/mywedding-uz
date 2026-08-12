import { prisma } from '../../config/database.js';

export const createOrder = async (req, res, next) => {
  try {
    const { template_id } = req.body;
    const user_id = req.user.id;

    if (!template_id) {
      return res.status(400).json({ error: 'template_id is required' });
    }

    // 1. Найти template по ID и проверить is_active
    const template = await prisma.template.findUnique({
      where: { id: template_id },
    });

    if (!template || !template.is_active) {
      return res.status(404).json({ error: 'Template not found or inactive' });
    }

    // 2. Создать Order с ценой из БД
    const order = await prisma.order.create({
      data: {
        user_id,
        template_id: template.id,
        amount: template.price, // strictly from DB
        currency: template.currency, // strictly from DB
        status: 'pending',
      },
      select: {
        id: true,
        template_id: true,
        amount: true,
        currency: true,
        status: true,
        created_at: true,
      },
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const orders = await prisma.order.findMany({
      where: { user_id },
      include: {
        template: {
          select: {
            name: true,
            preview_image: true,
          }
        }
      },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

export const getMyOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        template: {
          select: {
            name: true,
            preview_image: true,
            slug: true,
          }
        }
      }
    });

    if (!order || order.user_id !== user_id) {
      // 404 is safer than 403 to avoid leaking existence of order IDs
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
