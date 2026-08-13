import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ArrowLeft, Trash2, CheckCircle2, XCircle, Users, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RsvpDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [invitation, setInvitation] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`;
        const [invRes, rsvpRes] = await Promise.all([
          fetch(`${API_URL}/invitations/${id}`, { credentials: 'include' }),
          fetch(`${API_URL}/invitations/${id}/rsvp`, { credentials: 'include' })
        ]);

        if (!invRes.ok) throw new Error('Failed to fetch invitation');
        if (!rsvpRes.ok) throw new Error('Failed to fetch RSVPs');

        const invData = await invRes.json();
        const rsvpData = await rsvpRes.json();

        setInvitation(invData.invitation);
        setRsvps(rsvpData.rsvps);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [id, user]);

  const handleDelete = async (responseId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот ответ?')) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`;
      const res = await fetch(`${API_URL}/invitations/${id}/rsvp/${responseId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete RSVP');
      
      setRsvps(prev => prev.filter(r => r.id !== responseId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">Загрузка данных...</p>
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

  const totalResponses = rsvps.length;
  const totalAttending = rsvps.filter(r => r.attending).length;
  const totalNotAttending = totalResponses - totalAttending;
  const totalGuestsCount = rsvps.reduce((sum, r) => sum + r.guests_count, 0);

  return (
    <div className="min-h-screen bg-ivory font-sans pt-24 pb-24 selection:bg-champagne selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
          <div>
            <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-charcoal-light hover:text-champagne mb-3 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Вернуться в кабинет
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-charcoal mb-2">Ответы гостей</h1>
            <p className="text-charcoal-light">
              Для приглашения: {invitation?.template?.name || 'Без названия'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-sand shadow-sm text-center">
            <span className="block text-3xl font-serif text-charcoal mb-1">{totalResponses}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-light">Всего ответов</span>
          </div>
          <div className="bg-champagne/10 p-6 rounded-2xl border border-champagne/20 shadow-sm text-center">
            <span className="block text-3xl font-serif text-champagne mb-1">{totalAttending}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-light">Придут</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-sand shadow-sm text-center">
            <span className="block text-3xl font-serif text-charcoal-light mb-1">{totalNotAttending}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-light/70">Не придут</span>
          </div>
          <div className="bg-charcoal p-6 rounded-2xl border border-charcoal shadow-sm text-center text-ivory">
            <span className="block text-3xl font-serif mb-1">{totalGuestsCount}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-ivory/70">Всего гостей</span>
          </div>
        </div>

        {/* Responses List */}
        <div className="bg-white shadow-sm border border-sand rounded-3xl overflow-hidden">
          {rsvps.length === 0 ? (
            <div className="p-16 text-center text-charcoal-light">
              <Users className="w-12 h-12 mx-auto text-sand mb-4" />
              <p className="font-serif text-xl italic">Пока никто не ответил на приглашение.</p>
            </div>
          ) : (
            <ul className="divide-y divide-sand">
              {rsvps.map((rsvp, idx) => (
                <motion.li 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={rsvp.id} 
                  className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-sand/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-serif text-charcoal">{rsvp.guest_name}</h3>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                        rsvp.attending ? 'bg-champagne/20 text-champagne border border-champagne/30' : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {rsvp.attending ? <><CheckCircle2 size={12} /> Приду</> : <><XCircle size={12} /> Не приду</>}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal-light mb-3">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-sand-dark" /> Гостей: {rsvp.guests_count}
                      </span>
                      <span className="text-xs opacity-70">
                        {new Date(rsvp.created_at).toLocaleDateString('ru-RU')} в {new Date(rsvp.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {rsvp.message && (
                      <div className="mt-3 bg-sand/50 p-4 rounded-xl border border-sand">
                        <p className="text-sm text-charcoal italic flex gap-2">
                          <MessageSquare size={14} className="mt-0.5 text-champagne shrink-0" />
                          <span>"{rsvp.message}"</span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-sand">
                    <button 
                      onClick={() => handleDelete(rsvp.id)} 
                      className="flex items-center justify-center gap-2 w-full md:w-auto text-red-500 hover:text-white text-sm font-medium px-4 py-2 border border-red-200 rounded-full hover:bg-red-500 hover:border-red-500 transition-all"
                    >
                      <Trash2 size={16} /> Удалить
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
