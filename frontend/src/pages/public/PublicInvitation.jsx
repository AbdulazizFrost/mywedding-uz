import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PreviewComponent from '../../components/preview/PreviewComponent.jsx';
import { useTranslation } from 'react-i18next';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) ? import.meta.env.VITE_API_URL : (window.location.protocol === 'https:' ? `https://${window.location.hostname}/api` : `http://${window.location.hostname}:5000/api`);

export default function PublicInvitation() {
  const { slug } = useParams();
  const { t } = useTranslation();
  
  const [invitation, setInvitation] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await fetch(`${API_URL}/public/invitations/${slug}`);
        if (res.status === 404) {
          throw new Error('Invitation not found or draft');
        }
        if (!res.ok) {
          throw new Error('Failed to fetch invitation');
        }
        const data = await res.json();
        setInvitation(data.invitation);
        
        let parsedData = {};
        try {
          if (typeof data.invitation.data === 'string') {
            parsedData = data.invitation.data.trim() ? JSON.parse(data.invitation.data) : {};
          } else {
            parsedData = data.invitation.data || {};
          }
        } catch(e) {
          console.error("JSON parse error:", e);
          parsedData = {};
        }
        
        setMedia(data.invitation.media || []);
        setInvitation(prev => ({ ...prev, parsedData }));

        // Dynamic Document Title
        const groom = parsedData.groom_name;
        const bride = parsedData.bride_name;
        if (groom && bride) {
          document.title = `${groom} & ${bride} — BizningToy.uz`;
        } else {
          document.title = 'BizningToy.uz — Свадебное приглашение';
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [slug]);

  const handleRsvpSubmit = async (rsvpData) => {
    const res = await fetch(`${API_URL}/public/invitations/${slug}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData)
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 429) {
        throw new Error(t('publicInvitation.rateLimit'));
      }
      throw new Error(data.error || t('publicInvitation.errorSubmit'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-charcoal-light italic text-xl">{t('publicInvitation.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-serif text-charcoal mb-2">404</h2>
        <p className="text-charcoal-light font-serif text-lg">{error === 'Invitation not found or draft' ? t('publicInvitation.notFound') || 'Приглашение не найдено или снято с публикации.' : error}</p>
      </div>
    );
  }

  if (!invitation) return null;

  return (
    <PreviewComponent 
      data={invitation.parsedData} 
      media={media} 
      slug={slug}
      onSubmitRsvp={handleRsvpSubmit} 
    />
  );
}
