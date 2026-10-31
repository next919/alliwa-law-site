/* Language engine: puts the text from data/ar.js or data/en.js into the page,
   and switches between Arabic (right-to-left) and English (left-to-right).

   How the HTML asks for text:
     data-i18n="hero.title"                  → the element's text
     data-i18n-attr="placeholder:contact.x"  → an attribute (several: "a:key1; b:key2")
     data-list="about.values"                → one copy of the <template> inside it per list item;
                                               inside the template, data-field="title" picks a field
                                               ("." means the item itself, for lists of plain text)
   Text may contain {year}, which becomes the current year. */
(function () {
  'use strict';

  const TEXT = window.SITE_TEXT || {};
  const LANGS = ['ar', 'en'];
  const root = document.documentElement;
  const warned = new Set();

  function lookup(obj, key) {
    return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }

  function warn(message) {
    if (warned.has(message)) return;
    warned.add(message);
    console.warn('[text] ' + message);
  }

  // Text for a key in the current language; falls back to the other language if missing.
  function t(key, lang) {
    lang = lang || I18N.lang;
    let value = lookup(TEXT[lang], key);
    if (value === undefined) {
      const other = LANGS.find((l) => l !== lang);
      value = lookup(TEXT[other], key);
      warn(`missing ${lang} text for "${key}"` + (value === undefined ? ' (in both languages)' : ''));
    }
    if (typeof value === 'string') return value.replace(/\{year\}/g, String(new Date().getFullYear()));
    return value === undefined ? '' : value;
  }

  function fillList(list) {
    const tpl = list.querySelector(':scope > template');
    if (!tpl) return;
    const items = t(list.dataset.list);
    Array.from(list.children).forEach((child) => { if (child !== tpl) child.remove(); });
    (Array.isArray(items) ? items : []).forEach((item, i) => {
      const copy = tpl.content.cloneNode(true);
      copy.querySelectorAll('[data-field]').forEach((el) => {
        const field = el.dataset.field;
        const value = field === '.' ? item : item && item[field];
        el.textContent = value == null ? '' : value;
      });
      Array.from(copy.children).forEach((el) => el.style.setProperty('--i', i));
      list.appendChild(copy);
    });
  }

  // Fill every marked element inside `scope` (default: the whole page).
  function apply(scope) {
    scope = scope || document;
    scope.querySelectorAll('[data-list]').forEach(fillList);
    scope.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    scope.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const at = pair.indexOf(':');
        if (at > 0) el.setAttribute(pair.slice(0, at).trim(), t(pair.slice(at + 1).trim()));
      });
    });
  }

  function setLang(lang) {
    if (!LANGS.includes(lang)) return;
    I18N.lang = lang;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    try { localStorage.setItem('lang', lang); } catch (e) { /* private mode: choice just isn't remembered */ }
    // a shared ?lang= link would override the new choice on reload, so keep it in step
    try {
      const url = new URL(location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.set('lang', lang);
        history.replaceState(history.state, '', url);
      }
    } catch (e) { /* opened from a file: nothing to update */ }
    apply();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-lang-switch]')) setLang(I18N.lang === 'ar' ? 'en' : 'ar');
  });

  const I18N = {
    lang: LANGS.includes(root.getAttribute('lang')) ? root.getAttribute('lang') : 'ar',
    t,
    apply,
    setLang,
  };
  window.I18N = I18N;
})();
