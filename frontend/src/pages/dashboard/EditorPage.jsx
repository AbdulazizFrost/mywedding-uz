import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import PreviewComponent from '../../components/preview/PreviewComponent.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Globe, Smartphone, User, Calendar, MapPin, BookOpen, Image as ImageIcon, Music, CheckSquare, Palette, Upload, Trash2, LayoutTemplate, ExternalLink, X, ChevronDown, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`;

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
  
  // Mobile specific state
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [showDesktopPreview, setShowDesktopPreview] = useState(true); // Toggle for desktop small screens

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
          setError('Конфликт сохранения. Данные изменены на другом устройстве.');
        } else {
          throw new Error(resData.error || 'Failed to save');
        }
        return;
      }

      setLastUpdated(resData.invitation.updated_at);
      if (isManual) {
        setMessage('Сохранено');
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (isManual) setSaving(false);
    }
  };

  const autosaveTimeout = useRef(null);
  const triggerAutosave = useCallback(() => {
    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    autosaveTimeout.current = setTimeout(() => {
      saveToServer(dataRef.current);
    }, 1500);
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
      setMessage('Опубликовано!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[100dvh] bg-ivory flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-charcoal border-t-transparent rounded-full animate-spin mb-4" />
      </div>
    );
  }
  
  if (!invitation || !data) {
    return (
      <div className="min-h-[100dvh] bg-ivory flex flex-col items-center justify-center">
        <p className="font-serif text-charcoal text-xl">Приглашение не найдено</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-2 bg-charcoal text-ivory rounded-full">В кабинет</button>
      </div>
    );
  }

  const categories = {
    main: {
      label: 'Основное',
      icon: LayoutTemplate,
      tabs: [
        { id: 'couple', label: 'Имена', icon: User },
        { id: 'date', label: 'Дата и Время', icon: Calendar },
        { id: 'location', label: 'Место проведения', icon: MapPin },
        { id: 'design', label: 'Дизайн', icon: Palette }
      ]
    },
    media: {
      label: 'Медиа',
      icon: ImageIcon,
      tabs: [
        { id: 'gallery', label: 'Галерея фото', icon: ImageIcon },
        { id: 'music', label: 'Музыка', icon: Music }
      ]
    },
    extra: {
      label: 'Блоки',
      icon: BookOpen,
      tabs: [
        { id: 'story', label: 'История', icon: BookOpen },
        { id: 'rsvp', label: 'Форма RSVP', icon: CheckSquare }
      ]
    }
  };

  const handleMobileCategoryClick = (key) => {
    setActiveCategory(key);
    setActiveTab(categories[key].tabs[0].id);
    setMobileSheetOpen(true);
  };

  // The actual editor fields form
  const EditorForm = () => (
    <div className="space-y-6 pb-32">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {/* MAIN */}
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
              <Input type="url" label="Ссылка на карту" placeholder="https://yandex.uz/maps/..." value={data.map_url} onChange={e => handleChange(null, 'map_url', e.target.value)} />
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
              <Select label="Шрифт" value={data.design?.font} onChange={e => handleChange('design', 'font', e.target.value)} options={[
                {value: 'serif', label: 'С засечками (Cormorant)'},
                {value: 'sans', label: 'Без засечек (Inter)'},
                {value: 'script', label: 'Рукописный'}
              ]} />
              <div className="p-4 bg-sand/30 rounded-xl space-y-4">
                <p className="text-sm font-medium text-charcoal">Кастомные цвета</p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-charcoal-light mb-1">Фон/Текст</label>
                    <input type="color" className="w-full h-10 rounded cursor-pointer border border-sand" value={data.design?.primary_color || '#000000'} onChange={e => handleChange('design', 'primary_color', e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-charcoal-light mb-1">Акцент</label>
                    <input type="color" className="w-full h-10 rounded cursor-pointer border border-sand" value={data.design?.secondary_color || '#d4af37'} onChange={e => handleChange('design', 'secondary_color', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MEDIA */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-charcoal/20 bg-ivory/50 rounded-2xl p-6 text-center hover:bg-sand/30 transition-colors relative cursor-pointer group">
                <Upload className="w-8 h-8 text-charcoal mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium text-charcoal">Загрузить фото</p>
                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="" />
              </div>
              
              {media.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {media.map((img) => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-sand">
                      <img src={img.url} className="w-full h-full object-cover" alt="gallery" />
                      <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleMediaDelete(img.id)} className="bg-white text-red-500 rounded-full p-2 shadow-lg">
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
              <Toggle label="Включить музыку" checked={data.music?.enabled} onChange={e => handleChange('music', 'enabled', e.target.checked)} />
              {data.music?.enabled && (
                <div className="space-y-5 pt-2">
                  <Input label="Название трека" placeholder="A Thousand Years" value={data.music?.title} onChange={e => handleChange('music', 'title', e.target.value)} />
                  <Input type="url" label="URL (.mp3)" placeholder="https://example.com/music.mp3" value={data.music?.url} onChange={e => handleChange('music', 'url', e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* EXTRA */}
          {activeTab === 'story' && (
            <div className="space-y-5">
              <Toggle label="Отображать 'Историю любви'" checked={data.story?.enabled} onChange={e => handleChange('story', 'enabled', e.target.checked)} />
              {data.story?.enabled && (
                <div className="space-y-5 pt-2">
                  <Input label="Заголовок" placeholder="Наша история" value={data.story?.story_title} onChange={e => handleChange('story', 'story_title', e.target.value)} />
                  <TextArea label="Текст" rows={6} placeholder="Всё началось..." value={data.story?.story} onChange={e => handleChange('story', 'story', e.target.value)} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'rsvp' && (
            <div className="space-y-5">
              <Toggle label="Включить форму RSVP" checked={data.rsvp?.enabled} onChange={e => handleChange('rsvp', 'enabled', e.target.checked)} />
              {data.rsvp?.enabled && (
                <div className="space-y-5 pt-2">
                  <Input label="Заголовок" placeholder="Ждём ответа" value={data.rsvp?.title} onChange={e => handleChange('rsvp', 'title', e.target.value)} />
                  <TextArea label="Описание" placeholder="Подтвердите до..." value={data.rsvp?.description} onChange={e => handleChange('rsvp', 'description', e.target.value)} />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex flex-col h-[100dvh] bg-ivory font-sans overflow-hidden w-full relative">
      
      {/* GLOBAL HEADER */}
      <header className="flex-shrink-0 h-[60px] bg-white border-b border-sand px-3 sm:px-6 flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 text-charcoal-light hover:text-charcoal rounded-full hover:bg-sand transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-px bg-sand mx-1" />
          <h1 className="font-serif text-sm sm:text-lg text-charcoal truncate max-w-[120px] sm:max-w-xs">
            {invitation.template?.name || 'Редактор'}
          </h1>
        </div>
        
        {/* Toast Notification */}
        <AnimatePresence>
          {(message || error) && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute left-1/2 -translate-x-1/2 top-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg text-[10px] sm:text-xs font-medium tracking-wide z-50 flex items-center gap-2 whitespace-nowrap
                ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}
            >
              {error || message}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => saveToServer(data, true)} 
            disabled={saving} 
            className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full sm:rounded-full bg-sand text-charcoal hover:bg-champagne hover:text-white transition-colors"
          >
            <Save size={16} />
            <span className="hidden sm:inline ml-2 text-sm font-medium">{saving ? '...' : 'Сохранить'}</span>
          </button>
          
          {invitation.status !== 'published' ? (
            <button 
              onClick={handlePublish} 
              className="flex items-center justify-center px-3 sm:px-5 py-1.5 sm:py-2 bg-charcoal text-ivory rounded-full text-xs sm:text-sm font-medium hover:bg-charcoal-light shadow-md"
            >
              <Globe size={14} className="sm:mr-2" />
              <span className="hidden sm:inline">Опубликовать</span>
            </button>
          ) : (
             <a 
               href={`/w/${invitation.slug}`} 
               target="_blank" 
               rel="noreferrer" 
               className="flex items-center justify-center px-3 sm:px-5 py-1.5 sm:py-2 bg-green-700 text-white rounded-full text-xs sm:text-sm font-medium shadow-md"
             >
               <ExternalLink size={14} className="sm:mr-2" />
               <span className="hidden sm:inline">Сайт готов</span>
             </a>
          )}
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex flex-1 overflow-hidden relative w-full h-[calc(100dvh-60px)]">
        
        {/* DESKTOP SIDEBAR (Hidden on mobile) */}
        <div className="hidden lg:flex w-[400px] flex-col bg-white border-r border-sand h-full z-10 shrink-0">
          <div className="flex p-4 gap-2 border-b border-sand">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveCategory(key);
                  setActiveTab(cat.tabs[0].id);
                }}
                className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all
                  ${activeCategory === key ? 'bg-charcoal text-ivory shadow-sm' : 'bg-sand text-charcoal hover:bg-champagne/20'}`}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="px-4 pt-4 shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories[activeCategory].tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap
                    ${activeTab === tab.id ? 'bg-champagne/10 text-charcoal border border-champagne/30' : 'text-charcoal-light hover:bg-sand'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <EditorForm />
          </div>
        </div>

        {/* PREVIEW AREA (Full screen on mobile, right panel on desktop) */}
        <div className="flex-1 bg-sand/30 relative h-full flex flex-col items-center justify-center lg:p-8 overflow-hidden">
          
          {/* Mobile Full Screen Preview Wrapper */}
          <div className="w-full h-full lg:hidden relative bg-white overflow-y-auto overflow-x-hidden no-scrollbar">
            <PreviewComponent data={data} media={media} />
            {/* Overlay gradient at bottom so buttons are visible */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/90 to-transparent pointer-events-none z-10" />
          </div>

          {/* Desktop Mockup Preview Wrapper */}
          <div className="hidden lg:flex w-full max-w-[400px] aspect-[9/19.5] max-h-full bg-white shadow-2xl rounded-[3rem] overflow-hidden border-[12px] border-charcoal shrink-0 relative flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-charcoal rounded-b-3xl z-50 pointer-events-none" />
            <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
               <PreviewComponent data={data} media={media} />
            </div>
          </div>

        </div>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-sand pb-safe z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-around p-3 px-6 h-[72px]">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => handleMobileCategoryClick(key)}
                className="flex flex-col items-center gap-1.5 p-2 text-charcoal-light hover:text-charcoal transition-colors w-20"
              >
                <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center">
                  <cat.icon size={20} className={activeCategory === key && mobileSheetOpen ? "text-champagne" : "text-charcoal"} />
                </div>
                <span className="text-[10px] font-medium tracking-wide uppercase">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MOBILE BOTTOM SHEET FOR EDITING */}
        <AnimatePresence>
          {mobileSheetOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setMobileSheetOpen(false)}
                className="lg:hidden fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-40"
              />
              
              {/* Sheet */}
              <motion.div 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col max-h-[85dvh]"
              >
                {/* Handle */}
                <div className="w-full flex justify-center pt-3 pb-2" onClick={() => setMobileSheetOpen(false)}>
                  <div className="w-12 h-1.5 bg-sand rounded-full" />
                </div>
                
                {/* Header */}
                <div className="px-6 py-2 flex justify-between items-center border-b border-sand">
                  <h3 className="font-serif text-lg text-charcoal">{categories[activeCategory].label}</h3>
                  <button onClick={() => setMobileSheetOpen(false)} className="p-2 bg-sand rounded-full text-charcoal">
                    <Check size={16} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="px-4 py-3 shrink-0 bg-ivory/50 border-b border-sand">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {categories[activeCategory].tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap shrink-0
                          ${activeTab === tab.id ? 'bg-charcoal text-ivory shadow-sm' : 'bg-white border border-sand text-charcoal'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 pb-safe mb-10 custom-scrollbar">
                  <EditorForm />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
      className="w-full bg-white border border-sand focus:border-champagne rounded-xl px-4 py-3 text-charcoal text-[16px] outline-none transition-all shadow-sm placeholder:text-sand" 
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
      className="w-full bg-white border border-sand focus:border-champagne rounded-xl px-4 py-3 text-charcoal text-[16px] outline-none transition-all shadow-sm placeholder:text-sand custom-scrollbar resize-none" 
    />
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer p-4 border border-sand rounded-xl bg-white shadow-sm hover:border-champagne/30 transition-colors">
    <div className="text-[16px] font-medium text-charcoal">{label}</div>
    <div className="relative shrink-0">
      <input type="checkbox" className="sr-only" checked={Boolean(checked)} onChange={onChange} />
      <div className={`block w-12 h-7 rounded-full transition-colors ${checked ? 'bg-champagne' : 'bg-sand'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform shadow-sm ${checked ? 'transform translate-x-5' : ''}`}></div>
    </div>
  </label>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
    <select 
      value={value || ''} 
      onChange={onChange} 
      className="w-full bg-white border border-sand focus:border-champagne rounded-xl px-4 py-3 text-charcoal text-[16px] outline-none transition-all shadow-sm appearance-none cursor-pointer"
      style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
    >
      <option value="" disabled>Выберите опцию</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
