import crypto from 'crypto';
import { prisma } from '../../config/database.js';

const generateSlug = (templateSlug) => {
  const suffix = crypto.randomBytes(4).toString('hex');
  return `${templateSlug}-${suffix}`;
};

export const createInvitationForPaidOrder = async (orderId, txClient = prisma) => {
  // 1. Fetch Order and Template
  const order = await txClient.order.findUnique({
    where: { id: orderId },
    include: { template: true },
  });

  if (!order || !order.template) {
    throw new Error('Order or Template not found');
  }

  // 2. Check if invitation already exists (Idempotency)
  const existingInvitation = await txClient.invitation.findUnique({
    where: { order_id: orderId },
  });

  if (existingInvitation) {
    return existingInvitation;
  }

  // 3. Generate unique slug
  let slug = generateSlug(order.template.slug);
  let isUnique = false;
  
  // To avoid hitting the DB in a loop inside a transaction excessively, 
  // we do a simple check. Usually 4 bytes + slug is very unique.
  while (!isUnique) {
    const check = await txClient.invitation.findUnique({ where: { slug } });
    if (!check) {
      isUnique = true;
    } else {
      slug = generateSlug(order.template.slug);
    }
  }

  // 4. Create Invitation using a deep copy of template schema
  const newInvitation = await txClient.invitation.create({
    data: {
      user_id: order.user_id,
      order_id: order.id,
      template_id: order.template.id,
      slug,
      status: 'draft',
      data: JSON.parse(JSON.stringify(order.template.schema)),
    },
  });

  return newInvitation;
};
