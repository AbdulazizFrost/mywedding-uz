import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, ChevronDown, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../shared/CountdownTimer.jsx';
import FloatingMusicPlayer from '../shared/FloatingMusicPlayer.jsx';
import ImageLightbox from '../shared/ImageLightbox.jsx';
import RsvpFormSection from '../shared/RsvpFormSection.jsx';

export default function MinimalTemplate({ data = {}, media = [], onSubmitRsvp }) {
  const { t, i18n } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const groom = data.groom_name || 'Сардор';
  const bride = data.bride_name || 'Мадина';
  const weddingDate = data.wedding_date || '2026-09-24';
  const weddingTime = data.wedding_time || '17:00';
  const ceremonyTime = data.ceremony_time || '18:00';
  const receptionTime = data.reception_time || '19:30';
  const venueName = data.venue_name || 'Navruz Hall';
  const address = data.address || 'г. Ташкент, ул. Амира Темура, 15';
  const mapUrl = data.map_url || 'https://maps.yandex.ru';
  const quote = data.quote || 'Истинная красота — в простоте и искренности наших чувств.';

  const design = data.design || {};
  const primaryColor = design.primary_color || '#1d1d1f';
  const secondaryColor = design.secondary_color || '#86868b';

  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  ) : '24 Сентября 2026';

  const galleryImages = media.filter(m => m.type !== 'music');

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1d1d1f] font-sans selection:bg-[#1d1d1f] selection:text-white overflow-x-hidden relative">
      
      {/* Floating Music Player */}
      <FloatingMusicPlayer music={data.music} primaryColor="#1d1d1f" secondaryColor="#86868b" />

      {/* Lightbox */}
      <ImageLightbox 
        images={galleryImages} 
        selectedIndex={lightboxIndex} 
        onClose={() => setLightboxIndex(null)} 
        onSelectIndex={setLightboxIndex} 
      />

      {/* HERO / ULTRA MINIMAL COVER */}
      <section className="relative min-h-[100dvh] flex flex-col justify-between p-8 sm:p-16 border-b border-black/[0.06]">
        
        <div className="flex justify-between items-center text-xs tracking-widest uppercase text-[#86868b]">
          <span>WEDDING INVITATION</span>
          <span>{formattedDate}</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="my-auto py-16 max-w-4xl"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#86868b] mb-6">СВАДЬБА</p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-[#1d1d1f] leading-none mb-6">
            {groom} <span className="font-extralight text-[#86868b]">&</span> {bride}
          </h1>
          <p className="text-sm sm:text-base text-[#86868b] font-light max-w-lg leading-relaxed mt-8">
            Приглашаем вас стать свидетелями рождения нашей семьи и разделить радость этого дня.
          </p>
        </motion.div>

        <div className="flex justify-between items-center text-xs text-[#86868b] pt-8 border-t border-black/[0.06]">
          <span>{venueName}</span>
          <span className="font-mono">{weddingTime}</span>
        </div>
      </section>

      {/* MINIMAL QUOTE */}
      <section className="py-24 sm:py-36 px-8 max-w-3xl mx-auto text-center border-b border-black/[0.06]">
        <blockquote className="text-2xl sm:text-4xl font-light text-[#1d1d1f] leading-relaxed tracking-tight">
          «{quote}»
        </blockquote>
      </section>

      {/* COUNTDOWN */}
      {weddingDate && (
        <section className="py-20 px-8 bg-[#f5f5f7] border-b border-black/[0.06] text-center">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#86868b] font-medium block mb-4">
            ДО СОБЫТИЯ
          </span>
          <CountdownTimer targetDate={weddingDate} primaryColor="#1d1d1f" secondaryColor="#1d1d1f" />
        </section>
      )}

      {/* SCHEDULE */}
      <section className="py-24 sm:py-36 px-8 max-w-4xl mx-auto border-b border-black/[0.06]">
        <h2 className="text-3xl sm:text-5xl font-light text-[#1d1d1f] tracking-tight mb-16">
          Программа
        </h2>

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-6 border-b border-black/[0.06] gap-2">
            <span className="font-mono text-sm text-[#86868b]">{weddingTime}</span>
            <span className="text-xl sm:text-2xl font-light text-[#1d1d1f]">{t('previewComponent.gathering') || 'Сбор гостей'}</span>
            <span className="text-xs text-[#86868b]">Welcome & напитки</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-6 border-b border-black/[0.06] gap-2">
            <span className="font-mono text-sm text-[#86868b]">{ceremonyTime}</span>
            <span className="text-xl sm:text-2xl font-light text-[#1d1d1f]">{t('previewComponent.ceremony') || 'Церемония'}</span>
            <span className="text-xs text-[#86868b]">Торжественная часть</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-6 border-b border-black/[0.06] gap-2">
            <span className="font-mono text-sm text-[#86868b]">{receptionTime}</span>
            <span className="text-xl sm:text-2xl font-light text-[#1d1d1f]">{t('previewComponent.reception') || 'Банкет'}</span>
            <span className="text-xs text-[#86868b]">Ужин и поздравления</span>
          </div>
        </div>
      </section>

      {/* STORY */}
      {data.story?.enabled && (
        <section className="py-24 sm:py-36 px-8 max-w-3xl mx-auto border-b border-black/[0.06]">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#86868b] block mb-4">ИСТОРИЯ</span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#1d1d1f] mb-8">{data.story?.story_title || 'Наша история'}</h2>
          <p className="text-base sm:text-lg text-[#515154] font-light leading-relaxed whitespace-pre-line">
            {data.story?.story}
          </p>
        </section>
      )}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="py-24 sm:py-36 px-8 max-w-6xl mx-auto border-b border-black/[0.06]">
          <h2 className="text-3xl sm:text-5xl font-light text-[#1d1d1f] tracking-tight mb-16">
            Галерея
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                whileHover={{ scale: 1.01 }}
                onClick={() => setLightboxIndex(idx)}
                className="aspect-[4/5] rounded-xl overflow-hidden cursor-pointer bg-[#f5f5f7]"
              >
                <img
                  src={img.url}
                  alt="Minimal photography"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* VENUE */}
      <section className="py-24 sm:py-36 px-8 max-w-4xl mx-auto border-b border-black/[0.06] flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#86868b] block mb-3">МЕСТО</span>
          <h2 className="text-3xl sm:text-5xl font-light text-[#1d1d1f]">{venueName}</h2>
          <p className="text-sm text-[#86868b] mt-3">{address}</p>
        </div>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1d1d1f] text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors"
          >
            <span>Карта</span>
            <ArrowRight size={14} />
          </a>
        )}
      </section>

      {/* RSVP */}
      {data.rsvp?.enabled && (
        <section className="py-24 sm:py-36 px-8 bg-[#f5f5f7] border-b border-black/[0.06]">
          <RsvpFormSection 
            rsvpData={data.rsvp} 
            onSubmitRsvp={onSubmitRsvp} 
            theme="light" 
            primaryColor="#1d1d1f" 
            secondaryColor="#1d1d1f" 
          />
        </section>
      )}

      {/* CLOSING */}
      <footer className="py-20 px-8 text-center text-[#86868b] text-xs uppercase tracking-widest">
        <p className="mb-2">{groom} & {bride}</p>
        <p className="font-mono">{formattedDate}</p>
      </footer>

    </div>
  );
}
