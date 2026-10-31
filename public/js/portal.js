/* ==========================================================================
   Employee portal and electronic fee agreements — DEMO
   - No server: the demo sign-in is checked in this file, and everything is saved in this browser
     (localStorage). It is a preview of the workflow, NOT a secure system.
   - Phase 2 replaces this with a real backend: personal accounts, permissions checked on the server,
     encrypted storage, and an approved e-signature / Nafath verification.
   Runs on login.html (sign-in), portal.html (the portal) and sign.html (the client's signing page).
   ========================================================================== */
(function () {
  'use strict';

  const S = window.SITE_SETTINGS || {};
  const t = (key, lang) => I18N.t(key, lang);
  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fill = (str, vars) => String(str).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? vars[k] : m));
  const page = document.body.dataset.page;

  // ---------- demo account (shared with the client for the preview) ----------
  const DEMO_USER = { email: 'info@kalidlaw.com', password: 'Allewa@2026' };
  const SESSION_KEY = 'kh-demo-session';
  const DATA_KEY = 'kh-demo-contracts-v1';
  const DEMO_OTP = '1234';

  // what each role may open or do (the server enforces this in phase 2)
  const ROLES = {
    admin:   ['overview', 'contractsView', 'contractsCreate', 'contractsSend', 'contractsDelete', 'cases', 'appointments', 'clients', 'documents', 'invoices', 'users'],
    lawyer:  ['overview', 'contractsView', 'contractsCreate', 'contractsSend', 'cases', 'appointments', 'clients', 'documents'],
    trainee: ['overview', 'cases', 'appointments', 'documents'],
    staff:   ['overview', 'contractsView', 'appointments', 'clients', 'invoices'],
  };
  const PERMS = ['overview', 'contractsView', 'contractsCreate', 'contractsSend', 'contractsDelete', 'cases', 'appointments', 'clients', 'documents', 'invoices', 'users'];

  // ---------- small storage helpers (fall back to memory when storage is blocked) ----------
  const memory = {};
  const store = {
    get(k, area) { try { return (area || localStorage).getItem(k); } catch (e) { return memory[k] || null; } },
    set(k, v, area) { try { (area || localStorage).setItem(k, v); } catch (e) { memory[k] = v; } },
    del(k, area) { try { (area || localStorage).removeItem(k); } catch (e) { delete memory[k]; } },
  };
  // the demo session lasts until "Sign out", also in new tabs (so a link opened from WhatsApp is already signed in)
  const getSession = () => { try { return JSON.parse(store.get(SESSION_KEY)) || null; } catch (e) { return null; } };
  const setSession = (s) => store.set(SESSION_KEY, JSON.stringify(s));

  // ---------- formatting ----------
  const lang = () => I18N.lang;
  const toLatin = (s) => String(s || '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  const money = (n) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
  function fmtDate(ts, l, withTime) {
    const d = new Date(ts);
    const opts = withTime ? { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' } : { year: 'numeric', month: 'long', day: 'numeric' };
    try { return new Intl.DateTimeFormat((l || lang()) === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', opts).format(d); } catch (e) { return d.toLocaleDateString(); }
  }
  function fmtHijri(ts, l) {
    try { return new Intl.DateTimeFormat((l || lang()) === 'ar' ? 'ar-SA-u-ca-islamic-umalqura-nu-latn' : 'en-u-ca-islamic-umalqura', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(ts)); } catch (e) { return ''; }
  }
  function feeNumbers(c) {
    const amount = Number(c.fees.amount) || 0;
    if (c.fees.vat === 'excl') return { amount, vat: amount * 0.15, total: amount * 1.15 };
    if (c.fees.vat === 'incl') return { amount: amount / 1.15, vat: amount - amount / 1.15, total: amount };
    return { amount, vat: 0, total: amount };
  }
  const memberName = (id, l) => t('team.members.' + id + '.name', l);
  const areaName = (id, l) => (id && id !== 'other' ? t('practice.areas.' + id + '.title', l) : t('portal.form.areaOther', l));
  const licenceNo = (l) => { const m = (S.licence || []).find((x) => x.id === 'moj'); return (m && m.number) || t('licence.pending', l); };

  async function sha256(text) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (e) { return ''; }
  }
  const contractBody = (c) => JSON.stringify(c.lang === 'both'
    ? [c.id, c.lang, c.createdAt, c.lawyer, c.client, c.matter, c.fees, c.duration, c.city, c.terms, c.en || {}]
    : [c.id, c.lang, c.createdAt, c.lawyer, c.client, c.matter, c.fees, c.duration, c.city, c.terms]);
  const randomToken = () => { const a = new Uint8Array(12); crypto.getRandomValues(a); return Array.from(a, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 20); };

  // ---------- the demo agreements ----------
  function seed() {
    const now = Date.now(), day = 864e5, hr = 36e5;
    const tag = ' (' + t('portal.sample', 'ar') + ')';
    return [
      {
        id: 'FA-2026-0003', status: 'draft', lang: 'both', createdAt: now - 2 * hr, updatedAt: now - 2 * hr, lawyer: 'khalid',
        client: { name: 'مؤسسة النموذج للمقاولات' + tag, idType: 'cr', idNumber: '7000000003', phone: '0500000003', email: 'client3@example.com', address: 'الجبيل الصناعية' },
        matter: { area: 'commercial', title: 'صياغة ومراجعة عقود توريد', scope: 'مراجعة نماذج عقود التوريد الحالية، وصياغة نموذج موحد، وتقديم مذكرة بالملاحظات النظامية.' },
        fees: { amount: 12000, vat: 'excl', schedule: 'two', custom: '' }, duration: '', city: 'الجبيل', terms: '',
        en: { clientName: 'Al Namoothaj Contracting Est. (demo)', address: 'Jubail Industrial City', title: 'Drafting and reviewing supply contracts', scope: 'Reviewing the current supply contract templates, drafting a unified template, and providing a memo of legal observations.', custom: '', duration: '', city: 'Jubail', terms: '' },
        events: [{ type: 'created', at: now - 2 * hr }],
      },
      {
        id: 'FA-2026-0002', status: 'sent', lang: 'ar', createdAt: now - 3 * day, updatedAt: now - 2 * day, lawyer: 'khalid',
        client: { name: 'عميل تجريبي ثانٍ', idType: 'id', idNumber: '1000000002', phone: '0500000002', email: 'client2@example.com', address: 'الجبيل' },
        matter: { area: 'labor', title: 'الترافع في دعوى عمالية', scope: 'دراسة القضية، وإعداد المذكرات، والترافع أمام المحكمة العمالية حتى صدور الحكم الابتدائي.' },
        fees: { amount: 15000, vat: 'excl', schedule: 'full', custom: '' }, duration: '', city: 'الجبيل', terms: '',
        token: 'demo0002', hash: '',
        events: [{ type: 'created', at: now - 3 * day }, { type: 'sent', at: now - 2 * day }],
      },
      {
        id: 'FA-2026-0001', status: 'signed', lang: 'ar', createdAt: now - 9 * day, updatedAt: now - 7 * day, lawyer: 'khalid',
        client: { name: 'عميل تجريبي أول', idType: 'id', idNumber: '1000000001', phone: '0500000001', email: 'client1@example.com', address: 'الجبيل' },
        matter: { area: 'realestate', title: 'استشارة ومتابعة نزاع عقاري', scope: 'دراسة مستندات العقار، وتقديم الاستشارة، ومتابعة النزاع ودّيًا أو قضائيًا حتى صدور الحكم الابتدائي.' },
        fees: { amount: 20000, vat: 'excl', schedule: 'two', custom: '' }, duration: '', city: 'الجبيل', terms: '',
        token: 'demo0001', hash: '',
        signature: { method: 'typed', name: 'عميل تجريبي أول', at: now - 7 * day },
        events: [{ type: 'created', at: now - 9 * day }, { type: 'sent', at: now - 8 * day }, { type: 'viewed', at: now - 7 * day - 3 * hr }, { type: 'signed', at: now - 7 * day }],
      },
    ];
  }
  let contracts = null;
  function load() {
    if (contracts) return contracts;
    try { const d = JSON.parse(store.get(DATA_KEY)); if (Array.isArray(d)) contracts = d; } catch (e) { /* fresh start */ }
    if (!contracts) { contracts = page === 'sign' ? [] : seed(); if (page !== 'sign') save(); }
    return contracts;
  }
  function save() { store.set(DATA_KEY, JSON.stringify(contracts)); }
  const find = (id, token) => load().find((c) => c.id === id && (!token || c.token === token));
  // seeded agreements get their fingerprint the first time they are shown
  async function ensureHash(c) {
    if (c.status !== 'draft' && !c.hash) { c.hash = await sha256(contractBody(c)); save(); }
    return c.hash;
  }
  function nextId() {
    const year = new Date().getFullYear();
    const max = load().reduce((m, c) => { const r = /^FA-(\d{4})-(\d+)$/.exec(c.id); return r && +r[1] === year ? Math.max(m, +r[2]) : m; }, 0);
    return 'FA-' + year + '-' + String(max + 1).padStart(4, '0');
  }
  /* Without a server, a link has to carry its own data. The signing link holds a copy of the agreement
     (after the #, which browsers never send to a server), so it opens on any phone or browser. After signing,
     the confirmation link carries the agreement back with the signature (drawn signatures as compact strokes).
     Phase 2 replaces both with records on the server. */
  const b64u = {
    enc(bytes) { let bin = ''; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); },
    dec(str) { const t64 = str.replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(t64 + '='.repeat((4 - (t64.length % 4)) % 4)); return Uint8Array.from(bin, (ch) => ch.charCodeAt(0)); },
  };
  const packJson = (v) => b64u.enc(new TextEncoder().encode(JSON.stringify(v)));
  const unpackJson = (str) => JSON.parse(new TextDecoder().decode(b64u.dec(str)));
  const str = (v) => (v == null ? '' : String(v));
  // English counterparts of a bilingual agreement, always in this order (the fingerprint depends on it)
  const EN_KEYS = ['clientName', 'address', 'title', 'scope', 'custom', 'duration', 'city', 'terms'];
  function packContract(c) {
    const sent = (c.events || []).find((e) => e.type === 'sent');
    return [1, c.id, c.token, c.lang, c.createdAt, sent ? sent.at : c.updatedAt, c.lawyer,
      str(c.client.name), str(c.client.idType), str(c.client.idNumber), str(c.client.phone), str(c.client.email), str(c.client.address),
      str(c.matter.area), str(c.matter.title), str(c.matter.scope),
      c.fees.amount, str(c.fees.vat), str(c.fees.schedule), str(c.fees.custom),
      str(c.duration), str(c.city), str(c.terms)].concat(c.lang === 'both' ? EN_KEYS.map((k) => str((c.en || {})[k])) : []);
  }
  function unpackContract(a) {
    if (!Array.isArray(a) || a[0] !== 1 || a.length < 23) return null;
    const [, id, token, lang, createdAt, sentAt, lawyer, name, idType, idNumber, phone, email, address, area, title, scope, amount, vat, schedule, custom, duration, city, terms] = a;
    // same key order as the portal's own records, so the fingerprint comes out identical
    const c = {
      id, token, status: 'sent', lang, createdAt, updatedAt: sentAt, lawyer,
      client: { name, idType, idNumber, phone, email, address },
      matter: { area, title, scope },
      fees: { amount, vat, schedule, custom },
      duration, city, terms, hash: '', remote: true,
      events: [{ type: 'created', at: createdAt }, { type: 'sent', at: sentAt }],
    };
    if (lang === 'both') {
      if (a.length < 23 + EN_KEYS.length) return null;
      c.en = {};
      EN_KEYS.forEach((k, i) => { c.en[k] = a[23 + i]; });
    }
    return c;
  }
  const signLink = (c) => new URL('sign.html?c=' + encodeURIComponent(c.id) + '&k=' + encodeURIComponent(c.token) + '&lang=' + (c.lang === 'en' ? 'en' : 'ar') + '#v1.' + packJson(packContract(c)), location.href).href;
  function returnLink(c) {
    const sg = c.signature || {};
    const viewed = (c.events || []).find((e) => e.type === 'viewed');
    const head = packJson([packContract(c), [sg.name, sg.at, sg.method, sg.ratio || 0, viewed ? viewed.at : 0]]);
    return new URL('portal.html#/receive/v1.' + head + (sg.method === 'drawn' && sg.vec ? '.' + sg.vec : ''), location.href).href;
  }
  // drawn signature <-> bytes: strokes on a 1000-wide grid, as zigzag varint deltas
  function encodeStrokes(strokes) {
    const out = [];
    const put = (n) => { n = n < 0 ? -2 * n - 1 : 2 * n; while (n >= 0x80) { out.push((n & 0x7f) | 0x80); n = Math.floor(n / 128); } out.push(n); };
    const kept = strokes.map((pts) => {
      const q = [];
      for (let i = 0; i < pts.length; i += 2) {
        const x = Math.round(pts[i]), y = Math.round(pts[i + 1]);
        const n = q.length;
        if (!n || i === pts.length - 2 || Math.abs(x - q[n - 2]) + Math.abs(y - q[n - 1]) >= 3) q.push(x, y);
      }
      return q;
    }).filter((q) => q.length);
    put(kept.length);
    kept.forEach((q) => { put(q.length / 2); let px = 0, py = 0; for (let i = 0; i < q.length; i += 2) { put(q[i] - px); put(q[i + 1] - py); px = q[i]; py = q[i + 1]; } });
    return new Uint8Array(out);
  }
  function decodeStrokes(bytes) {
    let i = 0;
    const get = () => { let n = 0, mul = 1, b; do { b = bytes[i++]; n += (b & 0x7f) * mul; mul *= 128; } while (b & 0x80 && i < bytes.length); return n % 2 ? -(n + 1) / 2 : n / 2; };
    const strokes = [];
    for (let s = get(); s > 0 && i < bytes.length; s--) {
      const pts = []; let x = 0, y = 0;
      for (let k = get(); k > 0 && i < bytes.length; k--) { x += get(); y += get(); pts.push(x, y); }
      strokes.push(pts);
    }
    return strokes;
  }
  function strokesToImage(strokes, ratio) {
    const W = 600, H = Math.max(120, Math.round(W * (ratio || 0.45)));
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'), k = W / 1000;
    ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#14213d';
    strokes.forEach((pts) => {
      ctx.beginPath(); ctx.moveTo(pts[0] * k, pts[1] * k);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i] * k, pts[i + 1] * k);
      if (pts.length === 2) ctx.lineTo(pts[0] * k + 0.1, pts[1] * k + 0.1);
      ctx.stroke();
    });
    return cv.toDataURL('image/png');
  }

  // ---------- toast ----------
  function toast(msg) {
    let el = $('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  // ---------- the agreement document (portal, signing page and print) ----------
  // One language ('ar' or 'en'), or both ('both'): a two-column table with English on the left and Arabic on
  // the right, each article under a dark heading row, the way the firm lays out its bilingual agreements.
  const isBi = (c) => c.lang === 'both';
  const span = (L, html) => `<span class="cd-l" lang="${L}" dir="${L === 'ar' ? 'rtl' : 'ltr'}">${html}</span>`;
  const per = (langs, fn) => langs.map((L) => span(L, esc(fn(L)))).join('');

  // the agreement's own fields in one language (a bilingual agreement keeps its English in c.en)
  function fieldsIn(c, L) {
    const en = isBi(c) && L === 'en' ? (c.en || {}) : null;
    const pick = (base, key) => (en && en[key] ? en[key] : base) || '';
    const other = isBi(c) ? (c.en || {}).terms : '';
    return {
      clientName: pick(c.client.name, 'clientName'), address: pick(c.client.address, 'address'),
      title: pick(c.matter.title, 'title'), scope: pick(c.matter.scope, 'scope'), custom: pick(c.fees.custom, 'custom'),
      duration: pick(c.duration, 'duration'), city: pick(c.city, 'city'),
      terms: (L === 'en' && isBi(c) ? other || c.terms : c.terms || other) || '',
    };
  }

  // everything one language column needs
  function docParts(c, L) {
    const T = (k) => t('contract.' + k, L);
    const f = fieldsIn(c, L);
    const n = feeNumbers(c);
    const vars = {
      matter: esc(f.title), area: esc(areaName(c.matter.area, L)), scope: esc(f.scope),
      duration: esc(f.duration || t('portal.form.durationDefault', L)), city: esc(f.city || t('portal.form.cityDefault', L)),
      fees: fill(T('fees.' + c.fees.vat), { amount: money(n.amount), vat: money(n.vat), total: money(n.total) }),
      schedule: fill(T('schedule.' + c.fees.schedule), { custom: esc(f.custom) }),
    };
    const clauses = (t('contract.clauses', L) || []).map((cl) => Object.assign({}, cl));
    if (f.terms) clauses.push({ h: T('extraTerms'), p: f.terms, raw: true });
    if (isBi(c)) clauses.push(t('contract.language', L));
    clauses.push(t('contract.copies', L));
    const ordinals = t('contract.ordinals', 'ar') || [];
    const heading = (i, h) => fill(T('article'), { n: L === 'ar' ? ordinals[i] || String(i + 1) : String(i + 1), h });
    const body = (cl) => (cl.p ? `<p>${cl.raw ? esc(cl.p) : fill(esc(cl.p), vars)}</p>` : '')
      + (cl.items ? `<ol class="cd-items">${cl.items.map((it) => `<li>${fill(esc(it), vars)}</li>`).join('')}</ol>` : '')
      + (cl.note ? `<p>${fill(esc(cl.note), vars)}</p>` : '');
    const idTypeLabel = t('portal.form.idTypes.' + (c.client.idType || 'id'), L);
    const row = (label, value) => (value ? `<div><dt>${esc(label)}</dt><dd><bdi>${esc(value)}</bdi></dd></div>` : '');
    const partyA = `<h3>${esc(T('partyA'))}</h3><p class="cd-party-name">${esc(T('firmName'))}</p>`
      + `<p>${esc(fill(T('firmRep'), { lawyer: memberName(c.lawyer || 'khalid', L) }))}</p>`
      + `<p>${esc(fill(T('firmLicence'), { licence: licenceNo(L) }))}</p><p>${esc(T('firmCity'))}</p>`;
    const partyB = `<h3>${esc(T('partyB'))}</h3><p class="cd-party-name">${esc(f.clientName)}</p>`
      + `<dl>${row(T('labels.id') + ' (' + idTypeLabel + ')', c.client.idNumber)}${row(T('labels.phone'), c.client.phone)}`
      + `${row(T('labels.email'), c.client.email)}${row(T('labels.address'), f.address)}</dl>`;
    const cur = esc(T('table.currency'));
    const sum = [
      [T('table.fees'), `<bdi>${money(n.amount)} ${cur}</bdi>`],
      c.fees.vat !== 'none' ? [T('table.vat'), `<bdi>${money(n.vat)} ${cur}</bdi>`] : null,
      [T('table.total'), `<bdi>${money(n.total)} ${cur}</bdi>`, true],
      [T('table.schedule'), esc(t('portal.form.schedules.' + c.fees.schedule, L)) + (c.fees.schedule === 'custom' && f.custom ? ': ' + esc(f.custom) : '')],
    ].filter(Boolean);
    return { T, clauses, heading, body, partyA, partyB, sum, preamble: fill(esc(T('preamble')), vars) };
  }

  function signsHtml(c, langs) {
    const sent = (c.events || []).find((e) => e.type === 'sent');
    const sig = c.signature;
    const lab = (k) => per(langs, (L) => t('contract.' + k, L));
    return `
  <section class="cd-signs">
    <h3>${lab('signatures')}</h3>
    <div class="cd-sign-grid">
      <div class="cd-sign">
        <p class="cd-sign-party">${lab('partyA')}</p>
        ${sent ? `<p class="cd-stamp">${lab('approved')}</p><p class="cd-sign-name">${per(langs, (L) => memberName(c.lawyer || 'khalid', L))}</p><p class="cd-sign-date">${per(langs, (L) => fmtDate(sent.at, L, true))}</p>` : '<p class="cd-sign-wait">—</p>'}
      </div>
      <div class="cd-sign">
        <p class="cd-sign-party">${lab('partyB')}</p>
        ${sig ? `${sig.method === 'drawn' && sig.image ? `<img class="cd-sig-img" src="${esc(sig.image)}" alt="">` : `<p class="cd-sig-typed">${esc(sig.name)}</p>`}
          <p class="cd-sign-name">${esc(sig.name)}</p>
          <p class="cd-sign-date">${per(langs, (L) => t('contract.signedAt', L) + ' ' + fmtDate(sig.at, L, true))}</p>
          <p class="cd-sign-method">${lab('method.' + sig.method)}</p>` : `<p class="cd-sign-wait">${lab('pending')}</p>`}
      </div>
    </div>
  </section>`;
  }

  function footHtml(c, langs) {
    return `
  <footer class="cd-foot">
    ${c.hash ? `<p><span>${per(langs, (L) => t('contract.fingerprint', L))}</span><code dir="ltr">${esc(c.hash.match(/.{1,8}/g).join(' '))}</code></p>` : ''}
    <p>${per(langs, (L) => t('contract.footer', L))}</p>
  </footer>`;
  }

  function renderContract(c) {
    return isBi(c) ? renderBilingual(c) : renderSingle(c);
  }

  function renderSingle(c) {
    const L = c.lang === 'en' ? 'en' : 'ar';
    const d = docParts(c, L), T = d.T;
    return `
<article class="contract-doc" lang="${L}" dir="${L === 'ar' ? 'rtl' : 'ltr'}">
  <p class="cd-demo">${esc(T('demoMark'))}</p>
  <header class="cd-head">
    <div class="cd-brand"><img src="images/logo-mark-dark.svg" alt="" width="34" height="52"><span>${esc(T('firmName'))}</span></div>
    <h2 class="cd-title">${esc(T('title'))}</h2>
    <dl class="cd-meta">
      <div><dt>${esc(T('no'))}</dt><dd><bdi dir="ltr">${esc(c.id)}</bdi></dd></div>
      <div><dt>${esc(T('date'))}</dt><dd>${esc(fmtDate(c.createdAt, L))}<span class="cd-hijri">${esc(fmtHijri(c.createdAt, L))}</span></dd></div>
    </dl>
  </header>
  <section class="cd-parties"><div class="cd-party">${d.partyA}</div><div class="cd-party">${d.partyB}</div></section>
  <p class="cd-preamble">${d.preamble}</p>
  <ol class="cd-clauses">
    ${d.clauses.map((cl, i) => `<li><h4>${esc(d.heading(i, cl.h))}</h4>${d.body(cl)}</li>`).join('')}
  </ol>
  <table class="cd-fees"><tbody>
    ${d.sum.map(([k, v, total]) => `<tr${total ? ' class="cd-total"' : ''}><th scope="row">${esc(k)}</th><td>${v}</td></tr>`).join('')}
  </tbody></table>
  ${signsHtml(c, [L])}
  ${footHtml(c, [L])}
</article>`;
  }

  function renderBilingual(c) {
    const A = docParts(c, 'ar'), E = docParts(c, 'en');
    const LL = ['ar', 'en'];
    const cell = (L, html, tag) => `<${tag || 'td'} class="cd-${L}" lang="${L}" dir="${L === 'ar' ? 'rtl' : 'ltr'}">${html}</${tag || 'td'}>`;
    const head = (en, ar) => `<tr class="cd-bi-head">${cell('en', esc(en), 'th')}${cell('ar', esc(ar), 'th')}</tr>`;
    const pair = (en, ar) => `<tr>${cell('en', en)}${cell('ar', ar)}</tr>`;
    const sum = (d) => `<dl class="cd-sum">${d.sum.map(([k, v, total]) => `<div${total ? ' class="cd-total"' : ''}><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
    let rows = head(t('contract.bi.parties', 'en'), t('contract.bi.parties', 'ar'))
      + pair(E.partyA + E.partyB, A.partyA + A.partyB)
      + pair(`<p>${E.preamble}</p>`, `<p>${A.preamble}</p>`);
    const count = Math.max(A.clauses.length, E.clauses.length);
    for (let i = 0; i < count; i++) {
      const ce = E.clauses[i] || {}, ca = A.clauses[i] || {};
      rows += head(E.heading(i, ce.h || ''), A.heading(i, ca.h || '')) + pair(E.body(ce), A.body(ca));
    }
    rows += head(t('contract.bi.fees', 'en'), t('contract.bi.fees', 'ar')) + pair(sum(E), sum(A));
    return `
<article class="contract-doc contract-bi" lang="ar" dir="rtl">
  <p class="cd-demo">${per(LL, (L) => t('contract.demoMark', L))}</p>
  <header class="cd-head">
    <div class="cd-brand"><img src="images/logo-mark-dark.svg" alt="" width="34" height="52"><span>${per(LL, (L) => t('contract.firmName', L))}</span></div>
    <h2 class="cd-title">${per(LL, (L) => t('contract.title', L))}</h2>
    <dl class="cd-meta">
      <div><dt>${per(LL, (L) => t('contract.no', L))}</dt><dd><bdi dir="ltr">${esc(c.id)}</bdi></dd></div>
      <div><dt>${per(LL, (L) => t('contract.date', L))}</dt><dd>${esc(fmtDate(c.createdAt, 'ar'))}<span class="cd-hijri">${esc(fmtHijri(c.createdAt, 'ar'))}</span>${span('en', esc(fmtDate(c.createdAt, 'en')))}</dd></div>
    </dl>
  </header>
  <table class="cd-bi" dir="ltr"><tbody>${rows}</tbody></table>
  ${signsHtml(c, LL)}
  ${footHtml(c, LL)}
</article>`;
  }

  // print just the agreement (the browser's "Save as PDF" makes the copy)
  function printContract(c) {
    let root = $('#print-root');
    if (!root) { root = document.createElement('div'); root.id = 'print-root'; document.body.appendChild(root); }
    root.innerHTML = renderContract(c);
    document.documentElement.classList.add('is-printing');
    const done = () => { document.documentElement.classList.remove('is-printing'); root.innerHTML = ''; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    const img = $('img', root);
    const go = () => setTimeout(() => window.print(), 60);
    if (img && !img.complete) { img.onload = go; img.onerror = go; } else go();
  }

  // ---------- modal ----------
  let lastFocus = null;
  function openModal(html, onReady) {
    let wrap = $('[data-modal]');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'modal';
      wrap.setAttribute('data-modal', '');
      wrap.innerHTML = '<div class="modal-backdrop" data-modal-close></div><div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"></div>';
      document.body.appendChild(wrap);
      wrap.addEventListener('click', (e) => { if (e.target.closest('[data-modal-close]')) closeModal(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !wrap.hidden) { e.stopPropagation(); closeModal(); } }, true);
    }
    lastFocus = document.activeElement;
    $('.modal-card', wrap).innerHTML = html;
    wrap.hidden = false;
    document.body.classList.add('modal-open');
    const first = $('[data-autofocus]', wrap) || $('button, a, input', wrap);
    if (first) first.focus();
    if (onReady) onReady(wrap);
  }
  function closeModal() {
    const wrap = $('[data-modal]');
    if (!wrap || wrap.hidden) return;
    wrap.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const statusChip = (s) => `<span class="chip chip-${s}">${esc(t('portal.status.' + s))}</span>`;

  /* =======================================================================
     1. Sign-in page
     ======================================================================= */
  function setupLogin() {
    const form = $('[data-login-form]');
    if (!form) return;
    const email = $('#l-user', form), pass = $('#l-pass', form), err = $('[data-login-error]', form);
    const toggle = $('[data-show-pass]', form);
    if (toggle) toggle.addEventListener('click', () => {
      const show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(show));
      $('span', toggle).dataset.i18n = show ? 'login.hide' : 'login.show';
      $('span', toggle).textContent = t(show ? 'login.hide' : 'login.show');
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = email.value.trim().toLowerCase() === DEMO_USER.email && pass.value === DEMO_USER.password;
      if (!ok) {
        err.hidden = false;
        err.textContent = t('login.error');
        [email, pass].forEach((el) => el.setAttribute('aria-invalid', 'true'));
        pass.focus();
        return;
      }
      setSession({ email: DEMO_USER.email, role: 'admin', at: Date.now() });
      const next = new URLSearchParams(location.search).get('next') || '';
      location.href = 'portal.html' + (/^#\/[\w./-]*$/.test(next) ? next : '');
    });
    [email, pass].forEach((el) => el.addEventListener('input', () => { err.hidden = true; [email, pass].forEach((x) => x.removeAttribute('aria-invalid')); }));
  }

  /* =======================================================================
     2. Portal
     ======================================================================= */
  const NAV = [
    { id: 'overview', perm: 'overview', icon: 'home' },
    { id: 'contracts', perm: 'contractsView', icon: 'doc' },
    { id: 'cases', perm: 'cases', icon: 'briefcase', soon: true },
    { id: 'appointments', perm: 'appointments', icon: 'calendar', soon: true },
    { id: 'clients', perm: 'clients', icon: 'users', soon: true },
    { id: 'documents', perm: 'documents', icon: 'folder', soon: true },
    { id: 'invoices', perm: 'invoices', icon: 'receipt', soon: true },
    { id: 'users', perm: 'users', icon: 'shield' },
  ];
  let session = null;
  const can = (p) => (ROLES[session.role] || []).includes(p);

  function setupPortal() {
    session = getSession();
    if (!session) { location.replace('login.html' + (location.hash ? '?next=' + encodeURIComponent(location.hash) : '')); return; }
    load();
    // role switch (demo): shows how the menu changes with permissions
    const roleSel = $('[data-role-switch]');
    const fillRoles = () => {
      roleSel.innerHTML = Object.keys(ROLES).map((r) => `<option value="${r}"${r === session.role ? ' selected' : ''}>${esc(t('portal.roles.' + r))}</option>`).join('');
    };
    fillRoles();
    roleSel.addEventListener('change', () => { session.role = roleSel.value; setSession(session); renderNav(); route(); });
    $('[data-logout]').addEventListener('click', () => { store.del(SESSION_KEY); location.href = 'login.html'; });

    // phone menu (drawer)
    const nav = $('[data-portal-nav]'), navBtn = $('[data-portal-menu]'), shade = $('[data-portal-shade]');
    const setNav = (open) => {
      document.body.classList.toggle('portal-nav-open', open);
      navBtn.setAttribute('aria-expanded', String(open));
      shade.hidden = !open;
      if (open) { const a = $('a', nav); if (a) a.focus(); }
    };
    navBtn.addEventListener('click', () => setNav(!document.body.classList.contains('portal-nav-open')));
    shade.addEventListener('click', () => setNav(false));
    const closeBtn = $('[data-portal-close]');
    if (closeBtn) closeBtn.addEventListener('click', () => { setNav(false); navBtn.focus(); });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('portal-nav-open')) { setNav(false); navBtn.focus(); } });

    window.addEventListener('hashchange', route);
    document.addEventListener('langchange', () => { fillRoles(); renderNav(); route(); });
    renderNav();
    route();
  }

  function renderNav() {
    const nav = $('[data-portal-nav-list]');
    const current = (location.hash.split('/')[1] || 'overview');
    nav.innerHTML = NAV.filter((n) => can(n.perm)).map((n) => `
      <li><a href="#/${n.id}"${n.id === current ? ' aria-current="page"' : ''}>${icon(n.icon)}<span>${esc(t('portal.nav.' + n.id))}</span>${n.soon ? `<em class="soon">${esc(t('portal.soon'))}</em>` : ''}</a></li>`).join('');
    $('[data-user-role]').textContent = t('portal.roles.' + session.role);
  }

  // a client's confirmation link: the agreement comes back signed (created here if this browser lacks it)
  function receive(payload) {
    const view = $('[data-portal-view]');
    try {
      if (!/^v1\./.test(payload || '')) throw new Error('format');
      const [head, vec] = payload.slice(3).split('.');
      const data = unpackJson(head);
      const remote = unpackContract(data[0]);
      const [name, at, method, ratio, viewedAt] = data[1] || [];
      if (!remote || !name || !at) throw new Error('data');
      let c = find(remote.id, remote.token);
      if (!c) { c = remote; delete c.remote; load().push(c); }
      if (c.status !== 'signed') {
        const image = method === 'drawn' && vec ? strokesToImage(decodeStrokes(b64u.dec(vec)), ratio) : '';
        c.signature = image ? { method: 'drawn', image, name, at } : { method: 'typed', name, at };
        c.status = 'signed'; c.updatedAt = at;
        if (viewedAt && !c.events.some((e) => e.type === 'viewed')) c.events.push({ type: 'viewed', at: viewedAt });
        if (!c.events.some((e) => e.type === 'signed')) c.events.push({ type: 'signed', at });
        c.events.sort((x, y) => x.at - y.at);
        save();
        toast(t('portal.receive.done'));
      } else toast(t('portal.receive.already'));
      history.replaceState(history.state, '', '#/contracts/' + c.id);
      renderNav();
      route();
    } catch (e) {
      view.innerHTML = `<section class="p-empty">${icon('lock')}<h1>${esc(t('portal.receive.errorTitle'))}</h1><p>${esc(t('portal.receive.error'))}</p><a class="btn btn-ghost" href="#/contracts">${esc(t('portal.detail.back'))}</a></section>`;
    }
  }

  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const view = $('[data-portal-view]');
    const [section = 'overview', id, sub] = parts;
    if (section === 'receive') { if (can('contractsView')) receive(id); else view.innerHTML = viewDenied(); return; }
    $$('[data-portal-nav-list] a').forEach((a) => { if (a.getAttribute('href') === '#/' + section) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    let html;
    if (section === 'overview') html = can('overview') ? viewOverview() : viewDenied();
    else if (section === 'contracts') {
      if (!can('contractsView')) html = viewDenied();
      else if (id === 'new') html = can('contractsCreate') ? viewForm(null) : viewDenied();
      else if (id && sub === 'edit') { const c = find(id); html = c && c.status === 'draft' && can('contractsCreate') ? viewForm(c) : viewDenied(); }
      else if (id) html = viewDetail(find(id));
      else html = viewContracts();
    } else if (section === 'users') html = can('users') ? viewUsers() : viewDenied();
    else if (NAV.some((n) => n.id === section && n.soon)) html = can(section) ? viewSoon(section) : viewDenied();
    else html = viewOverview();
    view.innerHTML = html;
    document.title = t('portal.title') + ' | ' + t('brand.fullName');
    bindView(section, id, sub);
    if (route.ran) { view.focus({ preventScroll: true }); window.scrollTo(0, 0); }
    route.ran = true;
  }

  function viewDenied() {
    return `<section class="p-empty p-denied">${icon('lock')}<h1>${esc(t('portal.denied.title'))}</h1><p>${esc(fill(t('portal.denied.text'), { role: t('portal.roles.' + session.role) }))}</p></section>`;
  }

  // ----- overview -----
  function viewOverview() {
    const list = load();
    const count = (s) => list.filter((c) => c.status === s).length;
    const kpis = [['total', list.length, 'doc'], ['sent', count('sent'), 'clock'], ['signed', count('signed'), 'check-circle'], ['draft', count('draft'), 'edit']];
    const showContracts = can('contractsView');
    const recent = list.slice().sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);
    const activity = list.flatMap((c) => (c.events || []).map((e) => ({ ...e, c }))).sort((a, b) => b.at - a.at).slice(0, 6);
    return `
      <header class="p-head">
        <div><h1>${esc(t('portal.overview.hello'))}</h1><p>${esc(t('portal.overview.sub'))}</p></div>
        ${can('contractsCreate') ? `<a class="btn btn-primary" href="#/contracts/new">${icon('plus')}<span>${esc(t('portal.overview.newContract'))}</span></a>` : ''}
      </header>
      ${showContracts ? `
      <ul class="kpis">${kpis.map(([k, v, ic]) => `<li class="kpi kpi-${k}">${icon(ic)}<strong>${v}</strong><span>${esc(t('portal.overview.kpi.' + k))}</span></li>`).join('')}</ul>
      <div class="p-grid">
        <section class="p-card">
          <div class="p-card-head"><h2>${esc(t('portal.overview.recent'))}</h2><a class="link-arrow" href="#/contracts"><span>${esc(t('portal.overview.allContracts'))}</span>${icon('arrow').replace('class="icon"', 'class="icon icon-flip"')}</a></div>
          ${recent.length ? `<ul class="c-list">${recent.map(rowHtml).join('')}</ul>` : `<p class="p-muted">${esc(t('portal.overview.empty'))}</p>`}
        </section>
        <section class="p-card">
          <div class="p-card-head"><h2>${esc(t('portal.overview.activity'))}</h2></div>
          <ol class="timeline">${activity.map((e) => `<li class="tl-${e.type}"><span class="tl-dot" aria-hidden="true"></span><div><p>${esc(t('portal.events.' + e.type))} · <a href="#/contracts/${esc(e.c.id)}"><bdi dir="ltr">${esc(e.c.id)}</bdi></a></p><time>${esc(fmtDate(e.at, null, true))}</time></div></li>`).join('')}</ol>
        </section>
      </div>` : `<section class="p-card p-muted-card"><p>${esc(fill(t('portal.denied.text'), { role: t('portal.roles.' + session.role) }))}</p></section>`}`;
  }

  // one agreement as a row (table on wide screens, card on phones)
  function rowHtml(c) {
    const n = feeNumbers(c);
    return `<li><a class="c-row" href="#/contracts/${esc(c.id)}">
      <span class="c-no"><bdi dir="ltr">${esc(c.id)}</bdi></span>
      <span class="c-client">${esc(c.client.name)}</span>
      <span class="c-matter">${esc(c.matter.title)}</span>
      <span class="c-fees"><bdi>${money(n.total)} ${esc(t('contract.table.currency'))}</bdi></span>
      <span class="c-status">${statusChip(c.status)}</span>
      <span class="c-date">${esc(fmtDate(c.updatedAt))}</span>
    </a></li>`;
  }

  // ----- agreements list -----
  let filter = 'all', query = '';
  function viewContracts() {
    return `
      <header class="p-head">
        <div><h1>${esc(t('portal.contracts.title'))}</h1><p>${esc(t('portal.contracts.sub'))}</p></div>
        ${can('contractsCreate') ? `<a class="btn btn-primary" href="#/contracts/new">${icon('plus')}<span>${esc(t('portal.contracts.new'))}</span></a>` : `<p class="p-badge">${icon('eye')}${esc(t('portal.contracts.viewOnly'))}</p>`}
      </header>
      <div class="p-tools">
        <div class="p-filters" role="group" aria-label="${esc(t('portal.contracts.cols.status'))}">
          ${['all', 'draft', 'sent', 'signed'].map((f) => `<button type="button" class="p-filter" data-filter="${f}" aria-pressed="${f === filter}">${esc(t('portal.contracts.filters.' + f))}<span class="p-count"></span></button>`).join('')}
        </div>
        <label class="p-search">${icon('search')}<span class="sr-only">${esc(t('portal.contracts.search'))}</span><input class="input" type="search" data-search placeholder="${esc(t('portal.contracts.search'))}" value="${esc(query)}"></label>
      </div>
      <section class="p-card p-card-flush">
        <div class="c-head" aria-hidden="true">
          <span>${esc(t('portal.contracts.cols.no'))}</span><span>${esc(t('portal.contracts.cols.client'))}</span><span>${esc(t('portal.contracts.cols.matter'))}</span>
          <span>${esc(t('portal.contracts.cols.fees'))}</span><span>${esc(t('portal.contracts.cols.status'))}</span><span>${esc(t('portal.contracts.cols.date'))}</span>
        </div>
        <ul class="c-list" data-contract-list></ul>
      </section>`;
  }
  function fillContractList() {
    const list = load().slice().sort((a, b) => b.updatedAt - a.updatedAt);
    const q = toLatin(query).trim().toLowerCase();
    const shown = list.filter((c) => (filter === 'all' || c.status === filter) && (!q || (c.client.name + ' ' + c.id + ' ' + c.matter.title).toLowerCase().includes(q)));
    $('[data-contract-list]').innerHTML = shown.length ? shown.map(rowHtml).join('') : `<li class="p-muted c-empty">${esc(t('portal.contracts.empty'))}</li>`;
    $$('[data-filter]').forEach((b) => {
      const f = b.dataset.filter;
      b.setAttribute('aria-pressed', String(f === filter));
      $('.p-count', b).textContent = f === 'all' ? list.length : list.filter((c) => c.status === f).length;
    });
  }

  // ----- new / edit form -----
  function viewForm(c) {
    const F = (k) => esc(t('portal.form.' + k));
    const v = c || { lang: lang(), lawyer: 'khalid', client: { idType: 'id' }, matter: { area: (S.practiceAreas && S.practiceAreas[0] && S.practiceAreas[0].id) || 'commercial' }, fees: { vat: 'excl', schedule: 'two' }, city: '' };
    const bi = v.lang === 'both';
    // opts.en: the English counterpart of a field, shown only for a bilingual agreement; opts.custom: payment details
    const field = (name, label, value, opts = {}) => `
      <div class="field${opts.full ? ' field-full' : ''}${opts.en ? ' field-en' : ''}"${opts.en ? ' data-en' : ''}${opts.custom ? ' data-custom-field' : ''}${(opts.en && !bi) || (opts.custom && v.fees.schedule !== 'custom') ? ' hidden' : ''}>
        <label for="cf-${name}">${label}${opts.en ? ' <span class="lang-tag" lang="en">EN</span>' : ''}${opts.optional ? ` <span class="optional">${F('optional')}</span>` : ' <span class="req" aria-hidden="true">*</span>'}</label>
        ${opts.textarea
          ? `<textarea class="input" id="cf-${name}" name="${name}" rows="${opts.rows || 3}"${opts.en ? ' dir="ltr" lang="en"' : ''} placeholder="${opts.ph || ''}" aria-describedby="cf-${name}-err">${esc(value)}</textarea>`
          : `<input class="input${opts.ltr ? ' input-ltr' : ''}" id="cf-${name}" name="${name}" type="${opts.type || 'text'}"${opts.ltr || opts.en ? ' dir="ltr"' : ''}${opts.en ? ' lang="en"' : ''}${opts.inputmode ? ` inputmode="${opts.inputmode}"` : ''} value="${esc(value)}" placeholder="${opts.ph || ''}" aria-describedby="cf-${name}-err">`}
        <p class="field-error" id="cf-${name}-err" hidden></p>
      </div>`;
    const en = v.en || {};
    const select = (name, label, value, options) => `
      <div class="field">
        <label for="cf-${name}">${label}</label>
        <select class="input" id="cf-${name}" name="${name}">${options.map(([val, text]) => `<option value="${esc(val)}"${val === value ? ' selected' : ''}>${esc(text)}</option>`).join('')}</select>
      </div>`;
    const areas = (S.practiceAreas || []).map((a) => [a.id, t('practice.areas.' + a.id + '.title')]).concat([['other', t('portal.form.areaOther')]]);
    const langSelectHtml = select('lang', F('lang'), v.lang, [['ar', t('portal.form.langs.ar')], ['en', t('portal.form.langs.en')], ['both', t('portal.form.langs.both')]]);
    const lawyers = (S.team || []).filter((m) => m.group === 'partners').map((m) => [m.id, t('team.members.' + m.id + '.name')]);
    return `
      <header class="p-head">
        <div><a class="link-arrow p-back" href="${c ? '#/contracts/' + esc(c.id) : '#/contracts'}">${icon('arrow').replace('class="icon"', 'class="icon icon-back"')}<span>${esc(t('portal.detail.back'))}</span></a>
        <h1>${F(c ? 'titleEdit' : 'titleNew')}</h1>${c ? `<p><bdi dir="ltr">${esc(c.id)}</bdi></p>` : ''}</div>
      </header>
      <form class="p-form" data-contract-form novalidate>
        <section class="p-card p-lang-card">
          <div class="form-grid">
            ${langSelectHtml}
            <p class="p-muted p-both-hint" data-en${bi ? '' : ' hidden'}>${F('bothHint')}</p>
          </div>
        </section>
        <section class="p-card">
          <h2>${F('client')}</h2>
          <div class="form-grid">
            ${field('clientName', F('clientName'), v.client.name, { full: true })}
            ${field('clientNameEn', F('clientName'), en.clientName, { full: true, en: true, optional: true })}
            ${select('idType', F('idType'), v.client.idType, Object.keys(t('portal.form.idTypes')).map((k) => [k, t('portal.form.idTypes.' + k)]))}
            ${field('idNumber', F('idNumber'), v.client.idNumber, { ltr: true, inputmode: 'numeric' })}
            ${field('phone', F('phone'), v.client.phone, { ltr: true, type: 'tel', inputmode: 'tel', ph: '05XXXXXXXX' })}
            ${field('email', F('email'), v.client.email, { ltr: true, type: 'email', optional: true, ph: 'name@example.com' })}
            ${field('address', F('address'), v.client.address, { full: true, optional: true })}
            ${field('addressEn', F('address'), en.address, { full: true, en: true, optional: true })}
          </div>
        </section>
        <section class="p-card">
          <h2>${F('matter')}</h2>
          <div class="form-grid">
            ${select('area', F('area'), v.matter.area, areas)}
            ${field('matterTitle', F('matterTitle'), v.matter.title, { ph: F('matterTitlePh') })}
            ${field('matterTitleEn', F('matterTitle'), en.title, { full: true, en: true, ph: esc(t('portal.form.matterTitlePh', 'en')) })}
            ${field('scope', F('scope'), v.matter.scope, { full: true, textarea: true, rows: 4, ph: F('scopePh') })}
            ${field('scopeEn', F('scope'), en.scope, { full: true, textarea: true, rows: 4, en: true, ph: esc(t('portal.form.scopePh', 'en')) })}
          </div>
        </section>
        <section class="p-card">
          <h2>${F('fees')}</h2>
          <div class="form-grid">
            ${field('amount', F('amount'), v.fees.amount, { ltr: true, inputmode: 'decimal', ph: '0' })}
            ${select('vat', F('vat'), v.fees.vat, ['excl', 'incl', 'none'].map((k) => [k, t('portal.form.vats.' + k)]))}
            ${select('schedule', F('schedule'), v.fees.schedule, ['full', 'two', 'custom'].map((k) => [k, t('portal.form.schedules.' + k)]))}
            ${field('custom', F('custom'), v.fees.custom, { custom: true, optional: true, ph: F('customPh') })}
            ${field('customEn', F('custom'), en.custom, { custom: true, en: true, optional: true, ph: esc(t('portal.form.customPh', 'en')) })}
            <p class="p-total field-full" data-fee-total aria-live="polite"></p>
          </div>
        </section>
        <section class="p-card">
          <h2>${F('other')}</h2>
          <div class="form-grid">
            ${select('lawyer', F('lawyer'), v.lawyer, lawyers)}
            ${field('duration', F('duration'), v.duration, { optional: true, ph: F('durationDefault') })}
            ${field('durationEn', F('duration'), en.duration, { en: true, optional: true, ph: esc(t('portal.form.durationDefault', 'en')) })}
            ${field('city', F('city'), v.city, { optional: true, ph: F('cityDefault') })}
            ${field('cityEn', F('city'), en.city, { en: true, optional: true, ph: esc(t('portal.form.cityDefault', 'en')) })}
            ${field('terms', F('terms'), v.terms, { full: true, textarea: true, rows: 3, optional: true, ph: F('termsPh') })}
            ${field('termsEn', F('terms'), en.terms, { full: true, textarea: true, rows: 3, en: true, optional: true, ph: esc(t('portal.form.termsPh', 'en')) })}
          </div>
        </section>
        <div class="p-form-actions">
          <button class="btn btn-primary btn-lg" type="submit" data-intent="preview">${icon('eye')}<span>${F('preview')}</span></button>
          <button class="btn btn-ghost btn-lg" type="submit" data-intent="draft">${icon('edit')}<span>${F('saveDraft')}</span></button>
          <a class="btn-text p-cancel" href="${c ? '#/contracts/' + esc(c.id) : '#/contracts'}">${F('cancel')}</a>
        </div>
      </form>`;
  }

  function bindForm(existing) {
    const form = $('[data-contract-form]');
    const val = (n) => (form.elements[n] ? form.elements[n].value.trim() : '');
    const showTotal = () => {
      const amount = parseFloat(toLatin(val('amount')).replace(/,/g, ''));
      const out = $('[data-fee-total]');
      if (!amount || amount <= 0) { out.textContent = ''; return; }
      const n = feeNumbers({ fees: { amount, vat: val('vat') } });
      out.innerHTML = `${esc(t('portal.form.total'))}: <strong><bdi>${money(n.total)} ${esc(t('contract.table.currency'))}</bdi></strong>`;
    };
    form.addEventListener('input', (e) => {
      showTotal();
      if (e.target.getAttribute('aria-invalid') === 'true') {
        e.target.removeAttribute('aria-invalid');
        const p = $('#cf-' + e.target.name + '-err');
        if (p) p.hidden = true;
      }
    });
    const syncFields = () => {
      const both = val('lang') === 'both', custom = val('schedule') === 'custom';
      $$('[data-en], [data-custom-field]', form).forEach((el) => {
        el.hidden = (el.hasAttribute('data-en') && !both) || (el.hasAttribute('data-custom-field') && !custom);
      });
    };
    form.addEventListener('change', (e) => {
      if (e.target.name === 'schedule' || e.target.name === 'lang') syncFields();
      showTotal();
    });
    syncFields();
    showTotal();
    let intent = 'preview';
    $$('[data-intent]', form).forEach((b) => b.addEventListener('click', () => { intent = b.dataset.intent; }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errors = {};
      ['clientName', 'idNumber', 'phone', 'matterTitle', 'scope', 'amount'].forEach((n) => { if (!val(n)) errors[n] = t('portal.form.errors.required'); });
      const phone = toLatin(val('phone')).replace(/[\s-]/g, '');
      if (phone && !/^(\+?966|00966|0)?5\d{8}$/.test(phone) && !/^\+?\d{9,15}$/.test(phone)) errors.phone = t('portal.form.errors.phone');
      if (val('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) errors.email = t('portal.form.errors.email');
      const amount = parseFloat(toLatin(val('amount')).replace(/,/g, ''));
      if (val('amount') && !(amount > 0)) errors.amount = t('portal.form.errors.amount');
      const both = val('lang') === 'both';
      if (both) {
        // the English column needs its own text wherever the Arabic has some
        ['matterTitleEn', 'scopeEn'].forEach((n) => { if (!val(n)) errors[n] = t('portal.form.errors.required'); });
        [['duration', 'durationEn'], ['city', 'cityEn'], ['terms', 'termsEn']].forEach(([ar, n]) => { if (val(ar) && !val(n)) errors[n] = t('portal.form.errors.englishToo'); });
        if (val('schedule') === 'custom' && val('custom') && !val('customEn')) errors.customEn = t('portal.form.errors.englishToo');
      }
      $$('.field-error', form).forEach((p) => { p.hidden = true; });
      $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
      const bad = Object.keys(errors);
      if (bad.length) {
        bad.forEach((n) => { const el = form.elements[n]; const p = $('#cf-' + n + '-err'); el.setAttribute('aria-invalid', 'true'); p.textContent = errors[n]; p.hidden = false; });
        form.elements[bad[0]].focus();
        return;
      }
      const now = Date.now();
      const c = existing || { id: nextId(), status: 'draft', createdAt: now, events: [{ type: 'created', at: now }] };
      Object.assign(c, {
        lang: val('lang'), lawyer: val('lawyer'), updatedAt: now,
        client: { name: val('clientName'), idType: val('idType'), idNumber: toLatin(val('idNumber')), phone, email: val('email'), address: val('address') },
        matter: { area: val('area'), title: val('matterTitle'), scope: val('scope') },
        fees: { amount, vat: val('vat'), schedule: val('schedule'), custom: val('custom') },
        duration: val('duration'), city: val('city'), terms: val('terms'),
        // English counterparts, in the fixed EN_KEYS order
        en: both ? { clientName: val('clientNameEn'), address: val('addressEn'), title: val('matterTitleEn'), scope: val('scopeEn'), custom: val('customEn'), duration: val('durationEn'), city: val('cityEn'), terms: val('termsEn') } : undefined,
      });
      if (!both) delete c.en;
      if (!existing) load().push(c);
      save();
      toast(t('portal.form.saved'));
      location.hash = intent === 'draft' ? '#/contracts' : '#/contracts/' + c.id;
    });
  }

  // ----- one agreement -----
  function viewDetail(c) {
    if (!c) return `<section class="p-empty">${icon('doc')}<h1>${esc(t('portal.detail.notFound'))}</h1><a class="btn btn-ghost" href="#/contracts">${esc(t('portal.detail.back'))}</a></section>`;
    const D = (k) => esc(t('portal.detail.' + k));
    const note = c.status === 'draft' ? D('draftNote') : c.status === 'sent' ? D('sentNote') : D('signedCopy');
    return `
      <header class="p-head">
        <div><a class="link-arrow p-back" href="#/contracts">${icon('arrow').replace('class="icon"', 'class="icon icon-back"')}<span>${D('back')}</span></a>
        <h1><bdi dir="ltr">${esc(c.id)}</bdi> ${statusChip(c.status)}</h1><p>${esc(c.client.name)} · ${esc(c.matter.title)}</p></div>
      </header>
      <div class="p-detail">
        <div class="p-doc-wrap" data-doc>${renderContract(c)}</div>
        <aside class="p-side">
          <section class="p-card">
            <h2>${D('actions')}</h2>
            <p class="p-note p-note-${c.status}">${note}</p>
            <div class="p-actions">
              ${c.status === 'draft' && can('contractsSend') ? `<button class="btn btn-primary btn-block" type="button" data-act="send">${icon('send')}<span>${D('send')}</span></button>` : ''}
              ${c.status === 'sent' && can('contractsSend') ? `<button class="btn btn-primary btn-block" type="button" data-act="link">${icon('send')}<span>${D('resend')}</span></button>` : ''}
              ${c.status === 'draft' && can('contractsCreate') ? `<a class="btn btn-ghost btn-block" href="#/contracts/${esc(c.id)}/edit">${icon('edit')}<span>${D('edit')}</span></a>` : ''}
              <button class="btn btn-ghost btn-block" type="button" data-act="print">${icon('print')}<span>${D('print')}</span></button>
              ${c.status === 'draft' && can('contractsDelete') ? `<button class="btn-text p-delete" type="button" data-act="delete">${icon('trash')}<span>${D('delete')}</span></button>` : ''}
            </div>
          </section>
          ${c.hash ? `<section class="p-card"><h2>${D('fingerprint')}</h2><code class="p-hash" dir="ltr">${esc(c.hash.match(/.{1,8}/g).join(' '))}</code><p class="p-muted">${D('fingerprintNote')}</p></section>` : ''}
          <section class="p-card">
            <h2>${D('timeline')}</h2>
            <ol class="timeline">${(c.events || []).slice().reverse().map((e) => `<li class="tl-${e.type}"><span class="tl-dot" aria-hidden="true"></span><div><p>${esc(t('portal.events.' + e.type))}</p><time>${esc(fmtDate(e.at, null, true))}</time></div></li>`).join('')}</ol>
          </section>
        </aside>
      </div>`;
  }

  function sendModal(c) {
    const P = (k) => esc(t('portal.send.' + k));
    const link = signLink(c);
    const msg = fill(t('portal.send.message'), { client: c.client.name, no: c.id, link });
    const waPhone = toLatin(c.client.phone).replace(/^0/, '966').replace(/\D/g, '');
    openModal(`
      <h2 id="modal-title">${P('title')}</h2>
      <p>${P('text')}</p>
      <label class="p-link-label" for="sign-link">${P('link')}</label>
      <div class="p-link"><input class="input input-ltr" id="sign-link" dir="ltr" readonly value="${esc(link)}"><button class="btn btn-navy" type="button" data-copy data-autofocus>${icon('copy')}<span>${P('copy')}</span></button></div>
      <div class="p-share">
        <a class="btn btn-whatsapp" href="https://wa.me/${esc(waPhone)}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${P('whatsapp')}</span></a>
        <a class="btn btn-ghost" href="mailto:${esc(c.client.email || '')}?subject=${encodeURIComponent(fill(t('portal.send.subject'), { no: c.id }))}&body=${encodeURIComponent(msg)}">${icon('mail')}<span>${P('email')}</span></a>
        <a class="btn btn-ghost" href="${esc(link)}" target="_blank" rel="noopener">${icon('external')}<span>${P('open')}</span></a>
      </div>
      <p class="p-muted p-demo-note">${icon('info')}<span>${P('demoNote')}</span></p>
      <div class="modal-foot"><button class="btn-text" type="button" data-modal-close>${P('close')}</button></div>`, (wrap) => {
      $('[data-copy]', wrap).addEventListener('click', async () => {
        const input = $('#sign-link', wrap);
        try { await navigator.clipboard.writeText(link); } catch (e) { input.select(); try { document.execCommand('copy'); } catch (e2) { /* select is enough */ } }
        toast(P('copied'));
      });
    });
  }

  // ----- users & permissions -----
  function viewUsers() {
    const U = (k) => esc(t('portal.users.' + k));
    const teamRole = (m) => (m.id === 'gm' ? 'admin' : m.id === 'khalid' ? 'lawyer' : m.group === 'staff' ? 'trainee' : 'staff');
    return `
      <header class="p-head"><div><h1>${U('title')}</h1><p>${U('sub')}</p></div></header>
      <div class="p-grid p-grid-users">
        <section class="p-card">
          <h2>${U('team')}</h2>
          <ul class="u-list">${(S.team || []).map((m) => `
            <li><span class="u-avatar" aria-hidden="true">${esc((t('team.members.' + m.id + '.name') || '?').trim().charAt(0))}</span>
            <div><p class="u-name">${esc(t('team.members.' + m.id + '.name'))}</p><p class="u-title">${esc(t('team.members.' + m.id + '.role'))}</p></div>
            <span class="chip chip-role">${esc(t('portal.roles.' + teamRole(m)))}</span></li>`).join('')}
          </ul>
          <p class="p-muted">${U('note')}</p>
        </section>
        <section class="p-card p-card-scroll">
          <h2>${U('matrix')}</h2>
          <div class="matrix-wrap" tabindex="0" role="region" aria-label="${U('matrix')}">
            <table class="matrix">
              <thead><tr><th scope="col">${U('perm')}</th>${Object.keys(ROLES).map((r) => `<th scope="col">${esc(t('portal.roles.' + r))}</th>`).join('')}</tr></thead>
              <tbody>${PERMS.map((p) => `<tr><th scope="row">${esc(t('portal.users.perms.' + p))}</th>${Object.keys(ROLES).map((r) => `<td>${ROLES[r].includes(p) ? `<span class="yes">${icon('check')}<span class="sr-only">✓</span></span>` : '<span class="no" aria-label="—">—</span>'}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
          </div>
          <button class="btn btn-ghost" type="button" data-reset>${icon('refresh')}<span>${U('reset')}</span></button>
        </section>
      </div>`;
  }

  function viewSoon(id) {
    const M = (k) => t('portal.modules.' + k);
    return `
      <header class="p-head"><div><h1>${esc(M(id + '.title'))} <span class="chip chip-soon">${esc(t('portal.soon'))}</span></h1></div></header>
      <section class="p-card p-soon">
        ${icon(NAV.find((n) => n.id === id).icon)}
        <h2>${esc(M('soonTitle'))}</h2>
        <p>${esc(M('soonText'))}</p>
        <ul class="checklist">${(M(id + '.items') || []).map((s) => `<li>${icon('check')}<span>${esc(s)}</span></li>`).join('')}</ul>
      </section>`;
  }

  function bindView(section, id, sub) {
    if (section === 'contracts' && !id && $('[data-contract-list]')) {
      fillContractList();
      $$('[data-filter]').forEach((b) => b.addEventListener('click', () => { filter = b.dataset.filter; fillContractList(); }));
      $('[data-search]').addEventListener('input', (e) => { query = e.target.value; fillContractList(); });
    }
    if (section === 'contracts' && $('[data-contract-form]')) bindForm(id && id !== 'new' ? find(id) : null);
    if (section === 'contracts' && id && !sub && find(id)) {
      const c = find(id);
      if (c.status !== 'draft' && !c.hash) ensureHash(c).then(() => { if (location.hash === '#/contracts/' + c.id) route(); });
      $$('[data-act]').forEach((b) => b.addEventListener('click', async () => {
        const act = b.dataset.act;
        if (act === 'print') printContract(c);
        if (act === 'link') sendModal(c);
        if (act === 'delete' && confirm(t('portal.detail.deleteConfirm'))) {
          contracts = load().filter((x) => x.id !== c.id); save(); toast(t('portal.detail.deleted')); location.hash = '#/contracts';
        }
        if (act === 'send') {
          // approval freezes the text: the fingerprint is taken now and the draft can no longer be edited
          c.status = 'sent'; c.token = c.token || randomToken(); c.updatedAt = Date.now();
          c.events.push({ type: 'sent', at: c.updatedAt });
          c.hash = await sha256(contractBody(c));
          save(); route(); sendModal(c);
        }
      }));
    }
    if (section === 'users') {
      const r = $('[data-reset]');
      if (r) r.addEventListener('click', () => { if (confirm(t('portal.users.resetConfirm'))) { contracts = seed(); save(); toast(t('portal.users.resetDone')); route(); } });
    }
  }

  /* =======================================================================
     3. Client signing page
     ======================================================================= */
  function signaturePad(canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false, empty = true, ratio = 1, strokes = [], aspect = 0.45;
    function size() {
      const r = canvas.getBoundingClientRect();
      const keep = empty ? null : canvas.toDataURL();
      ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(r.width * ratio);
      canvas.height = Math.round(r.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#14213d';
      if (keep) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height); img.src = keep; }
    }
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top, r.width, r.height]; };
    const grid = (x, y, w) => [x / w * 1000, y / w * 1000];
    canvas.addEventListener('pointerdown', (e) => {
      drawing = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* some touch browsers refuse; drawing still works */ }
      const [x, y, w, h] = pos(e);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.1, y + 0.1); ctx.stroke();
      strokes.push(grid(x, y, w)); aspect = h / w;
      empty = false; canvas.dispatchEvent(new Event('sigchange'));
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const [x, y, w] = pos(e);
      ctx.lineTo(x, y); ctx.stroke();
      strokes[strokes.length - 1].push(...grid(x, y, w));
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => canvas.addEventListener(ev, () => { drawing = false; }));
    window.addEventListener('resize', size);
    size();
    return {
      isEmpty: () => empty,
      clear() { ctx.clearRect(0, 0, canvas.width, canvas.height); empty = true; strokes = []; canvas.dispatchEvent(new Event('sigchange')); },
      data: () => canvas.toDataURL('image/png'),
      vector: () => ({ vec: b64u.enc(encodeStrokes(strokes)), ratio: Math.round(aspect * 1000) / 1000 }),
    };
  }

  function setupSign() {
    const box = $('[data-sign-view]');
    const params = new URLSearchParams(location.search);
    const id = params.get('c'), key = params.get('k');
    let c = id && key ? find(id, key) : null;
    if (!c && id && key && /^#v1\./.test(location.hash)) {
      try {
        const remote = unpackContract(unpackJson(location.hash.slice(4)));
        if (remote && remote.id === id && remote.token === key) { load().push(remote); save(); c = remote; }
      } catch (e) { /* damaged link: shown as invalid below */ }
    }
    let justSigned = false;

    function render() {
      document.title = t('sign.title') + ' | ' + t('brand.fullName');
      if (!c || !key || c.token !== key) {
        box.innerHTML = `<section class="p-empty">${icon('lock')}<h1>${esc(t('sign.notFound'))}</h1><p>${esc(t('sign.notFoundText'))}</p><a class="btn btn-ghost" href="index.html">${esc(t('sign.toSite'))}</a></section>`;
        return;
      }
      const signed = c.status === 'signed';
      box.innerHTML = `
        <section class="sign-intro">
          <p class="eyebrow"><span>${esc(t('sign.title'))}</span></p>
          <h1>${esc(fill(t('sign.hello'), { client: c.client.name }))}</h1>
          <p>${esc(t('sign.intro'))}</p>
        </section>
        ${signed ? `<section class="sign-done" tabindex="-1" data-done>${icon('check-circle')}<div><h2>${esc(t(justSigned ? 'sign.doneTitle' : 'sign.signedTitle'))}</h2>${justSigned ? `<p>${esc(t('sign.doneText'))}</p>` : ''}
          <div class="sign-done-actions"><button class="btn btn-primary" type="button" data-print>${icon('print')}<span>${esc(t('sign.download'))}</span></button><a class="btn btn-ghost" href="index.html">${esc(t('sign.toSite'))}</a></div></div></section>` : ''}
        ${signed && c.remote ? returnSection() : ''}
        <div class="sign-doc">${renderContract(c)}</div>
        ${signed ? '' : signForm()}`;
      if (signed) {
        $('[data-print]').addEventListener('click', () => printContract(c));
        const copyBtn = $('[data-copy-return]');
        if (copyBtn) copyBtn.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(returnLink(c)); } catch (e) { const inp = $('#return-link'); inp.hidden = false; inp.select(); }
          toast(t('sign.return.copied'));
        });
        if (justSigned) { const d = $('[data-done]'); d.focus(); d.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      } else bindSign();
    }

    // demo only: in phase 2 the signature reaches the firm by itself
    function returnSection() {
      const link = returnLink(c);
      const msg = fill(t('sign.return.message'), { no: c.id, link });
      const wa = String(S.whatsapp || '').replace(/\D/g, '');
      return `
        <section class="sign-return p-card">
          <h2>${esc(t('sign.return.title'))}</h2>
          <p>${esc(t('sign.return.text'))}</p>
          <div class="p-share">
            <a class="btn btn-whatsapp" href="https://wa.me/${wa}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(t('sign.return.whatsapp'))}</span></a>
            <button class="btn btn-ghost" type="button" data-copy-return>${icon('copy')}<span>${esc(t('sign.return.copy'))}</span></button>
          </div>
          <input class="input input-ltr" id="return-link" dir="ltr" readonly value="${esc(link)}" hidden aria-label="${esc(t('sign.return.copy'))}">
        </section>`;
    }

    function signForm() {
      const G = (k) => esc(t('sign.' + k));
      return `
      <form class="sign-form p-card" data-sign-form novalidate>
        <h2>${G('signTitle')}</h2>
        <div class="field">
          <label for="s-name">${G('fullName')} <span class="req" aria-hidden="true">*</span></label>
          <input class="input" id="s-name" name="name" autocomplete="name" data-enter-blur required value="${esc(c.client.name.replace(/\s*\(.*\)$/, ''))}" aria-describedby="s-name-err">
          <p class="field-error" id="s-name-err" hidden></p>
        </div>
        <div class="sig-tabs" role="tablist">
          <button type="button" role="tab" id="tab-draw" aria-selected="true" aria-controls="sig-draw" data-tab="draw">${G('draw')}</button>
          <button type="button" role="tab" id="tab-type" aria-selected="false" aria-controls="sig-type" data-tab="type" tabindex="-1">${G('type')}</button>
        </div>
        <div class="sig-panel" id="sig-draw" role="tabpanel" aria-labelledby="tab-draw">
          <div class="sig-pad"><canvas data-pad aria-label="${G('drawHint')}"></canvas><button class="btn-text sig-clear" type="button" data-clear>${G('clear')}</button></div>
          <p class="p-muted">${G('drawHint')}</p>
        </div>
        <div class="sig-panel" id="sig-type" role="tabpanel" aria-labelledby="tab-type" hidden>
          <p class="sig-typed-preview" data-typed></p>
          <p class="p-muted">${G('typedHint')}</p>
        </div>
        <p class="field-error" id="s-sig-err" hidden></p>
        <label class="check"><input type="checkbox" id="s-consent" name="consent" required aria-describedby="s-consent-err"><span>${G('consent')}</span></label>
        <p class="field-error" id="s-consent-err" hidden></p>
        <div class="sign-otp" data-otp hidden>
          <h3>${G('otpTitle')}</h3>
          <p>${esc(fill(t('sign.otpText'), { last: '••' + String(c.client.phone).slice(-2) }))}</p>
          <p class="p-demo-note">${icon('info')}<span>${G('otpDemo')}</span></p>
          <div class="field">
            <label for="s-otp">${G('otpLabel')}</label>
            <input class="input input-ltr otp-input" id="s-otp" dir="ltr" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-describedby="s-otp-err">
            <p class="field-error" id="s-otp-err" hidden></p>
          </div>
        </div>
        <button class="btn btn-primary btn-lg btn-block" type="submit" data-sign-submit>${icon('edit')}<span>${G('sign')}</span></button>
      </form>`;
    }

    function bindSign() {
      const form = $('[data-sign-form]');
      const pad = signaturePad($('[data-pad]', form));
      let mode = 'draw', step = 'sign';
      const nameIn = $('#s-name', form), typed = $('[data-typed]', form);
      const err = (id, msg) => { const p = $('#' + id, form); p.textContent = msg || ''; p.hidden = !msg; };
      const syncTyped = () => { typed.textContent = nameIn.value.trim() || '—'; };
      nameIn.addEventListener('input', syncTyped); syncTyped();
      $('[data-clear]', form).addEventListener('click', () => pad.clear());
      $$('[data-tab]', form).forEach((tab) => tab.addEventListener('click', () => {
        mode = tab.dataset.tab;
        $$('[data-tab]', form).forEach((x) => { const on = x === tab; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
        $('#sig-draw', form).hidden = mode !== 'draw';
        $('#sig-type', form).hidden = mode !== 'type';
        err('s-sig-err');
      }));
      $('[data-pad]', form).addEventListener('sigchange', () => err('s-sig-err'));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (step === 'sign') {
          let ok = true;
          if (!nameIn.value.trim()) { err('s-name-err', t('sign.errors.name')); ok = false; } else err('s-name-err');
          if (mode === 'draw' && pad.isEmpty()) { err('s-sig-err', t('sign.errors.signature')); ok = false; } else err('s-sig-err');
          if (!$('#s-consent', form).checked) { err('s-consent-err', t('sign.errors.consent')); ok = false; } else err('s-consent-err');
          if (!ok) { const first = $('.field-error:not([hidden])', form); if (first) first.scrollIntoView({ block: 'center' }); return; }
          step = 'otp';
          $('[data-otp]', form).hidden = false;
          $('[data-sign-submit] span', form).textContent = t('sign.confirm');
          $('#s-otp', form).focus();
          return;
        }
        if (toLatin($('#s-otp', form).value).trim() !== DEMO_OTP) { err('s-otp-err', t('sign.errors.otp')); $('#s-otp', form).focus(); return; }
        const at = Date.now();
        c.signature = mode === 'draw' ? Object.assign({ method: 'drawn', image: pad.data(), name: nameIn.value.trim(), at }, pad.vector()) : { method: 'typed', name: nameIn.value.trim(), at };
        c.status = 'signed'; c.updatedAt = at;
        c.events.push({ type: 'signed', at });
        save();
        justSigned = true;
        render();
      });
    }

    if (c && c.token === key && c.status === 'sent' && !(c.events || []).some((e) => e.type === 'viewed')) {
      c.events.push({ type: 'viewed', at: Date.now() }); save();
    }
    (c && c.status !== 'draft' ? ensureHash(c) : Promise.resolve()).then(render);
    document.addEventListener('langchange', render);
  }

  // ---------- start ----------
  if (page === 'login') setupLogin();
  if (page === 'portal') setupPortal();
  if (page === 'sign') setupSign();
})();
