import { useEffect, useRef } from 'react';
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
  const { t, i18n } = useTranslation();
  
  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-ivory min-h-screen pt-20 md:pt-24 font-sans text-charcoal selection:bg-champagne selection:text-white overflow-x-hidden">
      
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 lg:pt-40 lg:pb-32 px-4 md:px-8 lg:px-12 w-full flex flex-col justify-center">
        
        {/* Soft background gradient & Floral Wrappers */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-ivory via-champagne-light/20 to-ivory" />
          
          {/* Subtle Ambient Floral Bouquet (Desktop only, with smooth fade mask so there are zero hard cut edges) */}
          <img 
            src="/assets/landing/hero-bg-left.png" 
            alt="" 
            style={{ 
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%), linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)'
            }}
            className="hidden lg:block absolute left-0 top-0 h-[85%] max-w-[380px] w-auto object-contain -translate-x-[12%] mix-blend-multiply opacity-40 pointer-events-none" 
          />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10 w-full">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left w-full mt-8 lg:-mt-16 block">
            <FadeIn delay={0.1}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-champagne/40 text-[10px] md:text-[11px] font-semibold tracking-[0.15em] text-champagne uppercase rounded-full mb-8 bg-white/40 backdrop-blur-md shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                <Heart size={12} className="text-champagne" /> {t('home.hero.badge')}
              </span>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-[clamp(3.5rem,5vw,5.5rem)] font-serif font-medium mb-6 text-charcoal">
                {t('home.hero.titlePart1')} <br />
                <span className="italic text-champagne font-light drop-shadow-sm">{t('home.hero.titlePart2')}</span> <br />
                {t('home.hero.titlePart3')} <br className="hidden lg:block"/> {t('home.hero.titlePart4')}
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.4} className="flex justify-center lg:justify-start z-0 relative my-3 sm:my-4">
              <img src="/assets/landing/divider.png" alt="Divider" className="w-[180px] sm:w-[220px] md:w-[260px] h-auto object-contain opacity-80 pointer-events-none" />
            </FadeIn>

            <FadeIn delay={0.5}>
              <p className="text-[15px] md:text-lg text-charcoal-light/80 mb-10 max-w-[22rem] sm:max-w-md lg:max-w-md mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0 font-light">
                {t('home.hero.desc')}
              </p>
            </FadeIn>
            
            <FadeIn delay={0.7} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 px-4 sm:px-0">
              <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-charcoal text-white rounded-full font-medium hover:bg-black transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] hover:-translate-y-0.5 duration-300">
                <img src="/assets/landing/rings.png" alt="" className="w-5 h-5 brightness-0 invert object-contain opacity-90" />
                {user ? t('home.hero.goToDashboard') : t('home.hero.createBtn')}
              </Link>
              <a href="#templates" className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/50 border border-champagne text-charcoal rounded-full font-medium hover:bg-champagne/10 transition-all duration-300 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                {t('home.hero.seeExamples')}
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
                 className="w-[110%] md:w-[150%] max-w-none object-contain opacity-50 md:opacity-90 scale-[1.1] scale-x-[-1]"
               />
            </div>

            <FadeIn delay={0.8} direction="up" className="relative z-10 w-full max-w-[280px] md:max-w-[320px]">
              <PhoneMockup className="relative transform lg:rotate-[2deg] hover:rotate-0 transition-transform duration-700 shadow-[0_20px_60px_rgb(0,0,0,0.15)]">
                <div className="h-full w-full bg-ivory flex flex-col items-center justify-center relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&h=800&q=80" 
                    alt="Wedding Couple" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                    loading="lazy"
                  />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-8 pb-14 text-white">
                    <FadeIn delay={0.8} className="text-center w-full">
                      <p className="text-[11px] uppercase tracking-[0.4em] font-semibold mb-4 text-white/90 drop-shadow-md">
                        {t('home.hero.mockupBadge')}
                      </p>
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-champagne/80"></div>
                        <Heart size={14} className="text-champagne drop-shadow-md" />
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-champagne/80"></div>
                      </div>
                      <h3 className="text-[2.75rem] leading-[1.1] font-serif mb-2 font-medium text-white drop-shadow-lg">
                        Азамат <br />
                        <span className="text-[2rem] text-champagne italic font-light my-2 block">&</span> 
                        Мадина
                      </h3>
                      <p className="text-xs uppercase tracking-[0.3em] mt-8 text-white/90 font-medium drop-shadow-md">
                        24 Сентября 2026
                      </p>
                      <p className="text-[10px] uppercase tracking-widest mt-3 text-white/70 font-light">
                        Ташкент, Узбекистан
                      </p>
                    </FadeIn>
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
