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
    }
  },

  a11y: {
    skip: "Skip to main content"
  },

  demo: {
    banner: "Demo version — text and images are placeholders"
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

  // ----- Partners & team -----
  // Each member is linked by its key (partner1, lawyer1 …) to data/settings.js, which sets the photo and order.
  team: {
    eyebrow: "Our People",
    title: "Partners & Team",
    subtitle: "Lawyers and legal consultants who combine practical experience with strong academic qualifications.",
    partnersTitle: "Partners",
    staffTitle: "Our Team",
    members: {
      partner1: {
        name: "Founding Partner Name",
        role: "Founding & Managing Partner",
        bio: "Over 15 years of experience in litigation and legal advice for companies and individuals; oversees the work of every department."
      },
      partner2: {
        name: "Partner Name",
        role: "Partner, Head of Litigation",
        bio: "Focuses on commercial and labor disputes, representing clients before the courts and judicial committees."
      },
      lawyer1: {
        name: "Senior Lawyer Name",
        role: "Senior Lawyer",
        bio: "Handles real estate and enforcement matters, and advises on drafting and reviewing contracts."
      },
      lawyer2: {
        name: "Lawyer Name",
        role: "Lawyer",
        bio: "Works on family and personal status matters, with a focus on amicable settlement and reconciliation."
      },
      consultant: {
        name: "Consultant Name",
        role: "Legal Consultant",
        bio: "Advises on corporate law, governance and commercial arbitration procedure."
      },
      researcher: {
        name: "Researcher Name",
        role: "Legal Researcher",
        bio: "Prepares legal memoranda and research, and follows new regulations and court practice."
      },
      manager: {
        name: "Office Manager Name",
        role: "Office & Client Relations Manager",
        bio: "Manages appointments, client communication and administrative follow-up."
      }
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
      consent: "I agree that my details may be used to contact me about my request, in line with the Personal Data Protection Law.",
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
    license: "License No.: 000000 (placeholder)",
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
    photo: "Placeholder photo",
    officePhoto: "Office photo (placeholder)"
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
