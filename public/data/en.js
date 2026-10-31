/* ==========================================================================
   ENGLISH TEXT
   Edit only the text between the quotes "...". Keep the keys (the words before
   the colons), commas and brackets exactly as they are: data/ar.js uses the same keys.
   ========================================================================== */
window.SITE_TEXT = window.SITE_TEXT || {};
window.SITE_TEXT.en = {

  meta: {
    home: {
      title: "Khalid Allewa Lawyers and Consultants | Jubail",
      description: "A law firm in Jubail, Saudi Arabia, advising and representing individuals and companies in commercial, labor, real estate, family, criminal and arbitration matters."
    },
    login: {
      title: "Employee Login | Khalid Allewa Lawyers and Consultants",
      description: "Staff portal of Khalid Allewa Lawyers and Consultants."
    },
    legal: {
      title: "Policies & Terms | Khalid Allewa Lawyers and Consultants",
      description: "Privacy policy, terms of use and disclaimer for the Khalid Allewa Lawyers and Consultants website."
    }
  },

  a11y: {
    skip: "Skip to main content"
  },

  demo: {
    banner: "Demo version — some text is still placeholder"
  },

  // "Display options" button in the top strip (preview)
  theme: {
    button: "Display options",
    title: "Display options",
    close: "Close",
    mode: "Mode",
    light: "Light",
    dark: "Dark",
    colors: "Colours",
    official: "Official",
    navy: "Navy & gold",
    green: "Green & bronze",
    shape: "Shape",
    soft: "Soft",
    sharp: "Sharp",
    round: "Round",
    note: "Preview only: try the options, and the one you pick becomes the final look.",
    reset: "Back to the official look"
  },

  brand: {
    fullName: "Khalid Allewa Lawyers and Consultants"   // read out by screen readers in place of the logo
  },

  nav: {
    label: "Main menu",
    home: "Home",
    about: "About",
    team: "Our Team",
    practice: "Practice Areas",
    contact: "Contact",
    open: "Open menu",
    close: "Close menu"
  },

  header: {
    langSwitch: "العربية",   // the other language, as shown on the button
    langShort: "عربي",
    langCode: "ar",
    login: "Employee Login"
  },

  cta: {
    book: "Book a Consultation",
    whatsapp: "Chat on WhatsApp"
  },

  // ----- Home -----
  hero: {
    eyebrow: "Law Firm & Legal Consultancy · Jubail",
    title: "Trusted legal expertise",
    titleAccent: "protecting your rights and your business",
    lead: "We advise and represent individuals and companies under the laws of the Kingdom of Saudi Arabia, with professionalism and strict confidentiality.",
    secondary: "Our Practice Areas",
    points: [
      "Licensed lawyers",
      "Strict client confidentiality",
      "In-person and remote consultations"
    ],
    badge: "Years of experience"
  },

  intro: {
    eyebrow: "Welcome",
    title: "Your legal partner in the Eastern Province",
    text: "Khalid Allewa Lawyers and Consultants is a Saudi law firm based in Jubail, with a dedicated team of lawyers and legal consultants. We work with clarity and transparency, and stay with our clients at every step, from the first consultation to the right resolution.",
    more: "Learn more about us"
  },

  stats: {
    years: "Years of experience",
    team: "Team members",
    areas: "Core practice areas"
  },

  // ----- About -----
  about: {
    eyebrow: "About the Firm",
    photoAlt: "One of the offices at Khalid Allewa Lawyers and Consultants, with a view of the sea",
    title: "Professional commitment. Trust earned through work.",
    lead: "The firm was founded to provide comprehensive legal services that combine a deep understanding of Saudi law with hands-on experience before the courts and judicial committees.",
    text: "We believe every client's situation is unique. That is why we study each matter carefully, explain the options in plain language, and build a plan that protects your rights and serves your interests. (Placeholder introduction, to be replaced with the firm's official profile.)",
    highlights: [
      "Deep knowledge of Saudi laws and regulations",
      "Close follow-up at every stage of the case",
      "Regular communication and clear reporting",
      "Amicable solutions whenever they serve the client"
    ],
    badge: "Years of experience in Saudi law",
    vision: {
      title: "Our Vision",
      text: "To be the first choice for legal services in the Eastern Province, delivering reliable legal solutions that keep pace with legislative change and the goals of Saudi Vision 2030."
    },
    mission: {
      title: "Our Mission",
      text: "To deliver high-quality legal representation and advice founded on integrity, confidentiality and professionalism, always putting our clients' interests first."
    },
    valuesTitle: "Our Values",
    values: [
      { title: "Integrity", text: "We uphold the ethics of the legal profession and give honest advice in every situation." },
      { title: "Confidentiality", text: "We protect our clients' information and handle it with the utmost care." },
      { title: "Professionalism", text: "We work methodically, with up-to-date knowledge of the law and court procedure." },
      { title: "Transparency", text: "We explain procedures, fees and expectations clearly from the very start." }
    ]
  },

  // ----- Leadership & team -----
  // Each member is linked by its key (gm, khalid, trainee1 …) to data/settings.js, which sets the photo and order.
  team: {
    eyebrow: "Our People",
    title: "Leadership & Team",
    subtitle: "A team that brings together legal and administrative experience, working as one to serve our clients with professionalism and complete discretion.",
    partnersTitle: "Leadership",
    staffTitle: "Our Team",
    members: {
      gm: {
        name: "Abdulhadi bin Mohammed Allewa",
        role: "General Manager",
        bio: "Oversees the running of the firm and its day-to-day work, and follows up on the quality of service our clients receive."
      },
      khalid: {
        name: "Khalid bin Abdulhadi Allewa",
        role: "Lawyer",
        bio: "Represents clients before the courts and judicial committees, and gives legal advice to individuals and companies."
      },
      // initial: the letter shown in the circle instead of a photo
      trainee1: { name: "Ali bin Mohammed Al-Marri", role: "Trainee Lawyer", initial: "A", bio: "" },
      trainee2: { name: "Thamer bin Hamad Al-Dosari", role: "Trainee Lawyer", initial: "T", bio: "" },
      trainee3: { name: "Noura Ibrahim Al-Hamad", role: "Trainee Lawyer", initial: "N", bio: "" },
      trainee4: { name: "Zainab Al-Ramadan", role: "Trainee Lawyer", initial: "Z", bio: "" }
    }
  },

  // ----- Partners & clients (the logos are in data/settings.js) -----
  clients: {
    eyebrow: "Trusted by",
    title: "Our Partners & Clients",
    subtitle: "Organisations and companies whose trust and cooperation we value.",
    note: "The logos shown are placeholders. An organisation's logo is shown only with its written consent, in line with professional confidentiality."
  },

  // ----- Licences & accreditation (numbers and verify links are in data/settings.js) -----
  licence: {
    eyebrow: "Trust & Transparency",
    title: "Licences & Accreditation",
    subtitle: "We practise under a Ministry of Justice licence and Saudi Bar Association membership, and you can check our details with the official bodies.",
    pending: "To be added",
    note: "Draft: the numbers are added once the firm confirms them; the verify links open the official websites.",
    items: {
      moj: { title: "Law Practice Licence", issuer: "Issued by the Ministry of Justice", label: "Licence No.", verify: "Verify in the lawyers directory" },
      sba: { title: "Saudi Bar Association Membership", issuer: "Active basic membership", label: "Membership No.", verify: "Verify with the SBA" },
      establishment: { title: "Legal Establishment Record", issuer: "Saudi Bar Association", label: "Record No.", verify: "Verify the establishment" },
      cr: { title: "Commercial Registration", issuer: "Professional company registered with the Ministry of Commerce", label: "Unified National No.", verify: "" },
      vat: { title: "VAT Registration", issuer: "Zakat, Tax and Customs Authority (ZATCA)", label: "VAT No.", verify: "Verify with ZATCA" }
    }
  },

  // ----- Practice areas -----
  // Practice areas only: no client cases or client names.
  practice: {
    eyebrow: "What We Do",
    title: "Practice Areas",
    subtitle: "We provide legal advice, contract drafting and representation before the competent judicial authorities in the following areas.",
    cta: "Request a consultation",
    note: "We keep all client information strictly confidential and never publish details of cases or clients.",
    areas: {
      commercial: {
        title: "Commercial Law",
        text: "We help companies and entrepreneurs set up businesses and draft contracts, and represent them in disputes before the commercial courts.",
        services: [
          "Company formation and amendments",
          "Drafting and reviewing commercial contracts",
          "Commercial disputes and debt collection",
          "Bankruptcy and financial restructuring"
        ]
      },
      labor: {
        title: "Labor Law",
        text: "We represent employers and employees in labor disputes, and advise under the Saudi Labor Law and its implementing regulations.",
        services: [
          "Employment contracts and internal work rules",
          "Wage and end-of-service benefit claims",
          "Unlawful termination cases",
          "Amicable settlement and labor court representation"
        ]
      },
      realestate: {
        title: "Real Estate",
        text: "Complete legal support for property transactions, from sale, ownership and leasing to disputes and enforcement.",
        services: [
          "Drafting and reviewing sale and lease contracts",
          "Ownership and title transfer disputes",
          "Lease and eviction cases",
          "Property development and construction contracts"
        ]
      },
      family: {
        title: "Family & Personal Status",
        text: "We handle family matters with wisdom and complete confidentiality, favoring amicable solutions that protect everyone's interests.",
        services: [
          "Divorce, khula and annulment",
          "Custody, maintenance and visitation",
          "Estate division and wills",
          "Family mediation and reconciliation"
        ]
      },
      criminal: {
        title: "Criminal Law",
        text: "We defend our clients and represent victims at every stage of criminal proceedings, from investigation to judgment.",
        services: [
          "Attending investigations with the client",
          "Representation before the criminal courts",
          "Fraud and cybercrime cases",
          "Objections and appeals"
        ]
      },
      arbitration: {
        title: "Arbitration & Dispute Resolution",
        text: "We represent clients in domestic and international arbitration, and help resolve disputes through mediation, away from the courts.",
        services: [
          "Domestic and international commercial arbitration",
          "Drafting arbitration clauses and agreements",
          "Mediation and conciliation",
          "Enforcement of arbitral awards"
        ]
      }
    }
  },

  // ----- How we work -----
  process: {
    eyebrow: "How We Work",
    title: "Working with you, step by step",
    subtitle: "Clear steps from the first contact to the resolution of your matter, at our office or remotely.",
    steps: [
      { title: "Get in touch", text: "Book through the form, by phone or on WhatsApp, and choose what suits you: in person or remotely." },
      { title: "We study your matter", text: "A specialist lawyer listens to the details and reviews your documents in complete confidence." },
      { title: "A clear plan", text: "We explain your legal position, your options and the expected fees before any work begins." },
      { title: "Ongoing follow-up", text: "We handle the procedures on your behalf and keep you informed until your matter is resolved." }
    ]
  },

  ctaBand: {
    title: "Need legal advice?",
    text: "Speak with one of our lawyers today. We will help you understand your legal position and the right next steps."
  },

  // ----- Frequently asked questions -----
  faq: {
    eyebrow: "FAQ",
    title: "Answers to common questions",
    items: [
      { q: "How do I book a consultation?", a: "Use the consultation form on this page, call us or message us on WhatsApp, and we will contact you to confirm the appointment." },
      { q: "Do you offer remote consultations?", a: "Yes. Consultations can take place at our office in Jubail, or by phone or video call, for clients in Saudi Arabia and abroad." },
      { q: "How much does a consultation cost?", a: "Fees depend on the type and complexity of the matter, and we tell you clearly before the appointment is confirmed." },
      { q: "Which documents should I bring?", a: "To start, anything related to your matter: contracts, correspondence, deeds or judgments. Your lawyer will tell you if anything else is needed." },
      { q: "Is my information confidential?", a: "Yes. We keep all information and documents shared by our clients strictly confidential, in line with the rules of the legal profession in Saudi Arabia." },
      { q: "Do you take cases outside Jubail?", a: "Yes. We handle cases before the courts and competent authorities across the Kingdom, using electronic judicial services such as the Najiz platform." }
    ]
  },

  // ----- Contact -----
  contact: {
    eyebrow: "Contact Us",
    title: "Book Your Consultation",
    subtitle: "We are happy to answer your questions and schedule consultations. Fill in the form and our team will get back to you shortly.",
    form: {
      title: "Consultation Request",
      name: "Full name",
      namePh: "Your full name",
      phone: "Mobile number",
      phonePh: "05XXXXXXXX",
      email: "Email",
      emailPh: "name@example.com",
      optional: "(optional)",
      area: "Type of consultation",
      areaPh: "Choose a type",
      areaOther: "General consultation / Other",
      method: "Preferred consultation method",
      methods: {
        office: "At the office",
        phone: "Phone call",
        video: "Video call"
      },
      message: "Brief details",
      messagePh: "Briefly describe your matter. Please don't include confidential information.",
      consent: "I agree to my data being collected and processed under the Privacy Policy, to answer my request and book the appointment.",
      privacyNote: "Please do not send confidential details or documents through this form.",
      privacyLink: "Privacy Policy",
      submit: "Send Request",
      note: "Demo form: no data is sent in this version.",
      successTitle: "Request received",
      successText: "Thank you for contacting us. (This is a demo, so no data was actually sent.)",
      again: "Send another request"
    },
    errors: {
      name: "Please enter your full name.",
      phone: "Please enter a valid mobile number, e.g. 0501234567.",
      email: "Please enter a valid email address.",
      area: "Please choose the type of consultation.",
      message: "Please add a few details (at least 10 characters).",
      consent: "Please agree to the use of your details so we can contact you."
    },
    info: {
      title: "Contact Details",
      phone: "Phone",
      whatsapp: "WhatsApp",
      whatsappAction: "Chat on WhatsApp",
      email: "Email",
      address: "Address",
      hours: "Working Hours"
    },
    address: "King Abdulaziz Service Road, Al Jubail 35513, Saudi Arabia",
    hours: [
      { days: "Sunday – Thursday", time: "8:00 AM – 4:00 PM" },
      { days: "Friday – Saturday", time: "Closed" }
    ],
    hoursNote: "Working hours are placeholders and will be confirmed.",
    whatsappMessage: "Hello, I would like to ask about the services of Khalid Allewa Lawyers and Consultants.",
    // office photos next to the map
    office: {
      entrance: "Our entrance",
      entranceAlt: "Entrance of Khalid Allewa Lawyers and Consultants, with the office sign, number 611",
      interior: "Inside the office",
      interiorAlt: "Inside the offices of Khalid Allewa Lawyers and Consultants"
    },
    map: {
      title: "Our Location",
      placeholder: "Placeholder map. An interactive map will be added later.",
      open: "Open in Google Maps"
    }
  },

  footer: {
    about: "A law firm and legal consultancy in Jubail, serving individuals and companies with professionalism and strict confidentiality.",
    linksTitle: "Quick Links",
    contactTitle: "Contact",
    hoursTitle: "Working Hours",
    legalForm: "Professional company",
    licenceLabel: "Ministry of Justice licence",
    crLabel: "Unified National No.",
    legal: { privacy: "Privacy Policy", terms: "Terms of Use", disclaimer: "Disclaimer" },
    disclaimer: "The information on this website is for general purposes only and does not constitute legal advice.",
    copyright: "© {year} Khalid Allewa Lawyers and Consultants. All rights reserved."
  },

  whatsapp: {
    float: "Chat with us on WhatsApp"
  },

  // Quick-contact bar at the bottom of phone screens
  mobileBar: {
    label: "Quick contact",
    call: "Call",
    whatsapp: "WhatsApp",
    book: "Book now"
  },

  placeholder: {
    photo: "Placeholder photo"
  },

  // ----- Privacy, terms and disclaimer page (legal.html) -----
  // A draft based on the Personal Data Protection Law and the lawyers' Code of Professional Conduct;
  // the firm reviews and approves it before launch. Text in [ ] is to be completed by the firm.
  legalPage: {
    title: "Policies & Terms",
    back: "Back to the website",
    toc: "On this page",
    draft: "Draft: the firm reviews and approves these texts before launch; text in [ ] is completed by the firm.",
    updated: "Last updated: [date]",
    privacy: {
      title: "Privacy Policy",
      items: [
        { h: "Who we are", p: "Khalid Allewa Lawyers and Consultants (a professional company), based in Jubail, Saudi Arabia, is responsible for the personal data collected through this website. Questions about your data: info@kalidlaw.com." },
        { h: "What we collect", p: "Only when you fill in the consultation form: your name, mobile number, email (optional), type of consultation, preferred way of meeting and a short summary of the matter. We do not ask for documents or confidential case details through the website." },
        { h: "Purpose and legal basis", p: "We use this data only to answer your request and arrange the consultation, based on the consent you give when you send the form. We do not use it for marketing without your separate consent." },
        { h: "Confidentiality and disclosure", p: "We treat your data in strict confidence under the lawyers' Code of Professional Conduct. We never sell it, and we disclose it only with your explicit consent or where the law requires. The technical providers that host the website or run our email may access it, only as far as their service needs." },
        { h: "How long we keep it", p: "We keep request data only as long as needed for its purpose or as the law requires, then destroy it securely. [The firm sets the period.]" },
        { h: "Your rights", p: "Under the Personal Data Protection Law you may: know how your data is processed, access it and get a copy, ask for it to be corrected or completed, ask for it to be destroyed once it is no longer needed, and withdraw your consent at any time. To use these rights, email info@kalidlaw.com." },
        { h: "Transfers outside Saudi Arabia", p: "[The firm states where the website and email are hosted. If outside the Kingdom, the safeguards used under the law and its regulation on transferring personal data abroad are described here.]" },
        { h: "Browser storage and outside services", p: "The website uses no tracking or advertising cookies. Your browser keeps only your preferences (language and display options) on your device for your next visit. Fonts are loaded from Google Fonts." },
        { h: "Questions and complaints", p: "If you have a concern about how your data is handled, contact us first. You may also complain to the competent authority, the Saudi Data & AI Authority (SDAIA)." },
        { h: "Changes", p: "We may update this policy from time to time; the date of the latest update is shown at the top of the page." }
      ]
    },
    terms: {
      title: "Terms of Use",
      items: [
        { h: "Acceptance", p: "By using this website you accept these terms. If you do not accept them, please do not use the website." },
        { h: "Nature of the content", p: "The content introduces the firm and its services and gives general information; it is not legal advice on any particular case." },
        { h: "When a lawyer-client relationship begins", p: "Visiting the website, writing to us or filling in the form does not create a lawyer-client relationship. It begins only once a written fee agreement or power of attorney is signed, as the law provides." },
        { h: "Appointments and fees", p: "A consultation request made through the website binds neither side until we confirm the appointment, and fees are agreed in writing before any work starts." },
        { h: "Intellectual property", p: "The website content and the firm's logo belong to the firm and may not be copied, republished or used commercially without written permission." },
        { h: "External links", p: "The website may link to official or outside websites for verification or information; we are not responsible for their content or policies." },
        { h: "Governing law", p: "These terms are governed by the laws of the Kingdom of Saudi Arabia, and the Saudi courts have jurisdiction over any dispute arising from them." },
        { h: "Changes", p: "The firm may change these terms at any time; the version published on the website applies." }
      ]
    },
    disclaimer: {
      title: "Disclaimer",
      items: [
        { h: "General information", p: "The information on this website is general and for awareness only. It is not legal advice and does not replace consulting a licensed lawyer about your own situation." },
        { h: "Accuracy", p: "We work to keep the content accurate and up to date, but laws change, so we cannot guarantee it is complete or reflects the latest amendments at all times." },
        { h: "Outcomes", p: "Every case is different, no outcome can be guaranteed, and past results do not guarantee similar results." },
        { h: "Limits of responsibility", p: "The firm is not responsible for any decision made on the basis of the website content without specific legal advice." }
      ]
    }
  },

  // ----- Employee login page (phase 2) -----
  login: {
    title: "Employee Portal",
    subtitle: "This page is for the firm's staff only.",
    notice: "Under development: sign-in will be enabled in phase 2 of the project.",
    user: "Username or email",
    password: "Password",
    submit: "Sign In",
    back: "Back to website"
  }
};
