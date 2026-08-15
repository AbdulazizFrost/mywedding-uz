import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed with 8 Premium Wedding Templates...');

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
  }

  // 2. Base Schema generator helper
  const createDefaultSchema = (templateSlug, themeName, fontName, primaryColor, secondaryColor) => ({
    groom_name: 'Сардор',
    bride_name: 'Мадина',
    groom_description: 'Жених',
    bride_description: 'Невеста',
    wedding_date: '2026-09-24',
    wedding_time: '17:00',
    ceremony_time: '18:00',
    reception_time: '19:30',
    venue_name: 'Navruz Hall & Restaurant',
    address: 'г. Ташкент, ул. Амира Темура, 15',
    map_url: 'https://maps.yandex.ru',
    quote: 'Мы счастливы пригласить вас разделить с нами этот особенный день, когда две судьбы соединяются в одну.',
    story: {
      enabled: true,
      story_title: 'Наша история любви',
      story: 'Всё началось весенним утром в уютном кафе старого города. Один взгляд, случайная улыбка — и мы поняли, что это навсегда. Спустя годы путешествий и счастливых мгновений мы готовы сделать главный шаг в нашей жизни.'
    },
    timeline: [
      { time: '17:00', title: 'Сбор гостей & Welcome Drink', desc: 'Живая музыка, легкие напитки и фотосессия' },
      { time: '18:00', title: 'Торжественная церемония', desc: 'Обмен клятвами и кольцами' },
      { time: '19:30', title: 'Свадебный банкет', desc: 'Праздничный ужин, поздравления и тосты' },
      { time: '22:00', title: 'Свадебный торт & Танцы', desc: 'Завершение вечера с фейерверком' }
    ],
    music: {
      enabled: true,
      title: 'A Thousand Years (Instrumental)',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112199.mp3'
    },
    rsvp: {
      enabled: true,
      title: 'Подтверждение присутствия',
      description: 'Пожалуйста, подтвердите ваше участие до 10 сентября 2026 года, чтобы мы могли позаботиться о вашем комфорте.',
      button_text: 'Отправить ответ'
    },
    closing: {
      text: 'С любовью и уважением,',
      couple: 'Сардор & Мадина',
      date: '24.09.2026'
    },
    design: {
      template: templateSlug,
      theme: themeName,
      font: fontName,
      primary_color: primaryColor,
      secondary_color: secondaryColor
    }
  });

  // 3. 8 Distinct Premium Templates
  const templates = [
    {
      name: 'Royal Ivory',
      slug: 'royal-ivory',
      description: 'Luxury European Wedding. Аристократичный оттенок слоновой кости, шампань, классическая симметрия и утонченная типографика.',
      price: 150000,
      currency: 'UZS',
      category: 'Luxury',
      preview_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('royal-ivory', 'elegant', 'serif', '#2c2c2c', '#d4af37'),
      is_active: true,
      sort_order: 1
    },
    {
      name: 'Dark Luxury',
      slug: 'dark-luxury',
      description: 'Кинематографичный ночной стиль. Глубокий обсидиан, темное стекло, сияющее золото шампань и премиальная атмосфера.',
      price: 200000,
      currency: 'UZS',
      category: 'Luxury',
      preview_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('dark-luxury', 'dark', 'serif', '#f4f4f4', '#d4af37'),
      is_active: true,
      sort_order: 2
    },
    {
      name: 'Romantic Blush',
      slug: 'romantic-blush',
      description: 'Нежная романтика в пастельных пудровых тонах. Розовое золото, мягкие изгибы, рукописные акценты и романтичные переходы.',
      price: 160000,
      currency: 'UZS',
      category: 'Romantic',
      preview_image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('romantic-blush', 'rose', 'script', '#3a2d2d', '#c9938b'),
      is_active: true,
      sort_order: 3
    },
    {
      name: 'Editorial Vogue',
      slug: 'editorial',
      description: 'Стиль глянцевого свадебного журнала. Крупная журнальная типографика, асимметричные сетки, тонкие рамки и акцент на фотографии.',
      price: 220000,
      currency: 'UZS',
      category: 'Editorial',
      preview_image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('editorial', 'editorial', 'serif', '#111111', '#888888'),
      is_active: true,
      sort_order: 4
    },
    {
      name: 'Botanical Garden',
      slug: 'botanical',
      description: 'Элегантная ботаническая полиграфия. Оливковые и шалфейные акценты, текстура бумаги и природная эстетика дорогой канцелярии.',
      price: 170000,
      currency: 'UZS',
      category: 'Romantic',
      preview_image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('botanical', 'botanical', 'serif', '#283618', '#606c38'),
      is_active: true,
      sort_order: 5
    },
    {
      name: 'Ultra Minimal',
      slug: 'minimal',
      description: 'Абсолютная чистота и воздух. Теплый белый фон, идеальные пропорции, типографика первого плана в стиле Apple-дизайна.',
      price: 140000,
      currency: 'UZS',
      category: 'Minimal',
      preview_image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('minimal', 'minimal', 'sans', '#1d1d1f', '#86868b'),
      is_active: true,
      sort_order: 6
    },
    {
      name: 'Silk Luxury',
      slug: 'silk',
      description: 'Ощущение струящегося шелка и мягкого света. Плавные формы, жемчужные градиенты, перламутр и нежные переходы.',
      price: 190000,
      currency: 'UZS',
      category: 'Modern',
      preview_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('silk', 'silk', 'serif', '#332f2c', '#c5a880'),
      is_active: true,
      sort_order: 7
    },
    {
      name: 'Modern Uzbek Luxury',
      slug: 'uzbek-luxury',
      description: 'Современная узбекская свадебная эстетика. Благородный изумруд, тонкие золотые геометрические орнаменты и царственное величие.',
      price: 250000,
      currency: 'UZS',
      category: 'Traditional',
      preview_image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('uzbek-luxury', 'emerald', 'serif', '#0b241c', '#d4af37'),
      is_active: true,
      sort_order: 8
    },
    // Backward compatibility aliases
    {
      name: 'Elegant Rose',
      slug: 'elegant-rose',
      description: 'A beautiful and elegant wedding template with rose aesthetics.',
      price: 150000,
      currency: 'UZS',
      category: 'Romantic',
      preview_image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('romantic-blush', 'rose', 'script', '#3a2d2d', '#c9938b'),
      is_active: false,
      sort_order: 99
    },
    {
      name: 'Classic Love',
      slug: 'classic-love',
      description: 'Classic and timeless design for your special day.',
      price: 180000,
      currency: 'UZS',
      category: 'Luxury',
      preview_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('royal-ivory', 'elegant', 'serif', '#2c2c2c', '#d4af37'),
      is_active: false,
      sort_order: 99
    },
    {
      name: 'Minimal Wedding',
      slug: 'minimal-wedding',
      description: 'Clean, modern, and minimal design.',
      price: 200000,
      currency: 'UZS',
      category: 'Minimal',
      preview_image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=400',
      schema: createDefaultSchema('minimal', 'minimal', 'sans', '#1d1d1f', '#86868b'),
      is_active: false,
      sort_order: 99
    }
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        description: t.description,
        price: t.price,
        currency: t.currency,
        category: t.category,
        preview_image: t.preview_image,
        thumbnail: t.thumbnail,
        schema: t.schema,
        is_active: t.is_active,
        sort_order: t.sort_order
      },
      create: t
    });
    console.log(`Upserted template: ${t.name} (${t.slug})`);
  }

  console.log('Seed completed successfully with 8 premium templates.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
