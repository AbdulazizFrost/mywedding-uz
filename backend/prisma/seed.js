import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Admin User
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password_hash: 'REPLACE_ME_IN_PRODUCTION', // Dummy hash for seed
        full_name: 'Admin User',
        role: 'admin',
        is_verified: true,
      }
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user ${adminEmail} already exists.`);
  }

  // 2. Create Templates
  const templates = [
    {
      name: 'Elegant Rose',
      slug: 'elegant-rose',
      description: 'A beautiful and elegant wedding template with rose aesthetics.',
      price: 150000,
      currency: 'UZS',
      category: 'Elegant',
      schema: {
        groom_name: '',
        bride_name: '',
        wedding_date: '',
        wedding_time: '',
        location: '',
        gallery: [],
        music: '',
        rsvp: true
      },
      is_active: true
    },
    {
      name: 'Classic Love',
      slug: 'classic-love',
      description: 'Classic and timeless design for your special day.',
      price: 180000,
      currency: 'UZS',
      category: 'Classic',
      schema: {
        groom_name: '',
        bride_name: '',
        wedding_date: '',
        wedding_time: '',
        location: '',
        gallery: [],
        music: '',
        rsvp: true
      },
      is_active: true
    },
    {
      name: 'Minimal Wedding',
      slug: 'minimal-wedding',
      description: 'Clean, modern, and minimal design.',
      price: 200000,
      currency: 'UZS',
      category: 'Minimal',
      schema: {
        groom_name: '',
        bride_name: '',
        wedding_date: '',
        wedding_time: '',
        location: '',
        gallery: [],
        music: '',
        rsvp: true
      },
      is_active: true
    }
  ];

  for (const t of templates) {
    const existingTemplate = await prisma.template.findUnique({
      where: { slug: t.slug }
    });
    
    if (!existingTemplate) {
      await prisma.template.create({ data: t });
      console.log(`Created template: ${t.name}`);
    } else {
      console.log(`Template ${t.name} already exists.`);
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
