import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, ChevronDown, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../shared/CountdownTimer.jsx';
import FloatingMusicPlayer from '../shared/FloatingMusicPlayer.jsx';
import ImageLightbox from '../shared/ImageLightbox.jsx';
import RsvpFormSection from '../shared/RsvpFormSection.jsx';

export default function SilkTemplate({ data = {}, media = [], onSubmitRsvp }) {
  const { t, i18n } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const groom = data.groom_name || 'Сардор';
  const bride = data.bride_name || 'Мадина';
  const weddingDate = data.wedding_date || '2026-09-24';
  const weddingTime = data.wedding_time || '17:00';
  const ceremonyTime = data.ceremony_time || '18:00';
  const receptionTime = data.reception_time || '19:30';
  const venueName = data.venue_name || 'Silk Road Palace';
  const address = data.address || 'г. Ташкент, ул. Амира Темура, 15';
  const mapUrl = data.map_url || 'https://maps.yandex.ru';
  const quote = data.quote || 'Как нежный шелк окутывает теплом, так и наша любовь дарит покой и бесконечное вдохновение.';

  const design = data.design || {};
  const primaryColor = design.primary_color || '#332f2c';
  const secondaryColor = design.secondary_color || '#c5a880';

  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  ) : '24 Сентября 2026';

  const galleryImages = media.filter(m => m.type !== 'music');

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#332f2c] font-serif selection:bg-[#c5a880]/30 selection:text-[#332f2c] overflow-x-hidden relative">
      
      {/* Floating Music Player */}
      <FloatingMusicPlayer music={data.music} primaryColor="#332f2c" secondaryColor="#c5a880" />

      {/* Lightbox */}
      <ImageLightbox 
        images={galleryImages} 
        selectedIndex={lightboxIndex} 
        onClose={() => setLightboxIndex(null)} 
        onSelectIndex={setLightboxIndex} 
      />

      {/* HERO / SILK COVER */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-between p-6 sm:p-12 text-center border-b border-[#ece4d8] bg-gradient-to-b from-[#ffffff] via-[#f7f2eb] to-[#faf7f2]">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="pt-8"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3 border border-[#ece4d8]">
            <Sparkles size={20} className="text-[#c5a880]" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#8e857c] font-sans">
            Silk & Soft Luxury
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="my-auto py-10"
        >
          <p className="font-serif italic text-lg sm:text-2xl text-[#c5a880] mb-3">Союз двух любящих сердец</p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#24211e] tracking-tight leading-tight">
            {groom}
          </h1>
          <p className="my-3 font-serif italic text-3xl sm:text-4xl text-[#c5a880]">и</p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#24211e] tracking-tight leading-tight">
            {bride}
          </h1>
          <p className="mt-8 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#7a7269] font-sans">
            {formattedDate}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pb-4 flex flex-col items-center text-[#8e857c]"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-sans mb-2 opacity-70">
            {t('preview.invitationTo') || 'Приглашение'}
          </span>
          <ChevronDown size={18} className="animate-bounce text-[#c5a880]" />
        </motion.div>
      </section>

      {/* SILK QUOTE */}
      <section className="py-20 sm:py-28 px-6 max-w-3xl mx-auto text-center border-b border-[#ece4d8]">
        <blockquote className="text-xl sm:text-3xl font-serif font-light text-[#332f2c] leading-relaxed italic">
          «{quote}»
        </blockquote>
        <div className="mt-8 w-12 h-px bg-[#c5a880] mx-auto" />
      </section>

      {/* COUNTDOWN */}
      {weddingDate && (
        <section className="py-16 px-6 bg-[#f2ece1] border-b border-[#ece4d8] text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8e857c] font-sans font-medium block mb-4">
            {t('countdown.title') || 'До нашего торжества'}
          </span>
          <CountdownTimer targetDate={weddingDate} primaryColor="#332f2c" secondaryColor="#c5a880" />
        </section>
      )}

      {/* SCHEDULE */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto border-b border-[#ece4d8]">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] font-sans font-medium block mb-3">
            {t('previewComponent.program') || 'План дня'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#24211e]">
            Программа вечера
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#ece4d8] text-center shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c5a880] font-bold">{weddingTime}</span>
            <h3 className="text-2xl font-serif text-[#24211e] mt-2 mb-2">{t('previewComponent.gathering') || 'Сбор гостей'}</h3>
            <p className="text-xs text-[#7a7269] font-sans leading-relaxed">Приветственный коктейль, струнный квартет и фотосессия</p>
          </div>

          <div className="p-8 rounded-3xl bg-[#f5ede2] border border-[#c5a880]/40 text-center shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c5a880] font-bold">{ceremonyTime}</span>
            <h3 className="text-2xl font-serif text-[#24211e] mt-2 mb-2">{t('previewComponent.ceremony') || 'Церемония'}</h3>
            <p className="text-xs text-[#7a7269] font-sans leading-relaxed">Торжественные клятвы и обмен кольцами при свечах</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#ece4d8] text-center shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c5a880] font-bold">{receptionTime}</span>
            <h3 className="text-2xl font-serif text-[#24211e] mt-2 mb-2">{t('previewComponent.reception') || 'Банкет'}</h3>
            <p className="text-xs text-[#7a7269] font-sans leading-relaxed">Праздничный ужин, шоу-программа и первый танец</p>
          </div>
        </div>
      </section>

      {/* STORY */}
      {data.story?.enabled && (
        <section className="py-24 sm:py-32 px-6 max-w-3xl mx-auto text-center border-b border-[#ece4d8]">
          <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] font-sans font-medium block mb-3">
            {t('previewComponent.ourStory') || 'Наша история'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#24211e] mb-8">
            {data.story?.story_title || 'Наша история'}
          </h2>
          <p className="text-base sm:text-lg text-[#5c544d] font-serif leading-relaxed italic whitespace-pre-line">
            {data.story?.story}
          </p>
        </section>
      )}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="py-24 sm:py-32 px-4 sm:px-8 max-w-6xl mx-auto border-b border-[#ece4d8]">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] font-sans font-medium block mb-3">
              {t('editor.gallery') || 'Фотоальбом'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#24211e]">
              Счастливые моменты
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxIndex(idx)}
                className="aspect-[3/4] rounded-3xl overflow-hidden shadow-sm cursor-pointer border border-[#ece4d8] bg-white group relative"
              >
                <img
                  src={img.url}
                  alt="Silk luxury wedding"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* VENUE */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto text-center border-b border-[#ece4d8]">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] font-sans font-medium block mb-3">
          {t('previewComponent.location') || 'Локация'}
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#24211e] mb-6">
          {venueName}
        </h2>
        <p className="text-base sm:text-lg text-[#7a7269] font-sans font-light mb-8 max-w-md mx-auto">
          {address}
        </p>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#332f2c] text-[#faf7f2] text-xs uppercase tracking-widest font-sans font-semibold hover:bg-[#c5a880] transition-colors shadow-md"
          >
            <Navigation size={16} />
            <span>{t('previewComponent.openMap') || 'Маршрут на карте'}</span>
          </a>
        )}
      </section>

      {/* RSVP */}
      {data.rsvp?.enabled && (
        <section className="py-24 sm:py-32 px-6 bg-[#f2ece1] border-b border-[#ece4d8]">
          <RsvpFormSection 
            rsvpData={data.rsvp} 
            onSubmitRsvp={onSubmitRsvp} 
            theme="light" 
            primaryColor="#332f2c" 
            secondaryColor="#c5a880" 
          />
        </section>
      )}

      {/* CLOSING */}
      <footer className="py-20 px-6 text-center text-[#8e857c] font-serif">
        <p className="italic text-lg mb-2">С любовью и уважением,</p>
        <p className="text-2xl sm:text-3xl font-serif text-[#24211e] font-medium">
          {groom} & {bride}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] font-sans mt-4 opacity-70">
          {formattedDate}
        </p>
      </footer>

    </div>
  );
}
