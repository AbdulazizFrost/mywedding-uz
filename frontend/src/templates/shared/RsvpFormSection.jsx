import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Users, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RsvpFormSection({ 
  rsvpData, 
  onSubmitRsvp, 
  theme = 'light', // 'light', 'dark', 'blush', 'botanical', 'emerald'
  primaryColor = '#2c2c2c',
  secondaryColor = '#d4af37',
  lang
}) {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(true);
  const [guestsCount, setGuestsCount] = useState(1);
  const [comment, setComment] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const effectiveLang = lang || i18n.language || 'ru';
  const isUz = effectiveLang === 'uz';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      if (onSubmitRsvp) {
        await onSubmitRsvp({
          guest_name: name.trim(),
          attending,
          guests_count: attending ? Number(guestsCount) : 0,
          comment: comment.trim() || undefined
        });
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || (isUz ? 'Yuborishda xatolik yuz berdi.' : 'Произошла ошибка при отправке.'));
    } finally {
      setSubmitting(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`w-full max-w-lg mx-auto p-6 sm:p-8 rounded-3xl backdrop-blur-md transition-all border ${
      isDark 
        ? 'bg-white/5 border-white/10 text-white shadow-2xl' 
        : 'bg-white/80 border-black/5 text-charcoal shadow-xl'
    }`}>
      
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 space-y-4"
        >
          <div 
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg"
            style={{ backgroundColor: secondaryColor, color: '#ffffff' }}
          >
            <Check size={32} />
          </div>
          <h4 className="font-serif text-2xl sm:text-3xl font-medium">
            {attending 
              ? (isUz ? 'Sizni intiqlik bilan kutib qolamiz!' : 'С нетерпением ждем вас!') 
              : (isUz ? 'Xabardor qilganingiz uchun rahmat.' : 'Спасибо, что сообщили нам.')
            }
          </h4>
          <p className="text-sm opacity-70">
            {isUz ? 'Javobingiz muvaffaqiyatli saqlandi.' : 'Ваш ответ успешно сохранен.'}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {rsvpData?.title && (
            <div className="text-center space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-medium" style={{ color: secondaryColor || primaryColor }}>
                {rsvpData.title}
              </h3>
              {rsvpData.description && (
                <p className="text-xs sm:text-sm opacity-70 max-w-sm mx-auto leading-relaxed">
                  {rsvpData.description}
                </p>
              )}
            </div>
          )}

          {submitError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">
              {submitError}
            </div>
          )}

          {/* Name input */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold mb-2 opacity-80">
              {isUz ? 'Ism va Familiyangiz' : 'Имя и Фамилия'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isUz ? "Ismingizni kiriting" : "Тимур и Лейла"}
              className={`w-full px-4 py-3 rounded-2xl text-[16px] outline-none transition-all border ${
                isDark 
                  ? 'bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-champagne' 
                  : 'bg-white border-black/10 text-charcoal placeholder:text-black/30 focus:border-champagne'
              }`}
            />
          </div>

          {/* Attendance Choice */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`py-3 px-4 rounded-2xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                attending 
                  ? 'shadow-md scale-[1.02]' 
                  : 'opacity-50 hover:opacity-80'
              }`}
              style={{
                backgroundColor: attending ? secondaryColor : 'transparent',
                borderColor: attending ? secondaryColor : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
                color: attending ? '#ffffff' : (isDark ? '#ffffff' : primaryColor)
              }}
            >
              <Check size={16} />
              <span>{isUz ? 'Albatta kelaman' : 'Я приду'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`py-3 px-4 rounded-2xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                !attending 
                  ? 'bg-black/20 shadow-md scale-[1.02] border-black/30' 
                  : 'opacity-50 hover:opacity-80'
              }`}
              style={{
                borderColor: !attending ? (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)') : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
                color: isDark ? '#ffffff' : primaryColor
              }}
            >
              <X size={16} />
              <span>{isUz ? 'Kela olmayman' : 'Не смогу'}</span>
            </button>
          </div>

          {/* Guests Count (Only if attending) */}
          {attending && (
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold mb-2 opacity-80 flex items-center gap-2">
                <Users size={14} />
                <span>{isUz ? 'Mehmonlar soni' : 'Количество персон'}</span>
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className={`w-full px-4 py-3 rounded-2xl text-[16px] outline-none transition-all border ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 text-white focus:border-champagne' 
                    : 'bg-white border-black/10 text-charcoal focus:border-champagne'
                }`}
              >
                <option value={1}>{isUz ? '1 kishi' : '1 человек'}</option>
                <option value={2}>{isUz ? '2 kishi' : '2 человека'}</option>
                <option value={3}>{isUz ? '3 kishi' : '3 человека'}</option>
                <option value={4}>{isUz ? '4+ kishi' : '4+ человек'}</option>
              </select>
            </div>
          )}

          {/* Comment / Wish */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold mb-2 opacity-80 flex items-center gap-2">
              <MessageSquare size={14} />
              <span>{isUz ? 'Tilak yoki sharh' : 'Пожелание или комментарий'}</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isUz ? "Kelin-kuyov uchun samimiy tilaklar..." : "Теплые слова для молодоженов..."}
              className={`w-full px-4 py-3 rounded-2xl text-[16px] outline-none transition-all resize-none border ${
                isDark 
                  ? 'bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:border-champagne' 
                  : 'bg-white border-black/10 text-charcoal placeholder:text-black/30 focus:border-champagne'
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full font-medium text-sm tracking-wide uppercase transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            style={{
              backgroundColor: secondaryColor,
              color: '#ffffff'
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{isUz ? 'Yuborilmoqda...' : 'Отправка...'}</span>
              </>
            ) : (
              <span>{rsvpData?.button_text || (isUz ? 'Tashrifni tasdiqlash' : 'Подтвердить')}</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
