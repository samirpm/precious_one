/**
 * The motion choreography for every page: GSAP ScrollTrigger drives the
 * scroll-linked scenes (so they behave the same in every browser), Lenis
 * smooths the wheel, and a few pointer effects finish it off. Everything
 * steps aside for prefers-reduced-motion, where the CSS layouts fall back
 * to plain flow.
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const q = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const qa = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(sel));

if (!reduced) {
  root.classList.add('motion');

  /* ---------------------------------------------------------------- */
  /*  Smooth scrolling, synced with ScrollTrigger                       */
  /* ---------------------------------------------------------------- */
  let lenis: Lenis | null = null;
  if (fine) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    document.addEventListener('click', (e) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!a || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname) return;
      const target = url.hash && q(url.hash);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, '', url.hash);
      lenis!.scrollTo(target, { offset: -72, duration: 1.4 });
    });

    const sync = () => {
      if (root.classList.contains('menu-open') || root.classList.contains('lightbox-open')) lenis!.stop();
      else lenis!.start();
    };
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------------------------------------------------------------- */
  /*  Reading progress hairline                                          */
  /* ---------------------------------------------------------------- */
  const bar = q('.scroll-progress');
  if (bar) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }) });

  /* ---------------------------------------------------------------- */
  /*  Hero: the photograph holds while the page slides over it           */
  /* ---------------------------------------------------------------- */
  const hero = q('[data-hero]');
  if (hero) {
    const media = q('.hero-media', hero);
    const parallax = q('.hero-parallax', hero);
    const panel = q('.hero-panel', hero);
    const foot = q('.hero-foot', hero);
    const cue = q('.hero-cue', hero);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
      tl.to([media, foot, cue].filter(Boolean), { y: () => hero.offsetHeight, ease: 'none' }, 0)
        .to(parallax, { yPercent: 12, ease: 'none' }, 0)
        .to(panel, { yPercent: -35, ease: 'none' }, 0);
    });
    mm.add('(max-width: 1023px)', () => {
      gsap.to(parallax, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Opening sequence, after the intro curtain (or straight away)       */
  /* ---------------------------------------------------------------- */
  if (hero) {
    const start = root.classList.contains('has-intro') && !root.classList.contains('intro-seen') ? 2.35 : 0.25;
    const media = q('.hero-media', hero);
    const parallax = q('.hero-parallax', hero);
    const open = gsap.timeline({ delay: start });
    if (media) open.fromTo(media, { scale: 1.2 }, { scale: 1, duration: 2.8, ease: 'power3.out' }, 0);
    open.from(qa('.thumb', hero), { y: 14, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity' }, 1.0);
    open.from(qa('.site-header .brand, .site-header .nav-desktop a, .site-header .phone, .site-header .btn-header, .site-header .menu-toggle'), {
      y: -12,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.06,
      clearProps: 'transform,opacity',
    }, 0.35);

    // The photograph leans gently with the mouse.
    if (fine && parallax) {
      const mx = gsap.quickTo(parallax, 'x', { duration: 1.4, ease: 'power3' });
      const my = gsap.quickTo(parallax, 'y', { duration: 1.4, ease: 'power3' });
      hero.addEventListener('pointermove', (e) => {
        mx((e.clientX / window.innerWidth - 0.5) * -34);
        my((e.clientY / window.innerHeight - 0.5) * -22);
      });
      hero.addEventListener('pointerleave', () => {
        mx(0);
        my(0);
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Marquee: runs on its own, hurries and reverses with the scroll     */
  /* ---------------------------------------------------------------- */
  const marquee = q('.marquee-track');
  if (marquee) {
    const loop = gsap.to(marquee, { xPercent: -50, ease: 'none', duration: 48, repeat: -1 });
    let target = 1;
    const settle = gsap.delayedCall(0.5, () => (target = target < 0 ? -1 : 1)).pause();
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        target = (v < 0 ? -1 : 1) * (1 + Math.min(4, Math.abs(v) / 600));
        settle.restart(true);
      },
    });
    gsap.ticker.add(() => {
      loop.timeScale(gsap.utils.interpolate(loop.timeScale(), target, 0.06));
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Session cards lay down into place, one after another              */
  /* ---------------------------------------------------------------- */
  const cards = qa('.sessions-grid > li, .more-grid > li');
  if (cards.length) {
    gsap.set(cards, { y: 70, rotateX: -14, opacity: 0, transformPerspective: 900, transformOrigin: '50% 100%' });
    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, rotateX: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.12, clearProps: 'transform,opacity' }),
    });
  }

  /* ---------------------------------------------------------------- */
  /*  The line through the three steps draws itself                     */
  /* ---------------------------------------------------------------- */
  const stepsLine = q('.steps-line');
  if (stepsLine) {
    gsap.fromTo(stepsLine, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 80%', end: 'bottom 45%', scrub: 0.6 } });
  }

  /* ---------------------------------------------------------------- */
  /*  Questions slide in one by one                                     */
  /* ---------------------------------------------------------------- */
  const faqItems = qa('.faq-item');
  if (faqItems.length) {
    gsap.set(faqItems, { x: -28, opacity: 0 });
    ScrollTrigger.batch(faqItems, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.09, clearProps: 'transform,opacity' }),
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Pinned horizontal gallery                                          */
  /* ---------------------------------------------------------------- */
  const work = q('#work');
  const track = work && q('.work-track', work);
  const progress = work && q('.work-progress span', work);
  if (work && track) {
    // The track may be wider than its wrapper (desktop) or overflow inside
    // it (phones); measuring against the wrapper covers both.
    const wrap = track.parentElement as HTMLElement;
    const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: work,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => progress && gsap.set(progress, { scaleX: self.progress }),
      },
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Photographs wipe in, alternating direction                         */
  /* ---------------------------------------------------------------- */
  qa('.reveal-clip').forEach((el, i) => {
    const dir = el.dataset.wipe || (i % 2 ? 'right' : 'left');
    const from = dir === 'right' ? 'inset(0 0 0 100%)' : dir === 'up' ? 'inset(100% 0 0 0)' : 'inset(0 100% 0 0)';
    const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
    const img = q('img', el);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    tl.fromTo(el, { clipPath: from }, { clipPath: 'inset(0 0 0 0)', duration: 1.3, ease: 'power3.inOut', delay });
    if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, '<');
  });

  /* ---------------------------------------------------------------- */
  /*  Parallax and scroll-velocity skew on the photographs               */
  /* ---------------------------------------------------------------- */
  const drifting = qa('.frame-drift picture');
  drifting.forEach((pic) => {
    gsap.fromTo(
      pic,
      { yPercent: -7 },
      { yPercent: 7, ease: 'none', scrollTrigger: { trigger: pic.closest('.frame') || pic, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

  const skewTargets = [...drifting, ...qa('.work-item .frame')];
  if (skewTargets.length) {
    const proxy = { skew: 0 };
    const clamp = gsap.utils.clamp(-5, 5);
    ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = clamp(self.getVelocity() / -450);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.9,
            ease: 'power3',
            overwrite: true,
            onUpdate: () => gsap.set(skewTargets, { skewY: proxy.skew }),
          });
        }
      },
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Mosaic tiles move at their own speeds                              */
  /* ---------------------------------------------------------------- */
  qa('.tile').forEach((tile, i) => {
    const amount = [50, 110, 25][i % 3];
    gsap.fromTo(tile, { y: amount }, { y: -amount, ease: 'none', scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------------------------------------------------------------- */
  /*  Statement band: the photograph settles as it passes                */
  /* ---------------------------------------------------------------- */
  const moment = q('.moment');
  if (moment) {
    const par = q('.moment-parallax', moment);
    const img = q('img', moment);
    const tl = gsap.timeline({ scrollTrigger: { trigger: moment, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (par) tl.fromTo(par, { yPercent: -9 }, { yPercent: 9, ease: 'none' }, 0);
    if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, ease: 'none' }, 0);
  }

  /* ---------------------------------------------------------------- */
  /*  Testimonials: a ring of cards turns as the section is pinned       */
  /* ---------------------------------------------------------------- */
  const kind = q('.kind');
  const ring = kind && q('.quotes', kind);
  if (kind && ring) {
    gsap.fromTo(
      ring,
      { rotateY: 0 },
      {
        rotateY: -300,
        ease: 'none',
        scrollTrigger: { trigger: kind, start: 'top top', end: '+=220%', pin: true, scrub: 1, anticipatePin: 1 },
      },
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Numbers count up                                                   */
  /* ---------------------------------------------------------------- */
  qa('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const format = (v: number) =>
      (el.dataset.prefix || '') + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (el.dataset.suffix || '');
    const state = { v: 0 };
    el.style.minWidth = `${el.offsetWidth}px`;
    el.textContent = format(0);
    gsap.to(state, {
      v: to,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => (el.textContent = format(state.v)),
    });
  });

  /* ---------------------------------------------------------------- */
  /*  Recalculate once fonts and images have settled                     */
  /* ---------------------------------------------------------------- */
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/* ------------------------------------------------------------------ */
/*  Mouse-only touches: tilt and magnetic buttons                       */
/* ------------------------------------------------------------------ */
if (!reduced && fine) {
  const MAX = 5;
  qa('.frame-button, [data-tilt]').forEach((el) => {
    el.classList.add('tilt');
    const rx = gsap.quickTo(el, '--rx', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(el, '--ry', { duration: 0.5, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 2 * MAX);
      rx(-py * 2 * MAX);
    });
    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });

  const PULL = 0.3;
  qa('.btn-primary, .btn-ink, .btn-light, .btn-outline, [data-magnetic]').forEach((el) => {
    el.classList.add('magnetic');
    const mx = gsap.quickTo(el, '--mx', { duration: 0.6, ease: 'power3' });
    const my = gsap.quickTo(el, '--my', { duration: 0.6, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - (r.left + r.width / 2)) * PULL);
      my((e.clientY - (r.top + r.height / 2)) * PULL);
    });
    el.addEventListener('pointerleave', () => {
      mx(0);
      my(0);
    });
  });
}
