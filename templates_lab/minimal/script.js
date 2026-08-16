/**
 * MINIMAL WEDDING INVITATION TEMPLATE — JS
 * Interactive Standalone Cover Overlay with Reveal
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

  // 2. AUDIO & OPEN INVITATION LOGIC
  const coverOverlay = document.getElementById('coverOverlay');
  const openInvitationBtn = document.getElementById('openInvitationBtn');
  const musicToggle = document.getElementById('musicToggle');
  const musicStatusText = document.getElementById('musicStatusText');
  const bgAudio = document.getElementById('bgAudio');
  let isPlaying = false;

  function playAudio() {
    if (!bgAudio) return;
    bgAudio.play().then(() => {
      if (musicToggle) musicToggle.classList.add('playing');
      if (musicStatusText) musicStatusText.textContent = 'Музыка';
      isPlaying = true;
    }).catch(err => {
      console.log('Audio autoplay prevented:', err);
    });
  }

  function pauseAudio() {
    if (!bgAudio) return;
    bgAudio.pause();
    if (musicToggle) musicToggle.classList.remove('playing');
    if (musicStatusText) musicStatusText.textContent = 'Музыка';
    isPlaying = false;
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // "ОТКРЫТЬ ПРИГЛАШЕНИЕ" Click Handler
  if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 1. Start background music
      playAudio();

      // 2. Animate cover opening upwards
      if (coverOverlay) {
        coverOverlay.classList.add('is-opened');
      }

      // 3. Unlock document scrolling
      document.body.classList.remove('is-locked');

      // 4. Reveal music control pill on top right
      if (musicToggle) {
        musicToggle.classList.remove('hidden-on-cover');
        musicToggle.classList.add('is-visible');
      }

      // 5. Scroll to top of main website smoothly
      window.scrollTo({ top: 0, behavior: 'instant' });

      // 6. Trigger reveal animations
      setTimeout(() => {
        reveals.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            el.classList.add('active');
          }
        });
      }, 400);
    });
  }

  // 3. REAL-TIME COUNTDOWN TIMER (24 September 2026, 17:00:00)
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
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = 'г. Ташкент, Мирзо-Улугбекский район, ул. Ниёзбек Йули, 1 (Ресторан Versal Palace)';
      navigator.clipboard.writeText(address).then(() => {
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

  // 5. RSVP FORM INTERACTIONS
  const rsvpForm = document.getElementById('rsvpForm');
  const guestsCountGroup = document.getElementById('guestsCountGroup');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const submitBtn = document.getElementById('submitBtn');

  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'no') {
        if (guestsCountGroup) guestsCountGroup.style.display = 'none';
      } else {
        if (guestsCountGroup) guestsCountGroup.style.display = 'flex';
      }
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (submitBtn) {
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        rsvpForm.style.display = 'none';
        if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');
      }, 600);
    });
  }

  // 6. ADD TO GOOGLE CALENDAR
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
