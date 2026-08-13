import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Heart, Image as ImageIcon, MapPin, Clock, Music, CheckCircle2, Smartphone, Gift, CalendarHeart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

// Fade in component for scroll animations
const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
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
      
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 lg:pt-40 lg:pb-32 px-4 md:px-8 lg:px-12 w-full flex flex-col justify-center">
        
        {/* Soft background gradient & Floral Wrappers */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-ivory/90 via-champagne-light/30 to-ivory/90" />
          <img 
            src="/assets/landing/hero-bg-left.png" 
            alt="Floral Background" 
            className="absolute left-0 top-0 h-[80%] md:h-[100%] w-auto object-contain md:-translate-x-1/4 mix-blend-multiply opacity-95" 
          />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10 w-full">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left w-full mt-8 lg:-mt-16 block">
            <FadeIn delay={0.1}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-champagne/40 text-[10px] md:text-[11px] font-semibold tracking-[0.15em] text-champagne uppercase rounded-full mb-8 bg-white/40 backdrop-blur-md shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                <Heart size={12} className="text-champagne" /> Digital Wedding Invitation
              </span>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-[clamp(3.5rem,5vw,5.5rem)] font-serif font-medium mb-6 text-charcoal">
                Ваше свадебное <br />
                <span className="italic text-champagne font-light drop-shadow-sm">приглашение</span> <br />
                в цифровом <br className="hidden lg:block"/> формате
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.4} className="flex justify-center lg:justify-start mb-8 mt-4">
              <img src="/assets/landing/divider.png" alt="Divider" className="h-10 md:h-16 object-contain opacity-80" />
            </FadeIn>

            <FadeIn delay={0.5}>
              <p className="text-[15px] md:text-lg text-charcoal-light/80 mb-10 max-w-[22rem] sm:max-w-md lg:max-w-md mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0 font-light">
                Создайте красивое персональное приглашение на свадьбу за несколько минут и отправьте его гостям одной ссылкой.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.7} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 px-4 sm:px-0">
              <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-charcoal text-white rounded-full font-medium hover:bg-black transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] hover:-translate-y-0.5 duration-300">
                <img src="/assets/landing/rings.png" alt="" className="w-5 h-5 invert object-contain opacity-90" />
                {user ? "Перейти в кабинет" : "Создать приглашение"}
              </Link>
              <a href="#templates" className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/50 border border-champagne text-charcoal rounded-full font-medium hover:bg-champagne/10 transition-all duration-300 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                Посмотреть примеры
              </a>
            </FadeIn>
          </div>

          {/* Right Mockup */}
          <div className="flex-1 w-full flex justify-center relative mt-12 lg:mt-0">
            
            {/* Beautiful Transparent Floral Backdrop */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none translate-y-[5%] -translate-x-[5%] md:-translate-x-[10%]">
               <img 
                 src="/assets/landing/flower-left.png"
                 alt=""
                 className="w-[140%] max-w-none md:w-[150%] object-contain opacity-90 scale-[1.1] scale-x-[-1]"
               />
            </div>

            <FadeIn delay={0.8} direction="up" className="relative z-10 w-full max-w-[280px] md:max-w-[320px]">
              <PhoneMockup className="relative transform lg:rotate-[2deg] hover:rotate-0 transition-transform duration-700 shadow-[0_20px_60px_rgb(0,0,0,0.15)]">
                <div className="h-full w-full bg-ivory flex flex-col items-center justify-center relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400&h=800" 
                    alt="Wedding Couple" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/40 to-[#1A1A1A]/10" />
                  
                  <div className="absolute bottom-10 text-center text-white px-6 w-full flex flex-col items-center">
                    <p className="font-sans text-[8px] md:text-[9px] tracking-[0.3em] uppercase mb-4 opacity-90 font-medium">Сохраните дату</p>
                    <Heart size={14} className="mb-4 text-champagne opacity-90" strokeWidth={1.5} />
                    <h2 className="font-serif text-3xl md:text-4xl mb-4 leading-tight">Азамат <br/><span className="italic font-light text-champagne drop-shadow-md">&</span> Мадина</h2>
                    <p className="font-sans text-[11px] md:text-xs font-light mt-2 tracking-wide">24 Сентября 2026</p>
                    
                    <div className="mt-6 flex gap-2 opacity-80">
                       <img src="/assets/landing/divider.png" alt="" className="h-2 invert opacity-50" />
                    </div>
                  </div>
                </div>
              </PhoneMockup>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. TEMPLATE SHOWCASE */}
      <section id="templates" className="py-24 md:py-32 bg-white relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 md:mb-24 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-charcoal mb-6">Коллекция дизайнов</h2>
            <p className="text-charcoal-light/80 max-w-2xl mx-auto text-[15px] md:text-lg font-light px-4">
              Создайте приглашение, которое идеально отражает атмосферу вашего особенного дня.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {[
              { name: 'Classic Elegance', category: 'Elegant', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600&h=900' },
              { name: 'Minimalist White', category: 'Minimal', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600&h=900' },
            ].map((template, idx) => (
              <FadeIn key={idx} delay={idx * 0.2} direction="up">
                <div className="group relative w-full aspect-[3/4] lg:aspect-[4/5] rounded-[2px] overflow-hidden cursor-pointer bg-sand/30 shadow-[0_20px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-700">
                  <img src={template.img} alt={template.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <span className="text-champagne text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-medium">{template.category}</span>
                    <h3 className="text-white font-serif text-3xl md:text-4xl mt-3 mb-6 font-medium tracking-wide">{template.name}</h3>
                    <div className="w-12 h-[1px] bg-champagne/50 mb-6 group-hover:w-24 transition-all duration-700" />
                    <Link to={user ? "/dashboard" : "/register"} className="inline-flex items-center gap-2 text-white/90 hover:text-white font-light text-sm tracking-widest uppercase transition-colors group/btn">
                      Выбрать <span className="text-champagne transition-transform group-hover/btn:translate-x-2">→</span>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.4} className="mt-16 text-center">
            <Link to="/catalog" className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-champagne text-charcoal rounded-full text-[13px] font-medium hover:bg-champagne/5 transition-all duration-300 uppercase tracking-[0.15em]">
              Смотреть все дизайны
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 md:py-32 bg-ivory w-full overflow-hidden border-t border-champagne/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <FadeIn className="text-center mb-20 md:mb-28">
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-charcoal leading-tight mb-6">Как это работает</h2>
            <img src="/assets/landing/divider.png" alt="Divider" className="h-3 md:h-4 object-contain opacity-50 mx-auto" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-[1px] bg-champagne/30 -z-10" />

            {[
              { num: '01', title: 'Выберите дизайн', desc: 'Просмотрите нашу коллекцию премиальных шаблонов.' },
              { num: '02', title: 'Добавьте детали', desc: 'Укажите имена, дату и место проведения торжества.' },
              { num: '03', title: 'Настройте опции', desc: 'Включите таймер, музыку и подтверждение RSVP.' },
              { num: '04', title: 'Отправьте гостям', desc: 'Разошлите уникальную ссылку удобным способом.' },
            ].map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.15} className="flex flex-col items-center text-center">
                <div className="bg-ivory px-4 mb-6 relative">
                  <span className="font-serif text-[4rem] md:text-[5rem] leading-none text-champagne/30 font-light block">{step.num}</span>
                </div>
                <h3 className="text-[17px] md:text-lg font-medium mb-3 text-charcoal tracking-wide">{step.title}</h3>
                <p className="text-charcoal-light/80 text-[13px] md:text-[14px] font-light leading-relaxed max-w-[220px]">{step.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES */}
      <section id="features" className="py-24 md:py-32 bg-ivory relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            <div className="flex-1 w-full text-center lg:text-left">
              <FadeIn>
                <h2 className="text-3xl md:text-5xl font-serif font-medium text-charcoal mb-6 leading-tight">Всё необходимое <br/> в одном приглашении</h2>
                <p className="text-charcoal-light/80 text-[15px] md:text-lg mb-12 max-w-lg mx-auto lg:mx-0 font-light">
                  Мы продумали каждую деталь, чтобы ваши гости получили максимум информации, а вы — меньше хлопот.
                </p>
              </FadeIn>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 text-left">
                {[
                  { icon: Heart, title: 'Персональный сайт', desc: 'Уникальный дизайн вашей личной страницы.' },
                  { icon: ImageIcon, title: 'Галерея', desc: 'Поделитесь историей вашей любви (Love Story).' },
                  { icon: MapPin, title: 'Локация', desc: 'Удобная навигация к месту проведения.' },
                  { icon: Clock, title: 'Таймер', desc: 'Обратный отсчет до важного момента.' },
                  { icon: Music, title: 'Музыка', desc: 'Создайте настроение с первых секунд.' },
                  { icon: CheckCircle2, title: 'RSVP', desc: 'Точный список гостей и их предпочтения.' },
                  { icon: Smartphone, title: 'Адаптивность', desc: 'Идеальное отображение на любых устройствах.' },
                  { icon: Gift, title: 'Wishlist', desc: 'Мягкий намек на желанные подарки.' },
                ].map((feature, idx) => (
                  <FadeIn key={idx} delay={0.05 * idx} className="flex items-start gap-4 group">
                    <div className="mt-1 text-champagne/60 group-hover:text-champagne transition-colors">
                      <feature.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-[15px] md:text-base text-charcoal">{feature.title}</h4>
                      <p className="text-[13px] md:text-sm text-charcoal-light/70 font-light leading-relaxed">{feature.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <FadeIn direction="left" delay={0.3} className="relative w-full max-w-[280px] md:max-w-[320px] flex justify-center">
                 <div className="relative z-10 w-full h-[600px] md:h-[700px] border border-champagne/30 rounded-[3rem] bg-white p-2 shadow-[0_30px_60px_rgb(0,0,0,0.08)]">
                   <div className="w-full h-full border border-champagne/20 rounded-[2.5rem] bg-ivory overflow-hidden relative flex flex-col">
                     <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400&h=800" alt="Wedding Detail" className="w-full h-[60%] object-cover opacity-90" />
                     <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-transparent h-[60%]" />
                     <div className="flex-1 bg-ivory p-6 flex flex-col items-center text-center -mt-8 relative z-10">
                        <div className="w-10 h-[1px] bg-champagne mb-4" />
                        <h3 className="font-serif text-3xl mb-2">Детали</h3>
                        <p className="text-[11px] text-charcoal-light/80 font-light mb-6">Ждём вас на нашем празднике</p>
                        <div className="flex gap-4 w-full justify-center">
                          <div className="bg-white border border-champagne/20 rounded-lg p-3 w-20 flex flex-col items-center shadow-sm">
                            <span className="font-serif text-2xl text-charcoal">45</span>
                            <span className="text-[8px] uppercase tracking-widest text-champagne">Дней</span>
                          </div>
                          <div className="bg-white border border-champagne/20 rounded-lg p-3 w-20 flex flex-col items-center shadow-sm">
                            <span className="font-serif text-2xl text-charcoal">12</span>
                            <span className="text-[8px] uppercase tracking-widest text-champagne">Часов</span>
                          </div>
                        </div>
                     </div>
                   </div>
                 </div>
                 {/* Decorative background element */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] border border-champagne/20 rounded-full -rotate-12 -z-10 opacity-50" />
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WOW PRODUCT SHOWCASE */}
      <section className="py-24 md:py-32 bg-charcoal text-ivory relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/landing/flower-left.png')] bg-no-repeat bg-right-top opacity-5 pointer-events-none w-full h-full bg-contain" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl lg:text-[4rem] font-serif font-medium mb-6 leading-tight">Больше, чем просто <br/> <span className="italic font-light text-champagne">приглашение</span></h2>
            <p className="text-ivory/70 max-w-2xl mx-auto text-[15px] md:text-lg mb-16 md:mb-24 px-4 font-light">
              Один красивый мини-сайт, в котором элегантно собрано всё самое важное о вашем празднике. Никаких бумажных открыток — только современные технологии и безупречный стиль.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3} direction="up" className="flex justify-center px-4">
             <div className="relative w-full max-w-[900px] aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_20px_80px_rgb(0,0,0,0.3)] group cursor-pointer border border-white/10">
                <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1600&h=900" alt="Platform Showcase" className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-champagne/90 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal hover:scale-110 transition-transform duration-300 shadow-[0_0_40px_rgba(212,195,163,0.4)]">
                    <svg className="w-6 h-6 md:w-8 md:h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <p className="mt-6 text-[11px] md:text-xs uppercase tracking-[0.3em] font-medium text-champagne">Посмотреть видео-тур</p>
                </div>
             </div>
          </FadeIn>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-24 md:py-32 relative bg-ivory overflow-hidden w-full border-t border-champagne/20">
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <img src="/assets/landing/flower-right.png" className="absolute left-0 top-1/2 h-[120%] w-auto object-contain opacity-20 -translate-x-1/2 -translate-y-1/2" alt="" />
           <img src="/assets/landing/flower-left.png" className="absolute right-0 top-1/2 h-[120%] w-auto object-contain opacity-20 translate-x-1/2 -translate-y-1/2" alt="" />
        </div>
        
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center relative z-10">
          <FadeIn>
            <div className="flex justify-center mb-8">
              <img src="/assets/landing/divider.png" alt="Divider" className="h-4 object-contain opacity-60" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-serif font-medium text-charcoal mb-6 leading-tight">Ваша история <br/> <span className="italic text-champagne font-light">начинается</span> здесь.</h2>
            <p className="text-[15px] md:text-lg text-charcoal-light/80 mb-12 font-light">
              Создайте красивое цифровое приглашение для своего особенного дня прямо сейчас.
            </p>
            <Link to={user ? "/dashboard" : "/register"} className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-charcoal text-white rounded-full font-medium text-[15px] hover:bg-black transition-all shadow-[0_10px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgb(0,0,0,0.15)] hover:-translate-y-1 duration-300">
              <img src="/assets/landing/rings.png" alt="" className="w-5 h-5 invert opacity-90" />
              {user ? "Перейти в кабинет" : "Создать приглашение"}
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
