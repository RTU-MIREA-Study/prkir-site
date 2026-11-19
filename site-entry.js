// Browsers allow local classic scripts but block module fetches from file URLs.
if (location.protocol === 'file:') {
  const script = document.createElement('script');
  script.src = 'site-local.js';
  document.head.append(script);
} else {
  import('./script.js').then(() => {
    if (document.querySelector('.demo-page')) return import('./practice.js');
  });
}
