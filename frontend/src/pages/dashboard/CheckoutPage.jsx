import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || API_URL + '';

export default function CheckoutPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${orderId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch order');
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrder();
  }, [orderId, user]);

  const handlePay = async () => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fetch(API_URL + '/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order_id: orderId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payment');
      
      setPayment(data.payment);
      
      // If there's a redirect URL (like Click/Payme), we might redirect here in the future:
      // window.location.href = data.payment.redirect_url;
      
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!payment) return;
    setProcessing(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/dev/payments/${payment.id}/success`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Simulation failed');
      
      // Payment successful, order is paid, invitation created
      // Redirect straight to Editor or Dashboard
      navigate(`/editor/${data.invitation.id}`);
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (loading || authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Заказ не найден</div>;

  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center space-y-6">
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Оформление заказа</h2>
          <p className="text-gray-500">Заказ #{order.id.slice(0, 8)}</p>
        </div>

        <div className="bg-gray-50 rounded-md p-6 text-left space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <span className="text-gray-600">Шаблон:</span>
            <span className="font-medium text-gray-900">{order.template?.name || 'Неизвестен'}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-600 text-lg">К оплате:</span>
            <span className="text-2xl font-bold text-gray-900">
              {Number(order.amount).toLocaleString('ru-RU')} {order.currency}
            </span>
          </div>
        </div>

        {order.status !== 'pending' ? (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
            Этот заказ уже имеет статус: {order.status}
          </div>
        ) : !payment ? (
          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {processing ? 'Обработка...' : 'Оплатить'}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 text-blue-800 rounded border border-blue-100 flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Ожидаем оплату...
            </div>
            
            {isDev && (
              <button
                onClick={handleSimulateSuccess}
                disabled={processing}
                className="w-full flex justify-center py-2 px-4 border border-green-500 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {processing ? '...' : 'Simulate successful payment (Dev)'}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
