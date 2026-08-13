import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Heart, Image as ImageIcon, MapPin, Clock, Music, CheckCircle2, Smartphone, Gift, CalendarHeart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

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

// Responsive Smartphone CSS Mockup Component
const PhoneMockup = ({ children, className = '' }) => (
  <div className={`relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[6px] md:border-[8px] rounded-[2rem] md:rounded-[2.5rem] w-[280px] h-[560px] sm:w-[300px] sm:h-[600px] shadow-2xl overflow-hidden shrink-0 ${className}`}>
    {/* Notch */}
    <div className="w-[120px] md:w-[148px] h-[16px] md:h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
    {/* Buttons */}
    <div className="h-[40px] md:h-[46px] w-[2px] md:w-[3px] bg-gray-800 absolute -left-[8px] md:-left-[11px] top-[100px] md:top-[124px] rounded-l-lg"></div>
    <div className="h-[40px] md:h-[46px] w-[2px] md:w-[3px] bg-gray-800 absolute -left-[8px] md:-left-[11px] top-[150px] md:top-[178px] rounded-l-lg"></div>
    <div className="h-[50px] md:h-[64px] w-[2px] md:w-[3px] bg-gray-800 absolute -right-[8px] md:-right-[11px] top-[120px] md:top-[142px] rounded-r-lg"></div>
    {/* Screen */}
    <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
      {children}
    </div>
  </div>
);

