export interface CompetencyCard {
  id: string;
  title: string;
  iconKey:
    | 'file-spreadsheet'
    | 'shield-check'
    | 'brain-circuit'
    | 'database'
    | 'table-2'
    | 'headset'
    | 'code-2'
    | 'bar-chart-3'
    | 'settings'
    | 'cloud';
  accentColor: string;
  summary: string;
  tools: string[];
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  shortSummary: string;
  iconKey: 'briefcase' | 'headset' | 'code-2' | 'wrench';
  bullets: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface CertificationItem {
  issuer: string;
  title: string;
}

export const PROFILE = {
  initials: 'GK',
  firstName: 'Gilbert Kariithi',
  lastName: 'Ihugo',
  fullName: 'Gilbert Kariithi Ihugo',
  tagline: 'Data & Tech Specialist',
  eyebrow: 'DATA • TECHNOLOGY • INNOVATION',
  roleTitle: 'Data Entry & Data Support Specialist',
  heroSummary:
    'Detail-oriented professional with experience in data entry, data management, AI training and web development.',
  fullSummary:
    'Detail-oriented Data Entry and Data Support Specialist with hands-on experience in data entry, data cleaning and validation, records management, database support, customer information management, documentation, and remote client support. Skilled in Microsoft Excel, Word, PowerPoint, Google Sheets, CRM and database platforms, ticketing systems, and AI tools. Proven ability to follow SOPs, protect confidential information, identify data inconsistencies, maintain accurate records, and deliver work independently across time zones. Also experienced in ICT technical support, AI data annotation and model testing, and web/UI/UX development. Native Swahili speaker with fluent professional English, offering strong potential for data operations, AI training, localization, and remote support roles.',
  location: 'Nairobi, Kenya',
  availability: 'Open to Remote Work (Global)',
  email: 'scanointgilbert7076@gmail.com',
  phone: '+254 746 750 677',
  portraitUrl: '/assets/gilbert-portrait.png',
  avatarUrl: '/assets/gilbert-avatar.png',
};

export const COMPETENCY_CARDS: CompetencyCard[] = [
  {
    id: 'data-entry',
    title: 'Data Entry & Processing',
    iconKey: 'file-spreadsheet',
    accentColor: '#10B981',
    summary:
      'High-accuracy day-to-day entry, formatting, and structured record maintenance across spreadsheets and databases.',
    tools: ['Microsoft Excel', 'Google Sheets', 'Microsoft Word', 'Document Processing'],
    highlights: [
      'Structured entry across spreadsheets and small client databases',
      'Consistent formatting and adherence to client-specific SOPs',
      'Confidential record handling across international projects',
    ],
  },
  {
    id: 'data-cleaning',
    title: 'Data Cleaning & Validation',
    iconKey: 'shield-check',
    accentColor: '#10B981',
    summary:
      'Thorough source data auditing for errors, duplicates, inconsistencies, and missing values prior to final delivery.',
    tools: ['Data Validation', 'Quality Checking', 'Excel Formulas', 'SOP Compliance'],
    highlights: [
      'Identifies missing fields and formatting anomalies early',
      'Reduces avoidable rework through pre-submission audits',
      'Maintains reliable, audit-ready master datasets',
    ],
  },
  {
    id: 'ai-annotation',
    title: 'AI Data Annotation & Training',
    iconKey: 'brain-circuit',
    accentColor: '#8B5CF6',
    summary:
      'Data labeling, model testing, response evaluation, and Swahili/English localization workflows for AI systems.',
    tools: ['Claude', 'Kimi', 'Code', 'Micro1', 'Model Evaluation'],
    highlights: [
      'AI model testing, output evaluation, and quality rubric checks',
      'Structured data annotation and prompt/response verification',
      'Native Swahili & fluent English localization readiness',
    ],
  },
  {
    id: 'database-records',
    title: 'Database & Records Management',
    iconKey: 'database',
    accentColor: '#0EA5E9',
    summary:
      'Organized digital filing architectures, service logs, and database support enabling rapid retrieval and continuity.',
    tools: ['Database Support', 'Folder Architecture', 'Equipment Inventories', 'Service Logs'],
    highlights: [
      'Designs clean folder and naming conventions for fast retrieval',
      'Maintains end-to-end service histories and technical logs',
      'Protects sensitive client documentation under strict privacy protocols',
    ],
  },
  {
    id: 'excel-sheets',
    title: 'Microsoft Excel & Google Sheets',
    iconKey: 'table-2',
    accentColor: '#06B6D4',
    summary:
      'Spreadsheet organization, cleanup, tabular reporting, and operational tracking for remote teams and overseas clients.',
    tools: ['Microsoft Excel', 'Google Sheets', 'Microsoft PowerPoint', 'Reporting'],
    highlights: [
      'Cross-platform spreadsheet workflows for international teams',
      'Clean formatting, data normalization, and structured reporting',
      'Document processing and executive-ready presentation support',
    ],
  },
  {
    id: 'ict-support',
    title: 'ICT Support & Customer Service',
    iconKey: 'headset',
    accentColor: '#3B82F6',
    summary:
      'Frontline customer engagement, technical diagnostics, ticket tracking, and standardized incident documentation.',
    tools: ['Ticketing Systems', 'Diagnostics', 'Service Records', 'SOP Workflows'],
    highlights: [
      'Diagnosed client technical issues and tracked tickets to resolution',
      'Standardized report-recording to surface recurring technical issues',
      'Balanced speed, accuracy, and service quality under steady volume',
    ],
  },
  {
    id: 'web-uiux',
    title: 'Web Development & UI/UX Design',
    iconKey: 'code-2',
    accentColor: '#0EA5E9',
    summary:
      'Translating product and client requirements into structured, accessible, user-centered web interfaces.',
    tools: ['Web Development', 'UI/UX Design', 'System Development', 'AutoCAD 2D/3D'],
    highlights: [
      'Designs and develops modern responsive web interfaces',
      'Combines technical documentation with clean visual hierarchy',
      'Quality-checked deliverables built for real user workflows',
    ],
  },
  {
    id: 'data-reporting',
    title: 'Data Analysis & Reporting',
    iconKey: 'bar-chart-3',
    accentColor: '#38BDF8',
    summary:
      'Summarizing operational metrics, recurring service patterns, and task progress into clear, actionable reports.',
    tools: ['Reporting', 'Quality Metrics', 'Spreadsheets', 'Inspection Logs'],
    highlights: [
      'Tracks recurring issues across technical service jobs',
      'Prepares clear status updates and turnaround summaries',
      'Ensures high numerical and factual precision in deliverables',
    ],
  },
  {
    id: 'crm-data',
    title: 'CRM & Data Management',
    iconKey: 'settings',
    accentColor: '#3B82F6',
    summary:
      'Accurate customer account updates, interaction notes, and database hygiene during and after client engagements.',
    tools: ['CRM Platforms', 'Customer Records', 'Interaction Logging', 'Data Hygiene'],
    highlights: [
      'Updates customer accounts accurately in real-time and post-call',
      'Follows strict data-entry standards to prevent record drift',
      'Maintains reliable, consistent customer profiles across shifts',
    ],
  },
  {
    id: 'remote-collab',
    title: 'Remote Collaboration & Communication',
    iconKey: 'cloud',
    accentColor: '#06B6D4',
    summary:
      'Proactive async and synchronous client communication, priority alignment, and independent delivery across time zones.',
    tools: ['Multi-Time Zone Coordination', 'Email Systems', 'Swahili (Native)', 'English (Fluent)'],
    highlights: [
      'Proactive updates on task progress, priorities, and turnaround times',
      'Proven track record delivering independently for overseas clients',
      'Strong time management and cross-cultural communication',
    ],
  },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'freelance-data',
    role: 'Freelance Data Entry & Data Support Specialist',
    organization: 'International Clients',
    location: 'Remote',
    period: 'Jul 2024 – Present',
    shortSummary: 'Data entry, cleanup, and record management for overseas clients.',
    iconKey: 'briefcase',
    bullets: [
      'Perform day-to-day data entry, data cleanup, formatting, and record maintenance across spreadsheets and small databases for overseas clients.',
      'Review source data for errors, inconsistencies, and missing information before final submission, improving record accuracy and reducing avoidable rework.',
      'Maintain confidential client records and communications while following client-specific data-handling procedures and SOPs.',
      'Organize digital files and folder structures to improve document retrieval, consistency, and workflow efficiency.',
      'Communicate proactively with clients regarding task progress, priorities, and turnaround times while coordinating across multiple time zones.',
    ],
  },
  {
    id: 'customer-support-cci',
    role: 'Customer Support Agent',
    organization: 'CCI',
    location: 'Remote',
    period: 'Apr 2023 – Mar 2025',
    shortSummary: 'Customer account updates and support.',
    iconKey: 'headset',
    bullets: [
      'Accurately updated customer account information and interaction notes during and after customer engagements.',
      'Followed established data-entry procedures to maintain consistent, reliable customer database records.',
      'Balanced speed, accuracy, service quality, and documentation requirements while handling a steady volume of customer interactions.',
    ],
  },
  {
    id: 'uiux-web-freelancer',
    role: 'UI/UX & Web Development Freelancer',
    organization: 'Self-Employed',
    location: 'Remote',
    period: '2022 – Present',
    shortSummary: 'Design and develop modern web interfaces.',
    iconKey: 'code-2',
    bullets: [
      'Design and develop web interfaces and digital solutions while translating requirements into structured, user-focused experiences.',
      'Apply problem-solving, documentation, and quality-checking skills across independent projects and client requirements.',
    ],
  },
  {
    id: 'ict-technician',
    role: 'ICT Technician & Technical Support',
    organization: 'Computer Ways Limited',
    location: 'Nairobi',
    period: 'May 2020 – Oct 2021',
    shortSummary: 'Technical support, service records and ICT solutions.',
    iconKey: 'wrench',
    bullets: [
      'Logged and maintained service records, equipment inventories, job reports, and technical documentation as part of daily ICT support operations.',
      'Documented inspections and service histories clearly, enabling effective record retrieval and continuity across support activities.',
      'Standardized report-recording practices to improve tracking of recurring technical issues across service jobs.',
      'Diagnosed client technical issues, tracked support tickets, and documented solutions to support timely resolution and follow-up.',
    ],
  },
];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    degree: 'Diploma in Information Technology',
    institution: 'Nairobi Institute of Business Studies',
    year: '2025',
  },
  {
    degree: 'Certificate in ICT',
    institution: 'National Industrial Training Authority',
    year: '2021',
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  { issuer: 'HP LIFE', title: 'AI for Business Professionals' },
  { issuer: 'HP LIFE', title: 'AI for Beginners' },
  { issuer: 'IBM', title: 'Technical Support' },
];

