import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import PreviewComponent from '../../components/preview/PreviewComponent.jsx';

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
  
  const [activeTab, setActiveTab] = useState('couple');
  const [lastUpdated, setLastUpdated] = useState(null);

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
          setError('Конфликт сохранения. Данные были изменены.');
        } else {
          throw new Error(resData.error || 'Failed to save');
        }
        return;
      }

      setLastUpdated(resData.invitation.updated_at);
      if (isManual) {
        setMessage('Сохранено');
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
    }, 1000);
  }, [lastUpdated]); // Depend on lastUpdated to ensure we send correct concurrency token

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
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!invitation || !data) return <div className="p-8 text-center text-red-500">Not found</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* HEADER */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">
            &larr; Назад
          </button>
          <h1 className="text-xl font-bold hidden sm:block">Редактор</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {error && <span className="text-red-500 text-sm hidden sm:inline-block">{error}</span>}
          {message && <span className="text-green-500 text-sm hidden sm:inline-block">{message}</span>}
          
          <button onClick={() => saveToServer(data, true)} disabled={saving} className="px-3 sm:px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 bg-white">
            {saving ? '...' : 'Сохранить'}
          </button>
          {invitation.status !== 'published' ? (
            <button onClick={handlePublish} className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700">
              Опубликовать
            </button>
          ) : (
             <a href={`/w/${invitation.slug}`} target="_blank" rel="noreferrer" className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700">
               Открыть
             </a>
          )}
        </div>
      </header>

      {/* MAIN EDITOR AREA */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* SETTINGS PANEL (LEFT/TOP) */}
        <div className="w-full md:w-1/3 lg:w-96 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
          <nav className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 shrink-0">
            {['couple', 'date', 'location', 'story', 'gallery', 'design', 'music', 'rsvp'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
          
          <div className="p-4 space-y-4 flex-1">
            {activeTab === 'couple' && (
              <>
                <Input label="Имя жениха" value={data.groom_name} onChange={e => handleChange(null, 'groom_name', e.target.value)} />
                <Input label="Имя невесты" value={data.bride_name} onChange={e => handleChange(null, 'bride_name', e.target.value)} />
              </>
            )}

            {activeTab === 'date' && (
              <>
                <Input type="date" label="Дата свадьбы" value={data.wedding_date} onChange={e => handleChange(null, 'wedding_date', e.target.value)} />
                <Input type="time" label="Сбор гостей" value={data.wedding_time} onChange={e => handleChange(null, 'wedding_time', e.target.value)} />
                <Input type="time" label="Церемония" value={data.ceremony_time} onChange={e => handleChange(null, 'ceremony_time', e.target.value)} />
                <Input type="time" label="Банкет" value={data.reception_time} onChange={e => handleChange(null, 'reception_time', e.target.value)} />
              </>
            )}

            {activeTab === 'location' && (
              <>
                <Input label="Название заведения" value={data.venue_name} onChange={e => handleChange(null, 'venue_name', e.target.value)} />
                <Input label="Адрес" value={data.address} onChange={e => handleChange(null, 'address', e.target.value)} />
                <Input type="url" label="Ссылка на карту (Yandex/Google)" value={data.map_url} onChange={e => handleChange(null, 'map_url', e.target.value)} />
              </>
            )}

            {activeTab === 'story' && (
              <>
                <Toggle label="Включить блок Истории" checked={data.story?.enabled} onChange={e => handleChange('story', 'enabled', e.target.checked)} />
                {data.story?.enabled && (
                  <>
                    <Input label="Заголовок" value={data.story?.story_title} onChange={e => handleChange('story', 'story_title', e.target.value)} />
                    <TextArea label="История" value={data.story?.story} onChange={e => handleChange('story', 'story', e.target.value)} />
                  </>
                )}
              </>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleMediaUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {media.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.url} className="h-24 w-full object-cover rounded" alt="gallery" />
                      <button onClick={() => handleMediaDelete(img.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'music' && (
              <>
                <Toggle label="Включить музыку" checked={data.music?.enabled} onChange={e => handleChange('music', 'enabled', e.target.checked)} />
                {data.music?.enabled && (
                  <>
                    <Input label="Название трека" value={data.music?.title} onChange={e => handleChange('music', 'title', e.target.value)} />
                    <Input type="url" label="Ссылка на трек (MP3)" value={data.music?.url} onChange={e => handleChange('music', 'url', e.target.value)} />
                  </>
                )}
              </>
            )}

            {activeTab === 'rsvp' && (
              <>
                <Toggle label="Включить форму подтверждения" checked={data.rsvp?.enabled} onChange={e => handleChange('rsvp', 'enabled', e.target.checked)} />
                {data.rsvp?.enabled && (
                  <>
                    <Input label="Заголовок" value={data.rsvp?.title} onChange={e => handleChange('rsvp', 'title', e.target.value)} />
                    <Input label="Описание" value={data.rsvp?.description} onChange={e => handleChange('rsvp', 'description', e.target.value)} />
                    <Input label="Текст кнопки" value={data.rsvp?.button_text} onChange={e => handleChange('rsvp', 'button_text', e.target.value)} />
                  </>
                )}
              </>
            )}

            {activeTab === 'design' && (
              <>
                <Select label="Тема" value={data.design?.theme} onChange={e => handleChange('design', 'theme', e.target.value)} options={[
                  {value: 'elegant', label: 'Elegant'},
                  {value: 'classic', label: 'Classic'},
                  {value: 'minimal', label: 'Minimal'}
                ]} />
                <Select label="Шрифт" value={data.design?.font} onChange={e => handleChange('design', 'font', e.target.value)} options={[
                  {value: 'serif', label: 'Serif'},
                  {value: 'sans', label: 'Sans-serif'},
                  {value: 'script', label: 'Script (Mono fallback)'}
                ]} />
                <div className="flex gap-4">
                  <Input type="color" label="Цвет 1" value={data.design?.primary_color} onChange={e => handleChange('design', 'primary_color', e.target.value)} />
                  <Input type="color" label="Цвет 2" value={data.design?.secondary_color} onChange={e => handleChange('design', 'secondary_color', e.target.value)} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* LIVE PREVIEW (RIGHT/BOTTOM) */}
        <div className="flex-1 bg-gray-200 overflow-y-auto flex items-start justify-center p-4">
          <div className="w-[390px] min-h-[844px] bg-white shadow-2xl rounded-3xl overflow-hidden border-8 border-gray-900 shrink-0 transform scale-75 md:scale-90 origin-top">
            <PreviewComponent data={data} media={media} />
          </div>
        </div>

      </div>
    </div>
  );
}

// UI Helpers
const Input = ({ label, type="text", value, onChange }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type={type} value={value || ''} onChange={onChange} className="w-full border-gray-300 rounded shadow-sm p-2 text-sm border focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea rows={3} value={value || ''} onChange={onChange} className="w-full border-gray-300 rounded shadow-sm p-2 text-sm border focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center mb-4">
    <input type="checkbox" checked={Boolean(checked)} onChange={onChange} className="h-4 w-4 text-indigo-600 rounded border-gray-300" />
    <label className="ml-2 block text-sm font-medium text-gray-700">{label}</label>
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select value={value || ''} onChange={onChange} className="w-full border-gray-300 rounded shadow-sm p-2 text-sm border bg-white focus:ring-indigo-500 focus:border-indigo-500">
      <option value="">По умолчанию</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