export default function Home() {
  const { user } = useAuth();
  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-ivory min-h-screen pt-20 md:pt-24 font-sans text-charcoal selection:bg-champagne selection:text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-24 lg:pb-32 px-4 md:px-8 lg:px-12 w-full overflow-hidden">
        {/* Soft background gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-ivory via-champagne-light/30 to-sand/50 -z-10" />
        
        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-[5%] w-24 h-24 lg:w-32 lg:h-32 bg-champagne rounded-full blur-[60px] lg:blur-[80px] -z-10"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 right-[5%] w-32 h-32 lg:w-48 lg:h-48 bg-sand rounded-full blur-[80px] lg:blur-[100px] -z-10"
        />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left z-10 w-full">
            <FadeIn delay={0.1}>
              <span className="inline-block px-3 py-1.5 md:px-4 border border-champagne text-[10px] md:text-xs font-semibold tracking-widest text-champagne uppercase rounded-full mb-6">
                Digital Wedding Invitation
              </span>
            </FadeIn>
            <FadeIn delay={0.3}>
              <h1 className="text-4xl sm:text-5xl lg:text-[clamp(3.5rem,5vw,5rem)] font-serif font-medium leading-[1.1] mb-6 text-charcoal">
                Ваше свадебное <br />
                <span className="italic text-champagne">приглашение</span> <br />
                в цифровом формате
              </h1>
            </FadeIn>
            <FadeIn delay={0.5}>
              <p className="text-base md:text-lg text-charcoal-light mb-8 md:mb-10 max-w-[20rem] sm:max-w-md lg:max-w-lg mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
                Создайте красивое персональное приглашение на свадьбу за несколько минут и отправьте его гостям одной ссылкой.
              </p>
            </FadeIn>
            <FadeIn delay={0.7} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 px-4 sm:px-0">
              <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-charcoal text-ivory rounded-full font-medium hover:bg-charcoal-light transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 duration-300">
                {user ? "Перейти в кабинет \u2192" : "Создать приглашение \u2192"}
              </Link>
              <a href="#templates" className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent border border-charcoal text-charcoal rounded-full font-medium hover:bg-charcoal hover:text-ivory transition-all duration-300">
                Посмотреть примеры
              </a>
            </FadeIn>
          </div>

          {/* Right Mockup */}
          <div className="flex-1 w-full flex justify-center relative mt-8 lg:mt-0">
            <FadeIn delay={0.8} direction="up" className="relative">
              {/* Decorative elements around phone */}
              <div className="absolute -top-5 -left-5 lg:top-10 lg:-left-10 w-16 h-16 lg:w-24 lg:h-24 border border-champagne/30 rounded-full animate-spin-slow z-0" style={{ animationDuration: '20s' }} />
              <div className="absolute -bottom-2 -right-2 lg:-bottom-5 lg:-right-5 text-champagne opacity-50 z-0">
                <CalendarHeart className="w-10 h-10 lg:w-12 lg:h-12" strokeWidth={1} />
              </div>
              
              <PhoneMockup className="relative z-10 transform lg:rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                <div className="h-full w-full bg-ivory flex flex-col items-center justify-center relative">
                  <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400&h=800" 
                    alt="Wedding Couple" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 md:bottom-12 text-center text-ivory px-4 md:px-6 w-full">
                    <p className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase mb-2 md:mb-3 opacity-80">Сохраните дату</p>
                    <h2 className="font-serif text-3xl md:text-4xl mb-2">Азамат <span className="italic font-light text-champagne">&</span> Мадина</h2>
                    <p className="font-sans text-xs md:text-sm font-light mt-3 md:mt-4 border-t border-ivory/30 pt-3 md:pt-4">24 Сентября 2026</p>
                  </div>
                </div>
              </PhoneMockup>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. TEMPLATE SHOWCASE */}
      <section id="templates" className="py-16 md:py-24 bg-white relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 md:mb-16 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-charcoal mb-4">Выберите стиль своей свадьбы</h2>
            <p className="text-charcoal-light max-w-2xl mx-auto text-base md:text-lg px-4">
              Создайте приглашение, которое идеально отражает атмосферу вашего особенного дня.
            </p>
          </FadeIn>
        </div>

        {/* Horizontal scroll (carousel) on mobile, wrapping grid on desktop */}
        <div className="w-full overflow-x-auto hide-scrollbar pb-8 px-4 md:px-8 lg:px-12 snap-x snap-mandatory">
          <div className="flex gap-4 md:gap-8 w-max mx-auto px-2">
            {[
              { name: 'Classic Elegance', category: 'Elegant', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=500&h=750' },
              { name: 'Minimalist White', category: 'Minimal', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=500&h=750' },
              { name: 'Golden Luxury', category: 'Luxury', img: 'https://images.unsplash.com/photo-1505934333218-8fe9d97a0642?auto=format&fit=crop&q=80&w=500&h=750' },
              { name: 'Tashkent Night', category: 'Uzbek', img: 'https://images.unsplash.com/photo-1606214174585-f2d1e041936c?auto=format&fit=crop&q=80&w=500&h=750' },
            ].map((template, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} direction="left" className="snap-center">
                <div className="group relative w-[75vw] max-w-[260px] md:w-72 h-[400px] md:h-[450px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
                  <img src={template.img} alt={template.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/40 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 bg-gradient-to-t from-charcoal/90 to-transparent">
                    <span className="text-champagne text-[10px] md:text-xs uppercase tracking-widest">{template.category}</span>
                    <h3 className="text-ivory font-serif text-xl md:text-2xl mt-1">{template.name}</h3>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-charcoal/30 backdrop-blur-sm">
                    <Link to={user ? "/dashboard" : "/register"} className="px-5 py-2.5 md:px-6 md:py-3 bg-ivory text-charcoal rounded-full text-sm md:text-base font-medium hover:bg-champagne hover:text-white transition-colors">
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
      <section id="how-it-works" className="py-16 md:py-24 bg-sand/30 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <FadeIn className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-charcoal leading-tight">Создать приглашение проще, чем кажется</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
            {/* Connecting line on desktop */}
            <div className="hidden lg:block absolute top-12 left-10 right-10 h-[1px] bg-champagne-light -z-10" />

            {[
              { num: '01', title: 'Выберите дизайн', desc: 'Просмотрите нашу коллекцию премиальных шаблонов и найдите свой идеальный стиль.' },
              { num: '02', title: 'Добавьте данные', desc: 'Укажите имена, дату, место проведения и добавьте ваши любимые совместные фотографии.' },
              { num: '03', title: 'Настройте детали', desc: 'Включите таймер, RSVP, карту проезда и выберите фоновую музыку.' },
              { num: '04', title: 'Отправьте гостям', desc: 'Получите уникальную ссылку и разошлите её гостям через Telegram или WhatsApp.' },
            ].map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.15} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-ivory border border-champagne flex items-center justify-center text-2xl md:text-3xl font-serif text-champagne mb-4 md:mb-6 shadow-sm">
                  {step.num}
                </div>
                <h3 className="text-lg md:text-xl font-medium mb-2 md:mb-3">{step.title}</h3>
                <p className="text-charcoal-light text-xs md:text-sm leading-relaxed max-w-[250px]">{step.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES */}
      <section id="features" className="py-16 md:py-24 bg-ivory relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 w-full lg:w-1/3 h-full bg-gradient-to-b lg:bg-gradient-to-r from-champagne-light/20 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="flex-1 w-full text-center lg:text-left">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-charcoal mb-4 md:mb-6">Всё необходимое — в одном приглашении</h2>
                <p className="text-charcoal-light text-base md:text-lg mb-10 md:mb-12 max-w-lg mx-auto lg:mx-0 px-2 lg:px-0">
                  Мы продумали каждую деталь, чтобы ваши гости получили максимум информации, а вы — меньше хлопот.
                </p>
              </FadeIn>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 text-left">
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
                  <FadeIn key={idx} delay={0.05 * (idx % 4)} className="flex items-start gap-3 md:gap-4 bg-white/50 p-4 rounded-xl border border-sand/50 shadow-sm sm:bg-transparent sm:p-0 sm:border-0 sm:shadow-none">
                    <div className="mt-1 text-champagne shrink-0">
                      <feature.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-sm md:text-base">{feature.title}</h4>
                      <p className="text-xs md:text-sm text-charcoal-light leading-relaxed">{feature.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full flex justify-center lg:justify-end hidden sm:flex pt-12 lg:pt-0">
              <FadeIn direction="left" delay={0.3} className="relative w-full max-w-sm flex justify-center">
                <div className="relative">
                  <PhoneMockup className="absolute top-10 right-10 lg:right-20 transform -rotate-6 opacity-60 scale-90 z-0 hidden md:block">
                     <div className="h-full w-full bg-sand flex flex-col pt-12 px-6">
                        <div className="w-full h-48 bg-white/50 rounded-xl mb-4" />
                        <div className="w-3/4 h-4 bg-white/50 rounded mb-2" />
                        <div className="w-1/2 h-4 bg-white/50 rounded" />
                     </div>
                  </PhoneMockup>
                  <PhoneMockup className="relative z-10 transform rotate-2 shadow-2xl mx-auto">
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
      <section className="py-20 md:py-32 bg-charcoal text-ivory relative w-full overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-champagne/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif font-medium mb-4 md:mb-6 leading-tight">Больше, чем просто приглашение</h2>
            <p className="text-ivory/70 max-w-2xl mx-auto text-base md:text-lg mb-12 md:mb-20 px-2">
              Один красивый мини-сайт, в котором элегантно собрано всё самое важное о вашем празднике. Никаких бумажных открыток — только современные технологии и безупречный стиль.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3} direction="up" className="flex justify-center px-2">
            {/* Extremely large showcase mockup - optimized for mobile width */}
            <div className="relative border-gray-900 bg-gray-900 border-[8px] md:border-[12px] rounded-[2.5rem] md:rounded-[3rem] h-[500px] sm:h-[600px] md:h-[700px] w-full max-w-[320px] shadow-2xl overflow-hidden mx-auto transform hover:scale-105 transition-transform duration-1000 shrink-0">
              {/* Notch */}
              <div className="w-[120px] md:w-[150px] h-[20px] md:h-[25px] bg-gray-900 top-0 rounded-b-[1rem] md:rounded-b-[1.2rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
              
              <div className="w-full h-[1200px] md:h-[1500px] bg-ivory text-charcoal flex flex-col relative animate-scroll-mockup" style={{ animation: 'scrollMockup 20s linear infinite alternate' }}>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes scrollMockup {
                    0% { transform: translateY(0); }
                    10% { transform: translateY(0); }
                    90% { transform: translateY(calc(-100% + 500px)); }
                    100% { transform: translateY(calc(-100% + 500px)); }
                  }
                  @media (min-width: 640px) {
                    @keyframes scrollMockup {
                      0% { transform: translateY(0); }
                      10% { transform: translateY(0); }
                      90% { transform: translateY(calc(-100% + 600px)); }
                      100% { transform: translateY(calc(-100% + 600px)); }
                    }
                  }
                  @media (min-width: 768px) {
                    @keyframes scrollMockup {
                      0% { transform: translateY(0); }
                      10% { transform: translateY(0); }
                      90% { transform: translateY(calc(-100% + 700px)); }
                      100% { transform: translateY(calc(-100% + 700px)); }
                    }
                  }
                `}} />
                
                {/* Hero part of mockup */}
                <div className="h-[500px] sm:h-[600px] md:h-[700px] relative shrink-0">
                  <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400&h=800" alt="Wedding" className="w-full h-full object-cover opacity-80" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                  <div className="absolute bottom-16 md:bottom-20 text-center w-full px-6 text-ivory">
                    <h2 className="font-serif text-4xl md:text-5xl">Тимур <span className="text-champagne">&</span> Лейла</h2>
                  </div>
                </div>
                
                {/* Info part of mockup */}
                <div className="h-[500px] sm:h-[600px] md:h-[700px] bg-white p-6 md:p-8 text-center flex flex-col items-center justify-center shrink-0">
                  <div className="w-10 md:w-12 h-[1px] bg-champagne mb-6 md:mb-8" />
                  <h3 className="font-serif text-xl md:text-2xl mb-3 md:mb-4">Ждём вас на нашем празднике</h3>
                  <p className="text-xs md:text-sm text-gray-500 mb-8 md:mb-12">15 Октября 2026<br/>Ресторан "Yakkasaroy", Ташкент</p>
                  
                  <div className="w-full grid grid-cols-3 gap-2 mb-8 md:mb-12">
                    <div className="bg-sand py-3 md:py-4 rounded flex flex-col"><span className="text-xl md:text-2xl font-serif">45</span><span className="text-[9px] md:text-[10px] uppercase">Дней</span></div>
                    <div className="bg-sand py-3 md:py-4 rounded flex flex-col"><span className="text-xl md:text-2xl font-serif">12</span><span className="text-[9px] md:text-[10px] uppercase">Часов</span></div>
                    <div className="bg-sand py-3 md:py-4 rounded flex flex-col"><span className="text-xl md:text-2xl font-serif">30</span><span className="text-[9px] md:text-[10px] uppercase">Минут</span></div>
                  </div>
                  
                  <button className="w-full py-3 md:py-4 bg-charcoal text-white rounded-full font-serif text-base md:text-lg">Я приду</button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-24 md:py-32 relative bg-ivory overflow-hidden w-full">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <div className="flex justify-center mb-6 text-champagne">
              <Heart className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-charcoal mb-4 md:mb-6 leading-tight">Ваша история начинается с приглашения.</h2>
            <p className="text-base md:text-xl text-charcoal-light mb-10 md:mb-12 max-w-2xl mx-auto px-2">
              Создайте красивое цифровое приглашение для своего особенного дня прямо сейчас.
            </p>
            <Link to={user ? "/dashboard" : "/register"} className="inline-block w-full sm:w-auto px-8 py-4 bg-charcoal text-ivory rounded-full font-medium text-base md:text-lg hover:bg-champagne transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300">
              {user ? "Перейти в кабинет \u2192" : "Создать приглашение \u2192"}
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
