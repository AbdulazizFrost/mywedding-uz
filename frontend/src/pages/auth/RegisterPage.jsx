import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { normalizeApiError } from '../../utils/apiUtils.js';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) ? import.meta.env.VITE_API_URL : (window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : `http://${window.location.hostname}:5000/api`);

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchMe } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(API_URL + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (err) {
        data = null;
      }
      
      if (!response.ok) {
        throw new Error(normalizeApiError(response.status, data));
      }

      // After successful registration, log them in automatically
      const loginResponse = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        if (loginData && loginData.token) {
          localStorage.setItem('token', loginData.token);
        }
        await fetchMe();
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex pt-20 md:pt-24 bg-ivory font-sans selection:bg-champagne selection:text-white">
      {/* Left side: Premium Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-charcoal">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-16 left-16 text-ivory max-w-lg z-10">
          <h2 className="text-5xl font-serif mb-6 leading-tight">{t('auth.register.titlePart1')} <br/><span className="italic text-champagne font-light drop-shadow-sm">{t('auth.register.titlePart2')}</span></h2>
          <p className="text-ivory/90 text-[15px] font-light leading-relaxed">
            {t('auth.register.desc')}
          </p>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 sm:p-12 lg:p-24 relative bg-white">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/assets/landing/flower-left.png')] bg-no-repeat bg-right-top opacity-5 pointer-events-none scale-x-[-1]" />
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile minimal header */}
          <div className="lg:hidden text-center mb-12">
            <h2 className="text-4xl font-serif text-charcoal mb-3">{t('auth.register.createAccount')}</h2>
            <div className="flex justify-center mb-4">
              <div className="w-8 h-[1px] bg-champagne/50" />
            </div>
            <p className="text-charcoal-light font-light text-sm">{t('auth.register.startNow')}</p>
          </div>

          <div className="hidden lg:block mb-12">
            <h2 className="text-4xl font-serif text-charcoal mb-4">{t('auth.register.createAccount')}</h2>
            <div className="w-10 h-[1px] bg-champagne/50 mb-6" />
            <p className="text-charcoal-light font-light text-[15px]">{t('auth.register.startNow')}</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold tracking-widest text-charcoal-light uppercase mb-2">{t('auth.register.nameLabel')}</label>
              <input
                type="text"
                required
                className="w-full px-0 py-3 bg-transparent border-b border-champagne/40 focus:border-charcoal outline-none text-charcoal transition-colors placeholder:text-charcoal-light/30"
                placeholder={t('auth.register.namePlaceholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold tracking-widest text-charcoal-light uppercase mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-0 py-3 bg-transparent border-b border-champagne/40 focus:border-charcoal outline-none text-charcoal transition-colors placeholder:text-charcoal-light/30"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold tracking-widest text-charcoal-light uppercase mb-2">{t('auth.register.password')}</label>
              <input
                type="password"
                required
                className="w-full px-0 py-3 bg-transparent border-b border-champagne/40 focus:border-charcoal outline-none text-charcoal transition-colors placeholder:text-charcoal-light/30"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-800/80 text-[12px] font-light text-center bg-red-50/50 p-3 rounded-lg border border-red-100/50 backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-4 mt-8 bg-charcoal text-ivory rounded-full font-medium text-sm tracking-wide hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300"
            >
              {t('auth.register.submit')}
            </button>
            
            <div className="text-center mt-10">
               <p className="text-charcoal-light text-[13px] font-light">
                  {t('auth.register.hasAccount')}{' '}
                  <Link to="/login" className="text-charcoal font-medium hover:text-champagne transition-colors underline decoration-champagne/30 underline-offset-4">
                    {t('auth.register.login')}
                  </Link>
               </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
