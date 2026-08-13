import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { CreditCard, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) ? import.meta.env.VITE_API_URL : (window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : `http://${window.location.hostname}:5000/api`);

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
    window.scrollTo(0, 0);
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
      
      navigate(`/editor/${data.invitation.id}`);
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">Подготовка заказа...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center px-4">
        <p className="text-red-700 font-serif text-xl mb-4 text-center">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-charcoal text-white rounded-full hover:bg-charcoal-light transition-colors">Вернуться в кабинет</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center px-4">
        <p className="text-charcoal-light font-serif text-xl mb-4 text-center">Заказ не найден</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-charcoal text-white rounded-full hover:bg-charcoal-light transition-colors">Вернуться в кабинет</button>
      </div>
    );
  }

  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-ivory font-sans pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center selection:bg-champagne selection:text-white">
      
      <div className="w-full max-w-lg">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-charcoal-light hover:text-champagne mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Вернуться в кабинет
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-charcoal/5 p-8 sm:p-12 border border-sand relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-champagne-light via-champagne to-champagne-light" />
          
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-3">Оформление заказа</h2>
            <p className="text-charcoal-light text-sm">Заказ <span className="font-mono bg-sand px-2 py-0.5 rounded ml-1">#{order.id.slice(0, 8)}</span></p>
          </div>

          <div className="bg-sand/30 rounded-2xl p-6 md:p-8 space-y-6 mb-10">
            <div className="flex justify-between items-center border-b border-sand pb-4">
              <span className="text-charcoal-light">Шаблон:</span>
              <span className="font-serif text-xl text-charcoal">{order.template?.name || 'Неизвестен'}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-charcoal-light text-lg">К оплате:</span>
              <span className="text-3xl font-serif text-charcoal">
                {Number(order.amount).toLocaleString('ru-RU')} {order.currency}
              </span>
            </div>
          </div>

          {order.status !== 'pending' ? (
            <div className="p-5 bg-champagne-light/50 text-charcoal rounded-2xl border border-champagne/50 text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-champagne" />
              <p className="font-medium">Этот заказ уже имеет статус: {order.status}</p>
              <button onClick={() => navigate('/dashboard')} className="mt-2 text-sm underline hover:text-champagne transition-colors">Перейти в панель</button>
            </div>
          ) : !payment ? (
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full shadow-lg text-lg font-medium text-ivory bg-charcoal hover:bg-charcoal-light focus:outline-none transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:transform-none"
            >
              {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              {processing ? 'Обработка...' : 'Перейти к оплате'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-6 bg-sand/50 rounded-2xl border border-sand flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="w-8 h-8 text-champagne animate-spin" />
                <p className="text-charcoal-light font-medium">Ожидаем подтверждение оплаты от платёжной системы...</p>
              </div>
              
              {isDev && (
                <button
                  onClick={handleSimulateSuccess}
                  disabled={processing}
                  className="w-full flex justify-center py-3 px-4 border-2 border-champagne rounded-full shadow-sm text-sm font-medium text-champagne bg-transparent hover:bg-champagne hover:text-white transition-colors mt-6"
                >
                  {processing ? '...' : '[DEV] Симулировать успешную оплату'}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
