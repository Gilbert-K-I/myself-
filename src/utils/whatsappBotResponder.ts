import {
  ALL_CORE_COMPETENCIES,
  CERTIFICATIONS,
  EDUCATION_ITEMS,
  EXPERIENCE_ITEMS,
  PROFILE,
  TARGET_ROLES,
  TECHNICAL_SKILL_GROUPS,
} from '../data/portfolioData.ts';

export function buildWhatsAppUrl(prefillText?: string): string {
  const digits = PROFILE.phone.replace(/[^\d]/g, '');
  const base = `https://wa.me/${digits}`;
  if (!prefillText || !prefillText.trim()) return base;
  return `${base}?text=${encodeURIComponent(prefillText.trim())}`;
}

export function generatePortfolioBotReply(userInput: string): string {
  const q = userInput.toLowerCase().trim();

  if (!q) {
    return `Hello! I'm Gilbert Kariithi Ihugo's WhatsApp assistant (${PROFILE.phone}). Ask me about his data support services, AI annotation experience, web/UI/UX skills, certifications, or availability.`;
  }

  if (
    /^(hi|hello|hey|habari|jambo|good\s*(morning|afternoon|evening)|greetings)\b/.test(q)
  ) {
    return `Hello! Welcome to Gilbert Kariithi Ihugo's portfolio assistant. Gilbert is a ${PROFILE.roleTitle} based in ${PROFILE.location} (${PROFILE.availability}).\n\nHow can I help today? You can ask about his skills, experience, certifications, or start a direct WhatsApp message to ${PROFILE.phone}.`;
  }

  if (q.includes('whatsapp') || q.includes('phone') || q.includes('call') || q.includes('number') || q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('hire')) {
    return `You can reach Gilbert directly through:\n• WhatsApp / Phone: ${PROFILE.phone}\n• Email: ${PROFILE.email}\n• Location: ${PROFILE.location} (${PROFILE.availability})\n\nTap "Continue on WhatsApp" below to open a direct WhatsApp chat with ${PROFILE.phone}.`;
  }

  if (q.includes('availab') || q.includes('remote') || q.includes('time zone') || q.includes('timezone') || q.includes('location') || q.includes('nairobi') || q.includes('kenya')) {
    return `Gilbert is based in ${PROFILE.location} and is fully open to global remote work across multiple time zones.\n\nHe has hands-on experience coordinating proactively with overseas clients on task progress, priorities, and turnaround times in both independent and team settings.`;
  }

  if (q.includes('ai') || q.includes('annotat') || q.includes('claude') || q.includes('kimi') || q.includes('micro1') || q.includes('model') || q.includes('label') || q.includes('train')) {
    return `Gilbert has hands-on experience in AI Data Annotation, model testing, and output evaluation using tools including Claude, Kimi, Code, and Micro1.\n\nHe also holds HP LIFE certifications in "AI for Business Professionals" and "AI for Beginners", plus native Swahili and fluent English proficiency for localization and evaluation tasks.`;
  }

  if (q.includes('data') || q.includes('excel') || q.includes('sheet') || q.includes('crm') || q.includes('entry') || q.includes('clean') || q.includes('record') || q.includes('sop')) {
    return `Data & Operations Core Services:\n• Data Entry & Processing (spreadsheets & databases)\n• Data Cleaning, Validation & Quality Checking\n• CRM & Customer Account Management\n• Digital Filing, SOP Compliance & Confidential Records\n\nTools: Microsoft Excel, Word, PowerPoint, Google Sheets, CRM platforms, and ticketing systems.`;
  }

  if (q.includes('web') || q.includes('ui') || q.includes('ux') || q.includes('design') || q.includes('autocad') || q.includes('develop')) {
    return `Since 2022, Gilbert has worked as a UI/UX & Web Development Freelancer, designing and developing modern, user-focused web interfaces and digital solutions.\n\nDesign & Technical tools include Web Development, UI/UX Design, System Development, Graphic Design, and AutoCAD 2D/3D.`;
  }

  if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('cv') || q.includes('resume') || q.includes('career') || q.includes('history')) {
    const summaryLines = EXPERIENCE_ITEMS.map(
      (exp) => `• ${exp.role} — ${exp.organization} (${exp.period})`
    ).join('\n');
    return `Gilbert's Professional Journey:\n${summaryLines}\n\nYou can also view his full CV from the CV button in the top navigation bar or ask about any specific role.`;
  }

  if (q.includes('educat') || q.includes('diploma') || q.includes('cert') || q.includes('ibm') || q.includes('hp') || q.includes('nibs') || q.includes('nita') || q.includes('qualif')) {
    const edu = EDUCATION_ITEMS.map((e) => `• ${e.degree} — ${e.institution} (${e.year})`).join('\n');
    const certs = CERTIFICATIONS.map((c) => `• ${c.issuer} — ${c.title}`).join('\n');
    return `Education:\n${edu}\n\nCertifications:\n${certs}`;
  }

  if (q.includes('skill') || q.includes('tool') || q.includes('service') || q.includes('competenc') || q.includes('offer')) {
    const groups = TECHNICAL_SKILL_GROUPS.map(
      (g) => `• ${g.category}: ${g.items.join(', ')}`
    ).join('\n');
    return `Gilbert's Key Skills & Tools:\n${groups}\n\nHe aligns strongly with roles such as ${TARGET_ROLES.slice(0, 5).join(', ')}, and Remote Operations Support.`;
  }

  if (q.includes('language') || q.includes('swahili') || q.includes('english')) {
    return `Languages:\n• Swahili — Native proficiency\n• English — Fluent, Professional Working Proficiency\n\nThis makes Gilbert well suited for international remote support, documentation, and AI localization projects.`;
  }

  if (q.includes('ict') || q.includes('tech support') || q.includes('ticket') || q.includes('computer ways')) {
    return `At Computer Ways Limited (Nairobi, May 2020 – Oct 2021), Gilbert served as an ICT Technician & Technical Support specialist — diagnosing client technical issues, tracking support tickets, maintaining equipment inventories, and standardizing service reports.\n\nHe also holds an IBM Technical Support certification and a Certificate in ICT from NITA.`;
  }

  if (q.includes('rate') || q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('budget')) {
    return `Project rates and engagement terms depend on scope, volume, and turnaround schedule. Please share your project brief directly with Gilbert on WhatsApp (${PROFILE.phone}) or email (${PROFILE.email}) for a tailored quote.`;
  }

  return `Thanks for your message! Gilbert Kariithi Ihugo specializes in:\n• ${ALL_CORE_COMPETENCIES.slice(0, 5).join('\n• ')}\n\nFor a direct response from Gilbert, message him on WhatsApp at ${PROFILE.phone} or email ${PROFILE.email}.`;
}
