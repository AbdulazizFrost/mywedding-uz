import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Navigation, Leaf, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../shared/CountdownTimer.jsx';
import FloatingMusicPlayer from '../shared/FloatingMusicPlayer.jsx';
import ImageLightbox from '../shared/ImageLightbox.jsx';
import RsvpFormSection from '../shared/RsvpFormSection.jsx';

export default function BotanicalTemplate({ data = {}, media = [], onSubmitRsvp }) {
  const { t, i18n } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const groom = data.groom_name || 'Сардор';
  const bride = data.bride_name || 'Мадина';
  const weddingDate = data.wedding_date || '2026-09-24';
  const weddingTime = data.wedding_time || '17:00';
  const ceremonyTime = data.ceremony_time || '18:00';
  const receptionTime = data.reception_time || '19:30';
  const venueName = data.venue_name || 'Botanical Garden Pavilion';
  const address = data.address || 'г. Ташкент, Ботанический сад';
  const mapUrl = data.map_url || 'https://maps.yandex.ru';
  const quote = data.quote || 'Как два дерева сплетаются ветвями и уходят корнями в глубину, так и наша любовь растет день за днем.';

  const design = data.design || {};
  const primaryColor = design.primary_color || '#283618';
  const secondaryColor = design.secondary_color || '#606c38';

  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  ) : '24 Сентября 2026';

  const galleryImages = media.filter(m => m.type !== 'music');

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#283618] font-serif selection:bg-[#606c38]/20 selection:text-[#283618] overflow-x-hidden relative">
      
      {/* Floating Music Player */}
      <FloatingMusicPlayer music={data.music} primaryColor="#283618" secondaryColor="#606c38" />

      {/* Lightbox */}
      <ImageLightbox 
        images={galleryImages} 
        selectedIndex={lightboxIndex} 
        onClose={() => setLightboxIndex(null)} 
        onSelectIndex={setLightboxIndex} 
      />

      {/* HERO / BOTANICAL COVER */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-between p-6 sm:p-12 text-center border-b border-[#e8e4dc] bg-gradient-to-b from-[#f7f9f5] to-[#fcfaf7]">
        
        {/* Leaf Emblem */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="pt-8"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3 border border-[#d8decb]">
            <Leaf size={22} className="text-[#606c38]" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#606c38] font-sans font-medium">
            Botanical Wedding
          </span>
        </motion.div>

        {/* Central Names */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="my-auto py-10"
        >
          <p className="font-serif italic text-lg sm:text-2xl text-[#606c38] mb-3">Приглашение на свадьбу</p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#1b2610] tracking-tight leading-tight">
            {groom}
          </h1>
          <p className="my-3 font-serif italic text-3xl sm:text-4xl text-[#606c38]">&</p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#1b2610] tracking-tight leading-tight">
            {bride}
          </h1>
          <p className="mt-8 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#606c38] font-sans">
            {formattedDate}
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pb-4 flex flex-col items-center text-[#606c38]/70"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-sans mb-2">
            {t('preview.invitationTo') || 'Приглашение'}
          </span>
          <ChevronDown size={18} className="animate-bounce text-[#606c38]" />
        </motion.div>
      </section>

      {/* BOTANICAL QUOTE */}
      <section className="py-20 sm:py-28 px-6 max-w-3xl mx-auto text-center border-b border-[#e8e4dc]">
        <blockquote className="text-xl sm:text-3xl font-serif font-light text-[#283618] leading-relaxed italic">
          «{quote}»
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-2 text-[#606c38]">
          <span className="h-px w-8 bg-[#606c38]/40" />
          <Leaf size={14} className="text-[#606c38]" />
          <span className="h-px w-8 bg-[#606c38]/40" />
        </div>
      </section>

      {/* COUNTDOWN */}
      {weddingDate && (
        <section className="py-16 px-6 bg-[#f3f5ee] border-b border-[#e8e4dc] text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#606c38] font-sans font-medium block mb-4">
            {t('countdown.title') || 'До начала церемонии'}
          </span>
          <CountdownTimer targetDate={weddingDate} primaryColor="#283618" secondaryColor="#606c38" />
        </section>
      )}

      {/* SCHEDULE */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto border-b border-[#e8e4dc]">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#606c38] font-sans font-medium block mb-3">
            {t('previewComponent.program') || 'План дня'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1b2610]">
            Свадебное расписание
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#d8decb] text-center shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#606c38] font-bold">{weddingTime}</span>
            <h3 className="text-2xl font-serif text-[#1b2610] mt-2 mb-2">{t('previewComponent.gathering') || 'Сбор гостей'}</h3>
            <p className="text-xs text-[#525f46] font-sans leading-relaxed">Приветственный лимонад, фрукты и акустическая музыка в саду</p>
          </div>

          <div className="p-8 rounded-3xl bg-[#edf1e4] border border-[#606c38]/30 text-center shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#606c38] font-bold">{ceremonyTime}</span>
            <h3 className="text-2xl font-serif text-[#1b2610] mt-2 mb-2">{t('previewComponent.ceremony') || 'Церемония'}</h3>
            <p className="text-xs text-[#525f46] font-sans leading-relaxed">Клятвы под сводами зеленой арки и первый поцелуй</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#d8decb] text-center shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#606c38] font-bold">{receptionTime}</span>
            <h3 className="text-2xl font-serif text-[#1b2610] mt-2 mb-2">{t('previewComponent.reception') || 'Банкет в саду'}</h3>
            <p className="text-xs text-[#525f46] font-sans leading-relaxed">Ужин на открытой террасе при свете гирлянд и звезд</p>
          </div>
        </div>
      </section>

      {/* STORY */}
      {data.story?.enabled && (
        <section className="py-24 sm:py-32 px-6 max-w-3xl mx-auto text-center border-b border-[#e8e4dc]">
          <span className="text-xs uppercase tracking-[0.3em] text-[#606c38] font-sans font-medium block mb-3">
            {t('previewComponent.ourStory') || 'Наша история'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1b2610] mb-8">
            {data.story?.story_title || 'Как расцветала любовь'}
          </h2>
          <p className="text-base sm:text-lg text-[#3e4f2b] font-serif leading-relaxed italic whitespace-pre-line">
            {data.story?.story}
          </p>
        </section>
      )}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="py-24 sm:py-32 px-4 sm:px-8 max-w-6xl mx-auto border-b border-[#e8e4dc]">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#606c38] font-sans font-medium block mb-3">
              {t('editor.gallery') || 'Фотоальбом'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1b2610]">
              Памятные кадры
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxIndex(idx)}
                className="aspect-[3/4] rounded-3xl overflow-hidden shadow-sm cursor-pointer border border-[#d8decb] bg-white group relative"
              >
                <img
                  src={img.url}
                  alt="Botanical wedding"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* VENUE */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto text-center border-b border-[#e8e4dc]">
        <span className="text-xs uppercase tracking-[0.3em] text-[#606c38] font-sans font-medium block mb-3">
          {t('previewComponent.location') || 'Локация'}
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#1b2610] mb-6">
          {venueName}
        </h2>
        <p className="text-base sm:text-lg text-[#525f46] font-sans font-light mb-8 max-w-md mx-auto">
          {address}
        </p>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#283618] text-white text-xs uppercase tracking-widest font-sans font-semibold hover:bg-[#606c38] transition-colors shadow-md"
          >
            <Navigation size={16} />
            <span>{t('previewComponent.openMap') || 'Маршрут на карте'}</span>
          </a>
        )}
      </section>

      {/* RSVP */}
      {data.rsvp?.enabled && (
        <section className="py-24 sm:py-32 px-6 bg-[#f3f5ee] border-b border-[#e8e4dc]">
          <RsvpFormSection 
            rsvpData={data.rsvp} 
            onSubmitRsvp={onSubmitRsvp} 
            theme="light" 
            primaryColor="#283618" 
            secondaryColor="#606c38" 
          />
        </section>
      )}

      {/* CLOSING */}
      <footer className="py-20 px-6 text-center text-[#606c38] font-serif">
        <p className="italic text-lg mb-2">С любовью и уважением,</p>
        <p className="text-2xl sm:text-3xl font-serif text-[#1b2610] font-medium">
          {groom} & {bride}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] font-sans mt-4 opacity-70">
          {formattedDate}
        </p>
      </footer>

    </div>
  );
}
