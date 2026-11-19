import { initTheme } from './theme.js';
initTheme();
function initSite() {
  // Бургер меню (ПР5)
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.site-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      burger.setAttribute('aria-expanded', String(nav.classList.contains('active')));
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
  }

  function closeMenu() {
    if (!burger || !nav) return;
    burger.classList.remove('active'); nav.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); burger?.focus(); } });
  nav?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  window.addEventListener('resize', () => { if (innerWidth > 1100) closeMenu(); });

  // Кнопка вверх (ПР3)
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => toTop.classList.toggle('visible', window.scrollY > 400));
    toTop.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Параллакс (ПР13)
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth > 768) heroImg.style.transform = `translateY(${window.scrollY * 0.08}px)`;
    });
  }

  // Тосты / ПР12 (Уведомления каждые 40 секунд)
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.setAttribute('role', 'status');
  toastContainer.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastContainer);

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span>${msg}</span><button class="toast-close">×</button>`;
    toastContainer.appendChild(t);
    setTimeout(() => { if (t.parentNode) t.remove(); }, 4000);
  }

  toastContainer.addEventListener('click', e => {
    if (e.target.classList.contains('toast-close')) e.target.closest('.toast').remove();
  });

  // Учебная демонстрация таймера, без обещания реального расписания.
  setInterval(() => { if (!document.hidden) showToast('Выберите формат консультации на странице услуг'); }, 40000);
  document.querySelectorAll('.social-btn').forEach(button => button.addEventListener('click', () => showToast('Социальные сети в учебном макете не подключены')));

  // ПР14 Защита копирования
  document.addEventListener('copy', (e) => {
    if (e.target instanceof Element && e.target.matches('input,textarea')) return;
    e.preventDefault();
    showToast('Копирование защищено');
  });

  // ПР14 Слайдер кейсов (translateX)
  const carousel = document.getElementById('cases');
  const track = carousel?.querySelector('.slider-track');
  if (track) {
    const dots = [...carousel.querySelectorAll('[data-slide]')];
    let current = 0;
    const slides = [...track.children];
    const total = slides.length;
    function updateSlider(n) {
      current = (n + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', current === index);
        dot.setAttribute('aria-pressed', String(current === index));
      });
      slides.forEach((slide, index) => slide.setAttribute('aria-hidden', String(current !== index)));
    }
    carousel.querySelectorAll('[data-direction]').forEach(button => {
      button.addEventListener('click', () => updateSlider(current + Number(button.dataset.direction)));
    });
    dots.forEach(dot => dot.addEventListener('click', () => updateSlider(Number(dot.dataset.slide))));
    updateSlider(0);
  }

  // ПР10 Canvas капча + отправка формы
  const form = document.getElementById('bookingForm');
  if (form) {
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    const input = form.querySelector('.captcha-input');
    let capText = '';

    function drawCaptcha() {
      capText = '';
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
      for (let i = 0; i < 5; i++) capText += chars.charAt(Math.floor(Math.random() * chars.length));
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FAFAF8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Шум
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(166,124,91,${Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Линии
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = `rgba(166,124,91,${Math.random() * 0.4})`;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }
      
      // Буквы
      ctx.font = 'bold 28px "Nunito Sans", sans-serif';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < capText.length; i++) {
        ctx.save();
        ctx.fillStyle = '#2C2926';
        ctx.translate(20 + i * 28, canvas.height / 2);
        ctx.rotate((Math.random() - 0.5) * 0.4);
        ctx.fillText(capText[i], 0, 0);
        ctx.restore();
      }
    }

    drawCaptcha();
    form.querySelector('.captcha-refresh').addEventListener('click', drawCaptcha);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value !== capText) {
        showToast('Неверная капча. Попробуйте снова.');
        drawCaptcha();
        input.value = '';
        return;
      }
      if (!form.checkValidity()) return showToast('Заполните все обязательные поля');
      showToast('Проверка пройдена. Данные не отправлены.');
      form.reset();
      drawCaptcha();
    });
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite, { once: true });
} else {
  initSite();
}
