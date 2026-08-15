import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import PreviewComponent from '../../components/preview/PreviewComponent.jsx';
import { ArrowLeft, Edit2, Globe, ExternalLink, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) ? import.meta.env.VITE_API_URL : (window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : `http://${window.location.hostname}:5000/api`);

export default function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  
  const [invitation, setInvitation] = useState(null);
  const [data, setData] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchInvitation = async () => {
      try {
        const [invRes, mediaRes] = await Promise.all([
          fetch(`${API_URL}/invitations/${id}`, { credentials: 'include' }),
          fetch(`${API_URL}/invitations/${id}/media`, { credentials: 'include' })
        ]);

        if (!invRes.ok) throw new Error('Failed to fetch invitation');
        const resData = await invRes.json();
        const inv = resData.invitation;
        setInvitation(inv);

        let parsedData = {};
        try {
          if (typeof inv.data === 'string') {
            parsedData = inv.data.trim() ? JSON.parse(inv.data) : {};
          } else {
            parsedData = inv.data || {};
          }
        } catch(e) {
          console.error("JSON parse error:", e);
          parsedData = {};
        }
        setData(parsedData);

        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          setMedia(mediaData.media || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchInvitation();
  }, [id, user]);

  const handleCopyLink = () => {
    if (!invitation?.slug) return;
    const url = `${window.location.origin}/w/${invitation.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setMessage(t('editor.linkCopied') || 'Ссылка скопирована');
      setTimeout(() => setMessage(null), 2500);
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">{t('preview.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory pt-32 flex flex-col items-center justify-center px-4">
        <p className="text-red-700 font-serif text-xl mb-4 text-center">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-charcoal text-white rounded-full">{t('dashboard.back')}</button>
      </div>
    );
  }

  if (!data || !invitation) return null;

  return (
    <div className="min-h-screen bg-sand/30 flex flex-col items-center pt-14 selection:bg-champagne selection:text-white">
      
      {/* Sticky Top Toolbar */}
      <div className="fixed top-0 left-0 right-0 bg-charcoal/95 backdrop-blur-md text-ivory px-4 py-2.5 flex justify-between items-center z-50 shadow-md">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-1 text-xs text-ivory/70 hover:text-ivory transition-colors">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">{t('preview.cabinet')}</span>
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
            <span className="text-xs font-medium tracking-wide uppercase">{t('preview.mode')}</span>
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 text-green-800 text-xs px-3 py-1 rounded-full border border-green-200"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {invitation.status === 'published' && (
            <button
              onClick={handleCopyLink}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-ivory rounded-full transition-colors"
              title="Копировать ссылку"
            >
              <Copy size={14} />
            </button>
          )}
          <button 
            onClick={() => navigate(`/editor/${id}`)} 
            className="text-xs flex items-center gap-1.5 bg-champagne hover:bg-champagne-light text-charcoal px-3.5 py-1.5 rounded-full font-medium transition-colors"
          >
            <Edit2 size={13} /> <span>{t('preview.editor')}</span>
          </button>
        </div>
      </div>

      {/* True WYSIWYG Invitation Container */}
      <div className="w-full flex-1 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white shadow-2xl overflow-hidden min-h-screen">
          <PreviewComponent data={data} media={media} />
        </div>
      </div>
    </div>
  );
}
