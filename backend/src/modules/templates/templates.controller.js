import { prisma } from '../../config/database.js';

export const getTemplates = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const where = {
      is_active: true,
    };

    if (category) {
      where.category = String(category);
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const templates = await prisma.template.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        currency: true,
        preview_image: true,
        thumbnail: true,
        category: true,
        sort_order: true,
      },
      orderBy: [
        { sort_order: 'asc' },
        { created_at: 'desc' },
      ],
    });

    res.status(200).json({ templates });
  } catch (error) {
    next(error);
  }
};

export const getTemplateBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const template = await prisma.template.findFirst({
      where: {
        slug,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        currency: true,
        preview_image: true,
        thumbnail: true,
        category: true,
        sort_order: true,
      },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.status(200).json({ template });
  } catch (error) {
    next(error);
  }
};
