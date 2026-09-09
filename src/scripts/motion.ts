/**
 * Motion polish shared by every page. All of it is optional: the site reads
 * completely without JavaScript, and every effect steps aside for
 * prefers-reduced-motion. Mouse-only effects (smooth scroll, tilt, magnetic
 * buttons) never run on touch screens, where native behaviour feels better.
 */
import Lenis from 'lenis';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ------------------------------------------------------------------ */
/*  Smooth, weighted scrolling on mouse-driven devices                 */
/* ------------------------------------------------------------------ */
if (!reduced && fine) {
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, autoRaf: true });

  // Anchor links glide instead of jumping.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
    if (!a || e.metaKey || e.ctrlKey) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname) return;
    const target = url.hash && document.querySelector<HTMLElement>(url.hash);
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', url.hash);
    lenis.scrollTo(target, { offset: -72, duration: 1.4 });
  });

  // Hold still while the menu or the lightbox owns the screen.
  const sync = () => {
    if (root.classList.contains('menu-open') || root.classList.contains('lightbox-open')) lenis.stop();
    else lenis.start();
  };
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
}

/* ------------------------------------------------------------------ */
/*  Photographs tilt gently toward the mouse                           */
/* ------------------------------------------------------------------ */
if (!reduced && fine) {
  const MAX = 5; // degrees
  document.querySelectorAll<HTMLElement>('.frame-button, [data-tilt]').forEach((el) => {
    el.classList.add('tilt');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(px * 2 * MAX).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-py * 2 * MAX).toFixed(2)}deg`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Buttons lean toward the mouse                                      */
/* ------------------------------------------------------------------ */
if (!reduced && fine) {
  const PULL = 0.28;
  document.querySelectorAll<HTMLElement>('.btn-primary, .btn-ink, .btn-light, .btn-outline, [data-magnetic]').forEach((el) => {
    el.classList.add('magnetic');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.setProperty('--mx', `${(dx * PULL).toFixed(1)}px`);
      el.style.setProperty('--my', `${(dy * PULL).toFixed(1)}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Numbers count up when they scroll into view                        */
/* ------------------------------------------------------------------ */
const tickers = document.querySelectorAll<HTMLElement>('[data-count]');
if (tickers.length && !reduced && 'IntersectionObserver' in window) {
  const format = (el: HTMLElement, v: number) => {
    const decimals = Number(el.dataset.decimals || 0);
    return (el.dataset.prefix || '') + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (el.dataset.suffix || '');
  };
  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.count);
    const t0 = performance.now();
    const duration = 1800;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(el, to * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target as HTMLElement);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.5 },
  );
  tickers.forEach((el) => {
    // Reserve the final width, then start from zero.
    el.style.minWidth = `${el.offsetWidth}px`;
    el.textContent = format(el, 0);
    io.observe(el);
  });
}
