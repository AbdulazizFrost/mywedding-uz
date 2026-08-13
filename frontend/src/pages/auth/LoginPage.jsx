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
      
      await fetchMe();
      navigate(returnUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex pt-20 md:pt-24 bg-ivory font-sans selection:bg-champagne selection:text-white">
      {/* Left side: Premium Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-charcoal">
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200&h=1600" 
          alt="Wedding details" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
        <div className="absolute bottom-16 left-16 text-ivory max-w-lg">
          <h2 className="text-4xl font-serif mb-4">Начните вашу историю</h2>
          <p className="text-ivory/80 text-lg font-light">
            Войдите в личный кабинет, чтобы продолжить работу над вашим идеальным свадебным приглашением.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 sm:p-12 lg:p-24 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile minimal header (since image is hidden) */}
          <div className="lg:hidden text-center mb-12">
            <h2 className="text-3xl font-serif text-charcoal mb-2">С возвращением</h2>
            <p className="text-charcoal-light">Продолжите создание приглашения</p>
          </div>

          <div className="hidden lg:block mb-12">
            <h2 className="text-3xl font-serif text-charcoal mb-2">С возвращением</h2>
            <p className="text-charcoal-light">Войдите в свой аккаунт</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-white border border-sand focus:border-champagne outline-none rounded-lg text-charcoal transition-colors shadow-sm"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-charcoal">Пароль</label>
                <a href="#" className="text-xs text-charcoal-light hover:text-champagne transition-colors">Забыли пароль?</a>
              </div>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-white border border-sand focus:border-champagne outline-none rounded-lg text-charcoal transition-colors shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-4 mt-4 bg-charcoal text-ivory rounded-full font-medium hover:bg-champagne hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300"
            >
              Войти
            </button>
            
            <div className="text-center mt-8">
               <p className="text-charcoal-light text-sm">
                  Нет аккаунта?{' '}
                  <Link to="/register" className="text-charcoal font-medium hover:text-champagne transition-colors border-b border-charcoal/30 hover:border-champagne">
                    Создать приглашение
                  </Link>
               </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
