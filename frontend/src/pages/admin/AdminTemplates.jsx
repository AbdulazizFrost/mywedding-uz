import { useState, useEffect } from 'react';
import { Power, PowerOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) ? import.meta.env.VITE_API_URL : (window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : `http://${window.location.hostname}:5000/api`);

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/templates`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch templates');
      const data = await res.json();
      setTemplates(data.templates);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplate = async (id, currentStatus) => {
    const actionText = currentStatus ? t('admin.deactivate') : t('admin.activate');
    if (!window.confirm(t('admin.confirmToggle', { action: actionText }))) return;
    
    try {
      const res = await fetch(`${API_URL}/admin/templates/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to toggle template status');
      
      // Update local state
      setTemplates(templates.map(t => t.id === id ? { ...t, is_active: !currentStatus } : t));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-charcoal font-semibold mb-2">{t('admin.templates')}</h1>
        <p className="text-charcoal-light">{t('admin.templatesManage')}</p>
      </div>

      {error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading && templates.length === 0 ? (
            [1, 2, 3].map(i => <div key={i} className="h-80 bg-white rounded-3xl border border-sand animate-pulse" />)
          ) : templates.length > 0 ? (
            templates.map((template, idx) => (
              <motion.div 
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white rounded-3xl border ${template.is_active ? 'border-sand shadow-sm' : 'border-gray-200 opacity-60'} overflow-hidden flex flex-col`}
              >
                <div className="h-48 bg-ivory relative">
                  {template.preview_image ? (
                    <img src={template.preview_image} alt={template.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-charcoal-light">{t('admin.noPreview')}</div>
                  )}
                  {!template.is_active && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-charcoal text-white px-4 py-1 rounded-full text-sm font-medium">{t('admin.disabled')}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-champagne font-bold">{template.category || 'Standard'}</span>
                    <span className="font-serif text-lg text-charcoal">{Number(template.price).toLocaleString(i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU')} {template.currency}</span>
                  </div>
                  
                  <h3 className="text-xl font-medium text-charcoal mb-4">{template.name}</h3>
                  
                  <div className="mt-auto pt-4 border-t border-sand flex items-center justify-between">
                    <div className="text-xs text-charcoal-light space-y-1">
                      <p>{t('admin.uses')} <b>{template._count?.invitations || 0}</b></p>
                      <p>{t('admin.purchases')} <b>{template._count?.orders || 0}</b></p>
                    </div>
                    
                    <button
                      onClick={() => toggleTemplate(template.id, template.is_active)}
                      className={`p-3 rounded-xl transition-all ${
                        template.is_active 
                          ? 'text-red-500 hover:bg-red-50' 
                          : 'text-green-500 hover:bg-green-50'
                      }`}
                      title={template.is_active ? t('admin.deactivate') : t('admin.activate')}
                    >
                      {template.is_active ? <PowerOff size={20} /> : <Power size={20} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center text-charcoal-light bg-white rounded-3xl border border-sand">
              {t('admin.noTemplatesFound')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
