import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Heart, Image as ImageIcon, MapPin, Clock, Music, CheckCircle2, Smartphone, Gift, CalendarHeart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

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

// Responsive Smartphone CSS Mockup Component with Titanium Bezel and Glass Glare
const PhoneMockup = ({ children, className = '' }) => (
  <div 
    className={`relative mx-auto border-[#1E1D1B] bg-[#1E1D1B] border-[6px] md:border-[7px] rounded-[2.4rem] md:rounded-[2.8rem] w-[280px] h-[550px] sm:w-[295px] sm:h-[580px] overflow-hidden shrink-0 transition-transform duration-500 ${className}`}
    style={{
      boxShadow: '0 30px 80px rgba(35, 30, 20, 0.16), 0 10px 30px rgba(35, 30, 20, 0.08)'
    }}
  >
    {/* Dynamic Island / Speaker */}
    <div className="w-[90px] md:w-[105px] h-[20px] bg-[#1E1D1B] top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-30 flex items-center justify-center">
      <div className="w-10 h-1 bg-[#2C2A28] rounded-full" />
    </div>

    {/* Subtle Glass Reflection Glare Overlay */}
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none z-20" />

    {/* Buttons */}
    <div className="h-[36px] md:h-[40px] w-[2px] bg-[#1E1D1B] absolute -left-[7px] md:-left-[9px] top-[95px] md:top-[115px] rounded-l-lg" />
    <div className="h-[36px] md:h-[40px] w-[2px] bg-[#1E1D1B] absolute -left-[7px] md:-left-[9px] top-[140px] md:top-[165px] rounded-l-lg" />
    <div className="h-[46px] md:h-[55px] w-[2px] bg-[#1E1D1B] absolute -right-[7px] md:-right-[9px] top-[110px] md:top-[130px] rounded-r-lg" />

    {/* Screen */}
    <div className="rounded-[1.9rem] md:rounded-[2.3rem] overflow-hidden w-full h-full bg-[#1E1D1B] relative">
      {children}
    </div>
  </div>
);

