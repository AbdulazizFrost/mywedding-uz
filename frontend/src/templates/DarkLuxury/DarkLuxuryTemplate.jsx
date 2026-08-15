import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Navigation, Sparkles, ChevronDown, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../shared/CountdownTimer.jsx';
import FloatingMusicPlayer from '../shared/FloatingMusicPlayer.jsx';
import ImageLightbox from '../shared/ImageLightbox.jsx';
import RsvpFormSection from '../shared/RsvpFormSection.jsx';

export default function DarkLuxuryTemplate({ data = {}, media = [], onSubmitRsvp }) {
  const { t, i18n } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const groom = data.groom_name || 'Сардор';
  const bride = data.bride_name || 'Мадина';
  const weddingDate = data.wedding_date || '2026-09-24';
  const weddingTime = data.wedding_time || '17:00';
  const ceremonyTime = data.ceremony_time || '18:00';
  const receptionTime = data.reception_time || '19:30';
  const venueName = data.venue_name || 'The Ritz-Carlton / Grand Hall';
  const address = data.address || 'г. Ташкент, пр-т Амира Темура, 15';
  const mapUrl = data.map_url || 'https://maps.yandex.ru';
  const quote = data.quote || 'В сиянии огней и музыки мы соединяем наши сердца, чтобы разделить этот незабываемый вечер с самыми близкими.';

  const design = data.design || {};
  const primaryColor = design.primary_color || '#f4f4f4';
  const secondaryColor = design.secondary_color || '#d4af37'; // Champagne Gold

  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  ) : '24 Сентября 2026';

  const galleryImages = media.filter(m => m.type !== 'music');

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f4f4f4] font-serif selection:bg-[#d4af37] selection:text-black overflow-x-hidden relative">
      
      {/* Background Music Player */}
      <FloatingMusicPlayer music={data.music} primaryColor="#0d0d0d" secondaryColor="#d4af37" />

      {/* Lightbox */}
      <ImageLightbox 
        images={galleryImages} 
        selectedIndex={lightboxIndex} 
        onClose={() => setLightboxIndex(null)} 
        onSelectIndex={setLightboxIndex} 
      />

      {/* HERO / OPENING COVER */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-between p-6 sm:p-12 text-center border-b border-white/10 overflow-hidden">
        
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none -z-0" />

        {/* Top Monogram */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-8 z-10"
        >
          <div className="w-14 h-14 rounded-full bg-white/5 border border-[#d4af37]/50 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <span className="font-serif italic text-sm text-[#d4af37] font-medium tracking-widest">
              {groom[0]}&{bride[0]}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-sans font-semibold">
            Wedding Celebration
          </span>
        </motion.div>

        {/* Dramatic Couple Names */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="my-auto py-12 z-10"
        >
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif font-extralight text-white tracking-tight leading-none uppercase">
            {groom}
          </h1>
          <div className="my-6 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <span className="font-serif italic text-3xl sm:text-4xl text-[#d4af37]">&</span>
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif font-extralight text-white tracking-tight leading-none uppercase">
            {bride}
          </h1>
          <p className="mt-8 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#a19f9a] font-sans font-light">
            {formattedDate}
          </p>
        </motion.div>

        {/* Scroll down */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pb-4 flex flex-col items-center text-white/50 z-10"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans mb-2 opacity-60">
            {t('preview.invitationTo') || 'Приглашение'}
          </span>
          <ChevronDown size={18} className="animate-bounce text-[#d4af37]" />
        </motion.div>
      </section>

      {/* CINEMATIC QUOTE */}
      <section className="py-24 sm:py-32 px-6 max-w-3xl mx-auto text-center border-b border-white/10 relative">
        <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-6">
          {t('preview.ourStory') || 'Наш особенный вечер'}
        </span>
        <blockquote className="text-xl sm:text-3xl font-serif font-light text-white/90 leading-relaxed italic">
          «{quote}»
        </blockquote>
        <div className="mt-8 w-12 h-px bg-[#d4af37]/60 mx-auto" />
      </section>

      {/* COUNTDOWN TIMER */}
      {weddingDate && (
        <section className="py-16 px-6 bg-white/[0.02] border-b border-white/10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-white/50 font-sans font-medium block mb-4">
            {t('countdown.title') || 'До начала вечера'}
          </span>
          <CountdownTimer targetDate={weddingDate} primaryColor="#f4f4f4" secondaryColor="#d4af37" />
        </section>
      )}

      {/* TIMELINE / SCHEDULE */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto border-b border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-3">
            {t('previewComponent.program') || 'Тайминг'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-light">
            Программа вечера
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-center hover:border-[#d4af37]/40 transition-colors">
            <span className="text-sm font-mono text-[#d4af37] font-semibold tracking-widest">{weddingTime}</span>
            <h3 className="text-2xl font-serif text-white mt-2 mb-3">{t('previewComponent.gathering') || 'Сбор гостей'}</h3>
            <p className="text-xs text-white/60 font-sans leading-relaxed">Welcome drink, живой саксофон и памятные фотографии</p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.04] border border-[#d4af37]/40 backdrop-blur-md text-center shadow-[0_0_30px_rgba(212,175,55,0.08)]">
            <span className="text-sm font-mono text-[#d4af37] font-semibold tracking-widest">{ceremonyTime}</span>
            <h3 className="text-2xl font-serif text-white mt-2 mb-3">{t('previewComponent.ceremony') || 'Церемония'}</h3>
            <p className="text-xs text-white/60 font-sans leading-relaxed">Клятвы при свечах и торжественный союз двух сердец</p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-center hover:border-[#d4af37]/40 transition-colors">
            <span className="text-sm font-mono text-[#d4af37] font-semibold tracking-widest">{receptionTime}</span>
            <h3 className="text-2xl font-serif text-white mt-2 mb-3">{t('previewComponent.reception') || 'Гала-ужин'}</h3>
            <p className="text-xs text-white/60 font-sans leading-relaxed">Праздничный банкет, поздравления и танцы до полуночи</p>
          </div>

        </div>
      </section>

      {/* LOVE STORY */}
      {data.story?.enabled && (
        <section className="py-24 sm:py-32 px-6 max-w-3xl mx-auto text-center border-b border-white/10">
          <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-3">
            {t('previewComponent.ourStory') || 'Наша история'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white mb-8">
            {data.story?.story_title || 'Как зажглась эта звезда'}
          </h2>
          <p className="text-base sm:text-lg text-white/80 font-serif leading-relaxed italic whitespace-pre-line">
            {data.story?.story}
          </p>
        </section>
      )}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="py-24 sm:py-32 px-4 sm:px-8 max-w-6xl mx-auto border-b border-white/10">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-3">
              {t('editor.gallery') || 'Фотоальбом'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white">
              Кадры нашей любви
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxIndex(idx)}
                className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl cursor-pointer border border-white/10 bg-white/5 group relative"
              >
                <img
                  src={img.url}
                  alt="Dark luxury wedding"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* VENUE */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto text-center border-b border-white/10">
        <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-3">
          {t('previewComponent.location') || 'Локация'}
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-white mb-6">
          {venueName}
        </h2>
        <p className="text-base sm:text-lg text-white/70 font-sans font-light mb-8 max-w-md mx-auto">
          {address}
        </p>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#d4af37] text-black text-xs uppercase tracking-widest font-sans font-semibold hover:bg-white transition-colors shadow-[0_0_25px_rgba(212,175,55,0.3)]"
          >
            <Navigation size={16} />
            <span>{t('previewComponent.openMap') || 'Маршрут на карте'}</span>
          </a>
        )}
      </section>

      {/* RSVP */}
      {data.rsvp?.enabled && (
        <section className="py-24 sm:py-32 px-6 bg-white/[0.02] border-b border-white/10">
          <RsvpFormSection 
            rsvpData={data.rsvp} 
            onSubmitRsvp={onSubmitRsvp} 
            theme="dark" 
            primaryColor="#f4f4f4" 
            secondaryColor="#d4af37" 
          />
        </section>
      )}

      {/* CLOSING */}
      <footer className="py-20 px-6 text-center text-white/50 font-serif">
        <p className="italic text-lg mb-2">Разделите этот сияющий вечер с нами,</p>
        <p className="text-2xl sm:text-3xl font-serif text-white font-medium tracking-tight">
          {groom} & {bride}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] font-sans mt-4 opacity-50">
          {formattedDate}
        </p>
      </footer>

    </div>
  );
}
