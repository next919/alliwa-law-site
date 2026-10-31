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
  // start downloading this language's fonts now, so the text changes font as little as possible after it appears
  try {
    (lang === 'ar' ? ['700 1em "IBM Plex Sans Arabic"', '400 1em "IBM Plex Sans Arabic"', '600 1em "IBM Plex Sans Arabic"']
      : ['700 1em Inter', '400 1em Inter', '600 1em Inter'])
      .forEach(function (f) { document.fonts.load(f, lang === 'ar' ? 'عربي' : 'Aa'); });
  } catch (e) {}
})();
