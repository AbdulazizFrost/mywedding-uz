import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { normalizeApiError } from '../../utils/apiUtils.js';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchMe } = useAuth();

  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
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
      
      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }
      
      await fetchMe();
      navigate(returnUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex pt-20 md:pt-24 bg-ivory font-sans selection:bg-champagne selection:text-white">
      {/* Left side: Premium Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-ivory">
        <img 
          src="/assets/landing/hero-bg-left.png" 
          alt="Floral background" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
        />
        <div className="absolute bottom-16 left-16 text-charcoal max-w-lg z-10">
          <h2 className="text-5xl font-serif mb-6 leading-tight">Начните <br/><span className="italic text-champagne font-light drop-shadow-sm">вашу историю</span></h2>
          <p className="text-charcoal-light/90 text-[15px] font-light leading-relaxed">
            Войдите в личный кабинет, чтобы продолжить работу над вашим идеальным свадебным приглашением.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 sm:p-12 lg:p-24 relative bg-white">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/assets/landing/flower-right.png')] bg-no-repeat bg-right-top opacity-5 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile minimal header */}
          <div className="lg:hidden text-center mb-12">
            <h2 className="text-4xl font-serif text-charcoal mb-3">С возвращением</h2>
            <div className="flex justify-center mb-4">
              <div className="w-8 h-[1px] bg-champagne/50" />
            </div>
            <p className="text-charcoal-light font-light text-sm">Продолжите создание приглашения</p>
          </div>

          <div className="hidden lg:block mb-12">
            <h2 className="text-4xl font-serif text-charcoal mb-4">С возвращением</h2>
            <div className="w-10 h-[1px] bg-champagne/50 mb-6" />
            <p className="text-charcoal-light font-light text-[15px]">Войдите в свой аккаунт</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold tracking-widest text-charcoal-light uppercase">Пароль</label>
                <a href="#" className="text-[11px] text-charcoal-light/70 hover:text-champagne transition-colors">Забыли пароль?</a>
              </div>
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
              Войти
            </button>
            
            <div className="text-center mt-10">
               <p className="text-charcoal-light text-[13px] font-light">
                  Нет аккаунта?{' '}
                  <Link to="/register" className="text-charcoal font-medium hover:text-champagne transition-colors underline decoration-champagne/30 underline-offset-4">
                    Зарегистрироваться
                  </Link>
               </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
