import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import PreviewComponent from '../../components/preview/PreviewComponent.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Save, Globe, Smartphone, User, Calendar, MapPin, 
  BookOpen, Image as ImageIcon, Music, CheckSquare, Palette, 
  Upload, Trash2, LayoutTemplate, ExternalLink, X, ChevronDown, 
  Check, Copy, Loader2, RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) ? import.meta.env.VITE_API_URL : (window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : `http://${window.location.hostname}:5000/api`);

// PREMIUM UI HELPERS DECLARED AT MODULE LEVEL SO REACT NEVER REMOUNTS INPUTS
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

const Select = ({ label, value, onChange, options, selectOptionText = "Выберите опцию" }) => (
  <div>
    <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
    <select 
      value={value || ''} 
      onChange={onChange} 
      className="w-full bg-white border border-sand focus:border-champagne rounded-xl px-4 py-3 text-charcoal text-[16px] outline-none transition-all shadow-sm appearance-none cursor-pointer"
      style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
    >
      <option value="" disabled>{selectOptionText}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// EDITOR FORM DECLARED AT MODULE LEVEL TO PREVENT REMOUNTING ON KEYSTROKES
function EditorForm({ 
  activeTab, 
  data, 
  handleChange, 
  media, 
  handleMediaUpload, 
  handleMediaDelete, 
  handleMusicUpload,
  uploadingMusic,
  uploadingPhoto,
  t 
}) {
  if (!data) return null;

  return (
    <div className="space-y-6 pb-28">
      {/* MAIN - COUPLE */}
      {activeTab === 'couple' && (
        <div className="space-y-5">
          <Input 
            label={t('editor.groomName')} 
            placeholder={t('editor.groomPlaceholder')} 
            value={data.groom_name} 
            onChange={e => handleChange(null, 'groom_name', e.target.value)} 
          />
          <Input 
            label={t('editor.brideName')} 
            placeholder={t('editor.bridePlaceholder')} 
            value={data.bride_name} 
            onChange={e => handleChange(null, 'bride_name', e.target.value)} 
          />
        </div>
      )}

      {/* MAIN - DATE & TIME */}
      {activeTab === 'date' && (
        <div className="space-y-5">
          <Input 
            type="date" 
            label={t('editor.weddingDate')} 
            value={data.wedding_date} 
            onChange={e => handleChange(null, 'wedding_date', e.target.value)} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="time" 
              label={t('editor.gathering')} 
              value={data.wedding_time} 
              onChange={e => handleChange(null, 'wedding_time', e.target.value)} 
            />
            <Input 
              type="time" 
              label={t('editor.ceremony')} 
              value={data.ceremony_time} 
              onChange={e => handleChange(null, 'ceremony_time', e.target.value)} 
            />
          </div>
          <Input 
            type="time" 
            label={t('editor.reception')} 
            value={data.reception_time} 
            onChange={e => handleChange(null, 'reception_time', e.target.value)} 
          />
        </div>
      )}

      {/* MAIN - LOCATION */}
      {activeTab === 'location' && (
        <div className="space-y-5">
          <Input 
            label={t('editor.venueName')} 
            placeholder={t('editor.venuePlaceholder')} 
            value={data.venue_name} 
            onChange={e => handleChange(null, 'venue_name', e.target.value)} 
          />
          <TextArea 
            label={t('editor.address')} 
            placeholder={t('editor.addressPlaceholder')} 
            value={data.address} 
            onChange={e => handleChange(null, 'address', e.target.value)} 
          />
          <Input 
            type="url" 
            label={t('editor.mapUrl')} 
            placeholder={t('editor.mapUrlPlaceholder')} 
            value={data.map_url} 
            onChange={e => handleChange(null, 'map_url', e.target.value)} 
          />
        </div>
      )}
      
      {/* MAIN - DESIGN */}
      {activeTab === 'design' && (
        <div className="space-y-6">
          <Select 
            label={t('editor.theme')} 
            value={data.design?.theme} 
            onChange={e => handleChange('design', 'theme', e.target.value)} 
            selectOptionText={t('editor.selectOption')}
            options={[
              {value: 'elegant', label: t('editor.themeElegant')},
              {value: 'classic', label: t('editor.themeClassic')},
              {value: 'minimal', label: t('editor.themeMinimal')},
              {value: 'dark', label: t('editor.themeDark')}
            ]} 
          />
          <Select 
            label={t('editor.font')} 
            value={data.design?.font} 
            onChange={e => handleChange('design', 'font', e.target.value)} 
            selectOptionText={t('editor.selectOption')}
            options={[
              {value: 'serif', label: t('editor.fontSerif')},
              {value: 'sans', label: t('editor.fontSans')},
              {value: 'script', label: t('editor.fontScript')}
            ]} 
          />
          <div className="p-4 bg-sand/30 rounded-xl space-y-4 border border-sand">
            <p className="text-sm font-medium text-charcoal">{t('editor.customColors')}</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-charcoal-light mb-1">{t('editor.colorBgText')}</label>
                <input 
                  type="color" 
                  className="w-full h-10 rounded cursor-pointer border border-sand" 
                  value={data.design?.primary_color || '#000000'} 
                  onChange={e => handleChange('design', 'primary_color', e.target.value)} 
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-charcoal-light mb-1">{t('editor.colorAccent')}</label>
                <input 
                  type="color" 
                  className="w-full h-10 rounded cursor-pointer border border-sand" 
                  value={data.design?.secondary_color || '#d4af37'} 
                  onChange={e => handleChange('design', 'secondary_color', e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEDIA - GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-charcoal/20 bg-ivory/50 rounded-2xl p-6 text-center hover:bg-sand/30 transition-colors relative cursor-pointer group">
            {uploadingPhoto ? (
              <Loader2 className="w-8 h-8 text-champagne mx-auto mb-2 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-charcoal mx-auto mb-2 opacity-50" />
            )}
            <p className="text-sm font-medium text-charcoal">
              {uploadingPhoto ? (t('editor.uploading') || 'Загрузка...') : t('editor.uploadPhoto')}
            </p>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              disabled={uploadingPhoto}
              onChange={handleMediaUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
              title="" 
            />
          </div>
          
          {media.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {media.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border border-sand shadow-sm">
                  <img src={img.url} className="w-full h-full object-cover" alt="gallery" />
                  <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleMediaDelete(img.id)} className="bg-white text-red-500 rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MEDIA - MUSIC */}
      {activeTab === 'music' && (
        <div className="space-y-5">
          <Toggle 
            label={t('editor.enableMusic')} 
            checked={data.music?.enabled} 
            onChange={e => handleChange('music', 'enabled', e.target.checked)} 
          />
          {data.music?.enabled && (
            <div className="space-y-5 pt-2">
              
              {/* Upload MP3 File */}
              <div className="border-2 border-dashed border-charcoal/20 bg-ivory/50 rounded-2xl p-5 text-center hover:bg-sand/30 transition-colors relative cursor-pointer group">
                {uploadingMusic ? (
                  <Loader2 className="w-7 h-7 text-champagne mx-auto mb-2 animate-spin" />
                ) : (
                  <Music className="w-7 h-7 text-charcoal mx-auto mb-2 opacity-60" />
                )}
                <p className="text-sm font-medium text-charcoal">
                  {uploadingMusic ? (t('editor.uploading') || 'Загрузка музыки...') : (t('editor.uploadAudioBtn') || 'Загрузить MP3 с устройства')}
                </p>
                <p className="text-xs text-charcoal-light/70 mt-1">MP3, WAV, M4A, OGG (до 25 MB)</p>
                <input 
                  type="file" 
                  accept="audio/*,.mp3,.wav,.ogg,.m4a" 
                  disabled={uploadingMusic}
                  onChange={handleMusicUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
              </div>

              <Input 
                label={t('editor.trackName')} 
                placeholder={t('editor.trackPlaceholder')} 
                value={data.music?.title} 
                onChange={e => handleChange('music', 'title', e.target.value)} 
              />
              <Input 
                type="url" 
                label={t('editor.trackUrl')} 
                placeholder={t('editor.trackUrlPlaceholder')} 
                value={data.music?.url} 
                onChange={e => handleChange('music', 'url', e.target.value)} 
              />
              
              {data.music?.url && (
                <div className="p-3 bg-sand/30 rounded-xl border border-sand flex items-center justify-between text-xs text-charcoal">
                  <div className="flex items-center gap-2 truncate">
                    <Music size={14} className="text-champagne shrink-0" />
                    <span className="truncate">{data.music.title || 'Трек выбран'}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleChange('music', 'url', '');
                      handleChange('music', 'title', '');
                    }}
                    className="text-red-500 hover:text-red-700 ml-2 font-medium shrink-0"
                  >
                    {t('editor.remove') || 'Удалить'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* EXTRA - STORY */}
      {activeTab === 'story' && (
        <div className="space-y-5">
          <Toggle 
            label={t('editor.showLoveStory')} 
            checked={data.story?.enabled} 
            onChange={e => handleChange('story', 'enabled', e.target.checked)} 
          />
          {data.story?.enabled && (
            <div className="space-y-5 pt-2">
              <Input 
                label={t('editor.title')} 
                placeholder={t('editor.storyPlaceholder')} 
                value={data.story?.story_title} 
                onChange={e => handleChange('story', 'story_title', e.target.value)} 
              />
              <TextArea 
                label={t('editor.text')} 
                rows={6} 
                placeholder={t('editor.textPlaceholder')} 
                value={data.story?.story} 
                onChange={e => handleChange('story', 'story', e.target.value)} 
              />
            </div>
          )}
        </div>
      )}

      {/* EXTRA - RSVP */}
      {activeTab === 'rsvp' && (
        <div className="space-y-5">
          <Toggle 
            label={t('editor.enableRsvp')} 
            checked={data.rsvp?.enabled} 
            onChange={e => handleChange('rsvp', 'enabled', e.target.checked)} 
          />
          {data.rsvp?.enabled && (
            <div className="space-y-5 pt-2">
              <Input 
                label={t('editor.title')} 
                placeholder={t('editor.rsvpPlaceholder')} 
                value={data.rsvp?.title} 
                onChange={e => handleChange('rsvp', 'title', e.target.value)} 
              />
              <TextArea 
                label={t('editor.description')} 
                placeholder={t('editor.descPlaceholder')} 
                value={data.rsvp?.description} 
                onChange={e => handleChange('rsvp', 'description', e.target.value)} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  const [invitation, setInvitation] = useState(null);
  const [data, setData] = useState(null);
  const [media, setMedia] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const [activeCategory, setActiveCategory] = useState('main'); // main, media, extra
  const [activeTab, setActiveTab] = useState('couple');
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Mobile specific state
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

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
        
        let parsedData = {};
        try {
          if (typeof inv.data === 'string') {
            parsedData = inv.data.trim() ? JSON.parse(inv.data) : {};
          } else {
            parsedData = inv.data || {};
          }
        } catch (e) {
          console.error("JSON parse error:", e);
          parsedData = {};
        }
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
          setError(t('editor.conflict'));
        } else {
          throw new Error(resData.error || 'Failed to save');
        }
        return;
      }

      setLastUpdated(resData.invitation.updated_at);
      if (isManual) {
        setMessage(t('editor.saved'));
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

  const handleChange = useCallback((section, field, value) => {
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
  }, [triggerAutosave]);

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingPhoto(true);
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
      setMessage(t('editor.photoUploaded') || 'Фото добавлено');
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleMusicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingMusic(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'music');

    try {
      const res = await fetch(`${API_URL}/invitations/${id}/media`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Audio upload failed');
      
      const trackTitle = file.name.replace(/\.[^/.]+$/, "");
      setData(prev => {
        const next = { ...prev };
        next.music = {
          ...(next.music || {}),
          enabled: true,
          title: next.music?.title || trackTitle,
          url: resData.media.url
        };
        return next;
      });
      triggerAutosave();
      setMessage(t('editor.musicUploaded') || 'Аудиофайл успешно загружен');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingMusic(false);
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
      setMessage(t('editor.published'));
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnpublish = async () => {
    try {
      const res = await fetch(`${API_URL}/invitations/${id}/unpublish`, {
        method: 'POST', credentials: 'include'
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to unpublish');
      setInvitation(resData.invitation);
      setMessage(t('editor.unpublished') || 'Снято с публикации');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopyLink = () => {
    if (!invitation?.slug) return;
    const url = `${window.location.origin}/w/${invitation.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setMessage(t('editor.linkCopied') || 'Ссылка скопирована');
      setTimeout(() => setMessage(null), 2500);
    }).catch(() => {
      prompt('Ссылка на приглашение:', url);
    });
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
        <p className="font-serif text-charcoal text-xl">{t('editor.notFound')}</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-2 bg-charcoal text-ivory rounded-full">{t('editor.backToCabinet')}</button>
      </div>
    );
  }

  const categories = {
    main: {
      label: t('editor.main'),
      icon: LayoutTemplate,
      tabs: [
        { id: 'couple', label: t('editor.names'), icon: User },
        { id: 'date', label: t('editor.dateAndTime'), icon: Calendar },
        { id: 'location', label: t('editor.location'), icon: MapPin },
        { id: 'design', label: t('editor.design'), icon: Palette }
      ]
    },
    media: {
      label: t('editor.media'),
      icon: ImageIcon,
      tabs: [
        { id: 'gallery', label: t('editor.gallery'), icon: ImageIcon },
        { id: 'music', label: t('editor.music'), icon: Music }
      ]
    },
    extra: {
      label: t('editor.blocks'),
      icon: BookOpen,
      tabs: [
        { id: 'story', label: t('editor.story'), icon: BookOpen },
        { id: 'rsvp', label: t('editor.rsvpForm'), icon: CheckSquare }
      ]
    }
  };

  const handleMobileCategoryClick = (key) => {
    setActiveCategory(key);
    setActiveTab(categories[key].tabs[0].id);
    setMobileSheetOpen(true);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-ivory font-sans overflow-hidden w-full relative">
      
      {/* GLOBAL HEADER */}
      <header className="flex-shrink-0 h-[60px] bg-white border-b border-sand px-3 sm:px-6 flex items-center justify-between z-40 relative shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 text-charcoal-light hover:text-charcoal rounded-full hover:bg-sand transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-px bg-sand mx-1" />
          <h1 className="font-serif text-sm sm:text-lg text-charcoal truncate max-w-[120px] sm:max-w-xs">
            {invitation.template?.name || t('editor.titleEditor')}
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
            className="flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-sand text-charcoal hover:bg-champagne hover:text-white transition-colors text-xs sm:text-sm font-medium"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span className="hidden sm:inline ml-1.5">{saving ? t('editor.saving') : t('editor.save')}</span>
          </button>
          
          {invitation.status !== 'published' ? (
            <button 
              onClick={handlePublish} 
              className="flex items-center justify-center px-3 sm:px-5 py-1.5 sm:py-2 bg-charcoal text-ivory rounded-full text-xs sm:text-sm font-medium hover:bg-charcoal-light shadow-md transition-colors"
            >
              <Globe size={14} className="sm:mr-1.5" />
              <span className="hidden sm:inline">{t('editor.publish')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleCopyLink}
                title={t('editor.copyLink') || 'Скопировать ссылку'}
                className="p-2 bg-sand text-charcoal hover:bg-champagne hover:text-white rounded-full transition-colors"
              >
                <Copy size={15} />
              </button>
              
              <a 
                href={`/w/${invitation.slug}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 bg-green-700 text-white rounded-full text-xs sm:text-sm font-medium shadow-md hover:bg-green-800 transition-colors"
              >
                <ExternalLink size={14} className="sm:mr-1.5" />
                <span className="hidden sm:inline">{t('editor.siteReady')}</span>
              </a>

              <button
                onClick={handleUnpublish}
                title={t('editor.unpublish') || 'Снять с публикации'}
                className="p-2 text-charcoal-light hover:text-red-600 rounded-full hover:bg-sand transition-colors"
              >
                <RefreshCw size={15} />
              </button>
            </div>
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
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap shrink-0
                    ${activeTab === tab.id ? 'bg-champagne/10 text-charcoal border border-charcoal/20' : 'text-charcoal-light hover:bg-sand'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <EditorForm 
              activeTab={activeTab} 
              data={data} 
              handleChange={handleChange} 
              media={media} 
              handleMediaUpload={handleMediaUpload} 
              handleMediaDelete={handleMediaDelete}
              handleMusicUpload={handleMusicUpload}
              uploadingMusic={uploadingMusic}
              uploadingPhoto={uploadingPhoto}
              t={t}
            />
          </div>
        </div>

        {/* PREVIEW AREA (Full screen on mobile, cleanly scaled inside mockup on desktop) */}
        <div className="flex-1 bg-sand/30 relative h-full flex flex-col items-center justify-center p-4 lg:p-6 overflow-hidden">
          
          {/* Mobile Full Screen Preview Wrapper */}
          <div className="w-full h-full lg:hidden relative bg-white overflow-y-auto overflow-x-hidden no-scrollbar">
            <PreviewComponent data={data} media={media} />
            {/* Overlay gradient at bottom so buttons are visible */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/90 to-transparent pointer-events-none z-10" />
          </div>

          {/* Desktop Elegant Mockup Preview Wrapper (Clean, no huge black notch protruding, perfectly fits height) */}
          <div className="hidden lg:flex w-[380px] h-[calc(100%-1.5rem)] max-h-[720px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-[2.5rem] overflow-hidden border-[6px] border-charcoal/80 shrink-0 relative flex-col">
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
                  <EditorForm 
                    activeTab={activeTab} 
                    data={data} 
                    handleChange={handleChange} 
                    media={media} 
                    handleMediaUpload={handleMediaUpload} 
                    handleMediaDelete={handleMediaDelete}
                    handleMusicUpload={handleMusicUpload}
                    uploadingMusic={uploadingMusic}
                    uploadingPhoto={uploadingPhoto}
                    t={t}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