export const TECHNICAL_SKILL_GROUPS = [
  {
    category: 'Data & Documentation',
    items: [
      'Data entry',
      'Data cleaning and validation',
      'Data annotation',
      'Document processing',
      'Records management',
      'Reporting',
    ],
  },
  {
    category: 'Productivity & Systems',
    items: [
      'Microsoft Excel',
      'Microsoft Word',
      'Microsoft PowerPoint',
      'Google Sheets',
      'CRM & database platforms',
      'Email & ticketing systems',
    ],
  },
  {
    category: 'AI Training & Testing',
    items: [
      'AI data annotation',
      'AI model testing and evaluation',
      'Claude',
      'Kimi',
      'Code',
      'Micro1',
    ],
  },
  {
    category: 'Design & Development',
    items: [
      'Web development',
      'UI/UX design',
      'System development',
      'Graphic design',
      'AutoCAD 2D/3D',
    ],
  },
];

export const ALL_CORE_COMPETENCIES = [
  'Data Entry & Data Processing',
  'Data Cleaning & Validation',
  'Data Annotation & AI Training',
  'Database & Records Management',
  'Microsoft Excel & Google Sheets',
  'CRM & Customer Data',
  'Quality Checking & Accuracy',
  'Document Processing & Reporting',
  'SOP & Process Compliance',
  'Confidential Data Handling',
  'ICT & Technical Support',
  'Remote Client Communication',
  'Ticketing & Service Records',
  'AI Model Testing & Evaluation',
  'Web & UI/UX Development',
];

export const CIRCLE_TOPICS = [
  {
    id: 'data-support',
    label: 'Data Support',
    detail: 'Peer collaboration on data hygiene, spreadsheet standardization, and SOP governance.',
  },
  {
    id: 'ai-training',
    label: 'AI Training',
    detail: 'Data annotation rubrics, model evaluation workflows, and Swahili/English localization.',
  },
  {
    id: 'web-development',
    label: 'Web Development',
    detail: 'Modern responsive UI/UX systems, front-end architecture, and technical documentation.',
  },
  {
    id: 'tech-support',
    label: 'Tech Support',
    detail: 'ICT diagnostics, ticket resolution workflows, and equipment lifecycle tracking.',
  },
];

export const TARGET_ROLES = [
  'Data Entry Specialist',
  'Data Support Specialist',
  'Data Operations Assistant',
  'Data Quality Analyst (Junior)',
  'AI Data Annotator',
  'AI Training / Data Labeling Specialist',
  'Customer Data Specialist',
  'Technical Support',
  'Remote Operations Support',
];
