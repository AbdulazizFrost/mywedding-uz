import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Navigation, 
  Heart, 
  Music as MusicIcon, 
  Sparkles, 
  ChevronDown, 
  Mail, 
  Check, 
  Copy, 
  Share2, 
  BookOpen, 
  UserCheck,
  Disc,
  Play,
  Pause
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '../shared/CountdownTimer.jsx';
import ImageLightbox from '../shared/ImageLightbox.jsx';
import RsvpFormSection from '../shared/RsvpFormSection.jsx';

export default function MinimalTemplate({ data = {}, media = [], onSubmitRsvp }) {
  const { t, i18n } = useTranslation();
  const [isOpened, setIsOpened] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef(null);

  // Dynamic user data mapping with quiet luxury defaults
  const groom = data.groom_name || 'Азамат';
  const bride = data.bride_name || 'Мадина';
  const weddingDate = data.wedding_date || '2026-09-24';
  const weddingTime = data.wedding_time || '17:00';
  const ceremonyTime = data.ceremony_time || '18:00';
  const receptionTime = data.reception_time || '19:30';
  const venueName = data.venue_name || 'Versal Palace';
  const address = data.address || 'г. Ташкент, Мирзо-Улугбекский район, ул. Ниёзбек Йули, 1';
  const mapUrl = data.map_url || 'https://maps.yandex.ru';
  const quote = data.quote || 'Два сердца — одна история, два пути — одна судьба.';

  const musicUrl = data.music?.url || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-114429.mp3';
  const musicEnabled = data.music?.enabled !== false;

  // Design tokens & palettes
  const design = data.design || {};
  const primaryColor = design.primary_color || '#1F1E1D';
  const secondaryColor = design.secondary_color || '#C8A66A'; // Champagne Gold

  // Formatted date
  const dateObj = weddingDate ? new Date(weddingDate) : new Date('2026-09-24');
  const formattedDate = dateObj.toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  );
  const formattedDateUpper = formattedDate.toUpperCase();

  const weddingDayNumber = dateObj.getDate();
  const weddingMonthName = dateObj.toLocaleDateString(
    i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU', 
    { month: 'long' }
  ).toUpperCase();
  const weddingYearNumber = dateObj.getFullYear();

  const galleryImages = media.filter(m => m.type !== 'music');
  const coverPhoto = galleryImages[0]?.url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85';

  // Music handling
  const togglePlayMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio playback prevented:', err));
    }
  };

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (musicEnabled && audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Autoplay prevented by browser:', err));
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venueName}, ${address}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`Свадьба: ${groom} & ${bride}`);
    const details = encodeURIComponent(`Свадебное торжество ${groom} и ${bride}. ${venueName}, ${address}.`);
    const location = encodeURIComponent(`${venueName}, ${address}`);
    const dateFormatted = weddingDate.replace(/-/g, '');
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T120000Z/${dateFormatted}T180000Z`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1F1E1D] font-sans selection:bg-[#C8A66A]/25 selection:text-[#1F1E1D] relative overflow-x-hidden">
      
      {/* Hidden Audio Element */}
      {musicEnabled && (
        <audio 
          ref={audioRef}
          src={musicUrl}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Floating Music Toggle Pill (Visible after opening invitation) */}
      {musicEnabled && isOpened && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={togglePlayMusic}
          className="fixed top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#C8A66A]/30 shadow-md text-xs font-medium text-[#1F1E1D] hover:bg-white hover:border-[#C8A66A] transition-all"
          aria-label={isPlaying ? "Выключить музыку" : "Включить музыку"}
        >
          <div className="flex items-center gap-0.5 h-3">
            <span className={`w-0.5 bg-[#C8A66A] rounded-full transition-all ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
            <span className={`w-0.5 bg-[#C8A66A] rounded-full transition-all ${isPlaying ? 'h-2.5 animate-pulse delay-75' : 'h-1'}`} />
            <span className={`w-0.5 bg-[#C8A66A] rounded-full transition-all ${isPlaying ? 'h-3.5 animate-pulse delay-150' : 'h-1'}`} />
          </div>
          <span className="text-[11px] uppercase tracking-wider">{isPlaying ? t('common.musicPlaying') || 'Музыка' : t('common.music') || 'Музыка'}</span>
        </motion.button>
      )}

      {/* Lightbox for Photos */}
      <ImageLightbox 
        images={galleryImages} 
        selectedIndex={lightboxIndex} 
        onClose={() => setLightboxIndex(null)} 
        onSelectIndex={setLightboxIndex} 
      />

      {/* ==========================================================================
          1. FULLSCREEN COVER SCREEN OVERLAY (MATCHES USER'S EXACT REFERENCE DESIGN)
          ========================================================================== */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#FAF7F0_0%,#F5F0E5_100%)] p-4 sm:p-6 overflow-hidden select-none"
          >
            {/* Top-Left Ambient Shadow Drapery */}
            <div className="absolute -top-16 -left-16 w-80 h-96 bg-[radial-gradient(ellipse_at_center,rgba(120,110,95,0.09)_0%,transparent_70%)] blur-2xl -rotate-12 pointer-events-none" />

            {/* Right Side Baby's Breath Floral Ambient Aura */}
            <div className="absolute top-[10%] -right-12 bottom-0 w-64 bg-[radial-gradient(circle_at_75%_30%,rgba(200,166,106,0.14)_0%,transparent_60%),radial-gradient(circle_at_85%_70%,rgba(200,166,106,0.18)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center my-auto">
              
              {/* Bismillah Arabic Calligraphy */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-serif text-2xl sm:text-3xl text-[#7B7365] mb-2 tracking-wide opacity-90"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </motion.div>

              {/* Subtitle */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-[9.5px] uppercase tracking-[0.28em] font-semibold text-[#C8A66A] mb-4"
              >
                DIGITAL WEDDING INVITATION
              </motion.div>

              {/* Tag */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="font-serif text-xs uppercase tracking-[0.35em] text-[#9F824F] font-medium mb-3"
              >
                С В А Д Ь Б А
              </motion.div>

              {/* Couple Names in Large Elegant Serif */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="flex flex-col items-center my-2"
              >
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-[#1F1E1D] leading-[0.95] tracking-tight">
                  {groom}
                </h1>
                
                <div className="flex items-center justify-center gap-3 my-2 w-44">
                  <span className="h-px flex-1 bg-[#C8A66A]/50" />
                  <span className="font-serif italic text-2xl text-[#C8A66A] font-light leading-none">&</span>
                  <span className="h-px flex-1 bg-[#C8A66A]/50" />
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-[#1F1E1D] leading-[0.95] tracking-tight">
                  {bride}
                </h1>
              </motion.div>

              {/* Date & Location Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="flex items-center gap-3 my-4 px-3 py-1"
              >
                <div className="text-[#C8A66A]">
                  <CalendarIcon size={22} strokeWidth={1.6} />
                </div>
                <div className="w-px h-8 bg-[#C8A66A]/50" />
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1F1E1D]">
                    {formattedDateUpper}
                  </span>
                  <span className="text-[9.5px] uppercase tracking-widest text-[#726E65] font-medium mt-0.5">
                    {venueName.toUpperCase()}
                  </span>
                </div>
              </motion.div>

              {/* Romantic Quote */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="font-serif italic text-sm text-[#726E65] leading-relaxed max-w-[280px] my-2"
              >
                «{quote}»
              </motion.p>

              {/* Heart Line Flourish */}
              <div className="flex items-center justify-center gap-3 w-48 my-3">
                <span className="h-px flex-1 bg-[#C8A66A]/50" />
                <span className="text-xs text-[#C8A66A]">♡</span>
                <span className="h-px flex-1 bg-[#C8A66A]/50" />
              </div>

              {/* Open Invitation CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                onClick={handleOpenInvitation}
                className="w-full max-w-xs py-4 px-6 rounded-full bg-[#1F1E1D] text-white flex items-center justify-center gap-2.5 shadow-xl hover:bg-black transition-all cursor-pointer mt-3 mb-4 group"
              >
                <Mail size={18} className="text-[#E2CCA0] transition-transform group-hover:scale-110" />
                <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                  {t('previewComponent.openInvitation') || 'ОТКРЫТЬ ПРИГЛАШЕНИЕ'}
                </span>
              </motion.button>

              {/* Down Chevrons */}
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="flex flex-col items-center gap-1 opacity-60 text-[#C8A66A]"
              >
                <ChevronDown size={16} />
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================================================
          2. MAIN WEDDING INVITATION WEBSITE (DISPLAYS AFTER OPENING)
          ========================================================================== */}
      <main className={`w-full max-w-xl mx-auto px-4 sm:px-6 py-10 pb-28 space-y-8 transition-opacity duration-700 ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Top Mini Brand Navigation */}
        <div className="flex items-center justify-center gap-2 py-4 font-serif text-sm text-[#9F824F] tracking-widest uppercase">
          <span>{groom[0]} & {bride[0]}</span>
          <span className="opacity-40">·</span>
          <span>{formattedDate}</span>
        </div>

        {/* 1. COVER PHOTO CARD */}
        <section className="bg-white border border-[#C8A66A]/25 rounded-3xl p-2.5 sm:p-3 shadow-sm overflow-hidden">
          <div 
            onClick={() => galleryImages.length > 0 && setLightboxIndex(0)}
            className="aspect-[4/5] sm:aspect-[16/11] rounded-2xl overflow-hidden cursor-pointer relative group"
          >
            <img 
              src={coverPhoto} 
              alt="Love Story" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <p className="font-serif italic text-white text-base sm:text-lg drop-shadow-md">
                «С этого дня и навсегда...»
              </p>
            </div>
          </div>
        </section>

        {/* 2. INVITATION LETTER / MESSAGE */}
        <section id="letter" className="bg-white border border-[#C8A66A]/25 rounded-3xl p-8 sm:p-10 text-center shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C8A66A] block mb-2">
            {t('previewComponent.dearGuests') || 'ДОРОГИЕ ГОСТИ'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] font-normal mb-3">
            {t('previewComponent.weGetMarried') || 'Мы женимся!'}
          </h2>
          
          <div className="flex items-center justify-center gap-3 my-4 text-[#C8A66A]">
            <span className="h-px w-8 bg-[#C8A66A]/40" />
            <span>❖</span>
            <span className="h-px w-8 bg-[#C8A66A]/40" />
          </div>

          <p className="text-sm sm:text-base text-[#726E65] leading-relaxed font-light max-w-md mx-auto mb-4">
            В нашей жизни наступает особенный день — день создания нашей семьи. 
            Мы будем счастливы разделить этот радостный и незабываемый праздник 
            вместе с нашими самыми дорогими и близкими людьми.
          </p>

          <div className="mt-8 flex flex-col items-center">
            <span className="font-serif italic text-sm text-[#C8A66A]">{t('previewComponent.withLove') || 'С любовью,'}</span>
            <strong className="font-serif text-xl sm:text-2xl text-[#1F1E1D] font-medium mt-1">
              {groom} & {bride}
            </strong>
          </div>
        </section>

        {/* 3. DUAL GRID: INTERACTIVE CALENDAR & REAL-TIME COUNTDOWN */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Mini Calendar Month Card */}
          <div className="bg-white border border-[#C8A66A]/25 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-center">
            <div>
              <div className="flex justify-between items-center border-b border-[#EAE4D8] pb-2.5 mb-3 text-[10px] font-bold tracking-wider">
                <span className="text-[#1F1E1D]">{weddingMonthName} {weddingYearNumber}</span>
                <span className="text-[#C8A66A]">{venueName.split(' ')[0] || 'ТАШКЕНТ'}</span>
              </div>

              <div className="grid grid-cols-7 text-[10px] font-semibold text-[#C8A66A] mb-2">
                <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
              </div>

              <div className="grid grid-cols-7 gap-y-1 text-xs text-[#726E65] mb-5">
                <span className="opacity-0">1</span><span className="opacity-0">2</span>
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
                <span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span>
                <span>20</span><span>21</span><span>22</span><span>23</span>
                <span className="relative flex items-center justify-center w-6 h-6 mx-auto rounded-full bg-[#1F1E1D] text-white font-bold shadow-md">
                  {weddingDayNumber}
                  <span className="absolute -top-2 -right-1 text-[8px] text-[#C8A66A]">♡</span>
                </span>
                <span>25</span><span>26</span><span>27</span><span>28</span><span>29</span><span>30</span>
              </div>
            </div>

            <button
              onClick={handleAddToCalendar}
              className="w-full py-2.5 px-4 rounded-full bg-[#F3EFE6] border border-[#C8A66A]/30 text-[11px] font-semibold uppercase tracking-wider text-[#1F1E1D] hover:bg-white hover:border-[#C8A66A] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CalendarIcon size={13} />
              <span>{t('previewComponent.addToCalendar') || 'В календарь'}</span>
            </button>
          </div>

          {/* Countdown Timer Card */}
          <div className="bg-white border border-[#C8A66A]/25 rounded-3xl p-6 shadow-sm flex flex-col justify-between text-center">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C8A66A] block mb-1">
                {t('previewComponent.countdownBadge') || 'ОБРАТНЫЙ ОТСЧЁТ'}
              </span>
              <h3 className="font-serif text-lg text-[#1F1E1D] font-medium mb-4">
                {t('previewComponent.timeUntil') || 'До нашей свадьбы:'}
              </h3>
              
              <div className="py-2">
                <CountdownTimer targetDate={weddingDate} primaryColor="#1F1E1D" secondaryColor="#C8A66A" />
              </div>
            </div>

            <p className="font-serif italic text-xs text-[#726E65] mt-3">
              Ждём встречи с вами!
            </p>
          </div>

        </section>

        {/* 4. WEDDING SCHEDULE (TIMELINE) */}
        <section id="schedule" className="bg-white border border-[#C8A66A]/25 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C8A66A] block mb-1">
              {t('previewComponent.programBadge') || 'ПРОГРАММА ДНЯ'}
            </span>
            <h2 className="font-serif text-3xl text-[#1F1E1D] font-normal">
              {t('previewComponent.program') || 'Расписание'}
            </h2>
            <div className="flex items-center justify-center gap-3 my-2 text-[#C8A66A]">
              <span className="h-px w-6 bg-[#C8A66A]/40" />
              <span>❖</span>
              <span className="h-px w-6 bg-[#C8A66A]/40" />
            </div>
          </div>

          <div className="space-y-3">
            
            {/* 1. Welcome */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F5EE] border border-[#C8A66A]/20">
              <span className="font-serif text-base font-semibold text-[#1F1E1D] px-3 py-1 rounded-full bg-white border border-[#C8A66A]/30 shrink-0">
                {weddingTime}
              </span>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#1F1E1D]">
                  {t('previewComponent.gathering') || 'Сбор гостей & Welcome'}
                </h4>
                <p className="text-xs text-[#726E65] mt-1 leading-relaxed">
                  Встреча гостей, легкие напитки, живая музыка и праздничная фотозона.
                </p>
              </div>
            </div>

            {/* 2. Ceremony */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F5EE] border border-[#C8A66A]/20">
              <span className="font-serif text-base font-semibold text-[#1F1E1D] px-3 py-1 rounded-full bg-white border border-[#C8A66A]/30 shrink-0">
                {ceremonyTime}
              </span>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#1F1E1D]">
                  {t('previewComponent.ceremony') || 'Торжественная церемония'}
                </h4>
                <p className="text-xs text-[#726E65] mt-1 leading-relaxed">
                  Обмен кольцами, свадебными клятвами и поздравления молодоженов.
                </p>
              </div>
            </div>

            {/* 3. Reception */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F5EE] border border-[#C8A66A]/20">
              <span className="font-serif text-base font-semibold text-[#1F1E1D] px-3 py-1 rounded-full bg-white border border-[#C8A66A]/30 shrink-0">
                {receptionTime}
              </span>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#1F1E1D]">
                  {t('previewComponent.reception') || 'Праздничный банкет'}
                </h4>
                <p className="text-xs text-[#726E65] mt-1 leading-relaxed">
                  Изысканный ужин, поздравления от близких, первый танец и шоу-программа.
                </p>
              </div>
            </div>

            {/* 4. Cake & Fireworks */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F5EE] border border-[#C8A66A]/20">
              <span className="font-serif text-base font-semibold text-[#1F1E1D] px-3 py-1 rounded-full bg-white border border-[#C8A66A]/30 shrink-0">
                23:00
              </span>
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#1F1E1D]">
                  {t('previewComponent.cake') || 'Свадебный торт & Салют'}
                </h4>
                <p className="text-xs text-[#726E65] mt-1 leading-relaxed">
                  Торжественное разрезание торта и кульминация вечера праздничными огнями.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 5. LOVE STORY (If enabled) */}
        {data.story?.enabled && data.story?.story && (
          <section className="bg-white border border-[#C8A66A]/25 rounded-3xl p-8 text-center shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C8A66A] block mb-1">
              {t('previewComponent.ourStory') || 'ИСТОРИЯ ЛЮБВИ'}
            </span>
            <h2 className="font-serif text-3xl text-[#1F1E1D] font-normal mb-3">
              {data.story?.story_title || 'Как всё начиналось'}
            </h2>
            <div className="flex items-center justify-center gap-3 my-3 text-[#C8A66A]">
              <span className="h-px w-6 bg-[#C8A66A]/40" />
              <span>❖</span>
              <span className="h-px w-6 bg-[#C8A66A]/40" />
            </div>
            <p className="text-sm text-[#726E65] leading-relaxed font-light max-w-lg mx-auto whitespace-pre-line">
              {data.story?.story}
            </p>
          </section>
        )}

        {/* 6. PHOTO GALLERY (If uploaded) */}
        {galleryImages.length > 1 && (
          <section className="bg-white border border-[#C8A66A]/25 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C8A66A] block mb-1">
                {t('previewComponent.gallery') || 'ГАЛЕРЕЯ'}
              </span>
              <h2 className="font-serif text-3xl text-[#1F1E1D] font-normal">
                {t('previewComponent.moments') || 'Наши моменты'}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryImages.map((img, idx) => (
                <div 
                  key={img.id || idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative bg-[#F8F5EE]"
                >
                  <img 
                    src={img.url} 
                    alt="Gallery photo" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. VENUE & LOCATION */}
        <section id="venue" className="bg-white border border-[#C8A66A]/25 rounded-3xl overflow-hidden shadow-sm">
          <div className="h-52 sm:h-64 relative bg-[#F8F5EE]">
            <img 
              src="https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1000&q=80" 
              alt="Банкетный зал" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider">
              {t('previewComponent.venue') || 'Банкетный зал'}
            </div>
          </div>

          <div className="p-6 sm:p-8 text-center">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C8A66A] block mb-1">
              {t('previewComponent.location') || 'ЛОКАЦИЯ'}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] font-medium mb-2">
              {venueName}
            </h3>
            <p className="text-xs sm:text-sm text-[#726E65] max-w-sm mx-auto mb-6">
              {address}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {mapUrl && (
                <a 
                  href={mapUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1F1E1D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  <Navigation size={14} />
                  <span>{t('previewComponent.openMap') || 'Открыть в картах'}</span>
                </a>
              )}
              
              <button 
                onClick={handleCopyAddress}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#F3EFE6] border border-[#C8A66A]/30 text-xs font-semibold uppercase tracking-wider text-[#1F1E1D] hover:bg-white hover:border-[#C8A66A] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copied ? t('common.copied') || 'Скопировано!' : t('common.copyAddress') || 'Скопировать адрес'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 8. DRESS CODE */}
        <section className="bg-white border border-[#C8A66A]/25 rounded-3xl p-6 sm:p-8 text-center shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#C8A66A] block mb-1">
            DRESS CODE
          </span>
          <h2 className="font-serif text-3xl text-[#1F1E1D] font-normal mb-2">
            {t('previewComponent.dressCode') || 'Пожелания по стилю'}
          </h2>
          <div className="flex items-center justify-center gap-3 my-2 text-[#C8A66A]">
            <span className="h-px w-6 bg-[#C8A66A]/40" />
            <span>❖</span>
            <span className="h-px w-6 bg-[#C8A66A]/40" />
          </div>

          <p className="text-xs sm:text-sm text-[#726E65] max-w-sm mx-auto mb-6">
            Будем благодарны, если вы поддержите цветовую гамму нашего праздника в своих нарядах:
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-[#1F1E1D] border-2 border-white shadow-md" />
              <span className="text-[10px] text-[#726E65]">Black</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-[#8C7B6B] border-2 border-white shadow-md" />
              <span className="text-[10px] text-[#726E65]">Taupe</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-[#C8A66A] border-2 border-white shadow-md" />
              <span className="text-[10px] text-[#726E65]">Champagne</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-[#E2DDD5] border-2 border-white shadow-md" />
              <span className="text-[10px] text-[#726E65]">Sand</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F2] border-2 border-white shadow-md" />
              <span className="text-[10px] text-[#726E65]">Ivory</span>
            </div>
          </div>
        </section>

        {/* 9. RSVP FORM */}
        {data.rsvp?.enabled !== false && (
          <section id="rsvp" className="bg-white border border-[#C8A66A]/25 rounded-3xl p-6 sm:p-8 shadow-sm">
            <RsvpFormSection 
              rsvpData={data.rsvp} 
              onSubmitRsvp={onSubmitRsvp} 
              theme="light" 
              primaryColor="#1F1E1D" 
              secondaryColor="#C8A66A" 
            />
          </section>
        )}

        {/* 10. FOOTER */}
        <footer className="text-center pt-8 pb-4 text-[#726E65]">
          <div className="font-serif italic text-2xl text-[#C8A66A] mb-1">
            {groom[0]} & {bride[0]}
          </div>
          <p className="font-serif text-lg text-[#1F1E1D] mb-1">
            {groom} & {bride}
          </p>
          <p className="text-xs tracking-widest text-[#9F824F] mb-6">
            {formattedDateUpper} · {venueName.toUpperCase()}
          </p>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#C8A66A]/80">
            BizningToy.uz — Цифровые свадебные приглашения
          </div>
        </footer>

      </main>

      {/* Sticky Bottom Navigation Bar on Mobile when opened */}
      {isOpened && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-md border border-[#C8A66A]/30 rounded-full py-2 px-5 shadow-lg flex items-center gap-6 text-xs text-[#726E65]"
        >
          <a href="#letter" className="flex flex-col items-center gap-0.5 hover:text-[#1F1E1D] transition-colors">
            <BookOpen size={14} className="text-[#C8A66A]" />
            <span className="text-[9px] uppercase tracking-wider">{t('previewComponent.navLetter') || 'Письмо'}</span>
          </a>
          <a href="#schedule" className="flex flex-col items-center gap-0.5 hover:text-[#1F1E1D] transition-colors">
            <Clock size={14} className="text-[#C8A66A]" />
            <span className="text-[9px] uppercase tracking-wider">{t('previewComponent.navProgram') || 'Программа'}</span>
          </a>
          <a href="#venue" className="flex flex-col items-center gap-0.5 hover:text-[#1F1E1D] transition-colors">
            <MapPin size={14} className="text-[#C8A66A]" />
            <span className="text-[9px] uppercase tracking-wider">{t('previewComponent.navLocation') || 'Место'}</span>
          </a>
          <a href="#rsvp" className="flex flex-col items-center gap-0.5 hover:text-[#1F1E1D] transition-colors">
            <UserCheck size={14} className="text-[#C8A66A]" />
            <span className="text-[9px] uppercase tracking-wider">RSVP</span>
          </a>
        </motion.div>
      )}

    </div>
  );
}
