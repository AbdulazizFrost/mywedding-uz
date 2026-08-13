import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ivory border-t border-champagne-light py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-8 text-center md:text-left">
        {/* Logo and Description */}
        <div className="flex flex-col items-center md:items-start gap-5 max-w-sm">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/assets/logo.png" 
              alt="BizningToy Logo" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>
          <p className="text-charcoal-light/80 text-[13px] md:text-sm leading-relaxed font-light">
            Создайте красивое цифровое приглашение для своего особенного дня и разделите радость с близкими.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 w-full md:w-auto justify-center md:justify-end">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="font-serif font-medium text-charcoal text-lg mb-1">Навигация</h4>
            <Link to="/catalog" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">Шаблоны</Link>
            <Link to="/" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">Как это работает</Link>
            <Link to="/" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">Возможности</Link>
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="font-serif font-medium text-charcoal text-lg mb-1">Поддержка</h4>
            <Link to="/login" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">Войти</Link>
            <Link to="/register" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">Регистрация</Link>
            <a href="#" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">Контакты</a>
          </div>
        </div>

        {/* Socials */}
        <div className="flex justify-center md:justify-start gap-3 mt-4 md:mt-0">
          <a href="#" className="w-10 h-10 rounded-full border border-champagne/40 flex items-center justify-center text-charcoal-light hover:bg-champagne hover:text-white hover:border-champagne transition-all shadow-sm hover:shadow-md">
            <Mail size={16} strokeWidth={1.5} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-champagne/40 flex items-center justify-center text-charcoal-light hover:bg-champagne hover:text-white hover:border-champagne transition-all shadow-sm hover:shadow-md">
            <MessageCircle size={16} strokeWidth={1.5} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-champagne/40 flex items-center justify-center text-charcoal-light hover:bg-champagne hover:text-white hover:border-champagne transition-all shadow-sm hover:shadow-md">
            <Phone size={16} strokeWidth={1.5} />
          </a>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-champagne/30 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] uppercase tracking-widest text-charcoal-light/60 text-center md:text-left">
        <p>© {new Date().getFullYear()} BizningToy.uz. Все права защищены.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:text-champagne transition-colors">Политика конфиденциальности</a>
          <a href="#" className="hover:text-champagne transition-colors">Условия использования</a>
        </div>
      </div>
    </footer>
  );
}
