import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, Smartphone, Paintbrush, Globe, Eye, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TemplatePreviewModal from '../../components/preview/TemplatePreviewModal.jsx';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) ? import.meta.env.VITE_API_URL : (window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : `http://${window.location.hostname}:5000/api`);

export default function TemplateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`${API_URL}/templates/${slug}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error(t('templateDetail.notFound') || 'Шаблон не найден');
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
  }, [slug, t]);

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
        <h2 className="text-4xl font-serif text-charcoal mb-4">{t('templateDetail.errorTitle') || 'Дизайн не найден'}</h2>
        <p className="text-charcoal-light mb-8">{error || t('templateDetail.notFound')}</p>
        <Link to="/catalog" className="px-8 py-3 bg-charcoal text-ivory rounded-full font-medium hover:bg-champagne transition-all">
          {t('templateDetail.backToCatalogBtn') || 'Вернуться в каталог'}
        </Link>
      </div>
    );
  }

  const features = [
    { icon: Smartphone, title: t('templateDetail.featureResponsive') || 'Адаптивен для всех смартфонов', desc: t('templateDetail.featureResponsiveDesc') || 'Идеально отображается на iPhone, Android и компьютерах.' },
    { icon: Paintbrush, title: t('templateDetail.featureCustom') || 'Полная кастомизация', desc: t('templateDetail.featureCustomDesc') || 'Настраивайте тексты, фото, музыку, шрифты и цвета в онлайн-редакторе.' },
    { icon: Globe, title: t('templateDetail.featureDomain') || 'Персональная ссылка и RSVP', desc: t('templateDetail.featureDomainDesc') || 'Мгновенная публикация и удобный сбор ответов гостей.' },
  ];

  return (
    <div className="min-h-screen bg-ivory font-sans pt-24 pb-24 selection:bg-champagne selection:text-white">
      
      {/* Live Demo Modal */}
      <TemplatePreviewModal
        isOpen={showLivePreview}
        onClose={() => setShowLivePreview(false)}
        template={template}
        onSelectTemplate={handleBuy}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-charcoal-light hover:text-champagne transition-colors font-medium text-sm">
            <ArrowLeft size={16} /> {t('templateDetail.backToCatalog') || 'Назад в каталог'}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Image / Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center"
          >
            <div className="relative w-full max-w-[380px] mx-auto aspect-[9/19] bg-white rounded-[2.5rem] p-3 shadow-2xl border border-sand group cursor-pointer"
                 onClick={() => setShowLivePreview(true)}>
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-sand relative">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-ivory text-charcoal-light p-6 text-center">
                    <Sparkles className="w-12 h-12 mb-4 text-champagne opacity-50" />
                    <span className="font-serif italic text-lg">{t('templateDetail.previewGenerating')}</span>
                  </div>
                )}
                
                {/* Live Demo Trigger Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-6 py-3 bg-white text-charcoal rounded-full text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-xl">
                    <Eye size={16} />
                    <span>{t('catalog.liveDemo') || 'Открыть живой показ'}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLivePreview(true)}
              className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-champagne hover:text-charcoal transition-colors"
            >
              <Eye size={16} />
              <span>{t('catalog.liveDemo') || 'Интерактивный предпросмотр сайта'}</span>
            </button>
          </motion.div>

          {/* Right Column: Template Details */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-full border border-champagne text-champagne mb-6 bg-white/50">
                {template.category || 'Premium Design'}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-charcoal mb-6 leading-tight">
                {template.name}
              </h1>
              <p className="text-base sm:text-lg text-charcoal-light font-light leading-relaxed max-w-lg">
                {template.description || t('catalog.defaultDesc')}
              </p>
            </div>

            {/* Price & Action */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand shadow-sm mb-10 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div>
                  <p className="text-xs uppercase tracking-widest text-charcoal-light font-semibold mb-2">{t('templateDetail.priceTitle') || 'Стоимость дизайна:'}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif text-charcoal">{Number(template.price).toLocaleString(i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU')}</span>
                    <span className="text-lg text-charcoal-light font-medium">{template.currency}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setShowLivePreview(true)}
                    className="px-6 py-3.5 border border-sand hover:border-champagne text-charcoal rounded-full font-medium text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={15} />
                    <span>{t('catalog.preview') || 'Демо'}</span>
                  </button>

                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="px-8 py-4 bg-charcoal text-ivory rounded-full font-medium text-xs uppercase tracking-widest hover:bg-champagne transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300 disabled:opacity-70 disabled:hover:translate-y-0 whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    {buying ? (
                      <span>{t('templateDetail.creating') || 'Создание...'}</span>
                    ) : (
                      <>
                        <span>{user ? (t('templateDetail.createBtn') || 'Создать приглашение') : (t('templateDetail.loginAndCreate') || 'Войти и создать')}</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-charcoal font-semibold mb-6">{t('templateDetail.includedTitle') || 'Что входит в этот шаблон:'}</h3>
              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center shrink-0 text-charcoal">
                      <feature.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-charcoal font-medium text-sm">{feature.title}</h4>
                      <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">{feature.desc}</p>
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
