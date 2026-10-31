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

  // The thin strip at the very top that says "demo version" (it also holds the "Display options" button).
  // Set to false before launch.
  showDemoBanner: true,

  // The "Display options" panel (light/dark, colour schemes, shapes). false = official look only:
  // the button is hidden and any choice a visitor saved earlier is cleared.
  displayOptions: true,

  // Official logo (white version, for the dark header and footer): Arabic page / English page.
  // The hero shows the office photo (images/office/hero-office.jpg); the 404 page uses images/logo-mark-dark.svg.
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

  // ----- Licences & registration (the "Licences" section and the footer), in display order -----
  // number → as issued; leave "" until the firm supplies it (the page then says "to be added").
  // link   → the official page where a visitor can check it ("" = no button).
  //          The lawyers directory is public; replace the establishment link with the firm's own entry when known.
  licence: [
    { id: "moj",           icon: "badge",    number: "", link: "https://eservice.sba.gov.sa/lawyers" },
    { id: "sba",           icon: "users",    number: "", link: "https://eservice.sba.gov.sa/lawyers" },
    { id: "establishment", icon: "building", number: "", link: "https://eservice.sba.gov.sa/" },
    { id: "cr",            icon: "doc",      number: "", link: "" },
    { id: "vat",           icon: "doc",      number: "", link: "https://zatca.gov.sa/en/eServices/Pages/TaxpayerLookup.aspx" }
  ],

  // ----- Partners & clients (the logo wall), in display order -----
  // logo → picture file in images/clients/ (PNG or SVG, transparent background, about 320×120 px)
  // name → the organisation's name (read out to screen readers)
  // Show an organisation only with its written consent. Leave logo "" for a placeholder shape (demo).
  clients: [
    { name: "", logo: "" },
    { name: "", logo: "" },
    { name: "", logo: "" },
    { name: "", logo: "" },
    { name: "", logo: "" },
    { name: "", logo: "" },
    { name: "", logo: "" },
    { name: "", logo: "" }
  ],

  // ----- Team, in display order -----
  // id    → links to the name, title and bio under team.members in ar.js and en.js
  // group → "partners" (large cards at the top, under "Leadership") or "staff"
  // photo → picture file in images/team/ (portrait, about 700×900 px).
  //         Leave "" for no photo: a large card then shows a placeholder,
  //         a team card shows the person's initial (set under "initial" in ar.js / en.js).
  team: [
    { id: "gm",       group: "partners", photo: "images/team/general-manager.jpg" },
    { id: "khalid",   group: "partners", photo: "images/team/khalid.jpg" },
    { id: "trainee1", group: "staff",    photo: "" },
    { id: "trainee2", group: "staff",    photo: "" },
    { id: "trainee3", group: "staff",    photo: "" },
    { id: "trainee4", group: "staff",    photo: "" }
  ]
};
