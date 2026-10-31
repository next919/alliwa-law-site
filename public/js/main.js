/* Page behaviour: builds the team and practice-area cards from data/settings.js, fills in the
   contact links, and runs the menu, scroll effects and the demo contact form.
   All visible text comes from data/ar.js and data/en.js (through js/i18n.js).
   Shared by index.html and login.html: every part checks that its elements exist. */
(function () {
  'use strict';

  const S = window.SITE_SETTINGS || {};
  const I18N = window.I18N;
  const t = (key) => I18N.t(key);
  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PLACEHOLDER_PHOTO = 'images/team/placeholder.svg';

  /* ---------- Cards and lists built from settings ---------- */

  function buildTeam() {
    const tpl = $('#tpl-member');
    if (!tpl) return;
    $$('[data-team]').forEach((grid) => {
      const group = grid.dataset.team;
      const members = (S.team || []).filter((m) => (m.group || 'staff') === group);
      grid.replaceChildren();
      members.forEach((m, i) => {
        const card = tpl.content.firstElementChild.cloneNode(true);
        const key = 'team.members.' + m.id;
        const photo = $('.member-photo', card);
        if (m.photo) {
          $('img', card).src = m.photo;
        } else if (group === 'staff') {
          // no photo on a team card: a circle with the person's initial instead of a silhouette
          const initial = document.createElement('span');
          initial.className = 'member-initial';
          initial.setAttribute('aria-hidden', 'true');
          initial.dataset.i18n = key + '.initial';
          photo.replaceWith(initial);
          card.classList.add('no-photo');
        } else {
          $('img', card).src = PLACEHOLDER_PHOTO;
          photo.dataset.placeholder = '';
          photo.dataset.i18nAttr = 'data-label:placeholder.photo';
        }
        $('.member-name', card).dataset.i18n = key + '.name';
        $('.member-role', card).dataset.i18n = key + '.role';
        $('.member-bio', card).dataset.i18n = key + '.bio';  // empty bios are hidden by CSS
        if (group === 'partners') card.classList.add('is-partner');
        card.style.setProperty('--i', i);
        grid.appendChild(card);
      });
      const wrap = grid.closest('[data-team-group]');
      if (wrap) wrap.hidden = members.length === 0;
    });
  }

  // logo wall: real logos from settings, or placeholder shapes until they are supplied
  function buildClients() {
    const list = $('[data-clients]');
    if (!list) return;
    const clients = S.clients || [];
    list.replaceChildren();
    clients.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'client-logo';
      li.style.setProperty('--i', i);
      if (c.logo) {
        const img = document.createElement('img');
        img.src = c.logo;
        img.alt = c.name || '';
        img.width = 160;
        img.height = 60;
        img.loading = 'lazy';
        img.decoding = 'async';
        li.classList.add('has-img');
        li.appendChild(img);
      } else {
        li.setAttribute('aria-hidden', 'true');  // a placeholder says nothing; the note under the grid explains
        li.innerHTML = `<svg class="client-mark" viewBox="0 0 160 48"><use href="#ph-logo-${(i % 8) + 1}"/></svg>`;
      }
      list.appendChild(li);
    });
    if (clients.every((c) => !c.logo)) list.setAttribute('aria-hidden', 'true');
    else list.removeAttribute('aria-hidden');
    const section = list.closest('section');
    if (section) section.hidden = clients.length === 0;
    const note = $('[data-clients-note]');
    if (note) note.hidden = !clients.some((c) => !c.logo);
  }

  // licence cards and the licence numbers in the footer: number from settings, or "to be added"
  function buildLicence() {
    const items = S.licence || [];
    const byId = {};
    items.forEach((it) => { byId[it.id] = it; });
    const fillNumber = (el, it) => {
      if (it && it.number) { el.textContent = it.number; el.classList.remove('is-pending'); delete el.dataset.i18n; }
      else { el.dataset.i18n = 'licence.pending'; el.classList.add('is-pending'); }
    };
    $$('[data-licence-number]').forEach((el) => fillNumber(el, byId[el.dataset.licenceNumber]));

    const list = $('[data-licence]');
    const tpl = $('#tpl-licence');
    if (!list || !tpl) return;
    list.replaceChildren();
    items.forEach((it, i) => {
      const card = tpl.content.firstElementChild.cloneNode(true);
      const key = 'licence.items.' + it.id;
      $('.licence-icon use', card).setAttribute('href', '#i-' + (it.icon || 'badge'));
      $('.licence-title', card).dataset.i18n = key + '.title';
      $('.licence-issuer', card).dataset.i18n = key + '.issuer';
      $('.licence-label', card).dataset.i18n = key + '.label';
      fillNumber($('.licence-number', card), it);
      const link = $('.licence-verify', card);
      if (it.link) {
        link.href = it.link;
        $('span', link).dataset.i18n = key + '.verify';
      } else {
        link.remove();
      }
      card.style.setProperty('--i', i);
      list.appendChild(card);
    });
    const note = $('[data-licence-note]');
    if (note) note.hidden = items.every((it) => it.number);
  }

  function buildPractice() {
    const grid = $('[data-practice]');
    const tpl = $('#tpl-area');
    if (!grid || !tpl) return;
    grid.replaceChildren();
    (S.practiceAreas || []).forEach((area, i) => {
      const card = tpl.content.firstElementChild.cloneNode(true);
      const key = 'practice.areas.' + area.id;
      const title = $('.area-title', card);
      $('.area-icon use', card).setAttribute('href', '#i-' + (area.icon || 'scale'));
      title.dataset.i18n = key + '.title';
      title.id = 'area-' + area.id;
      $('.area-text', card).dataset.i18n = key + '.text';
      $('.area-list', card).dataset.list = key + '.services';
      const link = $('.area-link', card);
      link.dataset.book = area.id;
      link.setAttribute('aria-describedby', title.id);
      card.style.setProperty('--i', i);
      grid.appendChild(card);
    });
  }

  function buildAreaOptions() {
    const select = $('[data-area-select]');
    if (!select) return;
    const keep = select.value;
    Array.from(select.options).forEach((o) => { if (o.value) o.remove(); });
    (S.practiceAreas || []).forEach((area) => {
      const option = document.createElement('option');
      option.value = area.id;
      option.dataset.i18n = 'practice.areas.' + area.id + '.title';
      select.appendChild(option);
    });
    const other = document.createElement('option');
    other.value = 'general';
    other.dataset.i18n = 'contact.form.areaOther';
    select.appendChild(other);
    select.value = keep;
  }

  /* ---------- Contact details and links from settings ---------- */

  function setLink(a) {
    switch (a.dataset.link) {
      case 'phone':
        a.href = 'tel:' + String(S.phone || '').replace(/[^\d+]/g, '');
        break;
      case 'email':
        a.href = 'mailto:' + (S.email || '');
        break;
      case 'whatsapp': {
        const message = t('contact.whatsappMessage');
        a.href = 'https://wa.me/' + String(S.whatsapp || '').replace(/\D/g, '') +
          (message ? '?text=' + encodeURIComponent(message) : '');
        a.target = '_blank';
        a.rel = 'noopener';
        break;
      }
      case 'map':
        a.href = S.mapLink || '#';
        a.target = '_blank';
        a.rel = 'noopener';
        break;
    }
  }

  function fillSettings() {
    $$('[data-setting]').forEach((el) => {
      const value = S[el.dataset.setting];
      if (value != null) el.textContent = value;
    });
    $$('[data-years]').forEach((el) => { el.textContent = (S.experienceYears || 0) + '+'; });
    $$('[data-logo]').forEach((img) => { const src = S.logos && S.logos[img.dataset.logo]; if (src) img.src = src; });
    $$('[data-link]').forEach(setLink);
    const banner = $('[data-demo-banner]');
    if (banner) banner.hidden = !S.showDemoBanner;
  }

  function setupMap() {
    const box = $('[data-map]');
    if (!box || !S.mapEmbed) return;
    const frame = document.createElement('iframe');
    frame.src = S.mapEmbed;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.allowFullscreen = true;
    frame.dataset.i18nAttr = 'title:contact.map.title';
    box.replaceChildren(frame);
  }

  /* ---------- Numbers that count up ---------- */

  function setupStats() {
    const els = $$('[data-stat]');
    if (!els.length) return;
    const values = {
      years: S.experienceYears || 0,
      team: (S.team || []).length,
      areas: (S.practiceAreas || []).length,
    };
    const suffix = { years: '+' };
    const show = (el, n) => { el.textContent = n + (suffix[el.dataset.stat] || ''); };

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => show(el, values[el.dataset.stat]));
      return;
    }
    // screen readers get the final number at once; the counting digits are only visual
    els.forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = values[el.dataset.stat] + (suffix[el.dataset.stat] || '');
      el.after(sr);
      show(el, 0);
    });
    const count = (el) => {
      const target = values[el.dataset.stat];
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / 1400);
        show(el, Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { count(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Scroll-in effect ---------- */

  function setupReveal() {
    const els = $$('.reveal, .reveal-stagger');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('reveal-ready');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Header: shadow on scroll, mobile menu, current section ---------- */

  const header = $('[data-header]');
  const nav = $('[data-nav]');
  const toggle = $('[data-menu-toggle]');
  const desktop = window.matchMedia('(min-width: 70em)');  // same as the CSS desktop breakpoint

  function setupHeaderShadow() {
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // the panel starts right under the header (whose bottom moves with the demo banner and on rotation)
  const placeNav = () => nav.style.setProperty('--nav-top', Math.max(0, header.getBoundingClientRect().bottom) + 'px');

  function setMenu(open) {
    if (!nav || !toggle) return;
    if (open) placeNav();
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.dataset.i18nAttr = 'aria-label:' + (open ? 'nav.close' : 'nav.open');
    toggle.setAttribute('aria-label', t(open ? 'nav.close' : 'nav.open'));
    // while the menu covers the page, keep keyboard and screen readers inside the header
    $$('main, footer, .wa-float, .mobile-bar').forEach((el) => { el.inert = open; });
  }
  const menuIsOpen = () => !!nav && nav.classList.contains('is-open');

  function setupMenu() {
    if (!nav || !toggle) return;
    toggle.addEventListener('click', () => {
      const open = !menuIsOpen();
      setMenu(open);
      // wait a frame so the panel is visible before focusing into it
      if (open) setTimeout(() => { const first = $('a', nav); if (first) first.focus(); }, 30);
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuIsOpen()) { setMenu(false); toggle.focus(); }
    });
    desktop.addEventListener('change', (e) => { if (e.matches) setMenu(false); });
    const keepPlaced = () => { if (menuIsOpen()) placeNav(); };
    window.addEventListener('resize', keepPlaced, { passive: true });
    document.addEventListener('langchange', keepPlaced);
  }

  function setupActiveNav() {
    const links = $$('.nav-list a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        const link = byId.get(e.target.id);
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const section = document.getElementById(id); if (section) io.observe(section); });
  }

  /* ---------- "Book a consultation" buttons ---------- */

  function setupBooking() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-book]');
      if (!button) return;
      const select = $('[data-area-select]');
      if (select && button.dataset.book) {
        select.value = button.dataset.book;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const title = $('#form-title');
      if (title) setTimeout(() => title.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
    });
  }

  /* ---------- Contact form (demo: checks the fields, sends nothing) ---------- */

  // Arabic-Indic digits (٠١٢…) typed on an Arabic keyboard count as normal digits
  const toLatinDigits = (s) => s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06F0));

  function isPhone(value) {
    const n = toLatinDigits(value).replace(/[\s\-().]/g, '');
    return /^(?:(?:\+|00)?966|0)?5\d{8}$/.test(n)   // Saudi mobile: 05XXXXXXXX / +9665XXXXXXXX
      || /^(?:\+|00)[1-9]\d{7,14}$/.test(n);        // any international number
  }

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const checks = {
    name: (el) => el.value.trim().length >= 2 || 'contact.errors.name',
    phone: (el) => isPhone(el.value) || 'contact.errors.phone',
    email: (el) => !el.value.trim() || EMAIL.test(el.value.trim()) || 'contact.errors.email',
    area: (el) => !!el.value || 'contact.errors.area',
    message: (el) => el.value.trim().length >= 10 || 'contact.errors.message',
    consent: (el) => el.checked || 'contact.errors.consent',
  };

  function showError(el, key) {
    const box = document.getElementById(el.id + '-err');
    if (key) {
      el.setAttribute('aria-invalid', 'true');
      if (box) { box.dataset.i18n = key; box.textContent = t(key); box.hidden = false; }
    } else {
      el.removeAttribute('aria-invalid');
      if (box) { delete box.dataset.i18n; box.textContent = ''; box.hidden = true; }
    }
  }

  function validate(el) {
    const check = checks[el.name];
    if (!check) return true;
    const result = check(el);
    showError(el, result === true ? null : result);
    return result === true;
  }

  function setupForm() {
    const form = $('[data-contact-form]');
    if (!form) return;
    const success = $('[data-form-success]', form);
    const fields = () => Object.keys(checks).map((name) => form.elements.namedItem(name)).filter(Boolean);
    let tried = false;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      tried = true;
      const invalid = fields().filter((el) => !validate(el));
      if (invalid.length) { invalid[0].focus(); return; }
      // Demo only — nothing leaves the browser. Phase 2: send the fields to a
      // Cloudflare Pages Function or a form service (e.g. Formspree, Web3Forms) here.
      form.reset();
      fields().forEach((el) => showError(el, null));
      tried = false;
      success.hidden = false;
      success.focus();
    });

    const recheck = (e) => { if (tried && e.target.name in checks) validate(e.target); };
    form.addEventListener('input', recheck);
    form.addEventListener('change', recheck);

    const again = $('[data-form-again]', form);
    if (again) again.addEventListener('click', () => {
      success.hidden = true;
      const first = form.elements.namedItem('name');
      if (first) first.focus();
    });
  }

  /* ---------- Quick-contact bar on phones ---------- */

  function setupMobileBar() {
    if (!$('[data-mobile-bar]')) return;
    const heroButtons = $('.hero-cta');
    // show it once the hero's own buttons have scrolled away, so the two never compete
    if (heroButtons && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        document.body.classList.toggle('show-bar', !e.isIntersecting && e.boundingClientRect.top < 0);
      }).observe(heroButtons);
    } else {
      document.body.classList.add('show-bar');
    }
    // hide it while typing in the form, so it doesn't sit on top of the phone keyboard
    const isField = (el) => el.matches && el.matches('input, textarea, select');
    document.addEventListener('focusin', (e) => { if (isField(e.target)) document.body.classList.add('is-typing'); });
    document.addEventListener('focusout', (e) => { if (isField(e.target)) document.body.classList.remove('is-typing'); });
  }

  // login.html: the form is a placeholder until phase 2
  /* ---------- Typing on phones: the keyboard's return key moves to the next field ---------- */
  // As in a native app: "Next" on the keyboard goes on to the next field and only the last one sends the
  // form, so a half-filled form is never sent by accident. Text areas keep Enter for new lines.
  // data-enter-blur on a field: when it is the last one, Enter just closes the keyboard ("Done").
  const NOT_TYPED = ['checkbox', 'radio', 'submit', 'button', 'reset', 'file', 'range', 'color', 'hidden'];
  const isTyped = (el) => (el instanceof HTMLInputElement && !NOT_TYPED.includes(el.type)) || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement;
  const nextField = (el) => {
    const fields = Array.from(el.form.elements).filter((f) => isTyped(f) && !f.disabled && !f.readOnly && f.getClientRects().length > 0);
    return fields[fields.indexOf(el) + 1] || null;
  };
  function setupEnterNext() {
    document.addEventListener('focusin', (e) => {
      const el = e.target;
      if (!(el instanceof HTMLInputElement) || NOT_TYPED.includes(el.type) || !el.form) return;
      el.setAttribute('enterkeyhint', nextField(el) ? 'next' : el.hasAttribute('data-enter-blur') ? 'done' : 'go');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
      const el = e.target;
      if (!(el instanceof HTMLInputElement) || NOT_TYPED.includes(el.type) || !el.form) return;
      const next = nextField(el);
      if (next) { e.preventDefault(); next.focus(); }
      else if (el.hasAttribute('data-enter-blur')) { e.preventDefault(); el.blur(); }
    });
  }

  /* ---------- Display options panel (demo): night mode, colours, shape ---------- */
  // js/boot.js applies the saved choice before the page is drawn; this panel changes it.
  const THEME = {
    mode:   { attr: 'theme',  key: 'theme-mode',   def: 'light',    param: 'theme' },
    accent: { attr: 'accent', key: 'theme-accent', def: 'official', param: 'accent' },
    shape:  { attr: 'shape',  key: 'theme-shape',  def: 'soft',     param: 'shape' },
  };

  // the browser bar colour follows the scheme (phones)
  function updateThemeColor() {
    const meta = $('meta[name="theme-color"]');
    const c = getComputedStyle(document.documentElement).getPropertyValue('--char-700').trim();
    if (meta && c) meta.setAttribute('content', c);
  }

  function setupThemePanel() {
    const panel = $('[data-theme-panel]');
    const toggle = $('[data-theme-toggle]');
    const backdrop = $('[data-theme-backdrop]');
    if (!panel || !toggle) return;
    if (S.displayOptions === false) { toggle.hidden = true; return; }
    const root = document.documentElement;
    const current = (k) => root.getAttribute('data-' + THEME[k].attr) || THEME[k].def;

    function sync() {
      Object.keys(THEME).forEach((k) => {
        const input = $(`input[name="theme-${k}"][value="${current(k)}"]`, panel);
        if (input) input.checked = true;
      });
    }
    function set(k, value) {
      const o = THEME[k];
      if (value === o.def) root.removeAttribute('data-' + o.attr);
      else root.setAttribute('data-' + o.attr, value);
      try { if (value === o.def) localStorage.removeItem(o.key); else localStorage.setItem(o.key, value); } catch (e) { /* not remembered */ }
      // a ?theme= / ?accent= / ?shape= link would undo the choice on reload, so keep it in step (as the language switch does)
      try {
        const url = new URL(location.href);
        if (url.searchParams.has(o.param)) {
          if (value === o.def) url.searchParams.delete(o.param); else url.searchParams.set(o.param, value);
          history.replaceState(history.state, '', url);
        }
      } catch (e) { /* opened from a file */ }
      updateThemeColor();
    }
    function open() {
      // never on top of the open mobile menu
      const menuToggle = $('[data-menu-toggle]');
      if (document.body.classList.contains('nav-open') && menuToggle) menuToggle.click();
      sync();
      panel.hidden = false;
      if (backdrop) backdrop.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      const first = $('input:checked', panel);
      if (first) first.focus();
    }
    function close(returnFocus) {
      if (panel.hidden) return;
      panel.hidden = true;
      if (backdrop) backdrop.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    }

    panel.addEventListener('change', (e) => {
      const m = /^theme-(mode|accent|shape)$/.exec(e.target.name || '');
      if (m) set(m[1], e.target.value);
    });
    toggle.addEventListener('click', () => (panel.hidden ? open() : close(true)));
    $('[data-theme-close]', panel).addEventListener('click', () => close(true));
    $('[data-theme-reset]', panel).addEventListener('click', () => {
      Object.keys(THEME).forEach((k) => set(k, THEME[k].def));
      sync();
    });
    // Esc closes the panel only (capture phase, so the menu's own Esc handler does not also run)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); close(true); }
    }, true);
    // a tap beside the panel lands on the backdrop, so it closes the panel without pressing anything underneath
    if (backdrop) backdrop.addEventListener('click', () => close(true));
    // keyboard: leaving the panel closes it, so it never hides the focused element
    panel.addEventListener('focusout', (e) => {
      const to = e.relatedTarget;
      if (to && !panel.contains(to) && !toggle.contains(to)) close(false);
    });
  }

  /* ---------- Start ---------- */

  buildTeam();
  buildClients();
  buildLicence();
  buildPractice();
  buildAreaOptions();
  setupMap();
  I18N.apply();
  fillSettings();
  setupStats();
  setupReveal();
  setupHeaderShadow();
  setupMenu();
  setupActiveNav();
  setupBooking();
  setupForm();
  setupMobileBar();
  setupThemePanel();
  setupEnterNext();
  updateThemeColor();

  // the WhatsApp greeting is written in the page language
  document.addEventListener('langchange', () => $$('[data-link="whatsapp"]').forEach(setLink));
})();
