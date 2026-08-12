import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import PreviewComponent from '../../components/preview/PreviewComponent.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Globe, Smartphone, User, Calendar, MapPin, BookOpen, Image as ImageIcon, Music, CheckSquare, Palette, Upload, Trash2, LayoutTemplate, ExternalLink, Edit2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [invitation, setInvitation] = useState(null);
  const [data, setData] = useState(null);
  const [media, setMedia] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const [activeCategory, setActiveCategory] = useState('main'); // main, media, extra
  const [activeTab, setActiveTab] = useState('couple');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Use a ref to store the latest data for autosave without triggering dependencies
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/invitations/${id}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch invitation');
        const resData = await res.json();
        const inv = resData.invitation;
        setInvitation(inv);
        setLastUpdated(inv.updated_at);
        
        const parsedData = typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data;
        setData(parsedData);

        // Fetch media
        const mediaRes = await fetch(`${API_URL}/invitations/${id}/media`, { credentials: 'include' });
        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          setMedia(mediaData.media || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [id, user]);

  const saveToServer = async (dataToSave, isManual = false) => {
    if (!dataToSave || !invitation) return;
    if (isManual) setSaving(true);
    
    try {
      const res = await fetch(`${API_URL}/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ data: dataToSave, last_updated: lastUpdated })
      });
      const resData = await res.json();
      
      if (!res.ok) {
        if (res.status === 409) {
          setError('Конфликт сохранения. Данные были изменены на другом устройстве.');
        } else {
          throw new Error(resData.error || 'Failed to save');
        }
        return;
      }

      setLastUpdated(resData.invitation.updated_at);
      if (isManual) {
        setMessage('Изменения сохранены');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (isManual) setSaving(false);
    }
  };

  // Debounced autosave
  const autosaveTimeout = useRef(null);
  const triggerAutosave = useCallback(() => {
    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    autosaveTimeout.current = setTimeout(() => {
      saveToServer(dataRef.current);
    }, 1500); // Increased debounce to 1.5s for smoother typing
  }, [lastUpdated]);

  const handleChange = (section, field, value) => {
    setData(prev => {
      if (!prev) return prev;
      let nextData = { ...prev };
      if (section) {
        nextData[section] = { ...(nextData[section] || {}), [field]: value };
      } else {
        nextData[field] = value;
      }
      return nextData;
    });
    triggerAutosave();
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'gallery_item');

    try {
      const res = await fetch(`${API_URL}/invitations/${id}/media`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Upload failed');
      setMedia(prev => [...prev, resData.media]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMediaDelete = async (mediaId) => {
    try {
      const res = await fetch(`${API_URL}/invitations/${id}/media/${mediaId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete media');
      setMedia(prev => prev.filter(m => m.id !== mediaId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublish = async () => {
    try {
      const res = await fetch(`${API_URL}/invitations/${id}/publish`, {
        method: 'POST', credentials: 'include'
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to publish');
      setInvitation(resData.invitation);
      setMessage('Приглашение опубликовано!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-charcoal border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">Открываем редактор...</p>
      </div>
    );
  }
  
  if (!invitation || !data) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center">
        <p className="font-serif text-charcoal text-xl">Приглашение не найдено</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-2 bg-charcoal text-ivory rounded-full">Вернуться в кабинет</button>
      </div>
    );
  }

  // Progressive Disclosure Configuration
  const categories = {
    main: {
      label: 'Основное',
      icon: LayoutTemplate,
      tabs: [
        { id: 'couple', label: 'Имена', icon: User },
        { id: 'date', label: 'Дата и Время', icon: Calendar },
        { id: 'location', label: 'Место проведения', icon: MapPin },
        { id: 'design', label: 'Дизайн и Цвета', icon: Palette }
      ]
    },
    media: {
      label: 'Медиа',
      icon: ImageIcon,
      tabs: [
        { id: 'gallery', label: 'Галерея фото', icon: ImageIcon },
        { id: 'music', label: 'Фоновая музыка', icon: Music }
      ]
    },
    extra: {
      label: 'Дополнительно',
      icon: BookOpen,
      tabs: [
        { id: 'story', label: 'История любви', icon: BookOpen },
        { id: 'rsvp', label: 'Ответы гостей (RSVP)', icon: CheckSquare }
      ]
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-ivory font-sans selection:bg-champagne selection:text-white overflow-hidden">
      
      {/* HEADER - Premium minimal style */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-sand px-4 sm:px-8 flex items-center justify-between z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-charcoal-light hover:text-charcoal transition-colors p-2 -ml-2 rounded-full hover:bg-sand"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline text-sm font-medium">В кабинет</span>
          </button>
          <div className="h-4 w-px bg-sand hidden sm:block mx-2" />
          <h1 className="font-serif text-lg text-charcoal hidden sm:block truncate max-w-[200px]">
            {invitation.template?.name || 'Редактор'}
          </h1>
        </div>
        
        {/* Status Toast Notification (Absolute positioned center) */}
        <AnimatePresence>
          {(message || error) && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`absolute left-1/2 -translate-x-1/2 top-4 px-4 py-2 rounded-full shadow-lg text-xs font-medium tracking-wide z-50 flex items-center gap-2
                ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}
            >
              <span className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
              {error || message}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => saveToServer(data, true)} 
            disabled={saving} 
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-charcoal bg-sand hover:bg-champagne hover:text-white transition-all disabled:opacity-50"
          >
            <Save size={16} />
            <span className="hidden sm:inline">{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
          
          {invitation.status !== 'published' ? (
            <button 
              onClick={handlePublish} 
              className="flex items-center gap-2 px-5 py-2 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-charcoal/90 transition-all shadow-md"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">Опубликовать</span>
            </button>
          ) : (
             <a 
               href={`/w/${invitation.slug}`} 
               target="_blank" 
               rel="noreferrer" 
               className="flex items-center gap-2 px-5 py-2 bg-green-700 text-white rounded-full text-sm font-medium hover:bg-green-800 transition-all shadow-md"
             >
               <ExternalLink size={16} />
               <span className="hidden sm:inline">Сайт готов</span>
             </a>
          )}

          {/* Mobile Preview Toggle */}
          <button 
            className="sm:hidden p-2 text-charcoal bg-sand rounded-full"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
          >
            {showMobilePreview ? <Edit2 size={20} /> : <Smartphone size={20} />}
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT: EDITING PANEL */}
        <div className={`w-full sm:w-[400px] lg:w-[450px] bg-white flex flex-col z-10 transition-transform duration-300 ${showMobilePreview ? '-translate-x-full absolute h-full' : 'translate-x-0'}`}>
          
          {/* Progressive Disclosure Categories */}
          <div className="flex p-4 gap-2 overflow-x-auto border-b border-sand shrink-0 no-scrollbar">
            {Object.entries(categories).map(([key, cat]) => {
              const Icon = cat.icon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveCategory(key);
                    setActiveTab(cat.tabs[0].id); // Auto-select first tab of category
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all
                    ${activeCategory === key ? 'bg-charcoal text-ivory shadow-sm' : 'bg-sand text-charcoal hover:bg-champagne/20'}`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sub-tabs */}
          <div className="px-4 pt-4 shrink-0">
            <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
              {categories[activeCategory].tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.id ? 'border-champagne text-charcoal' : 'border-transparent text-charcoal-light hover:text-charcoal'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Form Fields Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                
                {/* --- MAIN --- */}
                {activeTab === 'couple' && (
                  <div className="space-y-5">
                    <Input label="Имя жениха" placeholder="Тимур" value={data.groom_name} onChange={e => handleChange(null, 'groom_name', e.target.value)} />
                    <Input label="Имя невесты" placeholder="Лейла" value={data.bride_name} onChange={e => handleChange(null, 'bride_name', e.target.value)} />
                  </div>
                )}

                {activeTab === 'date' && (
                  <div className="space-y-5">
                    <Input type="date" label="Дата свадьбы" value={data.wedding_date} onChange={e => handleChange(null, 'wedding_date', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="time" label="Сбор гостей" value={data.wedding_time} onChange={e => handleChange(null, 'wedding_time', e.target.value)} />
                      <Input type="time" label="Церемония" value={data.ceremony_time} onChange={e => handleChange(null, 'ceremony_time', e.target.value)} />
                    </div>
                    <Input type="time" label="Банкет" value={data.reception_time} onChange={e => handleChange(null, 'reception_time', e.target.value)} />
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="space-y-5">
                    <Input label="Название заведения" placeholder="Ресторан Navruz" value={data.venue_name} onChange={e => handleChange(null, 'venue_name', e.target.value)} />
                    <TextArea label="Адрес" placeholder="ул. Амира Темура, 1" value={data.address} onChange={e => handleChange(null, 'address', e.target.value)} />
                    <Input type="url" label="Ссылка на карту (Yandex/Google Maps)" placeholder="https://yandex.uz/maps/..." value={data.map_url} onChange={e => handleChange(null, 'map_url', e.target.value)} />
                  </div>
                )}
                
                {activeTab === 'design' && (
                  <div className="space-y-6">
                    <Select label="Цветовая тема" value={data.design?.theme} onChange={e => handleChange('design', 'theme', e.target.value)} options={[
                      {value: 'elegant', label: 'Элегантная (Светлая)'},
                      {value: 'classic', label: 'Классическая'},
                      {value: 'minimal', label: 'Минимализм'},
                      {value: 'dark', label: 'Тёмная (Premium)'}
                    ]} />
                    <Select label="Стиль шрифтов" value={data.design?.font} onChange={e => handleChange('design', 'font', e.target.value)} options={[
                      {value: 'serif', label: 'Традиционный с засечками (Cormorant)'},
                      {value: 'sans', label: 'Современный (Inter)'},
                      {value: 'script', label: 'Рукописный акцент'}
                    ]} />
                    <div className="p-4 bg-sand/30 rounded-xl space-y-4">
                      <p className="text-sm font-medium text-charcoal">Пользовательские цвета (опционально)</p>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-charcoal-light mb-1">Основной</label>
                          <div className="flex items-center gap-2 border border-sand rounded-lg p-1 bg-white">
                            <input type="color" className="w-8 h-8 rounded cursor-pointer border-0 p-0" value={data.design?.primary_color || '#000000'} onChange={e => handleChange('design', 'primary_color', e.target.value)} />
                            <span className="text-xs font-mono text-charcoal uppercase">{data.design?.primary_color || 'Дефолт'}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-charcoal-light mb-1">Акцент</label>
                          <div className="flex items-center gap-2 border border-sand rounded-lg p-1 bg-white">
                            <input type="color" className="w-8 h-8 rounded cursor-pointer border-0 p-0" value={data.design?.secondary_color || '#d4af37'} onChange={e => handleChange('design', 'secondary_color', e.target.value)} />
                            <span className="text-xs font-mono text-charcoal uppercase">{data.design?.secondary_color || 'Дефолт'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- MEDIA --- */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-champagne/50 bg-champagne/5 rounded-2xl p-6 text-center hover:bg-champagne/10 transition-colors relative cursor-pointer group">
                      <Upload className="w-8 h-8 text-champagne mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-medium text-charcoal">Нажмите, чтобы загрузить фото</p>
                      <p className="text-xs text-charcoal-light mt-1">JPG, PNG (до 5 МБ)</p>
                      <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="" />
                    </div>
                    
                    {media.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {media.map((img) => (
                          <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-sand">
                            <img src={img.url} className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="gallery" />
                            <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => handleMediaDelete(img.id)} className="bg-white text-red-500 rounded-full p-2 hover:scale-110 transition-transform shadow-lg">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'music' && (
                  <div className="space-y-5">
                    <Toggle label="Включить фоновую музыку" checked={data.music?.enabled} onChange={e => handleChange('music', 'enabled', e.target.checked)} />
                    {data.music?.enabled && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5 pt-2">
                        <Input label="Название композиции" placeholder="A Thousand Years" value={data.music?.title} onChange={e => handleChange('music', 'title', e.target.value)} />
                        <Input type="url" label="Ссылка на трек (.mp3 URL)" placeholder="https://example.com/music.mp3" value={data.music?.url} onChange={e => handleChange('music', 'url', e.target.value)} />
                        <p className="text-xs text-charcoal-light">Совет: Убедитесь, что ссылка ведет напрямую на аудиофайл (заканчивается на .mp3)</p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* --- EXTRA --- */}
                {activeTab === 'story' && (
                  <div className="space-y-5">
                    <Toggle label="Отображать блок 'История любви'" checked={data.story?.enabled} onChange={e => handleChange('story', 'enabled', e.target.checked)} />
                    {data.story?.enabled && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5 pt-2">
                        <Input label="Заголовок" placeholder="Наша история" value={data.story?.story_title} onChange={e => handleChange('story', 'story_title', e.target.value)} />
                        <TextArea label="Текст истории" rows={6} placeholder="Всё началось теплым вечером..." value={data.story?.story} onChange={e => handleChange('story', 'story', e.target.value)} />
                      </motion.div>
                    )}
                  </div>
                )}

                {activeTab === 'rsvp' && (
                  <div className="space-y-5">
                    <Toggle label="Включить форму подтверждения (RSVP)" checked={data.rsvp?.enabled} onChange={e => handleChange('rsvp', 'enabled', e.target.checked)} />
                    {data.rsvp?.enabled && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5 pt-2">
                        <Input label="Заголовок блока" placeholder="Ждём вашего ответа" value={data.rsvp?.title} onChange={e => handleChange('rsvp', 'title', e.target.value)} />
                        <TextArea label="Описание" placeholder="Пожалуйста, подтвердите присутствие до..." value={data.rsvp?.description} onChange={e => handleChange('rsvp', 'description', e.target.value)} />
                        <Input label="Текст на кнопке" placeholder="Подтвердить присутствие" value={data.rsvp?.button_text} onChange={e => handleChange('rsvp', 'button_text', e.target.value)} />
                      </motion.div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: LIVE PREVIEW (Smartphone Mockup) */}
        <div className={`flex-1 bg-ivory/50 flex items-center justify-center p-4 sm:p-8 relative ${showMobilePreview ? 'block z-20 bg-ivory w-full absolute inset-0 pt-8' : 'hidden sm:flex'}`}>
          
          <div className="w-full max-w-[390px] aspect-[9/19.5] max-h-full bg-white shadow-2xl rounded-[3rem] overflow-hidden border-[12px] border-charcoal shrink-0 relative flex flex-col">
            {/* Dynamic Island Notch Fake */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-charcoal rounded-b-3xl z-50 pointer-events-none" />
            
            {/* The actual preview iframe/component */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
               <PreviewComponent data={data} media={media} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// PREMIUM UI HELPERS
const Input = ({ label, type="text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
    <input 
      type={type} 
      value={value || ''} 
      onChange={onChange} 
      placeholder={placeholder}
      className="w-full bg-white border border-sand focus:border-champagne rounded-lg px-4 py-2.5 text-charcoal text-sm outline-none transition-colors shadow-sm placeholder:text-sand" 
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows=3 }) => (
  <div>
    <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
    <textarea 
      rows={rows} 
      value={value || ''} 
      onChange={onChange} 
      placeholder={placeholder}
      className="w-full bg-white border border-sand focus:border-champagne rounded-lg px-4 py-2.5 text-charcoal text-sm outline-none transition-colors shadow-sm placeholder:text-sand custom-scrollbar resize-none" 
    />
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center cursor-pointer p-4 border border-sand rounded-xl bg-white shadow-sm hover:border-champagne/50 transition-colors">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={Boolean(checked)} onChange={onChange} />
      <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-champagne' : 'bg-sand'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
    </div>
    <div className="ml-3 text-sm font-medium text-charcoal">{label}</div>
  </label>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
    <select 
      value={value || ''} 
      onChange={onChange} 
      className="w-full bg-white border border-sand focus:border-champagne rounded-lg px-4 py-2.5 text-charcoal text-sm outline-none transition-colors shadow-sm appearance-none cursor-pointer"
      style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
    >
      <option value="" disabled>Выберите опцию</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