export default function Home() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Subtle Mouse Parallax on Desktop
  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-[#FBF9F5] min-h-screen pt-16 md:pt-20 font-sans text-[#242321] selection:bg-[#C8A66A] selection:text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-6 sm:py-10 lg:py-14 min-h-[calc(100vh-5rem)] px-4 sm:px-6 md:px-8 lg:px-12 w-full flex items-center justify-center">
        
        {/* Soft luxury ambient background gradient & Left Floral Frame */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FBF9F5] via-[#FAF7F2] to-[#F5F0E6]/50" />
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#C8A66A]/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#DCC59B]/10 rounded-full blur-[160px]" />

          {/* Ambient Left Floral Bouquet & Silk Drapery */}
          <motion.img 
            src="/assets/landing/hero-bg-left.png" 
            alt="" 
            style={{
              transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -6}px)`
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 100 }}
            className="absolute left-0 top-0 h-full max-h-[850px] w-auto max-w-[280px] lg:max-w-[420px] object-contain -translate-x-[20%] lg:-translate-x-[16%] pointer-events-none opacity-40 lg:opacity-75 mix-blend-multiply" 
          />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-14 relative z-10 w-full">
          
          {/* Left Content */}
          <div 
            className="flex-1 text-center lg:text-left w-full block"
            style={{
              transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)`
            }}
          >
            <FadeIn delay={0.1}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#C8A66A]/40 text-[10px] md:text-[11px] font-semibold tracking-[0.18em] text-[#C8A66A] uppercase rounded-full mb-4 bg-white/60 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <Heart size={11} className="text-[#C8A66A] fill-[#C8A66A]/20" /> {t('home.hero.badge')}
              </span>
            </FadeIn>
            
            <FadeIn delay={0.25}>
              <h1 className="text-[2.6rem] leading-[0.95] sm:text-5xl lg:text-[clamp(3.5rem,5.2vw,5.5rem)] font-serif font-normal mb-3 text-[#242321] tracking-[-0.015em]">
                {t('home.hero.titlePart1')} <br />
                <span className="gold-foil-text font-light italic drop-shadow-sm">
                  {t('home.hero.titlePart2')}
                </span> <br />
                {t('home.hero.titlePart3')} <br className="hidden lg:block"/> {t('home.hero.titlePart4')}
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.4} className="flex justify-center lg:justify-start z-0 relative my-2.5 sm:my-3.5">
              <img 
                src="/assets/landing/divider.png" 
                alt="Divider" 
                className="w-[170px] sm:w-[210px] md:w-[250px] h-auto object-contain opacity-80 pointer-events-none" 
              />
            </FadeIn>

            <FadeIn delay={0.5}>
              <p className="text-[15px] md:text-[16px] text-[#66625B] leading-[1.7] mb-6 lg:mb-8 max-w-[22rem] sm:max-w-md lg:max-w-[430px] mx-auto lg:mx-0 font-light">
                {t('home.hero.desc')}
              </p>
            </FadeIn>
            
            <FadeIn delay={0.65} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 px-4 sm:px-0">
              <Link 
                to={user ? "/dashboard" : "/register"} 
                className="w-full sm:w-auto h-[52px] flex items-center justify-center gap-3 px-8 bg-[#242321] text-[#FBF9F5] text-xs uppercase tracking-[0.1em] font-medium rounded-full hover:bg-black transition-all shadow-[0_8px_25px_rgba(36,35,33,0.14)] hover:shadow-[0_12px_35px_rgba(36,35,33,0.22)] hover:-translate-y-0.5 duration-300"
              >
                <img src="/assets/landing/rings.png" alt="" className="w-4 h-4 brightness-0 invert object-contain opacity-90" />
                <span>{user ? t('home.hero.goToDashboard') : t('home.hero.createBtn')}</span>
              </Link>
              <a 
                href="#templates" 
                className="w-full sm:w-auto h-[52px] flex items-center justify-center gap-3 px-8 bg-white/80 border border-[#C8A66A]/50 text-[#242321] text-xs uppercase tracking-[0.1em] font-medium rounded-full hover:bg-[#F0E8D9]/60 transition-all duration-300 backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:-translate-y-0.5"
              >
                <span>{t('home.hero.seeExamples')}</span>
              </a>
            </FadeIn>
          </div>

          {/* Right Mockup */}
          <div 
            className="flex-1 w-full flex justify-center relative mt-4 lg:mt-0"
            style={{
              transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`
            }}
          >
            
            {/* Floral Backdrop behind Phone */}
            <motion.div 
              style={{
                transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 8}px)`
              }}
              className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none translate-x-[6%] lg:translate-x-[12%]"
            >
              <img 
                src="/assets/landing/flower-left.png" 
                alt="" 
                className="w-[110%] md:w-[130%] max-w-[500px] object-contain opacity-70 lg:opacity-85 scale-x-[-1]" 
              />
            </motion.div>

            <FadeIn delay={0.7} direction="up" className="relative z-10 w-full max-w-[280px] md:max-w-[310px]">
              <motion.div
                animate={{ 
                  y: [-3, 3, -3],
                  rotate: [1.2, 1.8, 1.2]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
              >
                <PhoneMockup className="relative">
                  <div className="h-full w-full bg-[#1E1D1B] flex flex-col items-center justify-center relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&h=800&q=80" 
                      alt="Wedding Couple" 
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                      loading="lazy"
                    />
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-7 pb-12 text-white">
                      <div className="text-center w-full">
                        <p className="text-[10px] uppercase tracking-[0.35em] font-semibold mb-3 text-white/90 drop-shadow-md">
                          {t('home.hero.mockupBadge')}
                        </p>
                        <div className="flex items-center justify-center gap-3 mb-5">
                          <div className="h-[1px] w-7 bg-gradient-to-r from-transparent to-[#C8A66A]/80" />
                          <Heart size={13} className="text-[#C8A66A] drop-shadow-md fill-[#C8A66A]/30" />
                          <div className="h-[1px] w-7 bg-gradient-to-l from-transparent to-[#C8A66A]/80" />
                        </div>
                        <h3 className="text-[2.5rem] leading-[1.05] font-serif mb-1 font-normal text-white drop-shadow-lg">
                          Азамат <br />
                          <span className="text-[1.8rem] text-[#C8A66A] italic font-light my-1 block">&</span> 
                          Мадина
                        </h3>
                        <p className="text-[11px] uppercase tracking-[0.25em] mt-6 text-white/90 font-medium drop-shadow-md">
                          24 Сентября 2026
                        </p>
                        <p className="text-[9px] uppercase tracking-widest mt-2 text-white/70 font-light">
                          Ташкент, Узбекистан
                        </p>
                      </div>
                    </div>
                  </div>
                </PhoneMockup>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. TEMPLATE SHOWCASE */}
      <section id="templates" className="py-24 md:py-32 bg-white relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 md:mb-24 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-charcoal mb-6">{t('home.templates.title')}</h2>
            <p className="text-charcoal-light/80 max-w-2xl mx-auto text-[15px] md:text-lg font-light px-4">
              {t('home.templates.desc')}
            </p>
          </FadeIn>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[
              { name: 'Classic Elegance', category: 'Elegant', img: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop' },
              { name: 'Minimalist White', category: 'Minimal', img: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop' },
              { name: 'Boho Romance', category: 'Floral', img: 'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop' },
            ].map((template, idx) => (
              <FadeIn key={idx} delay={idx * 0.2} direction="up" className="flex justify-center">
                <Link to="/catalog" className="group relative w-full max-w-[260px] sm:max-w-[280px] md:max-w-none aspect-[4/5] md:aspect-[3/4] rounded-sm overflow-hidden cursor-pointer shadow-[0_10px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)] transition-all duration-700 block">
                  {/* Background Image */}
                  <img src={template.img} alt={template.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]" loading="lazy" />
                  
                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                  
                  {/* The Invitation Card (White box in the center) */}
                  <div className="absolute inset-5 bg-white/95 backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center opacity-90 group-hover:opacity-100 transition-opacity duration-500 shadow-xl">
                    <div className="w-full h-full border border-champagne/40 p-4 flex flex-col items-center justify-center relative">
                      <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.3em] uppercase text-charcoal/50 mb-3 block">
                        {template.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-medium mb-6 text-charcoal px-2 leading-tight">
                        {template.name}
                      </h3>
                      <div className="w-8 h-[1px] bg-champagne mb-6 transition-all duration-700 group-hover:w-16" />
                      
                      <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-charcoal hover:text-champagne transition-colors">
                        {t('home.templates.select')} <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.4} className="mt-16 text-center">
            <Link to="/catalog" className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-champagne text-charcoal rounded-full text-[13px] font-medium hover:bg-champagne/5 transition-all duration-300 uppercase tracking-[0.15em]">
              {t('home.templates.seeAll')}
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 md:py-32 bg-ivory w-full overflow-hidden border-t border-champagne/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <FadeIn className="text-center mb-20 md:mb-28">
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-charcoal leading-tight mb-6">{t('home.howItWorks.title')}</h2>
            <img src="/assets/landing/divider.png" alt="Divider" className="w-36 sm:w-48 h-auto object-contain opacity-70 mx-auto" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-[1px] bg-champagne/30 -z-10" />

            {[
              { num: '01', id: '1' },
              { num: '02', id: '2' },
              { num: '03', id: '3' },
              { num: '04', id: '4' },
            ].map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.15} className="flex flex-col items-center text-center">
                <div className="bg-ivory px-4 mb-6 relative">
                  <span className="font-serif text-[4rem] md:text-[5rem] leading-none text-champagne/30 font-light block">{step.num}</span>
                </div>
                <h3 className="text-[17px] md:text-lg font-medium mb-3 text-charcoal tracking-wide">{t(`home.howItWorks.steps.${step.id}.title`)}</h3>
                <p className="text-charcoal-light/80 text-[13px] md:text-[14px] font-light leading-relaxed max-w-[220px]">{t(`home.howItWorks.steps.${step.id}.desc`)}</p>
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
                <h2 className="text-3xl md:text-5xl font-serif font-medium text-charcoal mb-6 leading-tight">{t('home.features.titlePart1')} <br/> {t('home.features.titlePart2')}</h2>
                <p className="text-charcoal-light/80 text-[15px] md:text-lg mb-12 max-w-lg mx-auto lg:mx-0 font-light">
                  {t('home.features.desc')}
                </p>
              </FadeIn>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 text-left">
                {[
                  { icon: Heart, id: 'site' },
                  { icon: ImageIcon, id: 'gallery' },
                  { icon: MapPin, id: 'location' },
                  { icon: Clock, id: 'timer' },
                  { icon: Music, id: 'music' },
                  { icon: CheckCircle2, id: 'rsvp' },
                  { icon: Smartphone, id: 'responsive' },
                  { icon: Gift, id: 'wishlist' },
                ].map((feature, idx) => (
                  <FadeIn key={idx} delay={0.05 * idx} className="flex items-start gap-4 group">
                    <div className="mt-1 text-champagne/60 group-hover:text-champagne transition-colors">
                      <feature.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 text-[15px] md:text-base text-charcoal">{t(`home.features.items.${feature.id}.title`)}</h4>
                      <p className="text-[13px] md:text-sm text-charcoal-light/70 font-light leading-relaxed">{t(`home.features.items.${feature.id}.desc`)}</p>
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
                        <h3 className="font-serif text-3xl mb-2">{t('home.features.detailsTitle')}</h3>
                        <p className="text-[11px] text-charcoal-light/80 font-light mb-6">{t('home.features.detailsDesc')}</p>
                        <div className="flex gap-4 w-full justify-center">
                          <div className="bg-white border border-champagne/20 rounded-lg p-3 w-20 flex flex-col items-center shadow-sm">
                            <span className="font-serif text-2xl text-charcoal">45</span>
                            <span className="text-[8px] uppercase tracking-widest text-champagne">{t('home.features.days')}</span>
                          </div>
                          <div className="bg-white border border-champagne/20 rounded-lg p-3 w-20 flex flex-col items-center shadow-sm">
                            <span className="font-serif text-2xl text-charcoal">12</span>
                            <span className="text-[8px] uppercase tracking-widest text-champagne">{t('home.features.hours')}</span>
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

      {/* 6. FINAL CTA */}
      <section className="py-24 md:py-32 relative bg-ivory overflow-hidden w-full border-t border-champagne/20">
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <img src="/assets/landing/flower-left.png" className="absolute left-0 top-1/2 h-[120%] w-auto object-contain opacity-20 -translate-x-1/2 -translate-y-1/2 scale-x-[-1]" alt="" />
           <img src="/assets/landing/flower-left.png" className="absolute right-0 top-1/2 h-[120%] w-auto object-contain opacity-20 translate-x-1/2 -translate-y-1/2" alt="" />
        </div>
        
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center relative z-10">
          <FadeIn>
            <div className="flex justify-center mb-8">
              <img src="/assets/landing/divider.png" alt="Divider" className="w-36 sm:w-48 h-auto object-contain opacity-70" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-serif font-medium text-charcoal mb-6 leading-tight">{t('home.cta.titlePart1')} <br/> <span className="italic text-champagne font-light">{t('home.cta.titlePart2')}</span> {t('home.cta.titlePart3')}</h2>
            <p className="text-[15px] md:text-lg text-charcoal-light/80 mb-12 font-light">
              {t('home.cta.desc')}
            </p>
            <Link to={user ? "/dashboard" : "/register"} className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-charcoal text-white rounded-full font-medium text-[15px] hover:bg-black transition-all shadow-[0_10px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgb(0,0,0,0.15)] hover:-translate-y-1 duration-300">
              <img src="/assets/landing/rings.png" alt="" className="w-5 h-5 brightness-0 invert opacity-90" />
              {user ? t('home.cta.goToDashboard') : t('home.cta.createBtn')}
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
