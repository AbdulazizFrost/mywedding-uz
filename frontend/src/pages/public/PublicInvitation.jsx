import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PreviewComponent from '../../components/preview/PreviewComponent.jsx';

export default function PublicInvitation() {
  const { slug } = useParams();
  
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
        
        // Also fetch media if needed. Wait, does public API expose media?
        // We need a public endpoint for media or include it in the invitation response.
        const parsedData = typeof data.invitation.data === 'string' ? JSON.parse(data.invitation.data) : data.invitation.data;
        
        // Note: For step 7, we should fetch media. We'll do it via public API or assume backend provides it.
        // Actually, let's fetch media if we add a public media endpoint, or rely on invitation.media if returned.
        setMedia(data.invitation.media || []);
        setInvitation(prev => ({ ...prev, parsedData }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [slug]);

  const handleRsvpSubmit = async (rsvpData) => {
    const API_URL = import.meta.env.VITE_API_URL || API_URL + '';
    const res = await fetch(`${API_URL}/public/invitations/${slug}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData)
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Слишком много попыток. Пожалуйста, подождите немного.');
      }
      throw new Error(data.error || 'Ошибка отправки ответа');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-medium">{error}</div>;
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
