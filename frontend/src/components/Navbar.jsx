import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('body-lock');
    } else {
      document.body.classList.remove('body-lock');
    }
    return () => document.body.classList.remove('body-lock');
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: t('nav.templates'), href: '/catalog' },
    { name: t('nav.howItWorks'), href: '/#how-it-works' },
    { name: t('nav.features'), href: '/#features' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  const currentLang = i18n.language || 'ru';

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#C8A66A]/20 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.03)]' 
            : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center relative z-50 group">
            <img 
              src="/assets/logo.png" 
              alt="BizningToy Logo" 
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <div className="flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[11px] lg:text-[12px] uppercase tracking-[0.12em] text-[#242321]/75 hover:text-[#C8A66A] transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
              
              {/* Desktop Language Switcher */}
              <div className="flex items-center gap-1.5 ml-2 pl-4 border-l border-[#C8A66A]/30">
                <button 
                  onClick={() => i18n.changeLanguage('ru')}
                  className={`text-[11px] uppercase tracking-[0.1em] font-semibold transition-colors px-1 py-0.5 rounded ${
                    currentLang.startsWith('ru') 
                      ? 'text-[#242321]' 
                      : 'text-[#242321]/40 hover:text-[#C8A66A]'
                  }`}
                >RU</button>
                <span className="text-[#C8A66A]/40 text-[9px]">·</span>
                <button 
                  onClick={() => i18n.changeLanguage('uz')}
                  className={`text-[11px] uppercase tracking-[0.1em] font-semibold transition-colors px-1 py-0.5 rounded ${
                    currentLang.startsWith('uz') 
                      ? 'text-[#242321]' 
                      : 'text-[#242321]/40 hover:text-[#C8A66A]'
                  }`}
                >UZ</button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-l border-[#C8A66A]/30 pl-6">
              {user ? (
                <div className="flex items-center gap-3">
                  {user.role === 'admin' && (
                     <Link 
                       to="/admin" 
                       className="text-[10px] font-semibold text-[#77736C] hover:text-[#242321] transition-colors uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-sand hover:border-[#C8A66A]/40"
                     >
                       Admin
                     </Link>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#242321] text-[#FBF9F5] text-xs uppercase tracking-[0.1em] font-medium rounded-full hover:bg-black transition-all hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] duration-300"
                  >
                    <img src="/assets/landing/rings.png" alt="" className="w-3.5 h-3.5 brightness-0 invert opacity-90" />
                    <span>{t('nav.dashboard')}</span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/login" 
                    className="text-xs uppercase tracking-[0.1em] text-[#242321]/75 hover:text-[#C8A66A] transition-colors font-medium"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#242321] text-[#FBF9F5] text-xs uppercase tracking-[0.1em] font-medium rounded-full hover:bg-black transition-all hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] duration-300"
                  >
                    <img src="/assets/landing/rings.png" alt="" className="w-3.5 h-3.5 brightness-0 invert opacity-90" />
                    <span>{t('nav.createInvitation')}</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#242321] p-2 -mr-2 relative z-50 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-[#FBF9F5] shadow-2xl z-40 md:hidden flex flex-col pt-24 px-6 pb-8 overflow-y-auto"
            >
              <div className="flex flex-col gap-4 mb-auto">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-xl font-serif text-[#242321] py-3 border-b border-[#C8A66A]/20"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              
              {/* Mobile Language Switcher */}
              <div className="flex flex-col items-center mt-8 pt-6 border-t border-[#C8A66A]/20">
                <span className="text-xs uppercase tracking-[0.15em] text-[#77736C] mb-3">{t('nav.language')}</span>
                <div className="flex items-center gap-4 bg-white/60 px-4 py-1.5 rounded-full border border-[#C8A66A]/30">
                  <button 
                    onClick={() => i18n.changeLanguage('ru')}
                    className={`text-sm tracking-wider uppercase transition-colors ${currentLang.startsWith('ru') ? 'text-[#242321] font-semibold' : 'text-[#77736C]'}`}
                  >RU</button>
                  <span className="text-[#C8A66A]/40 text-xs">·</span>
                  <button 
                    onClick={() => i18n.changeLanguage('uz')}
                    className={`text-sm tracking-wider uppercase transition-colors ${currentLang.startsWith('uz') ? 'text-[#242321] font-semibold' : 'text-[#77736C]'}`}
                  >UZ</button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-[#C8A66A]/20">
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-[#242321] text-[#FBF9F5] text-sm uppercase tracking-wider font-medium rounded-full shadow-md"
                    >
                      <img src="/assets/landing/rings.png" alt="" className="w-4 h-4 brightness-0 invert opacity-90" />
                      <span>{t('nav.dashboard')}</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-center w-full px-6 py-3 border border-[#C8A66A]/50 text-[#242321] text-xs font-semibold uppercase tracking-widest rounded-full mt-1"
                      >
                        Admin
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center w-full py-3.5 text-[#242321] text-sm uppercase tracking-wider font-medium border border-[#C8A66A]/40 rounded-full"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-[#242321] text-[#FBF9F5] text-sm uppercase tracking-wider font-medium rounded-full shadow-md mt-1"
                    >
                      <img src="/assets/landing/rings.png" alt="" className="w-4 h-4 brightness-0 invert opacity-90" />
                      <span>{t('nav.createInvitation')}</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
