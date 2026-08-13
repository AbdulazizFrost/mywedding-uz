import { useState, useEffect } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000/api`);
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

export default function AdminInvitations() {
  const [data, setData] = useState({ invitations: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ page, limit: 20 });
        const res = await fetch(`${API_URL}/admin/invitations?${query}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch invitations');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvitations();
  }, [page]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'published': return <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Опубликован</span>;
      case 'draft': return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Черновик</span>;
      case 'archived': return <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Архив</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-widest rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-charcoal font-semibold mb-2">Приглашения</h1>
          <p className="text-charcoal-light">Сайты, созданные пользователями.</p>
        </div>
      </div>

      {error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-sand shadow-sm overflow-hidden">
          <div className="overflow-hidden">
            {/* Mobile View (Cards) */}
            <div className="block sm:hidden divide-y divide-sand">
              {loading && data.invitations.length === 0 ? (
                <div className="p-8 text-center text-charcoal-light">Загрузка...</div>
              ) : data.invitations.length > 0 ? (
                data.invitations.map((inv) => (
                  <motion.div 
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 hover:bg-ivory/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-charcoal">{inv.user.full_name || 'Без имени'}</div>
                        <div className="text-xs text-charcoal-light">{inv.user.email}</div>
                      </div>
                      <div className="shrink-0 ml-2">
                        {getStatusBadge(inv.status)}
                      </div>
                    </div>
                    <div className="mb-3 space-y-1">
                      <span className="block text-sm font-medium text-charcoal">{inv.template.name}</span>
                      <a 
                        href={`${FRONTEND_URL}/w/${inv.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-champagne hover:text-charcoal transition-colors text-xs font-medium"
                      >
                        /w/{inv.slug} <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="flex justify-end items-center text-xs text-charcoal-light border-t border-sand/50 pt-2">
                      <span>{new Date(inv.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-charcoal-light">Приглашения не найдены.</div>
              )}
            </div>

            {/* Desktop View (Table) */}
            <table className="hidden sm:table w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory border-b border-sand">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light">Пользователь</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light">Шаблон</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light">Ссылка</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light text-center">Статус</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-light hidden md:table-cell">Дата создания</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {loading && data.invitations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-charcoal-light">Загрузка...</td>
                  </tr>
                ) : data.invitations.length > 0 ? (
                  data.invitations.map((inv) => (
                    <motion.tr 
                      key={inv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-ivory/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-charcoal">{inv.user.full_name || 'Без имени'}</div>
                        <div className="text-xs text-charcoal-light">{inv.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-charcoal font-medium">
                        {inv.template.name}
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={`${FRONTEND_URL}/w/${inv.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-champagne hover:text-charcoal transition-colors text-sm font-medium"
                        >
                          /w/{inv.slug} <ExternalLink size={14} />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(inv.status)}
                      </td>
                      <td className="px-6 py-4 text-charcoal-light text-sm hidden md:table-cell">
                        {new Date(inv.created_at).toLocaleDateString('ru-RU')}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-charcoal-light">Приглашения не найдены.</td>
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
