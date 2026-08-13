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
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
    setIsMobileMenuOpen(false); // ensure menu closes
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
            ? 'bg-ivory/80 backdrop-blur-lg border-b border-champagne/20 py-4 shadow-[0_4px_30px_rgb(0,0,0,0.03)]' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center relative z-50 group">
            <img 
              src="/assets/logo.png" 
              alt="BizningToy Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
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
                  className="text-[13px] uppercase tracking-wider text-charcoal/80 hover:text-champagne transition-colors font-medium"
                >
                  {link.name}
                </a>
              ))}
              
              {/* Desktop Language Switcher */}
              <div className="flex items-center gap-2 ml-4">
                <button 
                  onClick={() => i18n.changeLanguage('ru')}
                  className={`text-[13px] uppercase tracking-wider font-semibold transition-colors ${currentLang.startsWith('ru') ? 'text-charcoal' : 'text-charcoal/40 hover:text-champagne'}`}
                >RU</button>
                <span className="text-charcoal/40 text-[10px]">·</span>
                <button 
                  onClick={() => i18n.changeLanguage('uz')}
                  className={`text-[13px] uppercase tracking-wider font-semibold transition-colors ${currentLang.startsWith('uz') ? 'text-charcoal' : 'text-charcoal/40 hover:text-champagne'}`}
                >UZ</button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-l border-champagne/30 pl-6 lg:pl-8">
              {user ? (
                <div className="flex items-center gap-4">
                  {user.role === 'admin' && (
                     <Link 
                       to="/admin" 
                       className="text-[11px] font-semibold text-champagne hover:text-charcoal transition-colors uppercase tracking-[0.2em]"
                     >
                       Admin
                     </Link>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-6 py-2.5 bg-charcoal text-white text-sm font-medium rounded-full hover:bg-black transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    <img src="/assets/landing/rings.png" alt="" className="w-4 h-4 brightness-0 invert opacity-90" />
                    {t('nav.dashboard')}
                  </Link>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-sm text-charcoal hover:text-champagne transition-colors font-medium"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 px-6 py-2.5 bg-charcoal text-white text-sm font-medium rounded-full hover:bg-black transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    <img src="/assets/landing/rings.png" alt="" className="w-4 h-4 brightness-0 invert opacity-90" />
                    {t('nav.createInvitation')}
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-charcoal p-2 -mr-2 relative z-50 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-30 md:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-ivory shadow-2xl z-40 md:hidden flex flex-col pt-24 px-6 pb-8 overflow-y-auto"
            >
              <div className="flex flex-col gap-6 mb-auto">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-2xl font-serif text-charcoal py-2 border-b border-champagne/20"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              
              {/* Mobile Language Switcher */}
              <div className="flex flex-col items-center mt-12 pt-6 border-t border-champagne/20">
                <span className="text-sm font-serif text-charcoal/60 mb-3">{t('nav.language')}</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => i18n.changeLanguage('ru')}
                    className={`text-lg font-serif transition-colors ${currentLang.startsWith('ru') ? 'text-charcoal font-semibold' : 'text-charcoal/40'}`}
                  >RU</button>
                  <span className="text-charcoal/40">·</span>
                  <button 
                    onClick={() => i18n.changeLanguage('uz')}
                    className={`text-lg font-serif transition-colors ${currentLang.startsWith('uz') ? 'text-charcoal font-semibold' : 'text-charcoal/40'}`}
                  >UZ</button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-champagne/20">
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-charcoal text-white text-lg font-medium rounded-full shadow-md"
                    >
                      <img src="/assets/landing/rings.png" alt="" className="w-5 h-5 brightness-0 invert opacity-90" />
                      {t('nav.dashboard')}
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-center w-full px-6 py-4 border border-champagne text-charcoal text-sm font-semibold uppercase tracking-widest rounded-full mt-2"
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
                      className="text-center w-full py-4 text-charcoal text-lg font-medium border border-champagne/50 rounded-full"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-charcoal text-white text-lg font-medium rounded-full shadow-md mt-2"
                    >
                      <img src="/assets/landing/rings.png" alt="" className="w-5 h-5 brightness-0 invert opacity-90" />
                      {t('nav.createInvitation')}
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
