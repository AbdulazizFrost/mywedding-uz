import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function CountdownTimer({ targetDate, theme = 'ivory', primaryColor, secondaryColor, lang }) {
  const { t, i18n } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  const effectiveLang = lang || i18n.language || 'ru';
  const isUz = effectiveLang === 'uz';

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!targetDate) return null;

  const items = [
    { label: isUz ? 'Kun' : 'Дней', value: timeLeft.days },
    { label: isUz ? 'Soat' : 'Часов', value: timeLeft.hours },
    { label: isUz ? 'Daqiqa' : 'Минут', value: timeLeft.minutes },
    { label: isUz ? 'Soniya' : 'Секунд', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 py-6 select-none">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="flex items-baseline">
            <span 
              className="text-3xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight tabular-nums"
              style={{ color: secondaryColor || primaryColor }}
            >
              {String(item.value).padStart(2, '0')}
            </span>
            {idx < items.length - 1 && (
              <span className="text-xl sm:text-3xl font-light opacity-30 mx-1.5 sm:mx-3" style={{ color: primaryColor }}>
                :
              </span>
            )}
          </div>
          <span 
            className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] mt-1 font-medium opacity-70"
            style={{ color: primaryColor }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
