import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`;

export default function AdminOrders() {
  const [data, setData] = useState({ orders: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ page, limit: 20 });
        const res = await fetch(`${API_URL}/admin/orders?${query}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [page]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid': return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full">Paid</span>;
      case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-widest rounded-full">Pending</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-widest rounded-full">Cancelled</span>;
      case 'failed': return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-widest rounded-full">Failed</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-charcoal font-semibold mb-2">Заказы</h1>
        <p className="text-charcoal-light">История покупок шаблонов.</p>
      </div>

      {error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-sand shadow-sm overflow-hidden">
          <div className="overflow-hidden">
            {/* Mobile View (Cards) */}
            <div className="block sm:hidden divide-y divide-sand">
              {loading && data.orders.length === 0 ? (
                <div className="p-8 text-center text-charcoal-light">Загрузка...</div>
              ) : data.orders.length > 0 ? (
                data.orders.map((order) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 hover:bg-ivory/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-charcoal">{order.user.full_name || 'Без имени'}</div>
                        <div className="text-xs text-charcoal-light">{order.user.email}</div>
                      </div>
                      <div className="shrink-0 ml-2">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-charcoal">{order.template.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-charcoal-light border-t border-sand/50 pt-2">
                      <span className="font-bold text-charcoal text-sm">{Number(order.amount).toLocaleString('ru-RU')} {order.currency}</span>
                      <span>{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-charcoal-light">Заказы не найдены.</div>
              )}
            </div>

            {/* Desktop View (Table) */}
            <table className="hidden sm:table w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory border-b border-sand">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light">ID Заказа</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light">Клиент</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light">Шаблон</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light">Сумма</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light text-center">Статус</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light hidden md:table-cell">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {loading && data.orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-charcoal-light">Загрузка...</td>
                  </tr>
                ) : data.orders.length > 0 ? (
                  data.orders.map((order) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-ivory/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-charcoal-light truncate max-w-[120px]" title={order.id}>
                        {order.id.split('-')[0]}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-charcoal">{order.user.full_name || 'Без имени'}</div>
                        <div className="text-xs text-charcoal-light">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-charcoal font-medium">{order.template.name}</td>
                      <td className="px-6 py-4 text-charcoal font-bold">
                        {Number(order.amount).toLocaleString('ru-RU')} {order.currency}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-charcoal-light text-sm hidden md:table-cell">
                        {new Date(order.created_at).toLocaleString('ru-RU')}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-charcoal-light">Заказы не найдены.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-sand flex items-center justify-between">
              <span className="text-sm text-charcoal-light">
                Страница {data.pagination.page} из {data.pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={data.pagination.page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 text-sm bg-ivory text-charcoal rounded-lg hover:bg-sand disabled:opacity-50"
                >
                  Назад
                </button>
                <button 
                  disabled={data.pagination.page === data.pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 text-sm bg-ivory text-charcoal rounded-lg hover:bg-sand disabled:opacity-50"
                >
                  Вперед
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
