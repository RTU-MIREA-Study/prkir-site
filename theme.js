export function initTheme() {
  const key = 'home-psychologist-theme';
  let saved = null;
  try { saved = localStorage.getItem(key); } catch { /* Storage may be unavailable. */ }
  let current = saved === 'dark' || saved === 'light' ? saved : 'light';
  const apply = () => {
    document.documentElement.dataset.theme = current;
    document.querySelectorAll('.theme-toggle').forEach(button => {
      const dark = current === 'dark';
      button.textContent = dark ? 'Светлая тема' : 'Тёмная тема';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
    });
  };
  apply();
  document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
    current = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(key, current); } catch { /* Theme remains usable for this page. */ }
    apply();
  }));
}
