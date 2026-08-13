import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, Smartphone, Paintbrush, Globe } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`;

export default function TemplateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`${API_URL}/templates/${slug}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Шаблон не найден');
          throw new Error('Failed to fetch template');
        }
        const data = await response.json();
        setTemplate(data.template);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug]);

  const handleBuy = async () => {
    if (!user) {
      navigate(`/login?returnUrl=/templates/${slug}`);
      return;
    }

    setBuying(true);
    setError(null);
    try {
      const response = await fetch(API_URL + '/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: template.id }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      navigate(`/checkout/${data.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBuying(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
      </div>
    );
  }
  
  if (error || !template) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-serif text-charcoal mb-4">Упс, что-то пошло не так</h2>
        <p className="text-charcoal-light mb-8">{error || 'Шаблон не найден'}</p>
        <Link to="/catalog" className="px-8 py-3 bg-charcoal text-ivory rounded-full font-medium hover:bg-champagne transition-all">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const features = [
    { icon: Smartphone, title: 'Адаптивный дизайн', desc: 'Идеально смотрится на любых смартфонах' },
    { icon: Paintbrush, title: 'Полная кастомизация', desc: 'Настраивайте тексты, цвета и шрифты' },
    { icon: Globe, title: 'Личный домен', desc: 'Уникальная ссылка-приглашение для гостей' },
  ];

  return (
    <div className="min-h-screen bg-ivory font-sans pt-24 pb-24 selection:bg-champagne selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-charcoal-light hover:text-champagne transition-colors font-medium text-sm">
            <ArrowLeft size={16} /> Назад в каталог
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Image / Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Soft decorative background element */}
            <div className="absolute -inset-4 bg-sand/30 rounded-[3rem] -z-10 rotate-3 transform-gpu" />
            
            <div className="relative w-full max-w-[400px] mx-auto aspect-[9/19.5] bg-white rounded-[2.5rem] p-3 shadow-2xl border border-sand">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-ivory rounded-b-xl z-20" />
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-sand relative">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-ivory text-charcoal-light p-6 text-center">
                    <Sparkles className="w-12 h-12 mb-4 text-champagne opacity-50" />
                    <span className="font-serif italic text-lg">Превью формируется</span>
                  </div>
                )}
                {/* Gradient overlay for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Template Details */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-full border border-champagne text-champagne mb-6">
                {template.category || 'Premium Design'}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-charcoal mb-6 leading-tight">
                {template.name}
              </h1>
              <p className="text-lg text-charcoal-light font-light leading-relaxed max-w-lg">
                {template.description || 'Элегантный и современный дизайн, созданный для того, чтобы запечатлеть ваши самые теплые моменты.'}
              </p>
            </div>

            {/* Price & Action */}
            <div className="bg-white p-8 rounded-3xl border border-sand shadow-sm mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-champagne/10 rounded-bl-full -mr-16 -mt-16" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div>
                  <p className="text-xs uppercase tracking-widest text-charcoal-light font-semibold mb-2">Стоимость шаблона</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif text-charcoal">{Number(template.price).toLocaleString('ru-RU')}</span>
                    <span className="text-lg text-charcoal-light font-medium">{template.currency}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className="px-8 py-4 bg-charcoal text-ivory rounded-full font-medium hover:bg-champagne transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300 disabled:opacity-70 disabled:hover:translate-y-0 whitespace-nowrap"
                >
                  {buying ? 'Оформление...' : (user ? 'Создать приглашение' : 'Войти и Создать')}
                </button>
              </div>
            </div>

            {/* Features List */}
            <div>
              <h3 className="text-sm uppercase tracking-widest text-charcoal font-semibold mb-6">В стоимость включено:</h3>
              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center shrink-0 text-charcoal">
                      <feature.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-charcoal font-medium">{feature.title}</h4>
                      <p className="text-sm text-charcoal-light">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
