import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Image as ImageIcon, MapPin, Clock, Music, CheckCircle2, Smartphone, Gift, CalendarHeart } from 'lucide-react';

// Fade in component for scroll animations
const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const yOffset = direction === 'up' ? 40 : direction === 'down' ? -40 : 0;
  const xOffset = direction === 'left' ? 40 : direction === 'right' ? -40 : 0;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: yOffset, x: xOffset },
        visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Realistic Smartphone CSS Mockup Component
const PhoneMockup = ({ children, className = '' }) => (
  <div className={`relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl overflow-hidden ${className}`}>
    <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[11px] top-[124px] rounded-l-lg"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[11px] top-[178px] rounded-l-lg"></div>
    <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[11px] top-[142px] rounded-r-lg"></div>
    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
      {children}
    </div>
  </div>
);

export default function Home() {
  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-ivory min-h-screen pt-24 font-sans text-charcoal selection:bg-champagne selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-24 lg:pb-32 px-6">
        {/* Soft background gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-ivory via-champagne-light/30 to-sand/50 -z-10" />
        
        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-32 h-32 bg-champagne rounded-full blur-[80px] -z-10"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-[10%] w-48 h-48 bg-sand rounded-full blur-[100px] -z-10"
        />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <FadeIn delay={0.1}>
              <span className="inline-block px-4 py-1.5 border border-champagne text-xs font-semibold tracking-widest text-champagne uppercase rounded-full mb-6">
                Digital Wedding Invitation
              </span>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h1 className="text-5xl lg:text-7xl font-serif font-medium leading-tight mb-6 text-charcoal">
                Ваше свадебное <br />
                <span className="italic text-champagne">приглашение</span> <br />
                в цифровом формате
              </h1>
            </FadeIn>
            <FadeIn delay={0.5}>
              <p className="text-lg text-charcoal-light mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Создайте красивое персональное приглашение на свадьбу за несколько минут и отправьте его гостям одной ссылкой.
              </p>
            </FadeIn>
            <FadeIn delay={0.7} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-charcoal text-ivory rounded-full font-medium hover:bg-charcoal-light transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 duration-300">
                Создать приглашение &rarr;
              </Link>
              <a href="#templates" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-charcoal text-charcoal rounded-full font-medium hover:bg-charcoal hover:text-ivory transition-all duration-300">
                Посмотреть примеры
              </a>
            </FadeIn>
          </div>

          {/* Right Mockup */}
          <div className="flex-1 w-full flex justify-center relative">
            <FadeIn delay={0.8} direction="up">
              {/* Decorative elements around phone */}
              <div className="absolute top-10 -left-10 w-24 h-24 border border-champagne/30 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
              <div className="absolute -bottom-5 -right-5 text-champagne opacity-50">
                <CalendarHeart size={48} strokeWidth={1} />
              </div>
              
              <PhoneMockup className="relative z-10 transform lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                <div className="h-full w-full bg-ivory flex flex-col items-center justify-center relative">
                  <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400&h=800" 
                    alt="Wedding Couple" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                  <div className="absolute bottom-12 text-center text-ivory px-6">
                    <p className="font-sans text-xs tracking-[0.2em] uppercase mb-3 opacity-80">Сохраните дату</p>
                    <h2 className="font-serif text-4xl mb-2">Азамат <span className="italic font-light text-champagne">&</span> Мадина</h2>
                    <p className="font-sans text-sm font-light mt-4 border-t border-ivory/30 pt-4">24 Сентября 2026</p>
                  </div>
                </div>
              </PhoneMockup>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. TEMPLATE SHOWCASE */}
      <section id="templates" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <FadeIn>
            <h2 className="text-4xl lg:text-5xl font-serif font-medium text-charcoal mb-4">Выберите стиль своей свадьбы</h2>
            <p className="text-charcoal-light max-w-2xl mx-auto text-lg">
              Создайте приглашение, которое идеально отражает атмосферу вашего особенного дня.
            </p>
          </FadeIn>
        </div>

        {/* Horizontal scroll on mobile, flex on desktop */}
        <div className="w-full overflow-x-auto hide-scrollbar pb-12 px-6">
          <div className="flex gap-8 w-max mx-auto px-4">
            {[
              { name: 'Classic Elegance', category: 'Elegant', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=500&h=750' },
              { name: 'Minimalist White', category: 'Minimal', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=500&h=750' },
              { name: 'Golden Luxury', category: 'Luxury', img: 'https://images.unsplash.com/photo-1505934333218-8fe9d97a0642?auto=format&fit=crop&q=80&w=500&h=750' },
              { name: 'Tashkent Night', category: 'Uzbek', img: 'https://images.unsplash.com/photo-1606214174585-f2d1e041936c?auto=format&fit=crop&q=80&w=500&h=750' },
            ].map((template, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} direction="left">
                <div className="group relative w-72 h-[450px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                  <img src={template.img} alt={template.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/40 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-charcoal/90 to-transparent">
                    <span className="text-champagne text-xs uppercase tracking-widest">{template.category}</span>
                    <h3 className="text-ivory font-serif text-2xl mt-1">{template.name}</h3>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-charcoal/30 backdrop-blur-sm">
                    <Link to="/register" className="px-6 py-3 bg-ivory text-charcoal rounded-full font-medium hover:bg-champagne hover:text-white transition-colors">
                      Выбрать дизайн
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-sand/30">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-serif font-medium text-charcoal">Создать приглашение проще, чем кажется</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Connecting line on desktop */}
            <div className="hidden lg:block absolute top-12 left-10 right-10 h-[1px] bg-champagne-light -z-10" />

            {[
              { num: '01', title: 'Выберите дизайн', desc: 'Просмотрите нашу коллекцию премиальных шаблонов и найдите свой идеальный стиль.' },
              { num: '02', title: 'Добавьте данные', desc: 'Укажите имена, дату, место проведения и добавьте ваши любимые совместные фотографии.' },
              { num: '03', title: 'Настройте детали', desc: 'Включите таймер, RSVP, карту проезда и выберите фоновую музыку.' },
              { num: '04', title: 'Отправьте гостям', desc: 'Получите уникальную ссылку и разошлите её гостям через Telegram или WhatsApp.' },
            ].map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.15} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-ivory border border-champagne flex items-center justify-center text-3xl font-serif text-champagne mb-6 shadow-sm">
                  {step.num}
                </div>
                <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                <p className="text-charcoal-light text-sm leading-relaxed">{step.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES */}
      <section id="features" className="py-24 bg-ivory relative">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-champagne-light/20 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <FadeIn>
                <h2 className="text-4xl lg:text-5xl font-serif font-medium text-charcoal mb-6">Всё необходимое — в одном приглашении</h2>
                <p className="text-charcoal-light text-lg mb-12 max-w-lg">
                  Мы продумали каждую деталь, чтобы ваши гости получили максимум информации, а вы — меньше хлопот.
                </p>
              </FadeIn>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: Heart, title: 'Персональный сайт', desc: 'Ваша личная страница с уникальным дизайном.' },
                  { icon: ImageIcon, title: 'Галерея фотографий', desc: 'Поделитесь историей вашей любви (Love Story).' },
                  { icon: MapPin, title: 'Карта проезда', desc: 'Удобная навигация к месту проведения.' },
                  { icon: Clock, title: 'Таймер до свадьбы', desc: 'Обратный отсчет до самого важного момента.' },
                  { icon: Music, title: 'Фоновая музыка', desc: 'Создайте настроение с первых секунд.' },
                  { icon: CheckCircle2, title: 'RSVP', desc: 'Точный список гостей и их предпочтения.' },
                  { icon: Smartphone, title: 'Идеально на телефоне', desc: 'Адаптивный дизайн для любых устройств.' },
                  { icon: Gift, title: 'Список желаний', desc: 'Мягкий намек на желанные подарки (Wishlist).' },
                ].map((feature, idx) => (
                  <FadeIn key={idx} delay={0.1 * (idx % 4)} className="flex items-start gap-4">
                    <div className="mt-1 text-champagne">
                      <feature.icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{feature.title}</h4>
                      <p className="text-sm text-charcoal-light">{feature.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
            
            <div className="flex-1 hidden lg:block">
              <FadeIn direction="left" delay={0.3}>
                <div className="relative">
                  {/* Two overlapping mockups */}
                  <PhoneMockup className="absolute top-10 right-20 transform -rotate-6 opacity-60 scale-90 z-0">
                     <div className="h-full w-full bg-sand flex flex-col pt-12 px-6">
                        <div className="w-full h-48 bg-white/50 rounded-xl mb-4" />
                        <div className="w-3/4 h-4 bg-white/50 rounded mb-2" />
                        <div className="w-1/2 h-4 bg-white/50 rounded" />
                     </div>
                  </PhoneMockup>
                  <PhoneMockup className="relative z-10 transform rotate-2 shadow-2xl">
                     <div className="h-full w-full bg-white flex flex-col items-center justify-center p-6 text-center">
                        <CheckCircle2 size={40} className="text-champagne mb-4" strokeWidth={1} />
                        <h3 className="font-serif text-2xl mb-2">Присутствие<br/>подтверждено</h3>
                        <p className="text-xs text-charcoal-light">Азамат и Мадина будут рады видеть вас!</p>
                     </div>
                  </PhoneMockup>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WOW PRODUCT SHOWCASE */}
      <section className="py-32 bg-charcoal text-ivory relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-champagne/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-4xl lg:text-6xl font-serif font-medium mb-6">Больше, чем просто приглашение</h2>
            <p className="text-ivory/70 max-w-2xl mx-auto text-lg mb-20">
              Один красивый мини-сайт, в котором элегантно собрано всё самое важное о вашем празднике. Никаких бумажных открыток — только современные технологии и безупречный стиль.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3} direction="up" className="flex justify-center">
            {/* Extremely large showcase mockup */}
            <div className="relative border-gray-900 bg-gray-900 border-[12px] rounded-[3rem] h-[700px] w-[350px] shadow-2xl overflow-hidden mx-auto transform hover:scale-105 transition-transform duration-1000">
              {/* Notch */}
              <div className="w-[150px] h-[25px] bg-gray-900 top-0 rounded-b-[1.2rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
              
              <div className="w-full h-[1500px] bg-ivory text-charcoal flex flex-col relative animate-scroll-mockup" style={{ animation: 'scrollMockup 20s linear infinite alternate' }}>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes scrollMockup {
                    0% { transform: translateY(0); }
                    10% { transform: translateY(0); }
                    90% { transform: translateY(-700px); }
                    100% { transform: translateY(-700px); }
                  }
                `}} />
                
                {/* Hero part of mockup */}
                <div className="h-[700px] relative shrink-0">
                  <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400&h=800" alt="Wedding" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                  <div className="absolute bottom-20 text-center w-full px-6 text-ivory">
                    <h2 className="font-serif text-5xl">Тимур <span className="text-champagne">&</span> Лейла</h2>
                  </div>
                </div>
                
                {/* Info part of mockup */}
                <div className="h-[700px] bg-white p-8 text-center flex flex-col items-center shrink-0">
                  <div className="w-12 h-[1px] bg-champagne mb-8" />
                  <h3 className="font-serif text-2xl mb-4">Ждём вас на нашем празднике</h3>
                  <p className="text-sm text-gray-500 mb-12">15 Октября 2026<br/>Ресторан "Yakkasaroy", Ташкент</p>
                  
                  <div className="w-full grid grid-cols-3 gap-2 mb-12">
                    <div className="bg-sand py-4 rounded flex flex-col"><span className="text-2xl font-serif">45</span><span className="text-[10px] uppercase">Дней</span></div>
                    <div className="bg-sand py-4 rounded flex flex-col"><span className="text-2xl font-serif">12</span><span className="text-[10px] uppercase">Часов</span></div>
                    <div className="bg-sand py-4 rounded flex flex-col"><span className="text-2xl font-serif">30</span><span className="text-[10px] uppercase">Минут</span></div>
                  </div>
                  
                  <button className="w-full py-4 bg-charcoal text-white rounded-full font-serif text-lg">Я приду</button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-32 relative bg-ivory overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <div className="flex justify-center mb-6 text-champagne">
              <Heart size={40} strokeWidth={1} />
            </div>
            <h2 className="text-5xl lg:text-7xl font-serif font-medium text-charcoal mb-6">Ваша история начинается с приглашения.</h2>
            <p className="text-xl text-charcoal-light mb-12">
              Создайте красивое цифровое приглашение для своего особенного дня прямо сейчас.
            </p>
            <Link to="/register" className="inline-block px-10 py-5 bg-charcoal text-ivory rounded-full font-medium text-lg hover:bg-champagne transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300">
              Создать приглашение &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
