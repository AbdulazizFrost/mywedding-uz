import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`);

export default function Catalog() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    const fetchTemplates = async () => {
      try {
        const response = await fetch(API_URL + '/templates');
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        setTemplates(data.templates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory pt-32 pb-16 px-6 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">Подготавливаем коллекцию...</p>
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
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 lg:mb-24"
        >
          <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 border border-champagne/40 text-[10px] md:text-[11px] font-semibold tracking-[0.2em] text-champagne uppercase rounded-full mb-8 bg-white/40 backdrop-blur-md shadow-sm">
            Wedding Design Gallery
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal mb-6 leading-tight">
            Выберите стиль <br className="hidden sm:block" />
            <span className="italic font-light text-champagne drop-shadow-sm">вашей истории</span>
          </h1>
          <div className="flex justify-center mb-6">
            <img src="/assets/landing/divider.png" alt="" className="h-4 object-contain opacity-60" />
          </div>
          <p className="text-charcoal-light max-w-2xl mx-auto text-[15px] md:text-lg leading-relaxed font-light">
            От минимализма до вечной классики. Каждый шаблон создан с любовью к деталям и легко настраивается под вашу свадьбу.
          </p>
        </motion.div>
        
        {templates.length === 0 ? (
          <div className="text-center text-charcoal-light font-serif italic text-xl h-64 flex items-center justify-center">
            Коллекция в данный момент пополняется...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-20 max-w-6xl mx-auto px-4 md:px-8">
            {templates.map((template, idx) => (
              <motion.div 
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                className="group flex flex-col"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/5] rounded-[2px] overflow-hidden mb-8 bg-sand/30 shadow-[0_20px_50px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.1)] transition-all duration-700">
                  {template.thumbnail || template.preview_image ? (
                    <img
                      src={template.thumbnail || template.preview_image}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-sand text-charcoal/30">
                      <span className="font-serif italic text-lg text-charcoal/40">Нет превью</span>
                    </div>
                  )}
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Hover Actions - Desktop */}
                  <div className="absolute inset-0 hidden md:flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 bg-charcoal/20 backdrop-blur-[2px]">
                    <Link
                      to={`/templates/${template.slug}`}
                      className="flex items-center gap-2 px-8 py-4 bg-charcoal text-white rounded-full font-medium text-sm tracking-wide hover:bg-black hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    >
                      Смотреть детали
                    </Link>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center text-center px-4">
                  <span className="text-[10px] md:text-[11px] font-medium tracking-[0.2em] text-champagne uppercase mb-3">
                    {template.category || 'Элегантный'}
                  </span>
                  <h3 className="text-3xl font-serif text-charcoal mb-3">{template.name}</h3>
                  <div className="w-8 h-[1px] bg-champagne/40 mb-4" />
                  <p className="text-charcoal-light/80 text-[13px] md:text-sm line-clamp-2 leading-relaxed mb-6 font-light max-w-md">
                    {template.description || 'Идеальный выбор для вашего особенного дня.'}
                  </p>
                  <div className="mt-auto flex flex-col items-center gap-4 w-full">
                    <span className="text-[15px] font-medium text-charcoal">
                      {Number(template.price) === 0 ? 'Бесплатно' : `${Number(template.price).toLocaleString('ru-RU')} ${template.currency}`}
                    </span>
                    
                    {/* Mobile visible CTA */}
                    <Link
                      to={`/templates/${template.slug}`}
                      className="md:hidden w-full max-w-[200px] py-3.5 border border-champagne text-charcoal rounded-full text-sm font-medium hover:bg-champagne/10 transition-colors uppercase tracking-widest text-[11px]"
                    >
                      Смотреть детали
                    </Link>
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
