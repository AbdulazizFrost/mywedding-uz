import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Navigation, Heart, Music, Sparkles, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../shared/CountdownTimer.jsx';
import FloatingMusicPlayer from '../shared/FloatingMusicPlayer.jsx';
import ImageLightbox from '../shared/ImageLightbox.jsx';
import RsvpFormSection from '../shared/RsvpFormSection.jsx';

export default function RoyalIvoryTemplate({ data = {}, media = [], onSubmitRsvp }) {
  const { t, i18n } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const groom = data.groom_name || 'Сардор';
  const bride = data.bride_name || 'Мадина';
  const weddingDate = data.wedding_date || '2026-09-24';
  const weddingTime = data.wedding_time || '17:00';
  const ceremonyTime = data.ceremony_time || '18:00';
  const receptionTime = data.reception_time || '19:30';
  const venueName = data.venue_name || 'Navruz Hall & Palace';
  const address = data.address || 'г. Ташкент, ул. Амира Темура, 15';
  const mapUrl = data.map_url || 'https://maps.yandex.ru';
  const quote = data.quote || 'Мы счастливы пригласить вас разделить с нами этот особенный день, когда две судьбы соединяются в одну.';
  
  const design = data.design || {};
  const primaryColor = design.primary_color || '#2c2c2c';
  const secondaryColor = design.secondary_color || '#d4af37'; // Champagne Gold

  // Format Date
  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  ) : '24 Сентября 2026';

  const galleryImages = media.filter(m => m.type !== 'music');

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2c2c2c] font-serif selection:bg-[#d4af37]/30 selection:text-[#2c2c2c] overflow-x-hidden relative">
      
      {/* Background Music Player */}
      <FloatingMusicPlayer music={data.music} primaryColor={primaryColor} secondaryColor={secondaryColor} />

      {/* Lightbox */}
      <ImageLightbox 
        images={galleryImages} 
        selectedIndex={lightboxIndex} 
        onClose={() => setLightboxIndex(null)} 
        onSelectIndex={setLightboxIndex} 
      />

      {/* HERO / OPENING COVER */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-between p-6 sm:p-12 text-center border-b border-[#e5dfd5]">
        
        {/* Top Royal Crest Monogram */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-8 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full border border-[#d4af37] flex items-center justify-center mb-3 p-1">
            <div className="w-full h-full rounded-full border border-[#d4af37]/40 flex items-center justify-center font-serif text-xs uppercase tracking-widest text-[#d4af37]">
              {groom[0]}&{bride[0]}
            </div>
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#8c827a] font-sans">
            {t('previewComponent.badge') || 'Приглашение на свадьбу'}
          </span>
        </motion.div>

        {/* Central Couple Typography */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="my-auto py-12"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light text-[#1f1d1b] tracking-tight leading-none">
            {groom}
          </h1>
          <div className="my-4 sm:my-6 flex items-center justify-center gap-4">
            <span className="h-px w-12 sm:w-20 bg-[#d4af37]/60" />
            <span className="font-serif italic text-2xl sm:text-3xl text-[#d4af37]">&</span>
            <span className="h-px w-12 sm:w-20 bg-[#d4af37]/60" />
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light text-[#1f1d1b] tracking-tight leading-none">
            {bride}
          </h1>
          <p className="mt-8 text-sm sm:text-base tracking-[0.25em] uppercase text-[#6e665e] font-sans font-light">
            {formattedDate}
          </p>
        </motion.div>

        {/* Bottom Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pb-4 flex flex-col items-center text-[#8c827a]"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-sans mb-2 opacity-70">
            {t('preview.invitationTo') || 'Приглашение'}
          </span>
          <ChevronDown size={18} className="animate-bounce text-[#d4af37]" />
        </motion.div>
      </section>

      {/* INVITATION QUOTE SECTION */}
      <section className="py-20 sm:py-28 px-6 max-w-3xl mx-auto text-center border-b border-[#e5dfd5]">
        <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-6">
          {t('preview.ourStory') || 'Дорогие гости'}
        </span>
        <blockquote className="text-xl sm:text-3xl font-serif font-light text-[#2c2c2c] leading-relaxed italic">
          «{quote}»
        </blockquote>
        <div className="mt-8 w-16 h-px bg-[#d4af37] mx-auto" />
      </section>

      {/* COUNTDOWN TIMER */}
      {weddingDate && (
        <section className="py-16 px-6 bg-[#f4f0e8] border-b border-[#e5dfd5] text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8c827a] font-sans font-medium block mb-4">
            {t('countdown.title') || 'До торжества осталось'}
          </span>
          <CountdownTimer targetDate={weddingDate} primaryColor="#2c2c2c" secondaryColor="#d4af37" />
        </section>
      )}

      {/* SCHEDULE OF THE DAY */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto border-b border-[#e5dfd5]">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-3">
            {t('previewComponent.program') || 'Программа дня'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1f1d1b]">
            {t('previewComponent.whenWhere') || 'Расписание событий'}
          </h2>
        </div>

        <div className="relative border-l border-[#d4af37]/40 ml-4 sm:mx-auto sm:max-w-xl space-y-12 sm:space-y-16 pl-8 sm:pl-12">
          
          {/* Gathering */}
          <div className="relative group">
            <div className="absolute -left-[39px] sm:-left-[55px] top-1.5 w-5 h-5 rounded-full bg-[#faf9f6] border-2 border-[#d4af37] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">{weddingTime}</span>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1f1d1b] mt-1">{t('previewComponent.gathering') || 'Сбор гостей'}</h3>
            <p className="text-xs sm:text-sm text-[#736a62] font-sans mt-1">Приветственные напитки, живая скрипка и фотозона</p>
          </div>

          {/* Ceremony */}
          <div className="relative group">
            <div className="absolute -left-[39px] sm:-left-[55px] top-1.5 w-5 h-5 rounded-full bg-[#faf9f6] border-2 border-[#d4af37] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">{ceremonyTime}</span>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1f1d1b] mt-1">{t('previewComponent.ceremony') || 'Торжественная церемония'}</h3>
            <p className="text-xs sm:text-sm text-[#736a62] font-sans mt-1">Обмен клятвами, кольцами и праздничный салют лепестков</p>
          </div>

          {/* Reception */}
          <div className="relative group">
            <div className="absolute -left-[39px] sm:-left-[55px] top-1.5 w-5 h-5 rounded-full bg-[#faf9f6] border-2 border-[#d4af37] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">{receptionTime}</span>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1f1d1b] mt-1">{t('previewComponent.reception') || 'Свадебный банкет'}</h3>
            <p className="text-xs sm:text-sm text-[#736a62] font-sans mt-1">Изысканный ужин, поздравления, шоу-программа и танцы</p>
          </div>

        </div>
      </section>

      {/* LOVE STORY SECTION */}
      {data.story?.enabled && (
        <section className="py-24 sm:py-32 px-6 max-w-3xl mx-auto text-center border-b border-[#e5dfd5]">
          <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-3">
            {t('previewComponent.ourStory') || 'История любви'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1f1d1b] mb-8">
            {data.story?.story_title || 'Как всё начиналось'}
          </h2>
          <p className="text-base sm:text-lg text-[#5e564e] font-serif leading-relaxed italic whitespace-pre-line">
            {data.story?.story}
          </p>
        </section>
      )}

      {/* PHOTO GALLERY */}
      {galleryImages.length > 0 && (
        <section className="py-24 sm:py-32 px-4 sm:px-8 max-w-6xl mx-auto border-b border-[#e5dfd5]">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-3">
              {t('editor.gallery') || 'Галерея'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1f1d1b]">
              Наши мгновения
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxIndex(idx)}
                className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md cursor-pointer border border-[#e5dfd5] bg-white group relative"
              >
                <img
                  src={img.url}
                  alt="Wedding memory"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#d4af37]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* VENUE & LOCATION */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto text-center border-b border-[#e5dfd5]">
        <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-medium block mb-3">
          {t('previewComponent.location') || 'Локация'}
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#1f1d1b] mb-6">
          {venueName}
        </h2>
        <p className="text-base sm:text-lg text-[#6e665e] font-sans font-light mb-8 max-w-md mx-auto">
          {address}
        </p>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#2c2c2c] text-[#faf9f6] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#d4af37] transition-colors shadow-lg"
          >
            <Navigation size={16} />
            <span>{t('previewComponent.openMap') || 'Открыть на карте'}</span>
          </a>
        )}
      </section>

      {/* RSVP FORM */}
      {data.rsvp?.enabled && (
        <section className="py-24 sm:py-32 px-6 bg-[#f4f0e8] border-b border-[#e5dfd5]">
          <RsvpFormSection 
            rsvpData={data.rsvp} 
            onSubmitRsvp={onSubmitRsvp} 
            theme="light" 
            primaryColor="#2c2c2c" 
            secondaryColor="#d4af37" 
          />
        </section>
      )}

      {/* CLOSING */}
      <footer className="py-20 px-6 text-center text-[#8c827a] font-serif">
        <p className="italic text-lg mb-2">С нетерпением ждем нашей встречи,</p>
        <p className="text-2xl sm:text-3xl font-serif text-[#1f1d1b] font-medium tracking-tight">
          {groom} & {bride}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] font-sans mt-4 opacity-60">
          {formattedDate}
        </p>
      </footer>

    </div>
  );
}
