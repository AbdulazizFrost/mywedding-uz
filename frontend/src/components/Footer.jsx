import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  return (
    <footer className="bg-ivory border-t border-champagne-light py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 text-left">
        {/* Logo and Description */}
        <div className="flex flex-col items-start gap-5 max-w-sm">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/assets/logo.png" 
              alt="BizningToy Logo" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>
          <p className="text-charcoal-light/80 text-[13px] md:text-sm leading-relaxed font-light">
            {t('footer.desc')}
          </p>
          
          {/* Socials (Moved under description on mobile) */}
          <div className="flex justify-start gap-3 mt-2">
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

        {/* Links (2-column grid on mobile) */}
        <div className="grid grid-cols-2 gap-8 sm:gap-16 w-full md:w-auto md:flex">
          <div className="flex flex-col items-start gap-4">
            <h4 className="font-serif font-medium text-charcoal text-lg mb-1">{t('footer.navTitle')}</h4>
            <Link to="/catalog" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">{t('nav.templates')}</Link>
            <Link to="/" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">{t('nav.howItWorks')}</Link>
            <Link to="/" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">{t('nav.features')}</Link>
          </div>
          <div className="flex flex-col items-start gap-4">
            <h4 className="font-serif font-medium text-charcoal text-lg mb-1">{t('footer.supportTitle')}</h4>
            {user ? (
              <Link to="/dashboard" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">{t('nav.dashboard')}</Link>
            ) : (
              <>
                <Link to="/login" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">{t('nav.login')}</Link>
                <Link to="/register" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">{t('footer.register')}</Link>
              </>
            )}
            <a href="#" className="text-[13px] text-charcoal-light/80 hover:text-champagne transition-colors font-light">{t('footer.contacts')}</a>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-champagne/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[11px] uppercase tracking-widest text-charcoal-light/60 text-left">
        <p>© {new Date().getFullYear()} BizningToy.uz. {t('footer.rights')}</p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <a href="#" className="hover:text-champagne transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-champagne transition-colors">{t('footer.terms')}</a>
        </div>
      </div>
    </footer>
  );
}
