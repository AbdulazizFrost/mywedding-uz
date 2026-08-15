import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, Plus, Edit2, Eye, ExternalLink, CreditCard, Users, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) ? import.meta.env.VITE_API_URL : (window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : `http://${window.location.hostname}:5000/api`);

export default function DashboardPage() {
  const { user, loading, fetchMe } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [orders, setOrders] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

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

  const handleCopyLink = (invId, slug) => {
    if (!slug) return;
    const url = `${window.location.origin}/w/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(invId);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-ivory pt-32 pb-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">{t('userDashboard.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory font-sans pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 selection:bg-champagne selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Profile Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] border border-sand p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12 shadow-[0_10px_30px_rgb(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-champagne-light/40 border border-champagne/40 flex items-center justify-center font-serif text-2xl sm:text-3xl text-champagne shrink-0">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-champagne uppercase">{t('userDashboard.personalCabinet')}</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-charcoal">{user?.full_name || t('userDashboard.dearUser')}</h1>
              <p className="text-xs sm:text-sm text-charcoal-light font-light">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-champagne/10 border border-champagne text-charcoal rounded-full text-sm font-medium hover:bg-champagne hover:text-white transition-all duration-300"
              >
                <Settings size={16} /> {t('userDashboard.adminPanel')}
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-sand text-charcoal-light rounded-full text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-300"
            >
              <LogOut size={16} /> {t('userDashboard.logout')}
            </button>
          </div>
        </motion.div>

        {/* Main Grid: Invitations & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: My Invitations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-serif text-charcoal">{t('userDashboard.myInvitations')}</h2>
              <Link 
                to="/catalog"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-champagne uppercase hover:text-charcoal transition-colors"
              >
                <Plus size={16} /> {t('userDashboard.newInvitation')}
              </Link>
            </div>

            {invitations.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-sand p-10 sm:p-14 text-center">
                <p className="font-serif italic text-xl text-charcoal-light mb-6">{t('userDashboard.noInvitations')}</p>
                <Link 
                  to="/catalog"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-black transition-all shadow-md"
                >
                  {t('userDashboard.chooseTemplate')}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {invitations.map((inv, idx) => (
                  <motion.div 
                    key={inv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[2rem] border border-sand p-6 sm:p-8 flex flex-col md:flex-row gap-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 aspect-[3/4] rounded-2xl overflow-hidden bg-sand/30 shrink-0 relative">
                      {inv.template?.thumbnail || inv.template?.preview_image ? (
                        <img 
                          src={inv.template?.thumbnail || inv.template?.preview_image} 
                          alt={inv.template?.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-serif text-charcoal/30 italic">
                          {t('userDashboard.noPreview')}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-full border mb-2 ${
                              inv.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-sand/40 text-charcoal-light border-sand'
                            }`}>
                              {inv.status === 'published' ? t('userDashboard.published') : t('userDashboard.draft')}
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-serif text-charcoal leading-tight">
                              {inv.template?.name || t('userDashboard.myInvitation')}
                            </h3>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-charcoal-light">
                          {t('userDashboard.lastChange')} {new Date(inv.updated_at).toLocaleDateString(i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU')}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2.5 mt-6 pt-4 border-t border-sand/60">
                        <Link 
                          to={`/editor/${inv.id}`} 
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-charcoal text-ivory rounded-full text-xs sm:text-sm font-medium hover:bg-champagne transition-all"
                        >
                          <Edit2 size={14} /> {t('userDashboard.edit')}
                        </Link>
                        
                        <Link 
                          to={`/dashboard/rsvp/${inv.id}`} 
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-sand/60 text-charcoal rounded-full text-xs sm:text-sm font-medium hover:bg-sand transition-all"
                        >
                          <Users size={14} /> {t('rsvp.title') || 'Гости (RSVP)'}
                        </Link>

                        {inv.status === 'published' ? (
                          <>
                            <a 
                              href={`/w/${inv.slug}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-charcoal text-charcoal rounded-full text-xs sm:text-sm font-medium hover:bg-sand transition-all"
                            >
                              <ExternalLink size={14} /> {t('userDashboard.openSite')}
                            </a>

                            <button
                              onClick={() => handleCopyLink(inv.id, inv.slug)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-sand text-charcoal rounded-full text-xs font-medium hover:bg-sand transition-all"
                              title="Копировать ссылку"
                            >
                              {copiedId === inv.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                              <span>{copiedId === inv.id ? (t('editor.linkCopied') || 'Скопировано') : (t('editor.copyLink') || 'Ссылка')}</span>
                            </button>
                          </>
                        ) : (
                          <Link 
                            to={`/preview/${inv.id}`} 
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-charcoal/20 text-charcoal rounded-full text-xs sm:text-sm font-medium hover:bg-sand transition-all"
                          >
                            <Eye size={14} /> {t('userDashboard.previewBtn')}
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right 1 Col: Orders & Invoices */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal">{t('userDashboard.billsAndOrders')}</h2>
            
            <div className="bg-white rounded-[2rem] border border-sand p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-6">
              {orders.length === 0 ? (
                <p className="text-center text-charcoal-light font-serif italic py-8">{t('userDashboard.noOrders')}</p>
              ) : (
                <div className="divide-y divide-sand">
                  {orders.map(order => (
                    <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-serif text-lg text-charcoal">{order.template?.name || t('userDashboard.orderTemplate')}</h4>
                          <span className="text-[10px] font-mono text-charcoal-light">#{order.id.slice(0, 8)}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                          order.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-sand text-charcoal-light'
                        }`}>
                          {order.status === 'paid' ? t('userDashboard.paid') : t('userDashboard.awaitingPayment')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm mt-3">
                        <span className="font-medium text-charcoal">
                          {Number(order.amount).toLocaleString('ru-RU')} {order.currency}
                        </span>
                        
                        {order.status === 'pending' && (
                          <Link 
                            to={`/checkout/${order.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-champagne hover:underline"
                          >
                            <CreditCard size={12} /> {t('userDashboard.pay')}
                          </Link>
                        )}
                      </div>
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
