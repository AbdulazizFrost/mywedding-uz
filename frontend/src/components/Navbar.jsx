import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Шаблоны', href: '/catalog' },
    { name: 'Как это работает', href: '/#how-it-works' },
    { name: 'Возможности', href: '/#features' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-ivory/90 backdrop-blur-md border-b border-champagne-light py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif text-charcoal font-semibold tracking-wide">
          bizningtoy.uz
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm text-charcoal hover:text-champagne transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4 border-l border-champagne-light pl-6">
            {user ? (
              <Link 
                to="/dashboard" 
                className="px-5 py-2.5 bg-charcoal text-ivory text-sm font-medium rounded-full hover:bg-charcoal-light transition-all hover:shadow-lg hover:shadow-charcoal/20"
              >
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm text-charcoal hover:text-champagne transition-colors font-medium"
                >
                  Войти
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-charcoal text-ivory text-sm font-medium rounded-full hover:bg-charcoal-light transition-all hover:shadow-lg hover:shadow-charcoal/20"
                >
                  Создать приглашение
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-charcoal p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-ivory border-b border-champagne-light shadow-lg py-4 px-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base text-charcoal py-2 border-b border-sand"
              >
                {link.name}
              </a>
            ))}
            
            {user ? (
              <Link 
                to="/dashboard" 
                className="mt-2 text-center px-5 py-3 bg-charcoal text-ivory text-base font-medium rounded-full"
              >
                Личный кабинет
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-base text-charcoal py-2 border-b border-sand">
                  Войти
                </Link>
                <Link 
                  to="/register" 
                  className="mt-2 text-center px-5 py-3 bg-charcoal text-ivory text-base font-medium rounded-full"
                >
                  Создать приглашение
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
