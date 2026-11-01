/* ==========================================================================
   Amounts in Arabic words, for quotation.html: 25000 → "خمسة وعشرون ألف ريال سعودي"
   Riyal forms: 1 واحد، 2 ريالان، 3-10 ريالات، 11-99 ريالًا، 100 وما فوق ريال.
   ========================================================================== */
window.Tafqit = (function () {
  'use strict';

  const UNITS = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const TEENS = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const HUNDREDS = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  // [one, two, 3-10, 11-99 with a word after it, 11-99 or a round hundred right before the noun]
  const SCALES = [
    null,
    ['ألف', 'ألفان', 'آلاف', 'ألفًا', 'ألف'],
    ['مليون', 'مليونان', 'ملايين', 'مليونًا', 'مليون'],
    ['مليار', 'ملياران', 'مليارات', 'مليارًا', 'مليار'],
  ];

  // 1 to 99
  function below100(n) {
    if (n < 10) return UNITS[n];
    if (n < 20) return TEENS[n - 10];
    const u = n % 10, t = TENS[Math.floor(n / 10)];
    return u ? UNITS[u] + ' و' + t : t;
  }

  // 1 to 999
  function below1000(n) {
    const h = Math.floor(n / 100), r = n % 100;
    return [h ? HUNDREDS[h] : '', r ? below100(r) : ''].filter(Boolean).join(' و');
  }

  // one group with its scale word, e.g. 125 thousand; isLast = nothing comes after it but the noun
  function group(n, scale, isLast) {
    const s = SCALES[scale];
    if (n === 1) return s[0];
    if (n === 2) return isLast ? s[1].slice(0, -1) : s[1];
    const r = n % 100;
    if (r === 0) return below1000(n).replace(/مائتان$/, 'مائتا') + ' ' + s[0];
    // 101 and 102 thousand read "مائة ألف وألف" and "مائة ألف وألفان"
    if (r === 1 || r === 2) return below1000(n - r) + ' ' + s[0] + ' و' + (r === 1 ? s[0] : (isLast ? s[1].slice(0, -1) : s[1]));
    if (r <= 10) return below1000(n) + ' ' + s[2];
    return below1000(n) + ' ' + (isLast ? s[4] : s[3]);
  }

  // whole riyals with the right form of "ريال سعودي"
  function riyals(n) {
    if (n === 0) return 'صفر ريال سعودي';
    if (n === 1) return 'ريال سعودي واحد';
    if (n === 2) return 'ريالان سعوديان';
    const parts = [];
    let rest = n, scale = 0;
    while (rest > 0) { parts.unshift([rest % 1000, scale]); rest = Math.floor(rest / 1000); scale++; }
    const used = parts.filter((p) => p[0] > 0);
    const r100 = n % 100;
    const lastIndex = used.length - 1;
    const words = used.map(([value, sc], i) => {
      const last = i === lastIndex;
      if (sc > 0) return group(value, sc, last);
      if (last && (value === 1 || value === 2)) return null; // said with the noun below
      if (value % 100 === 1 || value % 100 === 2) return below1000(value - value % 100);
      return below1000(value);
    }).filter(Boolean).join(' و').replace(/مائتان$/, 'مائتا');
    if (r100 === 1 && n > 100) return words + ' ريال سعودي وريال واحد';
    if (r100 === 2 && n > 100) return words + ' ريال سعودي وريالان';
    if (r100 >= 3 && r100 <= 10) return words + ' ريالات سعودية';
    if (r100 >= 11) return words + ' ريالًا سعوديًا';
    return words + ' ريال سعودي';
  }

  // 1 to 99 halalas (a feminine noun)
  function halalas(n) {
    const U = ['', 'إحدى', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثماني', 'تسع'];
    if (n === 1) return 'هللة واحدة';
    if (n === 2) return 'هللتان';
    if (n <= 9) return U[n] + ' هللات';
    if (n === 10) return 'عشر هللات';
    if (n === 11) return 'إحدى عشرة هللة';
    if (n === 12) return 'اثنتا عشرة هللة';
    if (n < 20) return U[n - 10] + ' عشرة هللة';
    const u = n % 10, t = TENS[Math.floor(n / 10)];
    return (u ? U[u] + ' و' + t : t) + ' هللة';
  }

  // amount in riyals, may carry halalas
  return function tafqit(amount) {
    const cents = Math.round(Number(amount || 0) * 100);
    const whole = Math.floor(cents / 100), frac = cents % 100;
    if (whole === 0 && frac > 0) return halalas(frac);
    return frac ? riyals(whole) + ' و' + halalas(frac) : riyals(whole);
  };
})();
