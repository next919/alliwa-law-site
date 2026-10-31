/* Runs before the page is drawn: picks the language so the page never flips after loading.
   Order: a ?lang=ar / ?lang=en link → the visitor's last choice → defaultLanguage in data/settings.js. */
(function () {
  var root = document.documentElement;
  var ok = function (l) { return l === 'ar' || l === 'en'; };
  var lang = null;
  try { lang = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  if (ok(lang)) { try { localStorage.setItem('lang', lang); } catch (e) {} }  // remember it for the next page
  else { try { lang = localStorage.getItem('lang'); } catch (e) {} }
  if (!ok(lang)) { lang = (window.SITE_SETTINGS && window.SITE_SETTINGS.defaultLanguage) || 'ar'; }
  if (!ok(lang)) { lang = 'ar'; }
  root.setAttribute('lang', lang);
  root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  // Display options (night mode, colours, shape): a ?theme=dark / ?accent=navy / ?shape=sharp link,
  // then the visitor's last choice in the options panel. No choice = the official look.
  var OPTIONS = {
    theme:  { key: 'theme-mode',   def: 'light',    values: ['dark'] },
    accent: { key: 'theme-accent', def: 'official', values: ['navy', 'green'] },
    shape:  { key: 'theme-shape',  def: 'soft',     values: ['sharp', 'round'] }
  };
  var params = null;
  try { params = new URLSearchParams(location.search); } catch (e) {}
  var optionsOn = !(window.SITE_SETTINGS && window.SITE_SETTINGS.displayOptions === false);
  Object.keys(OPTIONS).forEach(function (name) {
    if (!optionsOn) { try { localStorage.removeItem(OPTIONS[name].key); } catch (e) {} return; }
    var o = OPTIONS[name], value = null;
    var asked = params && params.get(name);
    try {
      if (asked && o.values.indexOf(asked) > -1) localStorage.setItem(o.key, asked);
      else if (asked === o.def) localStorage.removeItem(o.key);
      value = localStorage.getItem(o.key);
    } catch (e) { value = asked; }
    if (o.values.indexOf(value) > -1) root.setAttribute('data-' + name, value);
  });
  // start downloading this language's fonts now, so the text changes font as little as possible after it appears
  try {
    (lang === 'ar' ? ['700 1em "IBM Plex Sans Arabic"', '400 1em "IBM Plex Sans Arabic"', '600 1em "IBM Plex Sans Arabic"']
      : ['700 1em Inter', '400 1em Inter', '600 1em Inter'])
      .forEach(function (f) { document.fonts.load(f, lang === 'ar' ? 'عربي' : 'Aa'); });
  } catch (e) {}
})();
