/**
 * MINIMAL EDITORIAL WEDDING TEMPLATE — JS
 * BizningToy.uz Standalone Prototype
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  reveals.forEach(el => observer.observe(el));

  // 2. FLOATING MUSIC TOGGLE WITH AUDIO ELEMENT
  const musicToggle = document.getElementById('musicToggle');
  const musicStatusText = document.getElementById('musicStatusText');
  const bgAudio = document.getElementById('bgAudio');
  let isPlaying = false;

  if (musicToggle && bgAudio) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        bgAudio.pause();
        musicToggle.classList.remove('playing');
        if (musicStatusText) musicStatusText.textContent = 'Включить музыку';
        isPlaying = false;
      } else {
        bgAudio.play().then(() => {
          musicToggle.classList.add('playing');
          if (musicStatusText) musicStatusText.textContent = 'Музыка играет';
          isPlaying = true;
        }).catch((err) => {
          console.log('Audio autoplay prevented by browser policy:', err);
        });
      }
    });
  }

  // 3. REAL-TIME COUNTDOWN TIMER (Target: 24 September 2026, 17:00:00)
  const targetDate = new Date('2026-09-24T17:00:00+05:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. COPY ADDRESS BUTTON
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const copyBtnLabel = document.getElementById('copyBtnLabel');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = 'г. Ташкент, Мирзо-Улугбекский район, ул. Ниёзбек Йули, 1 (Ресторан Versal Palace)';
      navigator.clipboard.writeText(address).then(() => {
        if (copyBtnLabel) {
          const original = copyBtnLabel.textContent;
          copyBtnLabel.textContent = 'Адрес скопирован!';
          copyAddressBtn.style.borderColor = '#2E7D32';
          copyAddressBtn.style.color = '#2E7D32';
          setTimeout(() => {
            copyBtnLabel.textContent = original;
            copyAddressBtn.style.borderColor = '';
            copyAddressBtn.style.color = '';
          }, 2500);
        }
      });
    });
  }

  // 5. RSVP FORM INTERACTIONS
  const rsvpForm = document.getElementById('rsvpForm');
  const guestsCountGroup = document.getElementById('guestsCountGroup');
  const drinkPreferenceGroup = document.getElementById('drinkPreferenceGroup');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const submitBtn = document.getElementById('submitBtn');

  // Toggle optional fields if guest cannot attend
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'no') {
        if (guestsCountGroup) guestsCountGroup.style.display = 'none';
        if (drinkPreferenceGroup) drinkPreferenceGroup.style.display = 'none';
      } else {
        if (guestsCountGroup) guestsCountGroup.style.display = 'flex';
        if (drinkPreferenceGroup) drinkPreferenceGroup.style.display = 'flex';
      }
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Отправляем...</span>';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        rsvpForm.style.display = 'none';
        if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');
      }, 600);
    });
  }

  // 6. ADD TO GOOGLE CALENDAR LINK
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent('Свадьба Азамата и Мадины');
      const details = encodeURIComponent('Свадебное торжество Азамата и Мадины. Ресторан Versal Palace, Ташкент.');
      const location = encodeURIComponent('Ресторан Versal Palace, г. Ташкент, ул. Ниёзбек Йули, 1');
      const dates = '20260924T120000Z/20260924T180000Z'; // UTC

      const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
      window.open(calUrl, '_blank');
    });
  }
});
