import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Default values to prevent undefined errors for old invitations
const defaultData = {
  groom_name: '',
  bride_name: '',
  groom_description: '',
  bride_description: '',
  wedding_date: '',
  wedding_time: '',
  ceremony_time: '',
  reception_time: '',
  venue_name: '',
  address: '',
  map_url: '',
  story: { enabled: false, story_title: '', story: '' },
  music: { enabled: false, title: '', url: '' },
  rsvp: { enabled: true, title: '', description: '', button_text: '' },
  design: { theme: 'elegant', font: 'serif', primary_color: '#333333', secondary_color: '#d4af37' },
};

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

export default function PreviewComponent({ data, media = [], onSubmitRsvp, slug }) {
  // Merge defaults with current data
  const mergedData = {
    ...defaultData,
    ...data,
    story: { ...defaultData.story, ...(data?.story || {}) },
    music: { ...defaultData.music, ...(data?.music || {}) },
    rsvp: { ...defaultData.rsvp, ...(data?.rsvp || {}) },
    design: { ...defaultData.design, ...(data?.design || {}) },
  };

  const { theme, font, primary_color, secondary_color } = mergedData.design;

  const [rsvpState, setRsvpState] = useState({ guest_name: '', status: '', guest_count: 1, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!onSubmitRsvp) return; // Only visual in editor

    setSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);
    
    try {
      await onSubmitRsvp(rsvpState);
      setSubmitMessage(rsvpState.status === 'attending' ? 'С нетерпением ждем вас!' : 'Спасибо, что сообщили нам.');
      setRsvpState({ guest_name: '', status: '', guest_count: 1, comment: '' }); // Reset
    } catch (err) {
      setSubmitError(err.message || 'Произошла ошибка при отправке.');
    } finally {
      setSubmitting(false);
    }
  };

  // Theme styling logic
  const themeClasses = {
    elegant: 'bg-[#faf9f6] text-[#2c2c2c]', // Ivory & Charcoal
    classic: 'bg-white text-gray-900',
    minimal: 'bg-gray-50 text-gray-800',
    dark: 'bg-[#1a1a1a] text-[#f4f4f4]' // Premium Dark Mode
  };

  const fontClasses = {
    serif: 'font-serif', // Cormorant Garamond (configured in tailwind)
    sans: 'font-sans', // Inter
    script: 'font-mono italic' 
  };

  const containerClass = `w-full min-h-screen overflow-x-hidden ${themeClasses[theme] || themeClasses.elegant} ${fontClasses[font] || fontClasses.serif} selection:bg-[var(--secondary)] selection:text-white`;

  const heroImage = media.length > 0 ? media[0].url : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000';

  return (
    <div className={containerClass} style={{ '--primary': primary_color, '--secondary': secondary_color }}>
      
      {/* HERO SECTION - Cinematic fullscreen */}
      <section className="relative h-[100svh] w-full flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src={heroImage} 
            alt="Wedding Hero" 
            className="w-full h-full object-cover"
          />
          {/* Elegant dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.5 } }
          }}
          className="relative z-10 flex flex-col items-center text-white px-6 mt-16"
        >
          <motion.span variants={fadeUp} className="uppercase tracking-[0.3em] text-xs font-semibold mb-6 text-white/80">
            Приглашение на свадьбу
          </motion.span>
          
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-8xl font-serif mb-6 leading-tight drop-shadow-lg text-white">
            {mergedData.groom_name || 'Тимур'} <br className="sm:hidden"/> 
            <span className="italic text-[var(--secondary)]">&amp;</span> <br className="sm:hidden"/> 
            {mergedData.bride_name || 'Лейла'}
          </motion.h1>
          
          {mergedData.wedding_date && (
            <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center">
              <div className="h-16 w-px bg-white/30 mb-8" />
              <p className="text-xl sm:text-2xl uppercase tracking-[0.2em] font-light">
                {(() => {
                  if (!mergedData.wedding_date) return '';
                  try {
                    const parts = mergedData.wedding_date.split('-');
                    if (parts.length === 3) {
                      const [year, month, day] = parts;
                      return `${day} . ${month} . ${year}`;
                    }
                    return mergedData.wedding_date;
                  } catch (e) {
                    return mergedData.wedding_date;
                  }
                })()}
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* DATE & TIME - Editorial layout */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.span variants={fadeUp} className="inline-block uppercase tracking-[0.2em] text-xs font-bold mb-4" style={{ color: secondary_color }}>Программа дня</motion.span>
          
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl mb-16" style={{ color: primary_color }}>Когда & Во сколько</motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-[var(--primary)]/20">
            
            {mergedData.wedding_time && (
              <motion.div variants={fadeUp} className="pt-8 md:pt-0 flex flex-col items-center">
                <span className="text-4xl font-light mb-4" style={{ color: secondary_color }}>{mergedData.wedding_time}</span>
                <span className="uppercase tracking-widest text-sm font-semibold opacity-80" style={{ color: primary_color }}>Сбор гостей</span>
              </motion.div>
            )}
            
            {mergedData.ceremony_time && (
              <motion.div variants={fadeUp} className="pt-8 md:pt-0 flex flex-col items-center">
                <span className="text-4xl font-light mb-4" style={{ color: secondary_color }}>{mergedData.ceremony_time}</span>
                <span className="uppercase tracking-widest text-sm font-semibold opacity-80" style={{ color: primary_color }}>Церемония</span>
              </motion.div>
            )}

            {mergedData.reception_time && (
              <motion.div variants={fadeUp} className="pt-8 md:pt-0 flex flex-col items-center">
                <span className="text-4xl font-light mb-4" style={{ color: secondary_color }}>{mergedData.reception_time}</span>
                <span className="uppercase tracking-widest text-sm font-semibold opacity-80" style={{ color: primary_color }}>Банкет</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* STORY SECTION */}
      {mergedData.story.enabled && (
        <section className="py-24 px-6 bg-black/5 relative overflow-hidden">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ visible: { transition: { staggerChildren: 0.2 } } }} className="max-w-3xl mx-auto text-center relative z-10">
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl mb-10 italic" style={{ color: primary_color }}>
              {mergedData.story.story_title || 'Наша история'}
            </motion.h2>
            <motion.p variants={fadeUp} className="leading-relaxed text-lg sm:text-xl font-light whitespace-pre-wrap opacity-80" style={{ color: primary_color }}>
              {mergedData.story.story || 'Текст вашей истории...'}
            </motion.p>
          </motion.div>
        </section>
      )}

      {/* LOCATION - Elegant Map Card */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="border border-[var(--primary)]/10 p-8 sm:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--secondary)]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--secondary)]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--secondary)]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--secondary)]" />

          <span className="inline-block uppercase tracking-[0.2em] text-xs font-bold mb-6" style={{ color: secondary_color }}>Локация</span>
          <h2 className="text-4xl sm:text-5xl mb-6" style={{ color: primary_color }}>{mergedData.venue_name || 'Название ресторана'}</h2>
          <p className="text-lg opacity-80 mb-10 max-w-lg mx-auto" style={{ color: primary_color }}>{mergedData.address || 'Адрес проведения мероприятия'}</p>
          
          {mergedData.map_url && (
            <a 
              href={mergedData.map_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 border transition-all duration-300 hover:bg-[var(--primary)] hover:text-[var(--primary-foreground,white)]"
              style={{ borderColor: primary_color, color: primary_color }}
            >
              <span className="uppercase tracking-widest text-sm font-semibold">Открыть на карте</span>
            </a>
          )}
        </motion.div>
      </section>

      {/* GALLERY - Masonry/Grid look */}
      {media.length > 1 && (
        <section className="py-16 px-4 sm:px-6">
          <div className="columns-2 md:columns-3 gap-4 max-w-6xl mx-auto space-y-4">
            {media.slice(1).map((img, i) => (
              <motion.div 
                key={img.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                className="break-inside-avoid"
              >
                <img 
                  src={img.url} 
                  alt={`Gallery ${i}`} 
                  loading="lazy" 
                  className="w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP - Minimalist Form */}
      {mergedData.rsvp.enabled && (
        <section className="py-24 px-6 text-center bg-black/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ visible: { transition: { staggerChildren: 0.2 } } }} className="max-w-2xl mx-auto">
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl mb-6 italic" style={{ color: primary_color }}>
              {mergedData.rsvp.title || 'Присутствие'}
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-12 text-lg opacity-80" style={{ color: primary_color }}>
              {mergedData.rsvp.description || 'Пожалуйста, подтвердите своё присутствие.'}
            </motion.p>
            
            <motion.div variants={fadeUp} className="text-left bg-white/50 backdrop-blur p-8 sm:p-12 shadow-2xl">
              {submitMessage ? (
                <div className="text-center py-12">
                  <span className="text-5xl mb-6 block" style={{ color: secondary_color }}>✨</span>
                  <p className="font-serif text-2xl" style={{ color: primary_color }}>{submitMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-8">
                  {submitError && (
                    <div className="p-4 bg-red-50/80 text-red-800 text-sm">{submitError}</div>
                  )}
                  
                  <div>
                    <input 
                      type="text" 
                      required 
                      maxLength={100}
                      className="w-full border-b border-gray-300 bg-transparent py-3 px-0 focus:border-[var(--secondary)] focus:ring-0 outline-none transition-colors text-lg" 
                      placeholder="Имя и Фамилия" 
                      value={rsvpState.guest_name}
                      onChange={e => setRsvpState(prev => ({...prev, guest_name: e.target.value}))}
                      style={{ color: primary_color }}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="attending" 
                          value="attending"
                          required
                          className="peer appearance-none w-5 h-5 border border-gray-400 rounded-full checked:border-[var(--secondary)] transition-colors cursor-pointer" 
                          checked={rsvpState.status === 'attending'}
                          onChange={e => setRsvpState(prev => ({...prev, status: e.target.value}))}
                        />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--secondary)] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity" style={{ color: primary_color }}>Я с удовольствием приду</span>
                    </label>
                    
                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="attending"
                          value="not_attending"
                          required
                          className="peer appearance-none w-5 h-5 border border-gray-400 rounded-full checked:border-[var(--secondary)] transition-colors cursor-pointer" 
                          checked={rsvpState.status === 'not_attending'}
                          onChange={e => setRsvpState(prev => ({...prev, status: e.target.value}))}
                        />
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--secondary)] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity" style={{ color: primary_color }}>К сожалению, не смогу</span>
                    </label>
                  </div>
                  
                  <AnimatePresence>
                    {rsvpState.status === 'attending' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <select 
                          className="w-full border-b border-gray-300 bg-transparent py-3 px-0 focus:border-[var(--secondary)] outline-none transition-colors text-lg mt-2 cursor-pointer"
                          value={rsvpState.guest_count}
                          onChange={e => setRsvpState(prev => ({...prev, guest_count: parseInt(e.target.value, 10)}))}
                          style={{ color: primary_color }}
                        >
                          <option value="1" disabled>Количество персон</option>
                          {[...Array(10)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'человек' : i > 0 && i < 4 ? 'человека' : 'человек'}</option>
                          ))}
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div>
                    <input 
                      type="text"
                      maxLength={100}
                      className="w-full border-b border-gray-300 bg-transparent py-3 px-0 focus:border-[var(--secondary)] outline-none transition-colors text-lg" 
                      placeholder="Комментарий (необязательно)"
                      value={rsvpState.comment}
                      onChange={e => setRsvpState(prev => ({...prev, comment: e.target.value}))}
                      style={{ color: primary_color }}
                    />
                  </div>
  
                  <button 
                    type="submit" 
                    disabled={submitting || !onSubmitRsvp} 
                    className="w-full py-5 uppercase tracking-[0.2em] text-sm font-bold transition-all duration-300 disabled:opacity-50 mt-4 hover:scale-[1.02]" 
                    style={{ backgroundColor: primary_color, color: theme === 'dark' ? '#000' : '#fff' }}
                  >
                    {submitting ? 'Отправка...' : (mergedData.rsvp.button_text || 'Подтвердить')}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </section>
      )}
      
      {/* FINAL SPACER */}
      <div className="h-32" />

      {/* MUSIC - Minimal floating player */}
      {mergedData.music.enabled && mergedData.music.url && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity" style={{ backgroundColor: secondary_color }} />
            <a 
              href={mergedData.music.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-xl hover:scale-105 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={primary_color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
