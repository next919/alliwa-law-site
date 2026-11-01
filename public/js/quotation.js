/* ==========================================================================
   Quotation tool (quotation.html): the firm fills in the variables and gets a ready file for the second party:
   page 1 the firm's profile, page 2 the quotation, then the rest of the agreement.
   - No server: what is typed here stays in this browser and is never sent anywhere.
   - The contract and page text are encrypted in data/quotation-vault.js (AES-GCM, key from the access code).
     The direct link carries the code after the # (browsers never send that part to a server).
   ========================================================================== */
(function () {
  'use strict';

  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toLatin = (s) => String(s || '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  const toNum = (s) => Number(toLatin(s).replace(/٫/g, '.').replace(/[^\d.]/g, '')) || 0;
  const money = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2, maximumFractionDigits: 2 });

  // what the page was given by the vault (the firm's text) and the current fill-in values
  let V = null;

  // ---------- small storage helpers (storage can be blocked) ----------
  const CODE_KEY = 'kh-quote-code', DRAFT_KEY = 'kh-quote-draft', SEQ_KEY = 'kh-quote-seq';
  const store = {
    get(k, area) { try { return (area || localStorage).getItem(k); } catch (e) { return null; } },
    set(k, v, area) { try { (area || localStorage).setItem(k, v); } catch (e) { /* works without it */ } },
    del(k, area) { try { (area || localStorage).removeItem(k); } catch (e) { /* works without it */ } },
  };
  const session = () => { try { return sessionStorage; } catch (e) { return null; } };

  /* =======================================================================
     1. Entry: decrypt the vault with the access code
     ======================================================================= */
  const b64bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const normalizeCode = (s) => toLatin(s).toLowerCase().replace(/[^a-z0-9]/g, '');

  async function openVault(code) {
    const vault = window.QUOTATION_VAULT;
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(normalizeCode(code)), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b64bytes(vault.salt), iterations: vault.iter }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64bytes(vault.iv) }, key, b64bytes(vault.data));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  async function start() {
    const fromLink = /(?:^#|&)k=([^&]+)/.exec(location.hash);
    if (fromLink) history.replaceState(null, '', location.pathname + location.search); // the code never stays in the address bar
    const code = fromLink ? decodeURIComponent(fromLink[1]) : (store.get(CODE_KEY, session()) || store.get(CODE_KEY));
    if (code) {
      try {
        V = await openVault(code);
        store.set(CODE_KEY, code, session());
        return openApp();
      } catch (e) {
        store.del(CODE_KEY); store.del(CODE_KEY, session());
      }
    }
    showGate(Boolean(fromLink));
  }

  function showGate(failed) {
    const gate = $('[data-gate]'), form = $('[data-gate-form]'), err = $('[data-gate-error]'), btn = $('[data-gate-submit]'), input = $('[data-gate-code]');
    gate.hidden = false;
    const say = (msg) => { err.textContent = msg; err.hidden = !msg; };
    if (failed) say('الرابط غير صحيح. اكتب رمز الدخول.');
    if (!window.crypto || !crypto.subtle || !window.QUOTATION_VAULT) say('تعذر فتح الصفحة في هذا المتصفح. جرّب متصفحًا آخر.');
    if (matchMedia('(hover: hover)').matches) input.focus();   // on touch screens the keyboard opens only when the field is tapped
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = input.value.trim();
      if (!code) { say('اكتب رمز الدخول.'); input.focus(); return; }
      say(''); btn.disabled = true; btn.textContent = 'جارٍ الفتح...';
      try {
        V = await openVault(code);
        store.set(CODE_KEY, code, session());
        if ($('[data-gate-remember]').checked) store.set(CODE_KEY, code);
        gate.hidden = true;
        openApp();
      } catch (ex) {
        say('رمز الدخول غير صحيح.');
        btn.disabled = false; btn.textContent = 'دخول';
        input.select();
      }
    });
  }

  /* =======================================================================
     2. The form
     ======================================================================= */
  let form = null;
  let startTouched = false;
  let stale = false;   // the form has changes the sheets do not show yet

  const pad = (n) => String(n).padStart(2, '0');
  const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

  // the next number on this device, e.g. Q-20261101-01 (no server, so numbers are counted per device; the field can be edited)
  function nextRef() {
    const day = todayIso().replace(/-/g, '');
    let n = 1;
    try { const s = JSON.parse(store.get(SEQ_KEY)); if (s && s.day === day) n = s.n + 1; } catch (e) { /* starts at 1 */ }
    return `Q-${day}-${pad(n)}`;
  }
  function usedRef() {
    const m = /^Q-(\d{8})-(\d+)$/.exec(form.elements.ref.value.trim());
    if (m) store.set(SEQ_KEY, JSON.stringify({ day: m[1], n: Number(m[2]) }));
  }

  function setDefaults() {
    form.reset();
    const d = V.defaults, f = form.elements;
    Object.keys(d).forEach((k) => { if (f[k]) f[k].value = d[k]; });
    f.ref.value = nextRef();
    f.quoteDate.value = f.contractDate.value = f.start.value = todayIso();
    f.type.value = V.types[0].id;
    startTouched = false;
  }

  function saveDraft() {
    const out = {};
    $$('input, select', form).forEach((el) => { if (el.name) out[el.name] = el.type === 'checkbox' ? el.checked : el.value; });
    out._startTouched = startTouched;
    store.set(DRAFT_KEY, JSON.stringify(out), session());
  }
  function loadDraft() {
    try {
      const d = JSON.parse(store.get(DRAFT_KEY, session()));
      if (!d) return;
      Object.keys(d).forEach((k) => { const el = form.elements[k]; if (el) { if (el.type === 'checkbox') el.checked = d[k]; else el.value = d[k]; } });
      startTouched = Boolean(d._startTouched);
    } catch (e) { /* the defaults stay */ }
  }

  function syncForm() {
    $('[data-lit]').hidden = form.elements.type.value !== 'both';
  }

  /* =======================================================================
     3. Working out the values
     ======================================================================= */
  const utc = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null; };
  const fmtNum = (d) => (d ? `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}` : '');
  function fmtHijriNum(d) {
    if (!d) return '';
    try {
      const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).formatToParts(d);
      const get = (t) => (parts.find((p) => p.type === t) || {}).value || '';
      return `${get('day')}/${get('month')}/${get('year')}`;
    } catch (e) { return ''; }
  }
  const fmtLong = (d, cal) => {
    if (!d) return '';
    try { return new Intl.DateTimeFormat(`ar-SA-u-ca-${cal}-nu-latn`, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d); } catch (e) { return ''; }
  };
  const fmtDay = (d) => {
    if (!d) return '';
    try { return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { weekday: 'long', timeZone: 'UTC' }).format(d); } catch (e) { return ''; }
  };
  function addMonths(d, months) {
    const y = d.getUTCFullYear(), m = d.getUTCMonth() + months, day = d.getUTCDate();
    const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return new Date(Date.UTC(y, m, Math.min(day, last)));
  }
  const countWord = (n) => (n === 1 ? 'دفعة واحدة' : n === 2 ? 'دفعتان' : n <= 10 ? `${n} دفعات` : `${n} دفعة`);
  const daysWord = (n) => {
    const r = n % 100;
    if (n === 1) return 'يوم واحد';
    if (n === 2) return 'يومان';
    return r >= 3 && r <= 10 ? `${n} أيام` : r >= 11 ? `${n} يوماً` : `${n} يوم`;
  };
  const percent = (s) => (toNum(s) === 0 ? 'صفر%' : `${toNum(s)}%`);
  const PAGE_WORDS = { 3: 'ثلاث', 4: 'أربع', 5: 'خمس', 6: 'ست', 7: 'سبع' };

  function readValues() {
    const f = form.elements;
    const g = (n) => String(f[n].value || '').trim();
    const lit = f.type.value === 'both';
    const contractDate = utc(g('contractDate'));
    const startDate = utc(g('start')) || contractDate;
    const months = Number(g('duration')) || 12;
    const period = Number(g('freq')) || 3;
    const amount = toNum(g('amount'));
    const count = Math.max(1, Math.ceil(months / period));
    const each = Math.floor((amount * 100) / count) / 100;
    const last = Math.round((amount - each * (count - 1)) * 100) / 100;
    const v = {
      lit, type: lit ? V.types[1] : V.types[0], months, period, amount, count, each, last,
      vat: f.vat.checked,
      vatAmount: Math.round(amount * 15) / 100,
      durationText: f.duration.selectedOptions[0].textContent,
      freqText: f.freq.selectedOptions[0].textContent,
      ref: g('ref'), validity: toNum(g('validity')),
      quoteDate: utc(g('quoteDate')), contractDate, startDate,
      endDate: startDate ? new Date(addMonths(startDate, months).getTime() - 86400000) : null,
      day: fmtDay(contractDate), hijri: fmtHijriNum(contractDate), greg: fmtNum(contractDate),
      start: fmtNum(startDate), duration: f.duration.selectedOptions[0].textContent, city: g('city'),
      lawyer: g('lawyer'), lawyerEmail: g('lawyerEmail'), firmEmail: g('firmEmail'), firmWhats: g('firmWhats'), jurisdiction: g('jurisdiction'),
      r1pct: toNum(g('r1pct')), r1up: toNum(g('r1up')), r1min: money(toNum(g('r1min'))), r1max: money(toNum(g('r1max'))),
      r2pct: toNum(g('r2pct')), r3fee: money(toNum(g('r3fee'))), r4fee: money(toNum(g('r4fee'))),
      execPct: percent(g('execPct')), execFee: money(toNum(g('execFee'))),
    };
    ['p2name', 'p2cr', 'p2address', 'p2email', 'p2phone', 'p2rep', 'p2id', 'p2dob', 'p2nat', 'p2cap'].forEach((k) => { v[k] = g(k); });
    return v;
  }

  // the vault's text with the values in it: **bold**, {value}; an empty value prints as dots to fill in by hand
  const DOTS = '<span class="dots">............</span>';
  function fill(str, vars, cls) {
    return esc(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\{(\w+)\}/g, (m, k) => {
      if (!vars || !(k in vars)) return m;
      return vars[k] === '' || vars[k] == null ? (k === 'suffix' ? '' : DOTS) : `<bdi${cls ? ` class="${cls}"` : ''}>${esc(vars[k])}</bdi>`;
    });
  }
  const tpl = (str, vars) => fill(str, vars, 'v');   // agreement text: the filled-in values stand out

  /* =======================================================================
     4. The sheets
     ======================================================================= */
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const watermark = '<img class="sheet-wm" src="images/watermark.svg" alt="">';

  function footer() {
    const fm = V.firm, sep = '<span class="lf-sep">|</span>';
    return `<footer class="lf">
      <div>${esc(fm.address)}${sep}<bdi>${esc(fm.phone)}</bdi>${sep}<bdi>${esc(fm.email)}</bdi>${sep}س.ت <bdi>${esc(fm.cr)}</bdi></div>
      <div class="lf-page">صفحة <span data-pn></span> من <span data-pt></span></div>
    </footer>`;
  }

  function letterhead(meta) {
    return `<header class="lh"><img class="lh-logo" src="images/logo-ar-dark.svg" alt="${esc(V.firm.brand)}" width="214" height="50">${meta ? `<div class="lh-meta">${meta}</div>` : ''}</header>`;
  }

  // ----- page 1: the firm's profile -----
  function profileSheet() {
    const p = V.profile;
    return `<section class="sheet sheet-profile" data-profile>
      ${watermark}
      <div class="pf-band">
        <div class="pf-pattern"></div>
        <img class="pf-photo" src="images/office/hero-office.jpg" alt="">
        <svg class="pf-slant" viewBox="0 0 210 116" preserveAspectRatio="none" aria-hidden="true"><line x1="110" y1="0" x2="83.6" y2="116" stroke="#c0c0c0" stroke-width=".3"/></svg>
        <img class="pf-logo" src="images/logo-ar.svg" alt="${esc(V.firm.brand)}" width="214" height="50">
        <div class="pf-head">
          <span class="latin">FIRM PROFILE</span>
          <span class="pf-eyebrow">${esc(p.eyebrow)}</span>
          <h1>${esc(p.title)}<strong>${esc(p.titleAccent)}</strong></h1>
        </div>
      </div>
      <div class="pf-body">
        <div class="pf-top">
          <div class="pf-about"><h2 class="pf-h">${esc(p.aboutTitle)}</h2>${p.about.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
          <div class="pf-leaders">${p.leadership.map((m) => `<div class="pf-leader"><img src="${esc(m.photo)}" alt="" width="60" height="72"><div><b>${esc(m.name)}</b><span>${esc(m.role)}</span></div></div>`).join('')}</div>
        </div>
        <div class="pf-pillars">${p.pillars.map((x) => `<div class="pf-pillar"><h2>${esc(x.title)}</h2><p>${esc(x.text)}</p></div>`).join('')}</div>
        <div>
          <h2 class="pf-h">${esc(p.practiceTitle)}</h2>
          <div class="pf-practice">${p.practice.map((a) => `<div class="pf-area">${icon(a.icon)}<div><b>${esc(a.title)}</b><span>${esc(a.text)}</span></div></div>`).join('')}</div>
        </div>
      </div>
      ${footer()}
    </section>`;
  }

  // the litigation fees, on the quotation page and in clause 4
  function feeTable(v) {
    const t = V.contract.c4.table;
    return `<table class="fee-table"><colgroup><col class="n"><col class="c1"><col class="c2"><col class="c3"><col class="c4"></colgroup><thead><tr><th scope="col">#</th>${t.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${t.rows.map((r, i) => `<tr><td>${i + 1}</td>${r.map((c) => `<td>${tpl(c, v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  // ----- page 2: the quotation -----
  function quoteSheet(v) {
    const q = V.quote, fm = V.firm, r = q.rows;
    const each = v.count === 1 ? 'الدفعة' : 'كل دفعة';
    const total = v.vat ? v.amount + v.vatAmount : v.amount;
    const rows = [
      [r.type, `<strong>${esc(v.type.label)}</strong><br>${esc(v.type.description)}`],
      [r.duration, esc(v.durationText)],
      [r.contractDate, `<bdi>${esc(fmtLong(v.contractDate, 'gregory'))}م</bdi> الموافق <bdi>${esc(fmtLong(v.contractDate, 'islamic-umalqura'))}</bdi>`],
      [r.period, fill(r.periodValue, { start: fmtNum(v.startDate), end: fmtNum(v.endDate) })],
      [r.payment, fill(r.paymentValue, { freq: v.freqText, count: countWord(v.count), each, num: money(v.each), suffix: v.vat ? r.beforeVat : '' })],
    ];
    const notes = q.notes.slice();
    if (!v.vat) notes.push(q.noteNoVat);
    else if (v.lit) notes.push(q.noteLitVat);
    return `<section class="sheet sheet-quote">
      ${watermark}
      ${letterhead('')}
      <div class="sheet-body qt" data-quote-body>
        <div class="qt-head">
          <div class="qt-title"><h1>${esc(q.title)}</h1><span class="latin">QUOTATION</span></div>
          <dl class="qt-meta">
            <dt>${esc(q.refLabel)}</dt><dd><bdi>${esc(v.ref)}</bdi></dd>
            <dt>${esc(q.dateLabel)}</dt><dd><bdi>${esc(fmtLong(v.quoteDate, 'gregory'))}م</bdi><small><bdi>${esc(fmtLong(v.quoteDate, 'islamic-umalqura'))}</bdi></small></dd>
            ${v.validity ? `<dt>${esc(q.validityLabel)}</dt><dd>${fill(q.validityValue, { days: daysWord(v.validity) })}</dd>` : ''}
          </dl>
        </div>
        <div class="qt-to">
          <b>${fill(q.to, { name: v.p2name })}</b>
          ${v.p2cr ? `<span>${fill(q.toCr, { cr: v.p2cr })}</span>` : ''}
        </div>
        <p class="qt-p">${esc(q.greeting)}</p>
        <p class="qt-p">${fill(q.intro, { firm: fm.name })}</p>

        <h2 class="qt-h">${esc(q.contractTitle)}</h2>
        <table class="kv"><tbody>${rows.map(([k, val]) => `<tr><th scope="row">${esc(k)}</th><td>${val}</td></tr>`).join('')}</tbody></table>

        <h2 class="qt-h">${esc(q.feesTitle)}</h2>
        <table class="money"><tbody>
          ${v.vat ? `<tr><td>${esc(q.fees.before)}</td><td><bdi>${money(v.amount)}</bdi> ريال</td></tr>
          <tr><td>${esc(q.fees.vat)}</td><td><bdi>${money(v.vatAmount)}</bdi> ريال</td></tr>` : ''}
          <tr class="total"><td colspan="2"><div><span>${esc(v.vat ? q.fees.total : q.fees.totalNoVat)}</span><span><bdi>${money(total)}</bdi> ريال</span></div></td></tr>
          <tr class="words"><td colspan="2">${fill(q.fees.words, { words: window.Tafqit(total) })}</td></tr>
        </tbody></table>

        ${v.lit ? `<h2 class="qt-h">${esc(q.litigationTitle)}</h2>${feeTable(v)}` : ''}

        <ul class="qt-notes">${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>

        <div class="qt-sign">
          <div>
            <p>${esc(q.closing)}</p>
            <p class="who">${fill(q.signFor, { firm: fm.name })}</p>
            <p>${fill(q.signName, { name: fm.signatory })}</p>
          </div>
          <div class="qt-boxes"><div class="qt-box">${esc(q.signature)}</div><div class="qt-box">${esc(q.stamp)}</div></div>
        </div>
      </div>
      ${footer()}
    </section>`;
  }

  // ----- the agreement as a list of blocks, so it can flow over the pages -----
  function contractBlocks(v, pagesWord) {
    const c = V.contract, out = [];
    const add = (cls, html, opts) => out.push(Object.assign({ cls, html }, opts));
    const head = (text) => add('c-h', esc(text), { keep: true });
    const item = (n, html, opts = {}) => add('li', `<span class="li-n">${n}</span><div class="li-t">${html}</div>`, Object.assign({ split: true }, opts, { cls: 'li ' + (opts.cls || '') }));
    const words = (n) => window.Tafqit(n);

    add('c-title', esc(c.title), { keep: true });
    add('c-lead', tpl(c.opening, v), { keep: true });
    add('c-p', tpl(c.party1, v), { split: true });
    add('c-p', tpl(c.party2, v), { split: true });
    add('c-center', esc(c.prefaceTitle), { keep: true });
    add('c-p', tpl(c.preface, v), { split: true });

    head(c.c1.title);
    add('c-p', esc(c.c1.text));

    head(c.c2.title);
    add('c-docs', c.c2.items.map((t, i) => `<div class="li"><span class="li-n">${i + 1})</span><div class="li-t">${esc(t)}</div></div>`).join(''));

    head(c.c3.title);
    add('c-p', esc(c.c3.intro), { keep: true });
    const scopes = v.lit ? [c.c3.consulting, c.c3.litigation] : [c.c3.consulting];
    scopes.forEach((s, i) => {
      item(`${i + 1})`, esc(s.title), { cls: 'li-b', keep: true, split: false });
      s.items.forEach((t) => item('-', esc(t), { cls: 'li-2' }));
    });

    head(c.c4.title);
    const c4 = c.c4;
    item('1)', tpl(c4.consultingTitle, { num: money(v.amount), words: words(v.amount) }), { cls: 'li-b', keep: true, split: false });
    const interval = c4.intervals[v.period], line = (t, vars) => item('-', tpl(t, vars), { cls: 'li-2' });
    if (v.count === 1) line(c4.installmentOne, { num: money(v.amount), words: words(v.amount) });
    else if (v.count <= c4.ordinals.length) {
      for (let i = 0; i < v.count; i++) {
        const num = i === v.count - 1 ? v.last : v.each;
        const vars = { ord: c4.ordinals[i], num: money(num), words: words(num) };
        if (i === 0) line(c4.installmentFirst, vars);
        else line(c4.installmentNext, Object.assign(vars, { interval, prev: c4.ordinals[i - 1] }));
      }
    } else {
      line(c4.installmentMany, { count: v.count, noun: v.count <= 10 ? 'دفعات' : 'دفعة', freq: c4.freqAdj[v.period], num: money(v.each), words: words(v.each), interval });
      if (v.last !== v.each) line(c4.installmentLast, { num: money(v.last), words: words(v.last) });
    }
    if (v.lit) {
      item('2)', esc(c4.litigationTitle), { cls: 'li-b', keep: true, split: false });
      add('c-fee', feeTable(v), { table: true });
    }
    c.c4.general.forEach((t) => item('-', esc(t), { cls: 'li-2' }));
    if (v.lit) item('-', tpl(c.c4.execution, v), { cls: 'li-2' });

    head(c.c5.title);
    add('c-p', tpl(c.c5.text, v), { split: true });

    head(c.c6.title);
    c.c6.items.forEach((t, i) => item(`${i + 1})`, tpl(t, v)));

    head(c.c7.title);
    c.c7.items.forEach((t, i) => item(`${i + 1})`, tpl(t, v)));

    head(c.c8.title);
    add('c-p', tpl(c.c8.text, { pagesWord }), { keep: true });
    add('c-close', esc(c.closing), { keep: true });
    add('c-signs', `<table class="signs"><thead><tr>
        <th scope="col">${esc(c.signs.first)}<bdi>${esc(c.signs.firstName)}</bdi></th>
        <th scope="col">${esc(c.signs.second)}<bdi>${v.p2name ? esc(v.p2name) : DOTS}</bdi></th>
      </tr></thead><tbody>
        <tr><td>${esc(c.signs.signature)}</td><td>${esc(c.signs.signature)}</td></tr>
        <tr><td>${esc(c.signs.stamp)}</td><td>${esc(c.signs.stamp)}</td></tr>
      </tbody></table>`);
    return out;
  }

  /* =======================================================================
     5. Flowing the agreement over A4 pages (real measurements, so the screen matches the print)
     ======================================================================= */
  const overflowing = (body) => body.scrollHeight > body.clientHeight + 1;

  function newContractSheet(host, v) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<section class="sheet sheet-contract">${watermark}${letterhead(`<bdi>${esc(V.contract.title)}</bdi><bdi>${esc(v.ref)}</bdi>`)}<div class="sheet-body contract" data-body></div>${footer()}</section>`;
    const sheet = wrap.firstElementChild;
    host.appendChild(sheet);
    return $('[data-body]', sheet);
  }

  function makeBlock(b) {
    const el = document.createElement('div');
    el.className = b.cls;
    el.innerHTML = b.html;
    return el;
  }

  // keeps the first n words of a block (or everything after them), leaving its tags in place
  function cutWords(el, n, keepHead) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (!walker.currentNode.parentElement.closest('.li-n')) nodes.push(walker.currentNode);
    let seen = 0;
    nodes.forEach((node) => {
      const parts = node.nodeValue.split(/(\s+)/);
      let out = '';
      parts.forEach((p) => {
        const isWord = /\S/.test(p);
        if (keepHead ? seen < n : seen >= n) out += p;
        if (isWord) seen++;
      });
      node.nodeValue = out;
    });
    return el;
  }
  const countWords = (el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let total = 0;
    while (walker.nextNode()) if (!walker.currentNode.parentElement.closest('.li-n')) total += (walker.currentNode.nodeValue.match(/\S+/g) || []).length;
    return total;
  };

  // the most words of this block that still fit on the page, or 0
  function fitWords(body, el) {
    const total = countWords(el);
    let lo = 0, hi = total - 6;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const head = cutWords(el.cloneNode(true), mid, true);
      body.appendChild(head);
      const over = overflowing(body);
      head.remove();
      if (over) hi = mid - 1; else lo = mid;
    }
    return lo >= 10 ? lo : 0;
  }

  // a table breaks between its rows, and its head repeats on the next page
  function splitTable(body, el) {
    const head = el.cloneNode(true), rows = $$('tbody tr', head);
    for (let n = rows.length - 1; n > 0; n--) {
      rows[n].remove();
      body.appendChild(head);
      const over = overflowing(body);
      head.remove();
      if (!over) {
        const tail = el.cloneNode(true);
        $$('tbody tr', tail).slice(0, n).forEach((r) => r.remove());
        return [head, tail];
      }
    }
    return null;
  }

  function flow(host, blocks, v, [size, leading]) {
    host.style.setProperty('--fs', size + 'pt');
    host.style.setProperty('--lh', leading);
    let body = newContractSheet(host, v), pages = 1;
    blocks.forEach((b) => {
      const el = makeBlock(b);
      if (b.keep) el.dataset.keep = '1';
      body.appendChild(el);
      if (!overflowing(body)) return;
      el.remove();
      let rest = el;
      if (b.split) {
        const n = fitWords(body, el);
        if (n) {
          const head = cutWords(el.cloneNode(true), n, true);
          head.classList.add('split-head');
          body.appendChild(head);
          rest = cutWords(el.cloneNode(true), n, false);
          rest.classList.add('split-tail');
        }
      } else if (b.table) {
        const parts = splitTable(body, el);
        if (parts) { body.appendChild(parts[0]); rest = parts[1]; }
      }
      // a heading never stays alone at the foot of a page
      const moving = [];
      if (rest === el) {
        for (let last = body.lastElementChild; last && last.dataset.keep; last = body.lastElementChild) { moving.unshift(last); last.remove(); }
      }
      body = newContractSheet(host, v);
      pages++;
      moving.forEach((m) => body.appendChild(m));
      body.appendChild(rest);
    });
    return pages;
  }

  // [text size in pt, line height], largest first; the first that fits the wanted pages is used
  const SIZES = [[10.5, 1.6], [10.25, 1.6], [10, 1.58], [9.75, 1.58], [9.5, 1.55], [9.25, 1.52], [9, 1.5], [8.75, 1.46], [8.5, 1.4]];
  const WANTED_PAGES = 2;

  function layoutContract(v) {
    const sheets = $('[data-sheets]');
    let host = $('[data-contract]', sheets);
    if (!host) { host = document.createElement('div'); host.dataset.contract = ''; sheets.appendChild(host); }
    let pagesWord = PAGE_WORDS[2 + WANTED_PAGES];
    const run = (word) => {
      const blocks = contractBlocks(v, word);
      for (const size of SIZES) {
        host.innerHTML = '';
        if (flow(host, blocks, v, size) <= WANTED_PAGES) return;
      }
      // too long for two pages even at the smallest size: stay readable and add a page
      host.innerHTML = '';
      flow(host, blocks, v, [9.5, 1.55]);
    };
    run(pagesWord);
    const total = 2 + host.children.length;
    if (PAGE_WORDS[total] && PAGE_WORDS[total] !== pagesWord) { pagesWord = PAGE_WORDS[total]; run(pagesWord); }
  }

  // page 2 takes the largest text that fits, so it fills the page and always stays one page
  function fitQuote() {
    const body = $('[data-quote-body]');
    if (!body) return;
    for (const s of [1.14, 1.1, 1.06, 1.03, 1, 0.97, 0.94, 0.91, 0.88]) {
      body.style.setProperty('--qs', s);
      if (!overflowing(body)) return;
    }
  }

  function numberPages() {
    const sheets = $$('[data-sheets] .sheet');
    sheets.forEach((s, i) => {
      const pn = $('[data-pn]', s), pt = $('[data-pt]', s);
      if (pn) pn.textContent = i + 1;
      if (pt) pt.textContent = sheets.length;
    });
  }

  // the preview shrinks to fit its column; the sheets keep their true size underneath
  function fitPreview() {
    const preview = $('[data-preview]'), stage = $('[data-stage]'), sheets = $('[data-sheets]');
    const style = getComputedStyle(preview);
    const room = preview.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const full = sheets.offsetWidth;
    const scale = Math.min(1, room / full);
    sheets.style.transform = scale < 1 ? `scale(${scale})` : 'none';
    stage.style.width = Math.floor(full * scale) + 'px';
    stage.style.height = Math.ceil(sheets.offsetHeight * scale) + 'px';
  }

  // what belongs to the form itself: light, and safe while typing
  function updateForm() {
    const v = readValues();
    syncForm();
    $('[data-pay-summary]').textContent = v.amount
      ? `${v.freqText}: ${countWord(v.count)}، قيمة ${v.count === 1 ? 'الدفعة' : 'كل دفعة'} ${money(v.each)} ريال${v.last !== v.each ? ` والأخيرة ${money(v.last)} ريال` : ''}`
      : 'اكتب المبلغ ويظهر هنا تقسيم الدفعات.';
    saveDraft();
  }

  function render() {
    stale = false;
    const v = readValues();
    updateForm();
    const sheets = $('[data-sheets]');
    const old = $('.sheet-quote', sheets);
    const holder = document.createElement('div');
    holder.innerHTML = quoteSheet(v);
    sheets.replaceChild(holder.firstElementChild, old);
    fitQuote();
    layoutContract(v);
    numberPages();
    fitPreview();
    return v;
  }

  /* =======================================================================
     6. Opening the tool, printing
     ======================================================================= */
  function checkRequired() {
    const v = readValues();
    const missing = [];
    if (!v.p2name) missing.push('p2name');
    if (!v.amount) missing.push('amount');
    $$('.is-missing', form).forEach((el) => el.classList.remove('is-missing'));
    missing.forEach((k) => form.elements[k].classList.add('is-missing'));
    if (missing.length) form.elements[missing[0]].focus();
    return !missing.length;
  }

  // the keyboard's return key moves to the next field, and the last one closes the keyboard (as in js/main.js)
  function setupEnterNext() {
    const typed = (el) => el.matches('input:not([type="checkbox"]), select');
    const nextField = (el) => {
      const fields = Array.from(form.elements).filter((f) => typed(f) && f.getClientRects().length > 0);
      return fields[fields.indexOf(el) + 1] || null;
    };
    form.addEventListener('focusin', (e) => {
      if (e.target.matches('input:not([type="checkbox"])')) e.target.setAttribute('enterkeyhint', nextField(e.target) ? 'next' : 'done');
    });
    form.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229 || !e.target.matches('input:not([type="checkbox"])')) return;
      e.preventDefault();
      const next = nextField(e.target);
      if (next) next.focus(); else e.target.blur();
    });
  }

  function printFile() {
    if (!checkRequired()) return;
    const v = render();
    const title = document.title;
    const restore = () => { document.title = title; window.removeEventListener('afterprint', restore); };
    window.addEventListener('afterprint', restore);
    document.title = `عرض سعر - ${v.p2name} - ${v.ref}`; // the name a saved PDF is given
    usedRef();
    window.print();
  }

  function openApp() {
    $('[data-gate]').hidden = true;
    $('[data-app]').hidden = false;
    form = $('[data-form]');
    $('[data-type]').innerHTML = V.types.map((t) => `<option value="${esc(t.id)}">${esc(t.label)}</option>`).join('');
    setDefaults();
    loadDraft();
    syncForm();

    const sheets = $('[data-sheets]');
    sheets.innerHTML = profileSheet() + '<section class="sheet-quote"></section>';

    // On phones nothing on the page changes while a field is being typed in: the preview sits below the form,
    // so it catches up when the field is left, when it comes into view, or at printing.
    let timer = 0;
    const narrow = matchMedia('(max-width: 920px)');
    const typing = () => narrow.matches && document.activeElement && document.activeElement.matches('[data-form] input:not([type="checkbox"])');
    const later = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { if (stale && !typing()) render(); }, narrow.matches ? 300 : 120);
    };
    form.addEventListener('input', (e) => {
      const f = form.elements;
      if (e.target === f.start) startTouched = true;
      if (e.target === f.contractDate && !startTouched) f.start.value = f.contractDate.value;
      if (e.target.classList.contains('is-missing') && e.target.value.trim()) e.target.classList.remove('is-missing');
      stale = true;
      updateForm();
      later();
    });
    form.addEventListener('focusout', () => { if (stale) later(); });
    if (window.IntersectionObserver) new IntersectionObserver((seen) => { if (stale && seen.some((x) => x.isIntersecting)) render(); }).observe($('[data-preview]'));
    form.addEventListener('submit', (e) => e.preventDefault());
    setupEnterNext();
    $$('[data-print]').forEach((b) => b.addEventListener('click', printFile));
    $('[data-new]').addEventListener('click', () => {
      store.del(DRAFT_KEY, session());
      setDefaults();
      $$('.is-missing', form).forEach((el) => el.classList.remove('is-missing'));
      render();
      form.scrollTop = 0;
      window.scrollTo(0, 0);
    });
    $('[data-lock]').addEventListener('click', () => {
      store.del(CODE_KEY); store.del(CODE_KEY, session()); store.del(DRAFT_KEY, session());
      location.reload();
    });
    // only a real width change: the phone's address bar and keyboard change the height alone
    let width = window.innerWidth;
    window.addEventListener('resize', () => { if (window.innerWidth !== width) { width = window.innerWidth; fitPreview(); } });

    render();
    // the page lays out again once the fonts arrive, since they change the measurements
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
  }

  start();
})();
