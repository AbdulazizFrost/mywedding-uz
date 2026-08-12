import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ivory border-t border-champagne-light py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col gap-4 max-w-sm">
          <Link to="/" className="text-2xl font-serif text-charcoal font-semibold tracking-wide">
            bizningtoy.uz
          </Link>
          <p className="text-charcoal-light text-sm leading-relaxed">
            Создайте красивое цифровое приглашение для своего особенного дня и разделите радость с близкими.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="flex flex-col gap-3">
            <h4 className="font-serif font-semibold text-charcoal">Навигация</h4>
            <Link to="/catalog" className="text-sm text-charcoal-light hover:text-champagne transition-colors">Шаблоны</Link>
            <Link to="/" className="text-sm text-charcoal-light hover:text-champagne transition-colors">Как это работает</Link>
            <Link to="/" className="text-sm text-charcoal-light hover:text-champagne transition-colors">Возможности</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-serif font-semibold text-charcoal">Поддержка</h4>
            <Link to="/login" className="text-sm text-charcoal-light hover:text-champagne transition-colors">Войти</Link>
            <Link to="/register" className="text-sm text-charcoal-light hover:text-champagne transition-colors">Регистрация</Link>
            <a href="#" className="text-sm text-charcoal-light hover:text-champagne transition-colors">Контакты</a>
          </div>
        </div>

        {/* Socials */}
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 rounded-full border border-champagne-light flex items-center justify-center text-charcoal-light hover:bg-champagne hover:text-white hover:border-champagne transition-all">
            <Mail size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-champagne-light flex items-center justify-center text-charcoal-light hover:bg-champagne hover:text-white hover:border-champagne transition-all">
            <MessageCircle size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full border border-champagne-light flex items-center justify-center text-charcoal-light hover:bg-champagne hover:text-white hover:border-champagne transition-all">
            <Phone size={18} />
          </a>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-champagne-light flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-charcoal-light">
        <p>© {new Date().getFullYear()} bizningtoy.uz. Все права защищены.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-charcoal transition-colors">Политика конфиденциальности</a>
          <a href="#" className="hover:text-charcoal transition-colors">Условия использования</a>
        </div>
      </div>
    </footer>
  );
}
