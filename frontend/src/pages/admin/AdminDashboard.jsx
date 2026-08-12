import { useState, useEffect } from 'react';
import { Users, Mail, CreditCard, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-sand/50 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>;
  }

  const statCards = [
    { title: 'Пользователи', value: stats.stats.totalUsers, icon: Users, color: 'text-charcoal' },
    { title: 'Приглашения', value: stats.stats.totalInvitations, icon: Mail, color: 'text-charcoal' },
    { title: 'Заказы', value: stats.stats.totalOrders, icon: CreditCard, color: 'text-charcoal' },
    { title: 'Выручка', value: `${stats.stats.revenue.toLocaleString('ru-RU')} UZS`, icon: DollarSign, color: 'text-champagne' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-charcoal font-semibold mb-2">Обзор платформы</h1>
        <p className="text-charcoal-light">Главная статистика и последние действия.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-sand shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-ivory ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-charcoal-light mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-charcoal">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-sand shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sand">
          <h2 className="text-lg font-serif text-charcoal font-semibold">Последняя активность</h2>
        </div>
        <div className="divide-y divide-sand">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-ivory/50 transition-colors">
                <div>
                  <p className="font-medium text-charcoal">{activity.user.full_name || activity.user.email}</p>
                  <p className="text-sm text-charcoal-light mt-1">Оформил заказ на шаблон "{activity.template.name}"</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.status === 'paid' ? 'bg-green-100 text-green-700' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {activity.status.toUpperCase()}
                  </span>
                  <p className="text-xs text-charcoal-light mt-2">
                    {new Date(activity.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-charcoal-light">
              Пока нет активности.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
