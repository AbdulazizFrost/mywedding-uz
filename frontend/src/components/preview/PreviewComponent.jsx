import { useEffect, useState } from 'react';

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
  rsvp: { enabled: true, title: '', description: '' },
  design: { theme: 'elegant', font: 'serif', primary_color: '#4f46e5', secondary_color: '#111827' },
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
      setSubmitMessage(rsvpState.status === 'attending' ? 'Будем рады видеть вас!' : 'Спасибо, что сообщили нам.');
      setRsvpState({ guest_name: '', status: '', guest_count: 1, comment: '' }); // Reset
    } catch (err) {
      setSubmitError(err.message || 'Ошибка отправки.');
    } finally {
      setSubmitting(false);
    }
  };

  // Theme styling logic
  const themeClasses = {
    elegant: 'bg-stone-50 text-stone-900',
    classic: 'bg-white text-gray-900',
    minimal: 'bg-gray-50 text-gray-800'
  };

  const fontClasses = {
    serif: 'font-serif',
    sans: 'font-sans',
    script: 'font-mono' // using mono as fallback
  };

  const containerClass = `w-full min-h-screen overflow-x-hidden ${themeClasses[theme] || themeClasses.elegant} ${fontClasses[font] || fontClasses.serif}`;

  return (
    <div className={containerClass} style={{ '--primary': primary_color, '--secondary': secondary_color }}>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center border-b border-gray-200">
        <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4" style={{ color: primary_color }}>
          {mergedData.groom_name || 'Имя Жениха'} & {mergedData.bride_name || 'Имя Невесты'}
        </h1>
        {mergedData.wedding_date && (
          <p className="text-xl sm:text-2xl mt-4 opacity-80" style={{ color: secondary_color }}>
            {new Date(mergedData.wedding_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </section>

      {/* DATE & TIME */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl mb-8" style={{ color: primary_color }}>Программа дня</h2>
        <div className="max-w-md mx-auto space-y-6 text-lg">
          {mergedData.ceremony_time && (
            <div className="flex justify-between border-b pb-2">
              <span>Церемония:</span>
              <span className="font-semibold">{mergedData.ceremony_time}</span>
            </div>
          )}
          {mergedData.reception_time && (
            <div className="flex justify-between border-b pb-2">
              <span>Банкет:</span>
              <span className="font-semibold">{mergedData.reception_time}</span>
            </div>
          )}
          {!mergedData.ceremony_time && !mergedData.reception_time && mergedData.wedding_time && (
            <div className="flex justify-between border-b pb-2">
              <span>Сбор гостей:</span>
              <span className="font-semibold">{mergedData.wedding_time}</span>
            </div>
          )}
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-16 px-6 text-center bg-black/5">
        <h2 className="text-3xl mb-8" style={{ color: primary_color }}>Место проведения</h2>
        <p className="text-xl mb-2 font-semibold">{mergedData.venue_name || 'Название ресторана'}</p>
        <p className="mb-6 opacity-80">{mergedData.address || 'Адрес не указан'}</p>
        {mergedData.map_url && (
          <a 
            href={mergedData.map_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: primary_color }}
          >
            Открыть карту
          </a>
        )}
      </section>

      {/* STORY */}
      {mergedData.story.enabled && (
        <section className="py-16 px-6 text-center">
          <h2 className="text-3xl mb-6" style={{ color: primary_color }}>
            {mergedData.story.story_title || 'Наша история'}
          </h2>
          <p className="max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">
            {mergedData.story.story || 'Расскажите вашу историю здесь...'}
          </p>
        </section>
      )}

      {/* GALLERY */}
      {media.length > 0 && (
        <section className="py-16 px-6 text-center bg-black/5">
          <h2 className="text-3xl mb-8" style={{ color: primary_color }}>Галерея</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {media.map((img, i) => (
              <img 
                key={img.id} 
                src={img.url} 
                alt={`Gallery ${i}`} 
                loading="lazy" 
                className="w-full h-48 object-cover rounded shadow-sm"
              />
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}
      {mergedData.rsvp.enabled && (
        <section className="py-16 px-6 text-center">
          <h2 className="text-3xl mb-4" style={{ color: primary_color }}>
            {mergedData.rsvp.title || 'Подтверждение'}
          </h2>
          <p className="mb-8 opacity-80 max-w-md mx-auto">
            {mergedData.rsvp.description || 'Пожалуйста, подтвердите своё присутствие.'}
          </p>
          <div className="max-w-sm mx-auto p-6 bg-white shadow rounded-lg text-left text-gray-900">
            {submitMessage ? (
              <div className="text-center p-4 bg-green-50 text-green-700 rounded border border-green-200">
                <p className="font-semibold text-lg mb-2">Спасибо за ваш ответ!</p>
                <p>{submitMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit}>
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">{submitError}</div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя гостя</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={100}
                    className="w-full border border-gray-300 rounded shadow-sm p-2 focus:ring-2 focus:outline-none" 
                    placeholder="Имя и Фамилия" 
                    value={rsvpState.guest_name}
                    onChange={e => setRsvpState(prev => ({...prev, guest_name: e.target.value}))}
                  />
                </div>
                <div className="mb-6 space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="attending" 
                      value="attending"
                      required
                      className="text-indigo-600 focus:ring-indigo-500" 
                      checked={rsvpState.status === 'attending'}
                      onChange={e => setRsvpState(prev => ({...prev, status: e.target.value}))}
                    />
                    <span>Я с удовольствием приду</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="attending"
                      value="not_attending"
                      required
                      className="text-indigo-600 focus:ring-indigo-500" 
                      checked={rsvpState.status === 'not_attending'}
                      onChange={e => setRsvpState(prev => ({...prev, status: e.target.value}))}
                    />
                    <span>К сожалению, не смогу</span>
                  </label>
                </div>
                
                {rsvpState.status === 'attending' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Количество гостей (включая вас)</label>
                    <select 
                      className="w-full border border-gray-300 rounded shadow-sm p-2 focus:ring-2 focus:outline-none bg-white"
                      value={rsvpState.guest_count}
                      onChange={e => setRsvpState(prev => ({...prev, guest_count: parseInt(e.target.value, 10)}))}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий (необязательно)</label>
                  <textarea 
                    maxLength={1000}
                    rows="2"
                    className="w-full border border-gray-300 rounded shadow-sm p-2 focus:ring-2 focus:outline-none" 
                    placeholder="Например, аллергия на определенные продукты"
                    value={rsvpState.comment}
                    onChange={e => setRsvpState(prev => ({...prev, comment: e.target.value}))}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || !onSubmitRsvp} 
                  className="w-full px-4 py-2 text-white rounded transition-opacity hover:opacity-90 disabled:opacity-50 font-medium" 
                  style={{ backgroundColor: primary_color }}
                >
                  {submitting ? 'Отправка...' : (mergedData.rsvp.button_text || 'Отправить ответ')}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* MUSIC */}
      {mergedData.music.enabled && mergedData.music.url && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg p-3 rounded-full flex items-center space-x-3 z-50 border border-gray-100">
          <span className="text-xs font-medium text-gray-500 hidden sm:block">
            {mergedData.music.title || 'Музыкальная пауза'}
          </span>
          <a href={mergedData.music.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-indigo-600">
            ▶
          </a>
        </div>
      )}
    </div>
  );
}
