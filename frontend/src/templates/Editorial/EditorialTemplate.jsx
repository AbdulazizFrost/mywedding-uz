import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, ChevronDown, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../shared/CountdownTimer.jsx';
import FloatingMusicPlayer from '../shared/FloatingMusicPlayer.jsx';
import ImageLightbox from '../shared/ImageLightbox.jsx';
import RsvpFormSection from '../shared/RsvpFormSection.jsx';

export default function EditorialTemplate({ data = {}, media = [], onSubmitRsvp }) {
  const { t, i18n } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const groom = data.groom_name || 'САРДОР';
  const bride = data.bride_name || 'МАДИНА';
  const weddingDate = data.wedding_date || '2026-09-24';
  const weddingTime = data.wedding_time || '17:00';
  const ceremonyTime = data.ceremony_time || '18:00';
  const receptionTime = data.reception_time || '19:30';
  const venueName = data.venue_name || 'NAVRUZ PALACE';
  const address = data.address || 'г. Ташкент, ул. Амира Темура, 15';
  const mapUrl = data.map_url || 'https://maps.yandex.ru';
  const quote = data.quote || 'Любовь как искусство — вне времени, вне рамок, искренне и навсегда.';

  const design = data.design || {};
  const primaryColor = design.primary_color || '#111111';
  const secondaryColor = design.secondary_color || '#888888';

  const formattedDate = weddingDate ? new Date(weddingDate).toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  ) : '24 Сентября 2026';

  const galleryImages = media.filter(m => m.type !== 'music');

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111111] font-serif selection:bg-black selection:text-white overflow-x-hidden relative">
      
      {/* Floating Music Player */}
      <FloatingMusicPlayer music={data.music} primaryColor="#111111" secondaryColor="#555555" />

      {/* Lightbox */}
      <ImageLightbox 
        images={galleryImages} 
        selectedIndex={lightboxIndex} 
        onClose={() => setLightboxIndex(null)} 
        onSelectIndex={setLightboxIndex} 
      />

      {/* EDITORIAL HERO / VOGUE MAGAZINE COVER */}
      <section className="relative min-h-[100dvh] flex flex-col justify-between p-6 sm:p-12 border-b border-black">
        
        {/* Magazine Header Bar */}
        <div className="flex justify-between items-center border-b border-black pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#666666]">ISSUE N°01 // WEDDING EDITION</span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#666666]">{formattedDate}</span>
        </div>

        {/* Massive Vogue Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="my-auto py-12"
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#666666] mb-4">THE WEDDING OF</p>
          <div className="flex flex-col">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-serif tracking-tighter uppercase leading-[0.85] font-light">
              {groom}
            </h1>
            <div className="flex items-center gap-6 my-3 sm:my-6">
              <span className="font-serif italic text-3xl sm:text-5xl text-[#888888]">&</span>
              <div className="h-px flex-1 bg-black" />
            </div>
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-serif tracking-tighter uppercase leading-[0.85] font-light text-right">
              {bride}
            </h1>
          </div>
        </motion.div>

        {/* Editorial Subline */}
        <div className="flex flex-col sm:flex-row justify-between items-end border-t border-black pt-4 gap-4">
          <p className="font-sans text-xs uppercase tracking-widest text-[#555555] max-w-xs leading-relaxed">
            CELEBRATING LOVE, ART & ETERNITY IN TASHKENT.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
            <span>SCROLL TO READ</span>
            <ChevronDown size={14} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* EDITORIAL QUOTE BLOCK */}
      <section className="py-24 sm:py-32 px-6 max-w-5xl mx-auto border-b border-black grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-3 font-mono text-xs uppercase tracking-widest text-[#888888]">
          [ EDITORIAL STATEMENT ]
        </div>
        <div className="md:col-span-9">
          <blockquote className="text-2xl sm:text-4xl font-serif font-light leading-snug tracking-tight">
            «{quote}»
          </blockquote>
        </div>
      </section>

      {/* COUNTDOWN */}
      {weddingDate && (
        <section className="py-16 px-6 border-b border-black bg-black text-white text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#888888] block mb-4">
            [ TIME REMAINING ]
          </span>
          <CountdownTimer targetDate={weddingDate} primaryColor="#ffffff" secondaryColor="#ffffff" />
        </section>
      )}

      {/* TIMELINE / SCHEDULE */}
      <section className="py-24 sm:py-32 px-6 max-w-5xl mx-auto border-b border-black">
        <div className="flex justify-between items-baseline mb-16 border-b border-black pb-4">
          <h2 className="text-4xl sm:text-6xl font-serif uppercase tracking-tight font-light">ITINERARY</h2>
          <span className="font-mono text-xs uppercase tracking-widest text-[#666666]">{formattedDate}</span>
        </div>

        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8 border-b border-black/15">
            <div className="md:col-span-3 font-mono text-xl font-light">{weddingTime}</div>
            <div className="md:col-span-4 font-serif text-2xl uppercase tracking-wide">{t('previewComponent.gathering') || 'Сбор гостей'}</div>
            <div className="md:col-span-5 font-sans text-xs text-[#666666] leading-relaxed">Welcome cocktails, photo exhibition and ambient jazz music.</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8 border-b border-black/15">
            <div className="md:col-span-3 font-mono text-xl font-light">{ceremonyTime}</div>
            <div className="md:col-span-4 font-serif text-2xl uppercase tracking-wide">{t('previewComponent.ceremony') || 'Церемония'}</div>
            <div className="md:col-span-5 font-sans text-xs text-[#666666] leading-relaxed">Exchange of wedding vows and union ceremony.</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8 border-b border-black/15">
            <div className="md:col-span-3 font-mono text-xl font-light">{receptionTime}</div>
            <div className="md:col-span-4 font-serif text-2xl uppercase tracking-wide">{t('previewComponent.reception') || 'Гала-ужин'}</div>
            <div className="md:col-span-5 font-sans text-xs text-[#666666] leading-relaxed">Dinner celebration, artistic performances and dancing.</div>
          </div>
        </div>
      </section>

      {/* LOVE STORY */}
      {data.story?.enabled && (
        <section className="py-24 sm:py-32 px-6 max-w-5xl mx-auto border-b border-black grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#888888] block mb-2">[ ARCHIVE ]</span>
            <h2 className="text-3xl sm:text-5xl font-serif uppercase tracking-tight">{data.story?.story_title || 'STORY'}</h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-lg sm:text-xl font-serif leading-relaxed text-[#333333] whitespace-pre-line">
              {data.story?.story}
            </p>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="py-24 sm:py-32 px-6 max-w-6xl mx-auto border-b border-black">
          <div className="flex justify-between items-baseline mb-16 border-b border-black pb-4">
            <h2 className="text-4xl sm:text-6xl font-serif uppercase tracking-tight font-light">EXHIBITION</h2>
            <span className="font-mono text-xs uppercase tracking-widest text-[#666666]">{galleryImages.length} PHOTOGRAPHS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <div 
                key={img.id || idx} 
                onClick={() => setLightboxIndex(idx)}
                className="cursor-pointer group overflow-hidden border border-black/20"
              >
                <div className="aspect-[3/4] overflow-hidden bg-black/5">
                  <img 
                    src={img.url} 
                    alt="Editorial shoot" 
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <div className="p-3 bg-white font-mono text-[10px] uppercase flex justify-between border-t border-black/20">
                  <span>PHOTO {idx + 1}</span>
                  <span>VIEW FULLSCREEN</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VENUE */}
      <section className="py-24 sm:py-32 px-6 max-w-5xl mx-auto border-b border-black grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#888888] block mb-2">[ LOCATION ]</span>
          <h2 className="text-3xl sm:text-5xl font-serif uppercase tracking-tight">{venueName}</h2>
          <p className="font-sans text-xs text-[#666666] mt-4 leading-relaxed">{address}</p>
        </div>
        <div className="md:col-span-8 flex justify-start md:justify-end">
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-[#333333] transition-colors"
            >
              <span>OPEN MAP / NAVIGATION</span>
              <ArrowRight size={16} />
            </a>
          )}
        </div>
      </section>

      {/* RSVP */}
      {data.rsvp?.enabled && (
        <section className="py-24 sm:py-32 px-6 bg-[#f4f4f4] border-b border-black">
          <RsvpFormSection 
            rsvpData={data.rsvp} 
            onSubmitRsvp={onSubmitRsvp} 
            theme="light" 
            primaryColor="#111111" 
            secondaryColor="#111111" 
          />
        </section>
      )}

      {/* CLOSING */}
      <footer className="py-20 px-6 text-center font-mono text-xs uppercase tracking-widest text-[#666666]">
        <p className="mb-2">ALL RIGHTS RESERVED // WEDDING OF</p>
        <p className="text-lg font-serif text-black uppercase tracking-widest">{groom} & {bride}</p>
      </footer>

    </div>
  );
}
