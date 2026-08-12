import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
          <span className="inline-block px-4 py-1 border border-champagne/50 text-xs font-semibold tracking-[0.2em] text-champagne uppercase rounded-full mb-6">
            Wedding Design Gallery
          </span>
          <h1 className="text-5xl lg:text-6xl font-serif text-charcoal mb-6">
            Выберите стиль <br className="hidden sm:block" />
            <span className="italic font-light">вашей истории</span>
          </h1>
          <p className="text-charcoal-light max-w-2xl mx-auto text-lg leading-relaxed">
            От минимализма до вечной классики. Каждый шаблон создан с любовью к деталям и легко настраивается под вашу свадьбу.
          </p>
        </motion.div>
        
        {templates.length === 0 ? (
          <div className="text-center text-charcoal-light font-serif italic text-xl">
            Коллекция в данный момент пополняется...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {templates.map((template, idx) => (
              <motion.div 
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                className="group flex flex-col"
              >
                {/* Image Container with Hover Effect */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-md group-hover:shadow-2xl transition-all duration-700 bg-sand">
                  {template.thumbnail || template.preview_image ? (
                    <img
                      src={template.thumbnail || template.preview_image}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-sand text-charcoal/30">
                      <span className="font-serif italic text-lg">Нет превью</span>
                    </div>
                  )}
                  
                  {/* Elegant Overlay */}
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-500 backdrop-blur-[0px] group-hover:backdrop-blur-[2px]" />
                  
                  {/* CTA Button that appears on hover */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <Link
                      to={`/templates/${template.slug}`}
                      className="px-8 py-3 bg-ivory text-charcoal rounded-full font-medium tracking-wide hover:bg-champagne hover:text-white hover:shadow-lg transition-all"
                    >
                      Смотреть детали
                    </Link>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center text-center px-4">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-champagne uppercase mb-2">
                    {template.category || 'Элегантный'}
                  </span>
                  <h3 className="text-2xl font-serif text-charcoal mb-2">{template.name}</h3>
                  <p className="text-charcoal-light text-sm line-clamp-2 leading-relaxed mb-4">
                    {template.description || 'Идеальный выбор для вашего особенного дня.'}
                  </p>
                  <div className="mt-auto">
                    <span className="text-sm font-medium text-charcoal">
                      {Number(template.price) === 0 ? 'Бесплатно' : `${Number(template.price).toLocaleString('ru-RU')} ${template.currency}`}
                    </span>
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
