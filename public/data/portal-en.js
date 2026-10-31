/* ==========================================================================
   Employee portal and e-contracts (demo) — English text
   Loaded only on login.html, portal.html and sign.html.
   The agreement text (contract) is a draft for the firm to review before real use.
   ========================================================================== */
(function () {
  var en = window.SITE_TEXT.en;

  en.portal = {
    title: "Employee Portal",
    demo: "Demo: the data is made up and stays in this browser only.",
    menu: "Menu",
    closeMenu: "Close menu",
    logout: "Sign out",
    viewAs: "View as",
    account: "Demo account",
    backToSite: "Back to website",
    soon: "Soon",
    roles: { admin: "Administrator", lawyer: "Lawyer", trainee: "Trainee lawyer", staff: "Admin staff" },
    nav: {
      overview: "Overview",
      contracts: "E-contracts",
      cases: "Cases",
      appointments: "Appointments",
      clients: "Clients",
      documents: "Documents",
      invoices: "Invoices",
      users: "Users & permissions"
    },
    status: { draft: "Draft", sent: "Awaiting signature", signed: "Signed" },
    events: {
      created: "Agreement created",
      sent: "Approved and sent to the client",
      viewed: "Client opened the agreement",
      signed: "Client signed the agreement"
    },
    overview: {
      hello: "Welcome",
      sub: "A quick summary of the firm's fee agreements.",
      kpi: { total: "All agreements", sent: "Awaiting client signature", signed: "Signed agreements", draft: "Drafts" },
      recent: "Latest agreements",
      activity: "Recent activity",
      newContract: "New fee agreement",
      allContracts: "All agreements",
      empty: "No agreements yet."
    },
    contracts: {
      title: "E-contracts",
      sub: "Fee agreements with clients: create them, send them for e-signature and keep a signed copy.",
      new: "New agreement",
      search: "Search by client name or agreement number",
      filters: { all: "All", draft: "Drafts", sent: "Awaiting signature", signed: "Signed" },
      cols: { no: "Agreement no.", client: "Client", matter: "Matter", fees: "Fees", status: "Status", date: "Last update" },
      empty: "No matching agreements.",
      viewOnly: "Your access: view only."
    },
    form: {
      titleNew: "New fee agreement",
      titleEdit: "Edit draft",
      client: "Client details (second party)",
      clientName: "Client or organisation name",
      idType: "ID type",
      idTypes: { id: "National ID", iqama: "Iqama", cr: "Commercial registration / unified no." },
      idNumber: "ID or registration number",
      repName: "Representative's name",
      repCapacity: "Capacity",
      repCapacityPh: "e.g. Owner of the establishment, or General Manager",
      phone: "Mobile number",
      email: "Email",
      address: "Address",
      optional: "(optional)",
      matter: "Subject of the agreement",
      area: "Area",
      areaOther: "Other",
      matterTitle: "Matter title",
      matterTitlePh: "e.g. Representation in a labour claim",
      scope: "Scope of work",
      scopePh: "e.g. Studying the case, preparing the pleadings and representing the client before the Labour Court until the first-instance judgment.",
      fees: "Fees and payment",
      amount: "Fee amount (SAR)",
      vat: "VAT",
      vats: { excl: "Excluded (15% added)", incl: "Included", none: "Not applicable" },
      schedule: "Payment",
      schedules: { full: "In full on signing", two: "Two payments: 50% on signing, 50% on completion", custom: "Other" },
      custom: "Payment details",
      customPh: "e.g. Three equal monthly payments",
      other: "Agreement settings",
      lawyer: "Signing for the firm",
      duration: "Term",
      durationDefault: "until the work covered by it is completed",
      durationPh: "e.g. for one year",
      durationHint: "If left empty, the agreement remains in force until the work covered by it is completed.",
      city: "City (competent court)",
      cityDefault: "Jubail",
      lang: "Agreement language",
      langs: { ar: "العربية", en: "English", both: "Arabic & English" },
      bothHint: "Write the details in Arabic in the fields marked AR, and their English text in the fields marked EN. Numbers and amounts are entered once.",
      arTag: "AR",
      terms: "Additional terms",
      termsPh: "Optional",
      total: "Total incl. VAT",
      saveDraft: "Save draft",
      preview: "Save and preview",
      cancel: "Cancel",
      saved: "Draft saved.",
      errors: {
        required: "This field is required.",
        phone: "Invalid mobile number, e.g. 0501234567.",
        email: "Invalid email address.",
        amount: "Enter a valid amount.",
        englishToo: "Add the English text for this field too.",
        arabicToo: "Add the Arabic text for this field too.",
        arabicOnly: "Write this field in Arabic, and its English text in the EN field.",
        englishOnly: "Write this field in English."
      }
    },
    detail: {
      back: "Back to agreements",
      actions: "Actions",
      send: "Approve and send to client",
      resend: "Signing link",
      edit: "Edit",
      print: "Print / save as PDF",
      delete: "Delete draft",
      deleteConfirm: "Delete this draft permanently?",
      deleted: "Draft deleted.",
      timeline: "Agreement history",
      fingerprint: "Digital fingerprint",
      fingerprintNote: "Calculated on approval; it changes if a single character of the agreement is altered afterwards.",
      signedCopy: "The signed copy is kept here and can be printed or saved as PDF at any time.",
      draftNote: "Draft: review it, then approve and send it to the client. Once approved it can no longer be edited.",
      sentNote: "Sent to the client and awaiting signature.",
      openAsClient: "Open the client page",
      notFound: "Agreement not found."
    },
    send: {
      title: "Send the agreement for signature",
      text: "Send this link to the client to read the agreement and sign it electronically from their phone.",
      link: "Signing link",
      copy: "Copy link",
      copied: "Link copied.",
      whatsapp: "WhatsApp",
      email: "Email",
      open: "Try the client page",
      demoNote: "The link carries a copy of the agreement, so it opens on any phone. After signing, the client sends a confirmation that brings the agreement back to this portal as signed; in the final version this happens automatically.",
      close: "Close",
      subject: "Fee agreement no. {no}",
      message: "Dear {client}, please find fee agreement no. {no} from Khalid Allewa Lawyers and Consultants for your review and e-signature: {link}"
    },
    users: {
      title: "Users & permissions",
      sub: "Each employee sees only the sections their role allows. Try “View as” at the top to see the difference.",
      team: "Team",
      role: "Role",
      matrix: "Permissions by role",
      perm: "Permission",
      perms: {
        overview: "Overview",
        contractsView: "View contracts",
        contractsCreate: "Create contracts",
        contractsSend: "Approve and send contracts",
        contractsDelete: "Delete drafts",
        cases: "Cases",
        appointments: "Appointments",
        clients: "Clients",
        documents: "Documents",
        invoices: "Invoices",
        users: "Manage users"
      },
      note: "In the final version the administrator sets each employee's role, and every employee signs in with their own account.",
      reset: "Reset demo data",
      resetConfirm: "Remove everything you added and restore the original demo agreements?",
      resetDone: "Demo data restored."
    },
    modules: {
      soonTitle: "In development",
      soonText: "This section is part of phase 2. Highlights:",
      cases: { title: "Cases", items: ["A file per case: parties, court and case number", "Hearings and deadlines with reminders", "Links to the client, fee agreement and documents", "Assigning cases to lawyers and tracking progress"] },
      appointments: { title: "Appointments", items: ["A calendar of consultations and hearings for each lawyer", "Booking requests from the website", "A reminder message to the client before the appointment"] },
      clients: { title: "Clients", items: ["One record per client: details, cases and contracts", "Contact history and notes", "Data protected by permissions"] },
      documents: { title: "Documents", items: ["Upload and file documents by case", "Access permissions per document", "Secure sharing with the client"] },
      invoices: { title: "Invoices", items: ["Invoices linked to fee agreements and payments", "Tracking paid and outstanding amounts", "E-invoicing in line with ZATCA requirements"] }
    },
    receive: {
      done: "The client's signature has arrived; the agreement is now signed.",
      already: "This agreement was already signed.",
      errorTitle: "Invalid confirmation link",
      error: "The confirmation link could not be read. Make sure it was opened in full, exactly as received."
    },
    denied: {
      title: "No access",
      text: "This section is not available to the “{role}” role. Change the role in “View as” to try other permissions."
    },
    sample: "demo",
    money: "SAR {n}"
  };

  en.sign = {
    title: "Sign the fee agreement",
    hello: "Hello {client}",
    intro: "Khalid Allewa Lawyers and Consultants has sent you the fee agreement below. Please read it carefully, then sign it electronically at the bottom of the page.",
    notFound: "Invalid link",
    notFoundText: "Make sure the link was opened in full, exactly as you received it, or ask the firm to send a new one.",
    notReady: "This agreement has not been approved for signature yet.",
    signTitle: "Electronic signature",
    fullName: "Full name as on your ID",
    consent: "I have read the whole agreement, accept all its terms, and acknowledge that my electronic signature binds me.",
    draw: "Draw your signature",
    type: "Type your signature",
    clear: "Clear",
    drawHint: "Sign with your finger or mouse inside the box",
    typedHint: "Your typed name above will be used as your signature.",
    sign: "Sign the agreement",
    otpTitle: "Verification code",
    otpText: "We sent a verification code to your mobile ending in {last}.",
    otpDemo: "Demo: the code is 1234.",
    otpLabel: "Verification code",
    confirm: "Confirm signature",
    back: "Back",
    errors: {
      name: "Enter your full name.",
      consent: "You must accept the terms of the agreement.",
      signature: "Add your signature.",
      otp: "Incorrect code."
    },
    doneTitle: "Signed successfully",
    doneText: "Thank you. The signed copy has been kept by the firm, and you can save your copy now.",
    signedTitle: "This agreement is signed",
    download: "Save my copy (PDF)",
    return: {
      title: "Send the confirmation to the firm",
      text: "In the final version your signature reaches the firm automatically. In this demo, send this confirmation to the firm so the agreement shows as signed in its portal.",
      whatsapp: "Send confirmation on WhatsApp",
      copy: "Copy confirmation link",
      copied: "Confirmation link copied.",
      message: "Fee agreement no. {no} has been signed. Confirmation link: {link}"
    },
    toSite: "Visit the firm's website"
  };

  // Agreement text. Words in { } are filled in from the agreement's details.
  en.contract = {
    title: "Legal Fee Agreement",
    no: "Agreement no.",
    date: "Created on",
    demoMark: "Demo template — not valid for use",
    partyA: "First party",
    partyB: "Second party (client)",
    firmName: "Khalid Allewa Lawyers and Consultants",
    firmRep: "Represented by: {lawyer}, {role}",
    clientRep: "Represented by: {rep}, {capacity}",
    firmLicence: "Ministry of Justice licence no.: {licence}",
    firmCity: "Jubail, Kingdom of Saudi Arabia",
    labels: { phone: "Mobile", email: "Email", address: "Address" },
    idLabels: { id: "National ID no.", iqama: "Iqama no.", cr: "CR / unified no." },
    preamble: "Whereas the second party wishes to engage the services of the first party for “{matter}”, and whereas the first party is a licensed law firm, the two parties, each having full legal capacity, have agreed as follows:",
    clauses: [
      { h: "Effect of the preamble", p: "The above preamble forms an integral part of this agreement." },
      { h: "Subject and scope of work", p: "The first party shall provide legal services in connection with “{matter}”{area}, including: {scope}" },
      { h: "Fees", p: "The second party shall pay the first party fees of {fees}, {schedule}" },
      { h: "Expenses", p: "Court fees and actual expenses needed for the work, such as official fees, translation and expert fees, are borne by the second party and are not included in the fees unless otherwise agreed in writing." },
      { h: "Obligations of the first party", p: "The first party shall:", items: ["Exercise due professional care in performing the work in accordance with the law and the lawyers' Code of Professional Conduct.", "Keep the second party informed of developments in the work."], note: "The first party's obligation is one of means, not of result." },
      { h: "Obligations of the second party", p: "The second party shall:", items: ["Provide the first party with accurate and complete information and documents in good time.", "Issue the power of attorney the first party needs to carry out the work.", "Pay the fees when due."] },
      { h: "Term and termination", p: "This agreement shall take effect on the date of its signature and shall remain in force {duration}. Either party may terminate it by written notice, in which case the first party shall be entitled to fees for the work completed up to the date of termination." },
      { h: "Confidentiality and data protection", p: "The first party shall treat the second party's data and documents in strict confidence under the lawyers' Code of Professional Conduct and the Personal Data Protection Law, and disclose them only with the second party's consent or where the law requires." },
      { h: "Electronic signature", p: "The parties acknowledge that the electronic approval and signature of this agreement are binding on them and have full legal effect under the Electronic Transactions Law of the Kingdom of Saudi Arabia." },
      { id: "law", h: "Governing law and jurisdiction", p: "This agreement shall be governed by the laws of the Kingdom of Saudi Arabia, and the competent courts in {city} shall have jurisdiction over any dispute arising from it." }
    ],
    extraTerms: "Additional terms",
    // the area of work as written in Article 2 ("Other" names no area)
    areaPhrase: " in the field of {name}",
    areas: { commercial: "commercial law", labor: "labour law", realestate: "real estate", family: "personal status law", criminal: "criminal law", arbitration: "arbitration and dispute resolution" },
    // heading of each article: "Article 1: Preamble"
    article: "Article {n}: {h}",
    // bilingual agreements only
    language: { h: "Language", p: "This agreement has been executed in Arabic and English. In case of any discrepancy between the two texts, the Arabic text shall prevail." },
    bi: { parties: "The parties", preamble: "Preamble", fees: "Fees summary" },
    copies: { h: "Copies", p: "This agreement has been executed electronically. A signed copy is kept by the first party, and the second party receives its copy upon signing." },
    fees: {
      excl: "SAR {amount}, plus VAT (15%) of SAR {vat}, making a total of SAR {total}",
      incl: "SAR {total} including VAT",
      none: "SAR {amount}"
    },
    schedule: {
      full: "and the total amount is payable in full on signing this agreement.",
      two: "and the total amount is payable in two instalments: 50% on signing this agreement and 50% on completion of the work.",
      custom: "and the total amount is payable as follows: {custom}."
    },
    table: { fees: "Fees", vat: "VAT (15%)", total: "Total", schedule: "Payment", money: "SAR {n}" },
    signatures: "Signatures",
    approved: "Approved electronically",
    pending: "Awaiting client signature",
    signedAt: "Signed on",
    method: { drawn: "Handwritten on screen, with a verification code", typed: "Typed signature, with a verification code" },
    fingerprint: "Document fingerprint (SHA-256)",
    footer: "This agreement was prepared electronically through the Khalid Allewa Lawyers and Consultants portal."
  };
})();
