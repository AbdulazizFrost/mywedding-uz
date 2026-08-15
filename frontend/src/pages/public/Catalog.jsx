import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, ArrowRight, Sparkles, Smartphone, Check } from 'lucide-react';
import TemplatePreviewModal from '../../components/preview/TemplatePreviewModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) ? import.meta.env.VITE_API_URL : (window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : `http://${window.location.hostname}:5000/api`);

export default function Catalog() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchTemplates = async () => {
      try {
        const response = await fetch(API_URL + '/templates');
        if (!response.ok) throw new Error('Failed to fetch templates');
        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const categories = [
    { id: 'All', label: t('catalog.filterAll') || 'Все стили' },
    { id: 'Luxury', label: t('catalog.filterLuxury') || 'Luxury' },
    { id: 'Romantic', label: t('catalog.filterRomantic') || 'Romantic' },
    { id: 'Editorial', label: t('catalog.filterEditorial') || 'Editorial' },
    { id: 'Minimal', label: t('catalog.filterMinimal') || 'Minimal' },
    { id: 'Modern', label: t('catalog.filterModern') || 'Modern' },
    { id: 'Traditional', label: t('catalog.filterTraditional') || 'Traditional' },
  ];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category?.toLowerCase() === selectedCategory.toLowerCase());

  const handleSelectTemplate = (template) => {
    navigate(`/templates/${template.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory pt-32 pb-16 px-6 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">{t('catalog.loading') || 'Загрузка коллекции...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory pt-32 pb-16 px-6 flex flex-col items-center justify-center">
        <p className="text-red-800 font-serif text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-champagne selection:text-white">
      
      {/* Live Demo Modal */}
      <TemplatePreviewModal 
        isOpen={Boolean(previewTemplate)} 
        onClose={() => setPreviewTemplate(null)} 
        template={previewTemplate}
        onSelectTemplate={handleSelectTemplate}
      />

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 border border-champagne/40 text-[10px] md:text-[11px] font-semibold tracking-[0.25em] text-champagne uppercase rounded-full mb-6 bg-white/40 backdrop-blur-md shadow-sm">
            {t('catalog.badge') || 'PREMIUM WEDDING COLLECTION'}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-charcoal mb-4 leading-tight">
            {t('catalog.titlePart1') || 'Дизайнерские шаблоны'} <br className="hidden sm:block" />
            <span className="italic font-light text-champagne drop-shadow-sm">
              {t('catalog.titlePart2') || 'для вашего торжества'}
            </span>
          </h1>
          <p className="text-charcoal-light max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            {t('catalog.desc') || 'Каждый шаблон — это готовый интерактивный сайт со своей атмосферой, анимациями, таймером, музыкой и формой RSVP.'}
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-14 max-w-3xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-charcoal text-ivory shadow-md scale-[1.03]'
                  : 'bg-white border border-sand text-charcoal hover:border-champagne hover:text-champagne'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center text-charcoal-light font-serif italic text-xl h-64 flex items-center justify-center">
            {t('catalog.empty') || 'В этой категории пока нет шаблонов'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredTemplates.map((template, idx) => (
              <motion.div 
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-sand shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* Image & Hover Action Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-sand/20">
                  {template.preview_image || template.thumbnail ? (
                    <img
                      src={template.preview_image || template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-sand text-charcoal/30">
                      <Sparkles className="w-10 h-10 mb-2 opacity-50" />
                      <span className="font-serif italic text-sm">{t('catalog.noPreview')}</span>
                    </div>
                  )}
                  
                  {/* Category Pill on Image */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest font-semibold text-charcoal shadow-sm">
                      {template.category || 'Premium'}
                    </span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Live Preview Button Trigger */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 gap-3 p-4">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex items-center gap-2 px-5 py-3 bg-white/95 text-charcoal rounded-full font-medium text-xs tracking-widest uppercase hover:bg-champagne hover:text-white transition-all shadow-xl hover:scale-105"
                    >
                      <Eye size={15} />
                      <span>{t('catalog.liveDemo') || 'Предпросмотр'}</span>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-2xl font-serif text-charcoal tracking-tight font-medium">
                      {template.name}
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-champagne font-semibold font-mono">
                      {Number(template.price).toLocaleString(i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU')} {template.currency}
                    </span>
                  </div>

                  <div className="w-8 h-px bg-champagne/40 mb-3 group-hover:w-16 transition-all duration-500" />

                  <p className="text-charcoal-light text-xs sm:text-sm line-clamp-2 leading-relaxed mb-6 font-light">
                    {template.description || t('catalog.defaultDesc')}
                  </p>

                  {/* Card Bottom CTA Buttons */}
                  <div className="mt-auto pt-4 border-t border-sand flex items-center justify-between gap-3">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex-1 py-2.5 px-3 rounded-full border border-sand text-charcoal text-xs uppercase tracking-widest font-medium hover:border-champagne hover:text-champagne transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye size={14} />
                      <span>{t('catalog.preview') || 'Демо'}</span>
                    </button>

                    <button
                      onClick={() => handleSelectTemplate(template)}
                      className="flex-1 py-2.5 px-3 rounded-full bg-charcoal text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>{t('catalog.select') || 'Выбрать'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
