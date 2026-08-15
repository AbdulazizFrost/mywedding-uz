import RoyalIvoryTemplate from './RoyalIvory/RoyalIvoryTemplate.jsx';
import DarkLuxuryTemplate from './DarkLuxury/DarkLuxuryTemplate.jsx';
import RomanticBlushTemplate from './RomanticBlush/RomanticBlushTemplate.jsx';
import EditorialTemplate from './Editorial/EditorialTemplate.jsx';
import BotanicalTemplate from './Botanical/BotanicalTemplate.jsx';
import MinimalTemplate from './Minimal/MinimalTemplate.jsx';
import SilkTemplate from './Silk/SilkTemplate.jsx';
import UzbekLuxuryTemplate from './UzbekLuxury/UzbekLuxuryTemplate.jsx';

export {
  RoyalIvoryTemplate,
  DarkLuxuryTemplate,
  RomanticBlushTemplate,
  EditorialTemplate,
  BotanicalTemplate,
  MinimalTemplate,
  SilkTemplate,
  UzbekLuxuryTemplate,
};

export const TEMPLATES_REGISTRY = {
  'royal-ivory': {
    id: 'royal-ivory',
    name: 'Royal Ivory',
    category: 'Luxury',
    description: 'Luxury European Wedding. Аристократичный оттенок слоновой кости, золото шампань и классическая симметрия.',
    component: RoyalIvoryTemplate,
    preview_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    tags: ['Luxury', 'Classical', 'Gold', 'Royal']
  },
  'dark-luxury': {
    id: 'dark-luxury',
    name: 'Dark Luxury',
    category: 'Luxury',
    description: 'Кинематографичный ночной стиль. Глубокий обсидиан, темное стекло, сияющее золото шампань и атмосфера частного торжества.',
    component: DarkLuxuryTemplate,
    preview_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    tags: ['Luxury', 'Cinematic', 'Dark Mode', 'Gold']
  },
  'romantic-blush': {
    id: 'romantic-blush',
    name: 'Romantic Blush',
    category: 'Romantic',
    description: 'Нежная романтика в пастельных пудровых тонах. Розовое золото, мягкие изгибы и романтичные переходы.',
    component: RomanticBlushTemplate,
    preview_image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    tags: ['Romantic', 'Pastel', 'Rose Gold', 'Soft']
  },
  'editorial': {
    id: 'editorial',
    name: 'Editorial Vogue',
    category: 'Editorial',
    description: 'Стиль глянцевого свадебного журнала. Крупная журнальная типографика, асимметричные сетки и акцент на фотографии.',
    component: EditorialTemplate,
    preview_image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800',
    tags: ['Editorial', 'Vogue', 'Fashion', 'Typography']
  },
  'botanical': {
    id: 'botanical',
    name: 'Botanical Garden',
    category: 'Romantic',
    description: 'Элегантная ботаническая полиграфия. Оливковые и шалфейные акценты, текстура бумаги и природная эстетика.',
    component: BotanicalTemplate,
    preview_image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
    tags: ['Romantic', 'Nature', 'Sage', 'Floral']
  },
  'minimal': {
    id: 'minimal',
    name: 'Ultra Minimal',
    category: 'Minimal',
    description: 'Абсолютная чистота и воздух. Теплый белый фон, идеальные пропорции, типографика первого плана в стиле Apple-дизайна.',
    component: MinimalTemplate,
    preview_image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
    tags: ['Minimal', 'Modern', 'Clean', 'Whitespace']
  },
  'silk': {
    id: 'silk',
    name: 'Silk Luxury',
    category: 'Modern',
    description: 'Ощущение струящегося шелка и мягкого света. Плавные формы, жемчужные градиенты и нежные переходы.',
    component: SilkTemplate,
    preview_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
    tags: ['Modern', 'Silk', 'Pearl', 'Gradient']
  },
  'uzbek-luxury': {
    id: 'uzbek-luxury',
    name: 'Modern Uzbek Luxury',
    category: 'Traditional',
    description: 'Современная узбекская свадебная эстетика. Благородный изумруд, тонкие золотые геометрические орнаменты и величие.',
    component: UzbekLuxuryTemplate,
    preview_image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800',
    tags: ['Traditional', 'Emerald', 'Gold', 'Uzbekistan']
  },
  // Backward compatibility alias keys
  'elegant-rose': {
    id: 'romantic-blush',
    component: RomanticBlushTemplate
  },
  'classic-love': {
    id: 'royal-ivory',
    component: RoyalIvoryTemplate
  },
  'minimal-wedding': {
    id: 'minimal',
    component: MinimalTemplate
  }
};
