import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

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
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || API_URL + '';
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
      const API_URL = import.meta.env.VITE_API_URL || API_URL + '';
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

  if (loading || authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const totalResponses = rsvps.length;
  const totalAttending = rsvps.filter(r => r.attending).length;
  const totalNotAttending = totalResponses - totalAttending;
  const totalGuestsCount = rsvps.reduce((sum, r) => sum + r.guests_count, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Ответы гостей
          </h1>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
            Назад
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Статистика</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded text-center">
              <span className="block text-2xl font-bold text-blue-700">{totalResponses}</span>
              <span className="text-sm text-blue-600">Всего ответов</span>
            </div>
            <div className="bg-green-50 p-4 rounded text-center">
              <span className="block text-2xl font-bold text-green-700">{totalAttending}</span>
              <span className="text-sm text-green-600">Придут</span>
            </div>
            <div className="bg-red-50 p-4 rounded text-center">
              <span className="block text-2xl font-bold text-red-700">{totalNotAttending}</span>
              <span className="text-sm text-red-600">Не придут</span>
            </div>
            <div className="bg-purple-50 p-4 rounded text-center">
              <span className="block text-2xl font-bold text-purple-700">{totalGuestsCount}</span>
              <span className="text-sm text-purple-600">Всего гостей</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {rsvps.length === 0 ? (
              <li className="p-6 text-center text-gray-500">Пока нет ответов</li>
            ) : (
              rsvps.map(rsvp => (
                <li key={rsvp.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{rsvp.guest_name}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      {rsvp.attending ? (
                        <span className="text-green-600 font-medium flex items-center">
                          <span className="mr-1">✓</span> Приду
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium flex items-center">
                          <span className="mr-1">✕</span> Не смогу прийти
                        </span>
                      )}
                      <span>Гостей: {rsvp.guests_count}</span>
                      <span>{new Date(rsvp.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    {rsvp.message && (
                      <p className="mt-2 text-sm text-gray-600 italic">"{rsvp.message}"</p>
                    )}
                  </div>
                  <div>
                    <button onClick={() => handleDelete(rsvp.id)} className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors">
                      Удалить
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
