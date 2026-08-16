/**
 * MINIMAL WEDDING INVITATION TEMPLATE — SCRIPT
 * BizningToy.uz Standalone Prototype
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL REVEAL ANIMATION
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));

  // 2. AUDIO PLAYER TOGGLE
  const musicToggle = document.getElementById('musicToggle');
  const bgAudio = document.getElementById('bgAudio');
  let isPlaying = false;

  if (musicToggle && bgAudio) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        bgAudio.pause();
        musicToggle.classList.remove('playing');
        musicToggle.querySelector('.music-text').textContent = 'Музыка';
        isPlaying = false;
      } else {
        bgAudio.play().then(() => {
          musicToggle.classList.add('playing');
          musicToggle.querySelector('.music-text').textContent = 'Играет';
          isPlaying = true;
        }).catch(err => {
          console.log('Audio playback prevented:', err);
        });
      }
    });
  }

  // 3. REAL-TIME COUNTDOWN TIMER (24 September 2026, 17:00)
  const targetDate = new Date('2026-09-24T17:00:00+05:00').getTime();

  function updateTimer() {
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

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  // 4. COPY ADDRESS BUTTON
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addressText = 'г. Ташкент, Мирзо-Улугбекский район, ул. Ниёзбек Йули, 1 (Ресторан Versal Palace)';
      navigator.clipboard.writeText(addressText).then(() => {
        const originalText = copyAddressBtn.textContent;
        copyAddressBtn.textContent = '✓ Скопировано!';
        copyAddressBtn.style.borderColor = '#2E7D32';
        copyAddressBtn.style.color = '#2E7D32';
        setTimeout(() => {
          copyAddressBtn.textContent = originalText;
          copyAddressBtn.style.borderColor = '';
          copyAddressBtn.style.color = '';
        }, 2500);
      });
    });
  }

  // 5. RSVP FORM INTERACTION
  const rsvpForm = document.getElementById('rsvpForm');
  const guestsCountGroup = document.getElementById('guestsCountGroup');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const submitBtn = document.getElementById('submitBtn');

  // Toggle guest count dropdown based on attendance
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'no') {
        guestsCountGroup.style.display = 'none';
      } else {
        guestsCountGroup.style.display = 'flex';
      }
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      submitBtn.textContent = 'Отправка...';
      submitBtn.disabled = true;

      setTimeout(() => {
        rsvpForm.style.display = 'none';
        rsvpSuccess.classList.remove('hidden');
      }, 700);
    });
  }

  // 6. ADD TO GOOGLE CALENDAR
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent('Свадьба Азамата и Мадины');
      const details = encodeURIComponent('Будем счастливы видеть вас на нашей свадьбе! Ресторан Versal Palace.');
      const location = encodeURIComponent('Ресторан Versal Palace, г. Ташкент, ул. Ниёзбек Йули, 1');
      const dates = '20260924T120000Z/20260924T180000Z'; // UTC

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
      window.open(googleCalUrl, '_blank');
    });
  }
});
