import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const email = 'sba.200676@gmail.com';
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('User not found:', email);
    process.exit(1);
  }

  const template = await prisma.template.findFirst({ where: { is_active: true } });
  if (!template) {
    console.error('No active templates found in DB');
    process.exit(1);
  }

  // Create a paid order
  const order = await prisma.order.create({
    data: {
      user_id: user.id,
      template_id: template.id,
      amount: template.price,
      currency: template.currency,
      status: 'paid'
    }
  });

  // Create invitation
  const slug = crypto.randomBytes(8).toString('hex');
  const invitation = await prisma.invitation.create({
    data: {
      user_id: user.id,
      order_id: order.id,
      template_id: template.id,
      slug: slug,
      status: 'draft',
      data: template.schema
    }
  });

  console.log('Success! Template given to user.');
  console.log('User:', user.email);
  console.log('Template:', template.name);
  console.log('Invitation Slug:', slug);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
