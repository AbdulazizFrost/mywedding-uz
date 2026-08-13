import { useState, useEffect } from 'react';
import { Search, MoreVertical, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`;

export default function AdminUsers() {
  const [data, setData] = useState({ users: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ page, limit: 20, search });
        const res = await fetch(`${API_URL}/admin/users?${query}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch users');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Add debounce for search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on search
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-charcoal font-semibold mb-2">Пользователи</h1>
          <p className="text-charcoal-light">Управление зарегистрированными аккаунтами.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" size={18} />
          <input
            type="text"
            placeholder="Поиск по email или имени..."
            value={search}
            onChange={handleSearch}
            className="w-full sm:w-80 pl-10 pr-4 py-2 bg-white border border-sand rounded-full focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-colors"
          />
        </div>
      </div>

      {error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-sand shadow-sm overflow-hidden">
          <div className="overflow-hidden">
            {/* Mobile View (Cards) */}
            <div className="block sm:hidden divide-y divide-sand">
              {loading && data.users.length === 0 ? (
                <div className="p-8 text-center text-charcoal-light">Загрузка...</div>
              ) : data.users.length > 0 ? (
                data.users.map((u) => (
                  <motion.div 
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 hover:bg-ivory/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-charcoal">{u.full_name || 'Без имени'}</div>
                        <div className="text-sm text-charcoal-light break-all">{u.email}</div>
                      </div>
                      <span className={`shrink-0 ml-2 inline-block px-2 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                        u.role === 'admin' ? 'bg-champagne/20 text-champagne' : 'bg-gray-100 text-charcoal-light'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-charcoal-light mt-3 border-t border-sand/50 pt-2">
                      <span>Заказов: <span className="font-medium text-charcoal">{u._count?.orders || 0}</span></span>
                      <span>{new Date(u.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-charcoal-light">Пользователи не найдены.</div>
              )}
            </div>

            {/* Desktop View (Table) */}
            <table className="hidden sm:table w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory border-b border-sand">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light">Пользователь</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light hidden md:table-cell">Дата регистрации</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light text-center">Роль</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light text-center">Заказы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {loading && data.users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-charcoal-light">Загрузка...</td>
                  </tr>
                ) : data.users.length > 0 ? (
                  data.users.map((u) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-ivory/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-charcoal">
                        {u.full_name || 'Без имени'}
                      </td>
                      <td className="px-6 py-4 text-charcoal">{u.email}</td>
                      <td className="px-6 py-4 text-charcoal-light hidden md:table-cell">
                        {new Date(u.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                          u.role === 'admin' ? 'bg-champagne/20 text-champagne' : 'bg-gray-100 text-charcoal-light'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-charcoal">
                        {u._count?.orders || 0}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-charcoal-light">Пользователи не найдены.</td>
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
