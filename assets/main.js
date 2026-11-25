// Tira del inicio: duplica las portadas para que el loop vertical sea continuo
document.querySelectorAll('.strip-track').forEach(t => { t.innerHTML += t.innerHTML; });

// Filtro de reels
const chips = document.querySelectorAll('.chip');
const reels = document.querySelectorAll('.reel');
chips.forEach(chip => chip.addEventListener('click', () => {
  const f = chip.dataset.f;
  chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
  reels.forEach(r => { r.hidden = f !== 'todos' && !r.dataset.cat.split(' ').includes(f); });
}));

// Reproductor: carga el reel de Instagram recién cuando se toca la portada
(() => {
  const dlg = document.getElementById('player');
  const body = document.getElementById('player-body');
  let opener = null;
  const loadEmbedScript = () => new Promise(res => {
    if (window.instgrm) return res();
    const s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js'; s.async = true; s.onload = res; s.onerror = res;
    document.body.appendChild(s);
  });
  reels.forEach(r => r.addEventListener('click', async () => {
    opener = r;
    const url = `https://www.instagram.com/reel/${r.dataset.code}/`;
    body.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"><a class="ig-fallback" href="${url}" target="_blank" rel="noopener">Ver el reel en Instagram ↗</a></blockquote>`;
    if (dlg.showModal) dlg.showModal(); else window.open(url, '_blank');
    await loadEmbedScript();
    window.instgrm?.Embeds?.process();
  }));
  dlg.querySelector('.player-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { body.innerHTML = ''; opener?.focus(); });
})();
