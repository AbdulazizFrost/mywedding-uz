import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || API_URL + '';

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

  const handleDevActivate = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/dev/orders/${orderId}/activate`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        fetchDashboardData(); // Refresh both lists
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to activate');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

  const isDev = import.meta.env.DEV; // Vite exposed dev flag

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Выйти
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Invitations Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Мои приглашения</h2>
            {dataLoading ? (
              <p className="text-gray-500">Загрузка...</p>
            ) : invitations.length === 0 ? (
              <p className="text-gray-500 text-sm">У вас пока нет приглашений.</p>
            ) : (
              <div className="space-y-4">
                {invitations.map(inv => (
                  <div key={inv.id} className="border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row gap-4 items-center">
                    {inv.template?.thumbnail && (
                      <img src={inv.template.thumbnail} alt="" className="w-20 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{inv.template?.name || 'Шаблон'}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${inv.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {inv.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm mt-3">
                        <Link to={`/editor/${inv.id}`} className="text-indigo-600 hover:text-indigo-900">Редактировать</Link>
                        <span className="text-gray-300">|</span>
                        <Link to={`/preview/${inv.id}`} className="text-indigo-600 hover:text-indigo-900">Предпросмотр</Link>
                        {inv.status === 'published' && (
                          <>
                            <span className="text-gray-300">|</span>
                            <a href={`/w/${inv.slug}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900">Ссылка</a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Мои заказы</h2>
            {dataLoading ? (
              <p className="text-gray-500">Загрузка...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500 text-sm">У вас нет заказов.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-gray-500">ID: {order.id.slice(0, 8)}...</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{order.template?.name}</p>
                    <p className="text-gray-500 text-sm mb-3">{Number(order.amount).toLocaleString()} {order.currency}</p>
                    
                    {order.status === 'pending' && (
                      <Link 
                        to={`/checkout/${order.id}`}
                        className="inline-block w-full text-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm"
                      >
                        Оплатить
                      </Link>
                    )}
                    {order.status === 'paid' && order.invitation && (
                      <div className="flex gap-2">
                        <Link to={`/editor/${order.invitation.id}`} className="inline-block px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                          Открыть приглашение
                        </Link>
                        <Link to={`/dashboard/rsvp/${order.invitation.id}`} className="inline-block px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Ответы гостей
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
