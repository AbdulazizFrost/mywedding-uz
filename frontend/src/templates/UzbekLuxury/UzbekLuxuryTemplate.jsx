import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, ChevronDown, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../shared/CountdownTimer.jsx';
import FloatingMusicPlayer from '../shared/FloatingMusicPlayer.jsx';
import ImageLightbox from '../shared/ImageLightbox.jsx';
import RsvpFormSection from '../shared/RsvpFormSection.jsx';

export default function UzbekLuxuryTemplate({ data = {}, media = [], onSubmitRsvp }) {
  const { t, i18n } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const groom = data.groom_name || 'Сардор';
  const bride = data.bride_name || 'Мадина';
  const weddingDate = data.wedding_date || '2026-09-24';
  const weddingTime = data.wedding_time || '17:00';
  const ceremonyTime = data.ceremony_time || '18:00';
  const receptionTime = data.reception_time || '19:30';
  const venueName = data.venue_name || 'Oqsaroy To‘yxonasi & Palace';
  const address = data.address || 'г. Ташкент, ул. Амира Темура, 15';
  const mapUrl = data.map_url || 'https://maps.yandex.ru';
  const quote = data.quote || 'Bizning baxtli kunimizni siz bilan birga nishonlashdan mamnun bo‘lamiz. Ikki qalbning go‘zal va mustahkam rishtalari muborak bo‘lsin.';

  const design = data.design || {};
  const primaryColor = design.primary_color || '#0b241c'; // Deep Emerald
  const secondaryColor = design.secondary_color || '#d4af37'; // Royal Gold

  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  ) : '24 Sentyabr 2026';

  const galleryImages = media.filter(m => m.type !== 'music');

  return (
    <div className="min-h-screen bg-[#faf8f2] text-[#0b241c] font-serif selection:bg-[#d4af37] selection:text-[#0b241c] overflow-x-hidden relative">
      
      {/* Floating Music Player */}
      <FloatingMusicPlayer music={data.music} primaryColor="#0b241c" secondaryColor="#d4af37" />

      {/* Lightbox */}
      <ImageLightbox 
        images={galleryImages} 
        selectedIndex={lightboxIndex} 
        onClose={() => setLightboxIndex(null)} 
        onSelectIndex={setLightboxIndex} 
      />

      {/* HERO / ROYAL UZBEK COVER */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-between p-6 sm:p-12 text-center border-b border-[#e5dec9] bg-gradient-to-b from-[#f2efe4] via-[#faf8f2] to-[#faf8f2]">
        
        {/* Modern Geometric Ornament Monogram */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="pt-8"
        >
          <div className="w-16 h-16 rounded-2xl rotate-45 border-2 border-[#d4af37] flex items-center justify-center mx-auto mb-5 p-1.5 shadow-sm bg-white">
            <div className="w-full h-full rounded-xl border border-[#d4af37]/40 flex items-center justify-center -rotate-45 font-serif text-sm font-semibold tracking-widest text-[#0b241c]">
              {groom[0]} & {bride[0]}
            </div>
          </div>
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#0b241c] font-sans font-semibold">
            {i18n.language === 'uz' ? 'TO‘Y TAKLIFNOMASI' : 'СВАДЕБНОЕ ТОРЖЕСТВО'}
          </span>
        </motion.div>

        {/* Central Couple Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="my-auto py-10"
        >
          <p className="font-serif italic text-xl sm:text-3xl text-[#d4af37] mb-3">
            {i18n.language === 'uz' ? 'Baxt To‘yi' : 'Свадебный вечер'}
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#0b241c] tracking-tight leading-tight font-light">
            {groom}
          </h1>
          <div className="my-3 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[#d4af37]" />
            <span className="font-serif italic text-3xl sm:text-4xl text-[#d4af37]">&</span>
            <span className="h-px w-16 bg-[#d4af37]" />
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#0b241c] tracking-tight leading-tight font-light">
            {bride}
          </h1>
          <p className="mt-8 text-xs sm:text-sm tracking-[0.3em] uppercase text-[#616e67] font-sans font-medium">
            {formattedDate}
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pb-4 flex flex-col items-center text-[#616e67]"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans mb-2 opacity-70">
            {i18n.language === 'uz' ? 'TAKLIFNOMA' : 'ПРИГЛАШЕНИЕ'}
          </span>
          <ChevronDown size={18} className="animate-bounce text-[#d4af37]" />
        </motion.div>
      </section>

      {/* ROYAL QUOTE / DIL IZHORI */}
      <section className="py-20 sm:py-28 px-6 max-w-3xl mx-auto text-center border-b border-[#e5dec9]">
        <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-semibold block mb-4">
          {i18n.language === 'uz' ? 'AZIZ MEHMONLARIMIZ' : 'ДОРОГИЕ ГОСТИ'}
        </span>
        <blockquote className="text-xl sm:text-3xl font-serif font-light text-[#0b241c] leading-relaxed italic">
          «{quote}»
        </blockquote>
        <div className="mt-8 w-16 h-px bg-[#d4af37] mx-auto" />
      </section>

      {/* COUNTDOWN */}
      {weddingDate && (
        <section className="py-16 px-6 bg-[#0b241c] text-white border-b border-[#e5dec9] text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-semibold block mb-4">
            {i18n.language === 'uz' ? 'TO‘YGURCHA QOLGAN VAQT' : 'ДО НАЧАЛА ТОРЖЕСТВА'}
          </span>
          <CountdownTimer targetDate={weddingDate} primaryColor="#ffffff" secondaryColor="#d4af37" />
        </section>
      )}

      {/* SCHEDULE */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto border-b border-[#e5dec9]">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-semibold block mb-3">
            {i18n.language === 'uz' ? 'TO‘Y DASTURI' : 'ПРОГРАММА ДНЯ'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#0b241c]">
            {i18n.language === 'uz' ? 'Tadbirlar Tartibi' : 'Расписание торжества'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#e5dec9] text-center shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-bold">{weddingTime}</span>
            <h3 className="text-2xl font-serif text-[#0b241c] mt-2 mb-2">
              {i18n.language === 'uz' ? 'Mehmonlar Tashrifi' : 'Сбор гостей'}
            </h3>
            <p className="text-xs text-[#616e67] font-sans leading-relaxed">
              {i18n.language === 'uz' ? 'Karnay-surnay sadolari, tabassum va fotosessiya' : 'Встреча гостей под звуки карная и сурная, фотосессия'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0b241c] text-white border border-[#d4af37] text-center shadow-lg">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-bold">{ceremonyTime}</span>
            <h3 className="text-2xl font-serif text-white mt-2 mb-2">
              {i18n.language === 'uz' ? 'Kelin-Kuyov Kirishi' : 'Церемония'}
            </h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              {i18n.language === 'uz' ? 'Yor-yor sadolari ostida kelin va kuyovning kirib kelishi' : 'Торжественный вход молодоженов под песню «Ёр-ёр»'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#e5dec9] text-center shadow-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-bold">{receptionTime}</span>
            <h3 className="text-2xl font-serif text-[#0b241c] mt-2 mb-2">
              {i18n.language === 'uz' ? 'To‘y Oshi & Bazm' : 'Свадебный банкет'}
            </h3>
            <p className="text-xs text-[#616e67] font-sans leading-relaxed">
              {i18n.language === 'uz' ? 'Shukuhli dasturxon, tabriklar va kuy-qo‘shiqlar' : 'Праздничный дастархан, поздравления и концертная программа'}
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      {data.story?.enabled && (
        <section className="py-24 sm:py-32 px-6 max-w-3xl mx-auto text-center border-b border-[#e5dec9]">
          <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-semibold block mb-3">
            {i18n.language === 'uz' ? 'BIZNING TARIXIMIZ' : 'ИСТОРИЯ ЛЮБВИ'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#0b241c] mb-8">
            {data.story?.story_title || 'Baxtli lahzalar'}
          </h2>
          <p className="text-base sm:text-lg text-[#32453e] font-serif leading-relaxed italic whitespace-pre-line">
            {data.story?.story}
          </p>
        </section>
      )}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="py-24 sm:py-32 px-4 sm:px-8 max-w-6xl mx-auto border-b border-[#e5dec9]">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-semibold block mb-3">
              {i18n.language === 'uz' ? 'FOTOGALEREYA' : 'ГАЛЕРЕЯ'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#0b241c]">
              {i18n.language === 'uz' ? 'Esda Qolarli Onlar' : 'Памятные кадры'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxIndex(idx)}
                className="aspect-[3/4] rounded-3xl overflow-hidden shadow-sm cursor-pointer border-2 border-[#d4af37]/30 bg-white group relative"
              >
                <img
                  src={img.url}
                  alt="Uzbek luxury wedding"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* VENUE */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto text-center border-b border-[#e5dec9]">
        <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-sans font-semibold block mb-3">
          {i18n.language === 'uz' ? 'MANZIL VA LOKATSIYA' : 'ЛОКАЦИЯ'}
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#0b241c] mb-6">
          {venueName}
        </h2>
        <p className="text-base sm:text-lg text-[#616e67] font-sans font-medium mb-8 max-w-md mx-auto">
          {address}
        </p>

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0b241c] text-[#d4af37] text-xs uppercase tracking-widest font-sans font-semibold hover:bg-[#d4af37] hover:text-[#0b241c] transition-colors shadow-lg border border-[#d4af37]"
          >
            <Navigation size={16} />
            <span>{i18n.language === 'uz' ? 'Xaritada ko‘rish' : 'Открыть на карте'}</span>
          </a>
        )}
      </section>

      {/* RSVP */}
      {data.rsvp?.enabled && (
        <section className="py-24 sm:py-32 px-6 bg-[#f2efe4] border-b border-[#e5dec9]">
          <RsvpFormSection 
            rsvpData={data.rsvp} 
            onSubmitRsvp={onSubmitRsvp} 
            theme="light" 
            primaryColor="#0b241c" 
            secondaryColor="#d4af37" 
          />
        </section>
      )}

      {/* CLOSING */}
      <footer className="py-20 px-6 text-center text-[#616e67] font-serif">
        <p className="italic text-lg mb-2">
          {i18n.language === 'uz' ? 'Tashrifingizdan mamnun bo‘lamiz!' : 'С нетерпением ждем вас на нашем празднике!'}
        </p>
        <p className="text-2xl sm:text-3xl font-serif text-[#0b241c] font-medium">
          {groom} & {bride}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] font-sans mt-4 opacity-70">
          {formattedDate}
        </p>
      </footer>

    </div>
  );
}
