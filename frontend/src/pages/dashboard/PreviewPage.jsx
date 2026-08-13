import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`;

export default function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchInvitation = async () => {
      try {
        const res = await fetch(`${API_URL}/invitations/${id}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch invitation');
        const resData = await res.json();
        let parsedData = {};
        try {
          if (typeof resData.invitation.data === 'string') {
            parsedData = resData.invitation.data.trim() ? JSON.parse(resData.invitation.data) : {};
          } else {
            parsedData = resData.invitation.data || {};
          }
        } catch(e) {
          console.error("JSON parse error:", e);
          parsedData = {};
        }
        setData(parsedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchInvitation();
  }, [id, user]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">Загрузка превью...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center px-4">
        <p className="text-red-700 font-serif text-xl mb-4 text-center">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-charcoal text-white rounded-full">Вернуться в кабинет</button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-sand flex flex-col items-center pt-20 pb-12 px-0 md:px-6 lg:px-8 relative selection:bg-champagne selection:text-white">
      {/* Dev Toolbar */}
      <div className="fixed top-0 left-0 right-0 bg-charcoal text-ivory px-4 py-3 flex justify-between items-center z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
          <span className="text-xs md:text-sm font-medium tracking-wide uppercase">Режим предпросмотра</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/dashboard')} className="hidden sm:flex text-xs items-center gap-1 text-ivory/70 hover:text-ivory px-3 py-1.5 transition-colors">
            <ArrowLeft size={14} /> Кабинет
          </button>
          <button onClick={() => navigate(`/editor/${id}`)} className="text-xs md:text-sm flex items-center gap-2 bg-champagne hover:bg-champagne-light text-charcoal px-4 py-1.5 rounded-full font-medium transition-colors">
            <Edit2 size={14} /> <span className="hidden sm:inline">Вернуться в</span> Редактор
          </button>
        </div>
      </div>

      {/* Mockup Container to force mobile-like aspect ratio on desktop */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full md:max-w-md md:h-[800px] bg-ivory md:rounded-[2.5rem] shadow-2xl md:overflow-y-auto md:border-8 md:border-charcoal hide-scrollbar relative"
      >
        <div className="p-8 md:p-10 text-center space-y-10">
          <div>
            <p className="text-champagne uppercase tracking-widest text-xs font-semibold mb-3">Приглашаем на свадьбу</p>
            <h1 className="text-5xl font-serif text-charcoal mb-2 leading-none">
              {data.groom_name || 'Имя Жениха'} <br/>
              <span className="italic text-champagne">&</span><br/>
              {data.bride_name || 'Имя Невесты'}
            </h1>
          </div>

          <div className="py-6 border-y border-sand flex justify-center gap-8 text-charcoal-light">
            <div className="text-center">
              <span className="block text-xs uppercase tracking-widest mb-2 font-semibold">Дата</span>
              <span className="text-xl font-serif text-charcoal">{data.wedding_date || 'ДД.ММ.ГГГГ'}</span>
            </div>
            <div className="w-px bg-sand/80"></div>
            <div className="text-center">
              <span className="block text-xs uppercase tracking-widest mb-2 font-semibold">Время</span>
              <span className="text-xl font-serif text-charcoal">{data.wedding_time || 'ЧЧ:ММ'}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-champagne mb-3">Локация</h3>
            <p className="text-charcoal-light">{data.location || 'Место проведения не указано'}</p>
          </div>

          {data.story && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-champagne mb-3">Наша история</h3>
              <p className="text-charcoal-light italic font-serif text-lg leading-relaxed">"{data.story}"</p>
            </div>
          )}

          {data.rsvp?.enabled && (
            <div className="bg-sand/30 border border-sand rounded-2xl p-6 mt-8 text-left">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal mb-2 text-center">RSVP</h3>
              <p className="text-charcoal-light text-sm mb-6 text-center">Пожалуйста, подтвердите ваше присутствие до 1 Сентября.</p>
              
              <div className="space-y-3">
                <input type="text" placeholder="Ваше Имя и Фамилия" className="w-full bg-white border border-sand rounded-lg px-4 py-3 text-sm outline-none cursor-not-allowed opacity-70" disabled />
                <button disabled className="w-full bg-charcoal text-ivory px-6 py-3 rounded-full text-sm font-medium opacity-50 cursor-not-allowed">
                  Отправить ответ (Демо)
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
