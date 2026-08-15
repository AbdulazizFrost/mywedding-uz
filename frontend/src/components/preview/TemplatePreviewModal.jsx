import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Monitor, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TemplateRenderer from '../../templates/TemplateRenderer.jsx';

export default function TemplatePreviewModal({ isOpen, onClose, template, onSelectTemplate }) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  // Rich Demo Schema for the template preview
  const demoData = template.schema || {};

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex flex-col"
      >
        {/* Top Control Bar */}
        <div className="h-16 bg-neutral-900 border-b border-white/10 px-4 sm:px-8 flex items-center justify-between shrink-0 text-white z-50">
          
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              {template.category || 'Premium'}
            </span>
            <div className="h-4 w-px bg-white/20" />
            <h2 className="font-serif text-lg sm:text-xl text-white tracking-wide truncate max-w-[150px] sm:max-w-xs">
              {template.name}
            </h2>
          </div>

          {/* View Mode Toggle (Mobile / Desktop) */}
          <div className="hidden sm:flex items-center bg-white/10 rounded-full p-1 border border-white/10">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === 'mobile' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === 'desktop' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              <Monitor size={14} />
              <span>Full Screen</span>
            </button>
          </div>

          {/* Actions: Use template + Close */}
          <div className="flex items-center gap-3">
            {onSelectTemplate && (
              <button
                onClick={() => {
                  onClose();
                  onSelectTemplate(template);
                }}
                className="px-4 sm:px-6 py-2 bg-[#d4af37] text-black font-sans text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-white transition-all shadow-lg flex items-center gap-2"
              >
                <span>{t('catalog.useDesign') || 'Выбрать дизайн'}</span>
                <ArrowRight size={14} />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              title="Закрыть"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-0 sm:p-6 bg-neutral-950">
          {viewMode === 'mobile' ? (
            <div className="w-full h-full sm:max-w-[420px] sm:max-h-[85vh] bg-white sm:rounded-[2.5rem] sm:border-[6px] sm:border-neutral-800 shadow-2xl overflow-y-auto no-scrollbar relative flex flex-col">
              <TemplateRenderer 
                templateSlug={template.slug} 
                data={demoData} 
                media={[]} 
                onSubmitRsvp={async () => {
                  alert('Это демонстрационный режим. Ответы сохраняются на опубликованном сайте.');
                }} 
              />
            </div>
          ) : (
            <div className="w-full h-full bg-white overflow-y-auto custom-scrollbar">
              <TemplateRenderer 
                templateSlug={template.slug} 
                data={demoData} 
                media={[]} 
                onSubmitRsvp={async () => {
                  alert('Это демонстрационный режим. Ответы сохраняются на опубликованном сайте.');
                }} 
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
