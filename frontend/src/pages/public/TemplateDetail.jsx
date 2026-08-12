import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || API_URL + '';

export default function TemplateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`${API_URL}/templates/${slug}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Template not found');
          throw new Error('Failed to fetch template');
        }
        const data = await response.json();
        setTemplate(data.template);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [slug]);

  const handleBuy = async () => {
    if (!user) {
      // Redirect to login with returnUrl
      navigate(`/login?returnUrl=/templates/${slug}`);
      return;
    }

    setBuying(true);
    setError(null);
    try {
      const response = await fetch(API_URL + '/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: template.id }), // amount is explicitly omitted
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Instead of setting local order state, redirect to checkout
      navigate(`/checkout/${data.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBuying(false);
    }
  };

  if (loading || authLoading) return <div className="min-h-screen p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="min-h-screen p-8 text-center text-red-500">{error}</div>;
  if (!template) return <div className="min-h-screen p-8 text-center text-gray-500">Template not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg overflow-hidden flex flex-col md:flex-row">
        
        <div className="md:w-3/5 bg-gray-200">
          {template.preview_image ? (
            <img
              src={template.preview_image}
              alt={template.name}
              className="w-full h-full object-cover min-h-[400px]"
            />
          ) : (
            <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-indigo-50 text-indigo-300">
              <span className="text-lg font-medium">Нет полноразмерного превью</span>
            </div>
          )}
        </div>

        <div className="md:w-2/5 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 bg-indigo-50 rounded-full mb-3">
                  {template.category || 'Standard'}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
              </div>
            </div>
            
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {template.description || 'Описание отсутствует.'}
            </p>
            
            <div className="py-4 border-t border-b border-gray-100 mb-8">
              <p className="text-sm text-gray-500 mb-1">Стоимость шаблона</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {Number(template.price).toLocaleString('ru-RU')} {template.currency}
              </p>
            </div>
          </div>

          <button
            onClick={handleBuy}
            disabled={buying}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${
              buying ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
          >
            {buying ? 'Создание заказа...' : (user ? 'Купить' : 'Войти и купить')}
          </button>
        </div>
      </div>
    </div>
  );
}
