import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    const fetchInvitation = async () => {
      try {
        const res = await fetch(`${API_URL}/invitations/${id}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch invitation');
        const resData = await res.json();
        const parsedData = typeof resData.invitation.data === 'string' 
          ? JSON.parse(resData.invitation.data) 
          : resData.invitation.data;
        setData(parsedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchInvitation();
  }, [id, user]);

  if (loading || authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Dev Toolbar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-4 py-2 flex justify-between items-center z-50">
        <span className="text-sm font-medium">Режим предпросмотра (Preview)</span>
        <button onClick={() => navigate(`/editor/${id}`)} className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
          Вернуться в редактор
        </button>
      </div>

      <div className="mt-12 max-w-2xl w-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100 p-8 text-center space-y-8">
        <div>
          <p className="text-gray-500 uppercase tracking-widest text-sm mb-2">Приглашаем на свадьбу</p>
          <h1 className="text-5xl font-serif text-gray-900 mb-2">
            {data.groom_name || 'Имя Жениха'} & {data.bride_name || 'Имя Невесты'}
          </h1>
        </div>

        <div className="py-8 border-t border-b border-gray-100 flex justify-center gap-8 text-gray-800">
          <div className="text-center">
            <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Дата</span>
            <span className="text-xl font-medium">{data.wedding_date || 'ДД.ММ.ГГГГ'}</span>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="text-center">
            <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Время</span>
            <span className="text-xl font-medium">{data.wedding_time || 'ЧЧ:ММ'}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Локация</h3>
          <p className="text-gray-600">{data.location || 'Место проведения не указано'}</p>
        </div>

        {data.story && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Наша история</h3>
            <p className="text-gray-600 italic">"{data.story}"</p>
          </div>
        )}

        {data.music && (
          <div className="bg-gray-50 p-4 rounded-md">
            <span className="text-sm text-gray-500 block mb-1">Фоновая музыка (Плейсхолдер)</span>
            <a href={data.music} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm">{data.music}</a>
          </div>
        )}

        {data.rsvp?.enabled && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-medium text-gray-900 mb-2">RSVP</h3>
            <p className="text-gray-600 mb-4">Пожалуйста, подтвердите ваше присутствие.</p>
            <button disabled className="bg-indigo-600 text-white px-6 py-2 rounded-md opacity-50 cursor-not-allowed">
              Форма сбора гостей (демо)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
