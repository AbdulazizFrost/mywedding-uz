import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Settings, LogOut, Plus, Edit2, Eye, ExternalLink, CreditCard } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DashboardPage() {
  const { user, loading, fetchMe } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);
      const [ordersRes, invRes] = await Promise.all([
        fetch(API_URL + '/orders', { credentials: 'include' }),
        fetch(API_URL + '/invitations', { credentials: 'include' })
      ]);
      if (ordersRes.ok) setOrders((await ordersRes.json()).orders);
      if (invRes.ok) setInvitations((await invRes.json()).invitations);
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(API_URL + '/auth/logout', { method: 'POST', credentials: 'include' });
    await fetchMe();
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">Загрузка студии...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory font-sans pt-24 pb-24 selection:bg-champagne selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 border-b border-sand pb-8"
        >
          <div>
            <h1 className="text-4xl font-serif text-charcoal mb-2">Личный кабинет</h1>
            <p className="text-charcoal-light tracking-wide">{user.full_name || user.email}</p>
          </div>
          <div className="mt-6 sm:mt-0 flex gap-4">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-5 py-2.5 border border-charcoal/20 rounded-full text-sm font-medium text-charcoal hover:bg-sand transition-colors"
            >
              <LogOut size={16} /> Выйти
            </button>
            <Link 
              to="/catalog"
              className="flex items-center gap-2 px-6 py-2.5 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-champagne transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={16} /> Создать
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content: Invitations */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif text-charcoal">Мои приглашения</h2>
            </div>
            
            {dataLoading ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
              </div>
            ) : invitations.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl p-12 text-center border border-sand shadow-sm"
              >
                <div className="w-20 h-20 bg-sand rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="text-champagne w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif text-charcoal mb-3">У вас пока нет приглашений</h3>
                <p className="text-charcoal-light mb-8 max-w-md mx-auto">
                  Создайте свое первое цифровое свадебное приглашение и поделитесь им с гостями.
                </p>
                <Link 
                  to="/catalog"
                  className="inline-flex px-8 py-3 bg-charcoal text-ivory rounded-full font-medium hover:bg-champagne transition-all shadow-md hover:shadow-lg"
                >
                  Выбрать дизайн
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {invitations.map((inv, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={inv.id} 
                    className="bg-white rounded-3xl p-6 border border-sand shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-48 h-64 sm:h-auto aspect-[3/4] rounded-2xl overflow-hidden bg-sand shrink-0">
                      {inv.template?.thumbnail ? (
                        <img src={inv.template.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-serif italic text-charcoal/30">Превью</div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-full border border-champagne/30 text-champagne mb-3">
                              {inv.status === 'published' ? 'Опубликовано' : 'Черновик'}
                            </span>
                            <h3 className="text-3xl font-serif text-charcoal leading-tight">
                              {inv.template?.name || 'Моё приглашение'}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm text-charcoal-light line-clamp-2">
                          Последнее изменение: {new Date(inv.updated_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-8">
                        <Link 
                          to={`/editor/${inv.id}`} 
                          className="flex items-center gap-2 px-6 py-2.5 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-champagne transition-all"
                        >
                          <Edit2 size={16} /> Редактировать
                        </Link>
                        
                        {inv.status === 'published' && (
                          <a 
                            href={`/w/${inv.slug}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-2 px-6 py-2.5 border border-charcoal text-charcoal rounded-full text-sm font-medium hover:bg-sand transition-all"
                          >
                            <ExternalLink size={16} /> Открыть сайт
                          </a>
                        )}
                        
                        {inv.status !== 'published' && (
                          <Link 
                            to={`/preview/${inv.id}`} 
                            className="flex items-center gap-2 px-6 py-2.5 border border-charcoal/20 text-charcoal rounded-full text-sm font-medium hover:bg-sand transition-all"
                          >
                            <Eye size={16} /> Предпросмотр
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Orders */}
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-serif text-charcoal mb-8">Счета и заказы</h2>
            <div className="bg-white rounded-3xl p-8 border border-sand shadow-sm">
              {dataLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-sand mx-auto mb-4" />
                  <p className="text-charcoal-light font-serif italic">У вас нет активных заказов.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="pb-6 border-b border-sand last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-[10px] text-charcoal-light/70 tracking-wider">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full ${order.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                          {order.status === 'paid' ? 'Оплачен' : 'Ожидает'}
                        </span>
                      </div>
                      <p className="font-serif text-lg text-charcoal mb-1">{order.template?.name}</p>
                      <p className="text-charcoal-light text-sm mb-4">{Number(order.amount).toLocaleString('ru-RU')} {order.currency}</p>
                      
                      {order.status === 'pending' && (
                        <Link 
                          to={`/checkout/${order.id}`}
                          className="block w-full text-center px-4 py-2 text-sm font-medium text-ivory bg-charcoal hover:bg-champagne rounded-full transition-colors"
                        >
                          Оплатить
                        </Link>
                      )}
                      
                      {order.status === 'paid' && order.invitation && (
                        <Link 
                          to={`/dashboard/rsvp/${order.invitation.id}`} 
                          className="block w-full text-center px-4 py-2 text-sm font-medium text-charcoal border border-charcoal/20 hover:bg-sand rounded-full transition-colors"
                        >
                          Гости (RSVP)
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
