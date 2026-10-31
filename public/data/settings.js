/* ==========================================================================
   SHARED SETTINGS — the same in Arabic and English
   Contact details, links, numbers, photos and the order of the cards.
   All visible text (both languages) is in data/ar.js and data/en.js.

   Editing tips: change only what is between the quotes "..." or the numbers.
   Keep every comma and bracket. Lines starting with // are notes, not content.
   ========================================================================== */
window.SITE_SETTINGS = {

  // Language for a first visit: "ar" or "en". After that each visitor's own choice is remembered.
  defaultLanguage: "ar",

  // The thin gold strip at the very top that says "demo version". Set to false before launch.
  showDemoBanner: true,

  // Official logo (white version, for the dark header and footer): Arabic page / English page.
  // The hero emblem is images/logo-mark.svg; the 404 page uses images/logo-mark-dark.svg.
  logos: {
    ar: "images/logo-ar.svg",
    en: "images/logo-en.svg"
  },

  // ----- Contact -----
  phone: "+966579797648",          // used when someone taps "call"
  phoneDisplay: "057 979 7648",    // how the number is shown on the page
  whatsapp: "966579797648",        // country code + number, digits only (no + or spaces)
  email: "info@kalidlaw.com",

  // ----- Map -----
  // mapLink: where "Open in Google Maps" goes. Best: open the firm on Google Maps → Share → Copy link.
  mapLink: "https://www.google.com/maps/search/?api=1&query=مكتب+خالد+اللواء+محامون+ومستشارون+الجبيل",
  // mapEmbed: to show a live map instead of the placeholder, open Google Maps → Share → Embed a map,
  // and paste only the link inside src="..." here. Leave "" to keep the placeholder.
  mapEmbed: "",

  // ----- Numbers -----
  // Years of experience (PLACEHOLDER). The team size and the number of practice areas are counted automatically.
  experienceYears: 15,

  // ----- Practice areas, in display order -----
  // id   → links to the text under practice.areas in ar.js and en.js
  // icon → one of: briefcase, users, building, family, shield, scale, gavel
  practiceAreas: [
    { id: "commercial",  icon: "briefcase" },
    { id: "labor",       icon: "users" },
    { id: "realestate",  icon: "building" },
    { id: "family",      icon: "family" },
    { id: "criminal",    icon: "shield" },
    { id: "arbitration", icon: "scale" }
  ],

  // ----- Team, in display order -----
  // id    → links to the name, title and bio under team.members in ar.js and en.js
  // group → "partners" (large cards at the top, under "Leadership") or "staff"
  // photo → picture file in images/team/ (portrait, about 700×900 px).
  //         Leave "" for no photo: a large card then shows a placeholder,
  //         a team card shows the person's initial (set under "initial" in ar.js / en.js).
  team: [
    { id: "gm",       group: "partners", photo: "images/team/general-manager.jpg" },
    { id: "khalid",   group: "partners", photo: "" },
    { id: "trainee1", group: "staff",    photo: "" },
    { id: "trainee2", group: "staff",    photo: "" },
    { id: "trainee3", group: "staff",    photo: "" },
    { id: "trainee4", group: "staff",    photo: "" }
  ]
};
