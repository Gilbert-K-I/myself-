export interface SampleTableData {
  kind: 'table';
  columns: string[];
  rows: string[][];
}

export interface SampleChecklistData {
  kind: 'checklist';
  sections: {
    heading: string;
    items: string[];
  }[];
}

export interface SampleSpecData {
  kind: 'spec';
  blocks: {
    label: string;
    detail: string;
  }[];
}

export type SamplePreview = SampleTableData | SampleChecklistData | SampleSpecData;

export interface WorkSample {
  id: string;
  title: string;
  deliverableType: string;
  context: string;
  summary: string;
  toolsUsed: string[];
  outcome: string;
  preview: SamplePreview;
}

export const EXPERIENCE_WORK_SAMPLES: Record<string, WorkSample[]> = {
  'freelance-data': [
    {
      id: 'exp-fd-1',
      title: 'Vendor & Invoice Master Sheet Standardization',
      deliverableType: 'Spreadsheet Cleanup',
      context: 'International Clients · Remote Operations',
      summary:
        'Normalized 1,400+ multi-region vendor and invoice rows exported from raw PDFs and mixed CSVs into a single structured workbook.',
      toolsUsed: ['Microsoft Excel', 'Google Sheets', 'Data Validation'],
      outcome:
        'Eliminated duplicate vendor entries, aligned ISO date formatting (YYYY-MM-DD), and reduced client reconciliation review time.',
      preview: {
        kind: 'table',
        columns: ['Record ID', 'Raw Input Issue', 'Applied Standard', 'Verification Status'],
        rows: [
          ['INV-2041', 'Mixed date "14/08/24" & extra spaces', 'TRIM + ISO 2024-08-14', 'Verified'],
          ['INV-2042', 'Duplicate supplier "Acme Ltd." / "ACME"', 'Canonical supplier ID mapped', 'Merged'],
          ['INV-2043', 'Missing currency prefix on 38 rows', 'Explicit USD / KES column split', 'Verified'],
          ['INV-2044', 'Unformatted phone numbers', 'E.164 international format', 'Verified'],
        ],
      },
    },
    {
      id: 'exp-fd-2',
      title: 'Client Folder & SOP Naming Governance',
      deliverableType: 'Records Architecture',
      context: 'Overseas Client Document Control',
      summary:
        'Designed a consistent shared-drive folder tree and file-naming standard so remote teams locate contracts, invoices, and weekly batches without guesswork.',
      toolsUsed: ['Google Drive', 'Document Processing', 'SOP Compliance'],
      outcome:
        'Cut file search overhead across time zones and prevented accidental overwrites of signed client submissions.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Directory Structure Standard',
            items: [
              '01_Intake_Raw — Unedited client source files locked as read-only',
              '02_Working_Validation — Active cleanup sheets with dated revisions',
              '03_QA_Checked — Final audited datasets awaiting client sign-off',
              '04_Archive_Signed — Locked monthly deliverables with change log',
            ],
          },
          {
            heading: 'File Naming Rule',
            items: [
              'Pattern: [ClientCode]_[DatasetName]_[YYYY-MM-DD]_v[Number]',
              'No spaces or special characters; underscore separators only',
              'Confidential files restricted to named project stakeholders',
            ],
          },
        ],
      },
    },
    {
      id: 'exp-fd-3',
      title: 'Pre-Submission Source Data QA Log',
      deliverableType: 'Quality Audit Report',
      context: 'Weekly Overseas Client Delivery',
      summary:
        'Executed pre-delivery error checks across incoming batch spreadsheets to flag missing mandatory fields, out-of-range figures, and formatting breaks.',
      toolsUsed: ['Microsoft Excel', 'Quality Checking', 'Reporting'],
      outcome:
        'Delivered clean final batches with clear exception notes for ambiguous client source rows.',
      preview: {
        kind: 'spec',
        blocks: [
          {
            label: 'Check 01 — Completeness',
            detail: 'COUNTBLANK sweep across required ID, contact email, and billing columns prior to export.',
          },
          {
            label: 'Check 02 — Uniqueness',
            detail: 'Conditional formatting and COUNTIF duplicate scan on primary transaction keys.',
          },
          {
            label: 'Check 03 — Range & Format',
            detail: 'Verified numeric totals, decimal precision, and standardized country/region codes.',
          },
          {
            label: 'Check 04 — Exception Handoff',
            detail: 'Logged 12 unresolved source ambiguities in a separate Clarification tab with row references.',
          },
        ],
      },
    },
  ],
  'customer-support-cci': [
    {
      id: 'exp-cci-1',
      title: 'Customer Account & CRM Interaction Note Template',
      deliverableType: 'CRM Documentation',
      context: 'CCI · Remote Customer Operations',
      summary:
        'Structured interaction notes captured during and immediately after customer engagements so downstream agents had full context without re-asking.',
      toolsUsed: ['CRM Platforms', 'Data Entry', 'Ticketing Systems'],
      outcome:
        'Improved database consistency and reduced repeat verification steps on follow-up calls.',
      preview: {
        kind: 'spec',
        blocks: [
          {
            label: 'Account Verification',
            detail: 'Confirmed account ID, registered contact channel, and security verification timestamp.',
          },
          {
            label: 'Issue Summary',
            detail: 'One-sentence factual summary of customer request (e.g., billing address update & invoice resend).',
          },
          {
            label: 'CRM Fields Updated',
            detail: 'Updated postal code, preferred notification email, and linked support case reference.',
          },
          {
            label: 'Resolution & Follow-Up',
            detail: 'Confirmed customer receipt on call; marked ticket Resolved — No Escalation Required.',
          },
        ],
      },
    },
    {
      id: 'exp-cci-2',
      title: 'Customer Record Update SOP Checklist',
      deliverableType: 'Process Compliance',
      context: 'CCI · Account Maintenance',
      summary:
        'Step-by-step data-entry verification routine followed during live customer calls to protect account integrity and maintain strict SOP adherence.',
      toolsUsed: ['CRM Systems', 'SOP Compliance', 'Quality Checking'],
      outcome:
        'Balanced high ticket throughput with accurate, audit-ready customer database updates.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Pre-Edit Verification',
            items: [
              'Authenticate caller identity per two-factor account protocol',
              'Read back existing spelling and contact numbers before overwriting',
            ],
          },
          {
            heading: 'Post-Call Record Hygiene',
            items: [
              'Apply standardized disposition code matching interaction outcome',
              'Log concise, objective notes free of informal shorthand',
              'Verify no pending tasks or unclosed sub-tickets remain open',
            ],
          },
        ],
      },
    },
    {
      id: 'exp-cci-3',
      title: 'Shift Engagement & Resolution Summary Sheet',
      deliverableType: 'Operations Log',
      context: 'CCI · Daily Service Tracking',
      summary:
        'Sample shift log tracking customer interaction categories, database update accuracy, and escalation handoffs across a standard support queue.',
      toolsUsed: ['Ticketing Systems', 'Microsoft Excel', 'Reporting'],
      outcome:
        'Provided clear visibility into recurring customer inquiries and first-contact resolution trends.',
      preview: {
        kind: 'table',
        columns: ['Case Category', 'Tickets Handled', 'CRM Update Type', 'Escalations'],
        rows: [
          ['Profile & Contact Corrections', '18', 'Address / Email / Phone Sync', '0'],
          ['Billing Statement Requests', '14', 'Invoice Re-issue & Log', '1'],
          ['Service Activation Queries', '11', 'Status Verification & Note', '2'],
          ['General Account Guidance', '16', 'Interaction Summary Tagged', '0'],
        ],
      },
    },
  ],
  'uiux-web-freelancer': [
    {
      id: 'exp-web-1',
      title: 'Responsive Service Portfolio Architecture',
      deliverableType: 'UI/UX & Front-End Build',
      context: 'Self-Employed · Client Web Solution',
      summary:
        'Designed and implemented a responsive multi-section layout adapting cleanly across desktop, tablet, and mobile portrait/landscape viewports.',
      toolsUsed: ['UI/UX Design', 'Web Development', 'Responsive CSS'],
      outcome:
        'Delivered fast-loading pages with readable typographic hierarchy and clear primary contact flows.',
      preview: {
        kind: 'spec',
        blocks: [
          {
            label: 'Layout Grid',
            detail: '12-column desktop container (1320px max) collapsing cleanly to single-column mobile flow.',
          },
          {
            label: 'Interactive Navigation',
            detail: 'Single-row desktop header with mobile drawer fallback and accessible keyboard focus states.',
          },
          {
            label: 'Contact Conversion Flow',
            detail: 'Direct click-to-copy email/phone triggers paired with a validated inquiry form.',
          },
          {
            label: 'Performance & Contrast',
            detail: 'WCAG AA text contrast verified across dark and light surface modes.',
          },
        ],
      },
    },
    {
      id: 'exp-web-2',
      title: 'Operations Dashboard Wireframe & Filter Spec',
      deliverableType: 'Interface Wireframe',
      context: 'Independent Client Project',
      summary:
        'Translated client operational tracking needs into a structured dashboard specification separating summary metrics, searchable tables, and detail drawers.',
      toolsUsed: ['UI/UX Design', 'System Development', 'Documentation'],
      outcome:
        'Aligned stakeholders on screen hierarchy and field requirements before production coding began.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Screen Architecture',
            items: [
              'Top filter toolbar: date range, category selector, and instant keyword search',
              'Primary tabular register using aligned monospace figures for totals',
              'Slide-over detail drawer for inspecting or editing single records without losing scroll position',
            ],
          },
          {
            heading: 'Usability Safeguards',
            items: [
              'Explicit empty-state guidance when search filters return zero rows',
              'Clear confirmation feedback on save and export actions',
            ],
          },
        ],
      },
    },
    {
      id: 'exp-web-3',
      title: 'Cross-Device & Orientation QA Matrix',
      deliverableType: 'Web Quality Audit',
      context: 'Pre-Launch Client Sign-Off',
      summary:
        'Structured browser and device verification sheet run prior to handing over client web deliverables.',
      toolsUsed: ['Web Development', 'Quality Checking', 'Browser DevTools'],
      outcome:
        'Caught and resolved overflow, modal clipping in mobile landscape, and tap-target spacing issues pre-launch.',
      preview: {
        kind: 'table',
        columns: ['Viewport / Mode', 'Screen Size', 'Focus Area Checked', 'Result'],
        rows: [
          ['Mobile Portrait', '390 × 844', 'Header fit, touch targets ≥ 44px, zero horizontal scroll', 'Passed'],
          ['Mobile Landscape', '844 × 390', 'Modal max-height scroll & keyboard input visibility', 'Passed'],
          ['Tablet', '768 × 1024', '2-column card grid balance & drawer width', 'Passed'],
          ['Desktop Wide', '1440 × 900', '12-col split alignment & contrast legibility', 'Passed'],
        ],
      },
    },
  ],
  'ict-technician': [
    {
      id: 'exp-ict-1',
      title: 'Standardized Hardware Inspection & Job Sheet',
      deliverableType: 'Service Record Form',
      context: 'Computer Ways Limited · Nairobi',
      summary:
        'Standardized job-card format capturing asset serial numbers, diagnostic findings, replaced components, and post-repair test verification.',
      toolsUsed: ['ICT Diagnostics', 'Service Records', 'Microsoft Word'],
      outcome:
        'Improved service history continuity so any technician could review past repairs in seconds.',
      preview: {
        kind: 'spec',
        blocks: [
          {
            label: 'Asset Identification',
            detail: 'Device type, manufacturer, model, serial number, and client department tag.',
          },
          {
            label: 'Reported Fault & Diagnosis',
            detail: 'Observed symptom (e.g., intermittent power / thermal shutdown) and root component test result.',
          },
          {
            label: 'Corrective Action',
            detail: 'Cleaned cooling assembly, replaced faulty SSD, restored OS image, and verified BIOS health.',
          },
          {
            label: 'Sign-Off & Warranty Log',
            detail: '24-hour burn-in pass logged with technician initials and client handover signature.',
          },
        ],
      },
    },
    {
      id: 'exp-ict-2',
      title: 'Client Equipment & Workstation Inventory Log',
      deliverableType: 'Asset Inventory',
      context: 'Computer Ways Limited · Daily ICT Ops',
      summary:
        'Maintained structured workstation and peripheral inventories tracking hardware specifications, service dates, and active maintenance status.',
      toolsUsed: ['Microsoft Excel', 'Records Management', 'ICT Support'],
      outcome:
        'Enabled fast warranty lookups and preventive maintenance scheduling for client offices.',
      preview: {
        kind: 'table',
        columns: ['Asset Tag', 'Device Model', 'Assigned Dept', 'Last Service Status'],
        rows: [
          ['CWL-PC-104', 'HP ProDesk 400 G6', 'Accounts', 'SSD Upgraded · Operational'],
          ['CWL-LT-218', 'Lenovo ThinkPad T14', 'Field Ops', 'Battery Replaced · Operational'],
          ['CWL-PR-039', 'Kyocera ECOSYS M2040', 'Reception', 'Roller Kit Serviced · Operational'],
          ['CWL-SW-012', 'TP-Link 24-Port Switch', 'Server Rack B', 'Port Audit Complete · Healthy'],
        ],
      },
    },
    {
      id: 'exp-ict-3',
      title: 'Recurring Technical Issue & Ticket Tracker',
      deliverableType: 'Support Escalation Log',
      context: 'Computer Ways Limited · Nairobi',
      summary:
        'Standardized incident categorization across support tickets to surface recurring network, printer, and workstation faults.',
      toolsUsed: ['Ticketing Systems', 'Reporting', 'Technical Support'],
      outcome:
        'Reduced repeat site visits by documenting root fixes and preventive steps per fault category.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Standard Incident Codes',
            items: [
              'HW-PWR: Power supply, UPS battery, or adapter faults',
              'NET-LAN: Switch port, RJ45 termination, or DHCP lease drops',
              'OS-PERF: Drive health degradation, driver conflicts, or startup bloat',
              'PER-PRT: Shared network printer spooler or driver mismatches',
            ],
          },
          {
            heading: 'Closure Requirements',
            items: [
              'Record root cause rather than symptom alone',
              'Attach resolution confirmation before closing ticket',
            ],
          },
        ],
      },
    },
  ],
};

export const SKILL_WORK_SAMPLES: Record<string, WorkSample[]> = {
  'data-entry': [
    {
      id: 'sk-de-1',
      title: 'Multi-Source Supplier Directory Digitization',
      deliverableType: 'Structured Data Entry',
      context: 'Data Entry & Processing',
      summary:
        'Transcribed scanned supplier forms and PDF invoices into a uniform spreadsheet schema with strict field formatting.',
      toolsUsed: ['Microsoft Excel', 'Document Processing', 'Accuracy Checks'],
      outcome: '100% key-field completeness across 850 supplier records.',
      preview: {
        kind: 'table',
        columns: ['Supplier Code', 'Company Name', 'Category', 'Payment Term'],
        rows: [
          ['SUP-001', 'Rift Valley Logistics Ltd', 'Freight & Couriers', 'Net 30'],
          ['SUP-002', 'Highland Paper & Print', 'Office Supplies', 'Net 15'],
          ['SUP-003', 'Savannah Cloud Hosting', 'IT Services', 'Net 30'],
        ],
      },
    },
    {
      id: 'sk-de-2',
      title: 'Monthly Expense & Receipt Ledger Entry',
      deliverableType: 'Ledger Processing',
      context: 'Data Entry & Processing',
      summary:
        'Entered itemized receipts into categorized accounting templates with tax splits, receipt IDs, and date-sorted references.',
      toolsUsed: ['Google Sheets', 'Microsoft Excel', 'SOP Compliance'],
      outcome: 'Ready-to-reconcile monthly expense schedule with zero unlinked receipts.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Date & Reference', detail: 'Standardized ISO transaction date paired with physical/PDF receipt code.' },
          { label: 'Category Mapping', detail: 'Mapped to client Chart of Accounts (Travel, Software, Utilities, Supplies).' },
          { label: 'Balance Check', detail: 'Cross-checked batch sum against bank statement subtotal before sign-off.' },
        ],
      },
    },
    {
      id: 'sk-de-3',
      title: 'Confidential Client Intake Batch Protocol',
      deliverableType: 'SOP Execution',
      context: 'Data Entry & Processing',
      summary:
        'Controlled workflow for entering sensitive customer onboarding details without local unencrypted copies.',
      toolsUsed: ['Confidential Handling', 'CRM Entry', 'Word'],
      outcome: 'Zero policy breaches across recurring weekly client batches.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Handling Controls',
            items: [
              'Work strictly within client-authorized shared workspace',
              'Verify mandatory consent and ID fields before saving record',
              'Clear temporary exports immediately after batch verification',
            ],
          },
        ],
      },
    },
  ],
  'data-cleaning': [
    {
      id: 'sk-dc-1',
      title: 'Duplicate & Fuzzy-Match Contact Deduplication',
      deliverableType: 'Dataset Audit',
      context: 'Data Cleaning & Validation',
      summary:
        'Identified and merged duplicate contacts caused by inconsistent capitalization, trailing spaces, and phone formatting.',
      toolsUsed: ['Microsoft Excel', 'TRIM / PROPER', 'COUNTIF'],
      outcome: 'Reduced mailing list bounce risk and eliminated duplicate outreach.',
      preview: {
        kind: 'table',
        columns: ['Check Type', 'Issue Detected', 'Remediation Applied'],
        rows: [
          ['Whitespace', 'Leading/trailing spaces on 114 names', 'Applied TRIM & CLEAN pass'],
          ['Case Variance', '"NAIROBI" vs "nairobi" vs "Nairobi"', 'Standardized Title Case via PROPER'],
          ['Phone Format', '0746... vs +254 746...', 'Normalized to +254 international format'],
        ],
      },
    },
    {
      id: 'sk-dc-2',
      title: 'Spreadsheet Input Validation Rulebook',
      deliverableType: 'Validation Design',
      context: 'Data Cleaning & Validation',
      summary:
        'Configured dropdown lists, date bounds, and numeric constraints in shared Google Sheets to block bad entries at intake.',
      toolsUsed: ['Google Sheets', 'Data Validation', 'Conditional Formatting'],
      outcome: 'Prevented downstream formatting breaks across multi-user remote teams.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Active Sheet Rules',
            items: [
              'Status column locked to approved enum: Pending, In Review, Verified, Archived',
              'Email column validated via custom regex check for valid @ domain syntax',
              'Conditional red highlight on any blank mandatory ID cell',
            ],
          },
        ],
      },
    },
    {
      id: 'sk-dc-3',
      title: 'Missing-Field & Outlier Pre-Delivery Sweep',
      deliverableType: 'Exception Report',
      context: 'Data Cleaning & Validation',
      summary:
        'Audited raw survey and sales exports for impossible dates, negative quantities, and orphaned foreign keys.',
      toolsUsed: ['Microsoft Excel', 'Quality Checking', 'Reporting'],
      outcome: 'Delivered clean dataset accompanied by an itemized exception log.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Outlier Scan', detail: 'Flagged 6 order quantities above 99th percentile for manual client confirmation.' },
          { label: 'Referential Integrity', detail: 'Used XLOOKUP/VLOOKUP to verify every line item matched an active product SKU.' },
          { label: 'Audit Trail', detail: 'Documented every corrected cell in a dedicated Revision_Notes worksheet.' },
        ],
      },
    },
  ],
  'ai-annotation': [
    {
      id: 'sk-ai-1',
      title: 'Swahili–English Bilingual Localization Rubric Review',
      deliverableType: 'Localization QA',
      context: 'AI Data Annotation & Training',
      summary:
        'Evaluated translated Swahili and English response pairs for natural grammar, cultural accuracy, and instruction adherence.',
      toolsUsed: ['Swahili (Native)', 'English (Fluent)', 'Evaluation Rubrics'],
      outcome: 'Improved regional phrasing naturalness and caught literal-translation errors.',
      preview: {
        kind: 'table',
        columns: ['Sample ID', 'Evaluation Dimension', 'Human Reviewer Note', 'Score'],
        rows: [
          ['LOC-101', 'Natural Swahili Idiom', 'Adjusted stiff literal verb choice to conversational phrasing', 'Pass'],
          ['LOC-102', 'Factual Preservation', 'Verified numeric dates & units preserved intact', 'Pass'],
          ['LOC-103', 'Tone & Politeness', 'Aligned formal register with customer support guideline', 'Revised'],
        ],
      },
    },
    {
      id: 'sk-ai-2',
      title: 'Structured Response Quality & Grounding Check',
      deliverableType: 'Model Evaluation Log',
      context: 'AI Data Annotation & Training',
      summary:
        'Scored model candidate outputs side-by-side against strict factual grounding, instruction-following, and formatting rubrics.',
      toolsUsed: ['Claude', 'Kimi', 'Code', 'Micro1'],
      outcome: 'Provided clear preference rationales identifying unsupported claims and missed constraints.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Human Evaluation Criteria',
            items: [
              'Constraint Check: Did the output respect length, format, and negative constraints?',
              'Factual Grounding: Are all figures and claims supported by the provided source text?',
              'Clarity & Safety: Is the response concise, neutral, and free of invented details?',
            ],
          },
        ],
      },
    },
    {
      id: 'sk-ai-3',
      title: 'Entity & Intent Tagging Consistency Guidelines',
      deliverableType: 'Annotation Taxonomy',
      context: 'AI Data Annotation & Training',
      summary:
        'Applied multi-label intent and entity tags across customer support transcripts for downstream classification datasets.',
      toolsUsed: ['Data Annotation', 'SOP Compliance', 'Quality Checking'],
      outcome: 'Maintained high inter-annotator consistency across edge-case customer messages.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Primary Intent Labels', detail: 'Billing_Inquiry, Account_Update, Tech_Troubleshooting, Service_Cancel.' },
          { label: 'Span Tagging Rule', detail: 'Tag exact account reference and product name spans without leading punctuation.' },
          { label: 'Ambiguous Case Escalation', detail: 'Multi-intent messages tagged with primary action intent + secondary context note.' },
        ],
      },
    },
  ],
  'database-records': [
    {
      id: 'sk-db-1',
      title: 'Standardized Digital Archive & Retrieval Index',
      deliverableType: 'Records Index',
      context: 'Database & Records Management',
      summary:
        'Built a searchable master index linking physical scan batches, contract IDs, and cloud storage paths.',
      toolsUsed: ['Records Management', 'Google Sheets', 'Drive Indexing'],
      outcome: 'Reduced document lookup time from minutes to a single keyword filter.',
      preview: {
        kind: 'table',
        columns: ['Archive ID', 'Document Type', 'Retention Tier', 'Storage Path'],
        rows: [
          ['ARC-2025-01', 'Signed Service Agreement', '7 Years', '/04_Archive/Contracts/2025/'],
          ['ARC-2025-02', 'Hardware Asset Transfer', '5 Years', '/04_Archive/Assets/2025/'],
          ['ARC-2025-03', 'Monthly QA Sign-Off', '3 Years', '/04_Archive/QA/2025/'],
        ],
      },
    },
    {
      id: 'sk-db-2',
      title: 'Relational Lookup Table Normalization',
      deliverableType: 'Database Support',
      context: 'Database & Records Management',
      summary:
        'Separated flat repeating customer and order data into clean linked tables using unique Client_ID and Order_ID keys.',
      toolsUsed: ['Database Support', 'Microsoft Excel', 'Key Mapping'],
      outcome: 'Eliminated contradictory customer address edits across historical order rows.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Table 1 — Clients', detail: 'Unique Client_ID, Company Name, Primary Contact, Region, Status.' },
          { label: 'Table 2 — Engagements', detail: 'Engagement_ID, Client_ID (FK), Start Date, Deliverable Type, Owner.' },
          { label: 'Integrity Rule', detail: 'No orphan engagement rows permitted without a verified Client_ID.' },
        ],
      },
    },
    {
      id: 'sk-db-3',
      title: 'Quarterly Records Retention & Access Audit',
      deliverableType: 'Compliance Checklist',
      context: 'Database & Records Management',
      summary:
        'Periodic review ensuring archived client records follow access permissions and version-control discipline.',
      toolsUsed: ['Confidential Handling', 'SOP Compliance', 'Documentation'],
      outcome: 'Kept shared repositories organized, uncluttered, and permission-audited.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Quarterly Audit Steps',
            items: [
              'Revoke temporary edit access for completed external engagements',
              'Archive superseded draft files out of active working folders',
              'Verify backup integrity of master contact and asset registers',
            ],
          },
        ],
      },
    },
  ],
  'excel-sheets': [
    {
      id: 'sk-ex-1',
      title: 'Dynamic Operations Summary with Pivot & Lookup Formulas',
      deliverableType: 'Excel / Sheets Workbook',
      context: 'Microsoft Excel & Google Sheets',
      summary:
        'Constructed a clean executive summary tab aggregating raw operational rows by region, category, and completion status.',
      toolsUsed: ['Microsoft Excel', 'Google Sheets', 'Pivot Tables'],
      outcome: 'Turned raw multi-tab exports into an instant weekly progress view.',
      preview: {
        kind: 'table',
        columns: ['Region', 'Total Records', 'QA Verified', 'Completion Rate'],
        rows: [
          ['North America', '420', '420', '100.0%'],
          ['Europe (UK/EU)', '365', '362', '99.2%'],
          ['East Africa', '290', '290', '100.0%'],
        ],
      },
    },
    {
      id: 'sk-ex-2',
      title: 'Automated Formula Audit & Error-Trap Template',
      deliverableType: 'Formula Engineering',
      context: 'Microsoft Excel & Google Sheets',
      summary:
        'Replaced fragile manual copy-paste totals with IFERROR-wrapped lookups and locked header references.',
      toolsUsed: ['XLOOKUP / VLOOKUP', 'SUMIFS', 'IFERROR'],
      outcome: 'Removed #N/A and #DIV/0! display errors from client-facing reports.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Safe Lookups', detail: 'IFERROR(VLOOKUP(...), "Unmapped ID") flags missing reference keys cleanly.' },
          { label: 'Multi-Criteria Totals', detail: 'SUMIFS and COUNTIFS summarize volume by both month and status.' },
          { label: 'View Usability', detail: 'Frozen top header row, banded row striping, and explicit print-area setup.' },
        ],
      },
    },
    {
      id: 'sk-ex-3',
      title: 'Cross-Platform CSV Export & Encoding Checklist',
      deliverableType: 'Data Transfer SOP',
      context: 'Microsoft Excel & Google Sheets',
      summary:
        'Standardized UTF-8 CSV export settings so accented names, leading zeros, and phone numbers survive system imports.',
      toolsUsed: ['Google Sheets', 'Microsoft Excel', 'CSV Standards'],
      outcome: 'Prevented Excel auto-formatting from stripping leading zeros on IDs and phone numbers.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Safe Import/Export Steps',
            items: [
              'Import numeric IDs and phone columns explicitly as Text before opening CSV',
              'Export strictly as UTF-8 CSV to preserve special characters',
              'Verify row count parity between source sheet and exported CSV',
            ],
          },
        ],
      },
    },
  ],
  'ict-support': [
    {
      id: 'sk-ic-1',
      title: 'End-User Workstation Troubleshooting Runbook',
      deliverableType: 'Technical Runbook',
      context: 'ICT Support & Customer Service',
      summary:
        'Structured diagnostic sequence for resolving slow boot times, network drops, and peripheral connection failures.',
      toolsUsed: ['ICT Diagnostics', 'Windows Admin', 'Ticketing'],
      outcome: 'Standardized first-line troubleshooting steps for faster user resolution.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Diagnostic Sequence',
            items: [
              'Verify physical cabling, link lights, and power state first',
              'Check ipconfig / ping gateway to isolate local vs ISP outage',
              'Inspect disk SMART status and Event Viewer critical errors',
              'Document exact resolution steps in ticket before closing',
            ],
          },
        ],
      },
    },
    {
      id: 'sk-ic-2',
      title: 'Remote Customer De-Escalation & Ticket Response Guide',
      deliverableType: 'Service Playbook',
      context: 'ICT Support & Customer Service',
      summary:
        'Clear, empathetic communication framework used to guide non-technical users through account and technical fixes.',
      toolsUsed: ['Customer Support', 'Remote Communication', 'CRM'],
      outcome: 'Maintained calm, high-clarity customer conversations with verifiable next steps.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Step 1 — Acknowledge', detail: 'Confirm the exact impact on the customer without technical jargon.' },
          { label: 'Step 2 — Verify', detail: 'Ask one clear diagnostic question at a time to narrow root cause.' },
          { label: 'Step 3 — Resolve & Confirm', detail: 'Walk through the fix and verify the user sees expected behavior live.' },
        ],
      },
    },
    {
      id: 'sk-ic-3',
      title: 'Support Queue Priority & SLA Routing Matrix',
      deliverableType: 'SLA Matrix',
      context: 'ICT Support & Customer Service',
      summary:
        'Categorization matrix defining response targets and escalation paths by business impact.',
      toolsUsed: ['Ticketing Systems', 'IBM Technical Support', 'SLA Tracking'],
      outcome: 'Ensured critical outages received immediate triage while routine requests stayed on schedule.',
      preview: {
        kind: 'table',
        columns: ['Severity', 'Example Issue', 'Initial Response', 'Escalation Path'],
        rows: [
          ['P1 — Critical', 'Office-wide network or server down', '15 mins', 'Immediate Lead Tech'],
          ['P2 — High', 'Single workstation unable to sign in', '1 hour', 'ICT Support Bench'],
          ['P3 — Standard', 'Printer mapping or software request', '4 hours', 'Standard Queue'],
        ],
      },
    },
  ],
  'web-uiux': [
    {
      id: 'sk-wb-1',
      title: 'Design Token & Color Contrast Specification',
      deliverableType: 'UI System Spec',
      context: 'Web Development & UI/UX Design',
      summary:
        'Defined dark and light surface pairings, cobalt focal accents, and accessible text contrast ratios for a tech portfolio.',
      toolsUsed: ['UI/UX Design', 'Tailwind CSS', 'WCAG AA Contrast'],
      outcome: 'Consistent surface hierarchy with zero unreadable low-contrast text pairs.',
      preview: {
        kind: 'table',
        columns: ['Token Role', 'Midnight Navy', 'Crisp Light', 'Usage Rule'],
        rows: [
          ['Page Canvas', '#060E1F', '#F4F7FC', '60% dominant background field'],
          ['Elevated Card', '#0D1A33', '#FFFFFF', '30% structural surface + 1px border'],
          ['Primary Accent', '#1684FF', '#1684FF', '10% interactive CTAs & active states'],
        ],
      },
    },
    {
      id: 'sk-wb-2',
      title: 'Accessible Form & Interactive Modal Pattern',
      deliverableType: 'Component Spec',
      context: 'Web Development & UI/UX Design',
      summary:
        'Keyboard-accessible modal and form specification supporting ESC close, focus rings, inline validation, and mobile scroll.',
      toolsUsed: ['React', 'TypeScript', 'UI/UX Design'],
      outcome: 'Zero trapped focus or clipped modal actions on small screens.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Accessibility & Ergonomics',
            items: [
              'Close cleanly via top-right X button, backdrop tap, or Escape key',
              'Minimum 44px touch targets on mobile controls',
              'Inline error guidance paired with descriptive field labels',
            ],
          },
        ],
      },
    },
    {
      id: 'sk-wb-3',
      title: 'Technical Drafting & AutoCAD 2D/3D Layout Study',
      deliverableType: 'CAD & Spatial Design',
      context: 'Web Development & UI/UX Design',
      summary:
        'Precision 2D floorplan and 3D component layout drafting applying layered organization and clean dimensional callouts.',
      toolsUsed: ['AutoCAD 2D/3D', 'Graphic Design', 'System Design'],
      outcome: 'Clean layered drawings ready for technical review and spatial planning.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Layer Discipline', detail: 'Separated Walls, Electrical, Dimensions, and Annotations onto distinct CAD layers.' },
          { label: 'Scale & Units', detail: 'Metric millimeter precision with standardized title block and revision history.' },
          { label: '3D Verification', detail: 'Checked clearance tolerances using orthographic and isometric views.' },
        ],
      },
    },
  ],
  'data-reporting': [
    {
      id: 'sk-dr-1',
      title: 'Weekly Client Deliverable Turnaround Report',
      deliverableType: 'Status Report',
      context: 'Data Analysis & Reporting',
      summary:
        'Concise weekly summary tracking batch intake volume, QA pass rate, and average turnaround across time zones.',
      toolsUsed: ['Microsoft Excel', 'PowerPoint', 'Reporting'],
      outcome: 'Gave overseas stakeholders clear visibility without lengthy status meetings.',
      preview: {
        kind: 'table',
        columns: ['Week', 'Rows Processed', 'Error Rate Pre-QA', 'Final Delivery'],
        rows: [
          ['Week 01', '1,120', '3.4% flagged & fixed', 'On Schedule'],
          ['Week 02', '1,340', '2.1% flagged & fixed', 'On Schedule'],
          ['Week 03', '980', '1.8% flagged & fixed', 'Early (4 hrs)'],
        ],
      },
    },
    {
      id: 'sk-dr-2',
      title: 'Recurring Support Ticket Trend Digest',
      deliverableType: 'Operational Analysis',
      context: 'Data Analysis & Reporting',
      summary:
        'Grouped 3 months of support logs by fault category to pinpoint top drivers of repeat customer inquiries.',
      toolsUsed: ['Google Sheets', 'Data Analysis', 'Reporting'],
      outcome: 'Highlighted the top two billing confusion points for documentation updates.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Top Category (38%)', detail: 'Invoice copy requests — recommended automated self-serve PDF link.' },
          { label: 'Second Category (27%)', detail: 'Profile phone/email sync delays — documented quick agent verification fix.' },
          { label: 'Executive Presentation', detail: 'Packaged findings into a 4-slide PowerPoint brief for team leads.' },
        ],
      },
    },
    {
      id: 'sk-dr-3',
      title: 'Data Quality Scorecard & Accuracy Benchmark',
      deliverableType: 'QA Metrics Brief',
      context: 'Data Analysis & Reporting',
      summary:
        'Tracked completeness, format compliance, and duplicate rates across incoming client spreadsheets over a 6-week cycle.',
      toolsUsed: ['Microsoft Excel', 'Quality Metrics', 'Validation'],
      outcome: 'Measured steady drop in upstream intake errors after rolling out intake templates.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Tracked Quality Indicators',
            items: [
              'Field Completeness % (mandatory columns populated)',
              'Format Conformance % (ISO dates, currency, E.164 phone)',
              'Duplicate Rate % (unique primary key verification)',
            ],
          },
        ],
      },
    },
  ],
  'crm-data': [
    {
      id: 'sk-cr-1',
      title: 'Customer Lifecycle & Account Status Taxonomy',
      deliverableType: 'CRM Data Model',
      context: 'CRM & Data Management',
      summary:
        'Defined clear lifecycle stage definitions and mandatory transition fields inside customer relationship records.',
      toolsUsed: ['CRM Platforms', 'Customer Data', 'SOP Compliance'],
      outcome: 'Eliminated ambiguous "Active/Pending" overlaps across team updates.',
      preview: {
        kind: 'table',
        columns: ['CRM Stage', 'Required Field Gate', 'Owner Action'],
        rows: [
          ['Onboarding', 'Verified Email + Phone + Consent', 'Complete welcome setup'],
          ['Active', 'Billing Method + Assigned Tier', 'Log support engagements'],
          ['Follow-Up', 'Next Action Date + Case Ref', 'Resolve open request'],
        ],
      },
    },
    {
      id: 'sk-cr-2',
      title: 'Post-Call CRM Hygiene & Note Standard',
      deliverableType: 'Entry Standard',
      context: 'CRM & Data Management',
      summary:
        'Compact 4-line note pattern keeping customer timelines scannable for any agent opening the account later.',
      toolsUsed: ['CRM Systems', 'Data Entry', 'Documentation'],
      outcome: 'Shortened pre-call reading time while preserving complete audit context.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Line 1 — Context', detail: 'Channel (Call/Email) + Verification confirmed.' },
          { label: 'Line 2 — Request', detail: 'Exact change or inquiry stated concisely.' },
          { label: 'Line 3 — Action', detail: 'Database fields updated or ticket ID created.' },
          { label: 'Line 4 — Outcome', detail: 'Resolved or scheduled follow-up date.' },
        ],
      },
    },
    {
      id: 'sk-cr-3',
      title: 'Customer Contact Sync & Bounce Cleanup',
      deliverableType: 'CRM Hygiene Audit',
      context: 'CRM & Data Management',
      summary:
        'Reconciled bounced email notifications and disconnected phone logs against recent customer support records.',
      toolsUsed: ['CRM Platforms', 'Google Sheets', 'Data Cleaning'],
      outcome: 'Restored valid contact reachability across prioritized client accounts.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Reconciliation Routine',
            items: [
              'Flag bounced emails with "Verify on Next Contact" status tag',
              'Cross-check recent inbound tickets for updated signatures or phone numbers',
              'Archive confirmed inactive duplicate profiles rather than deleting audit history',
            ],
          },
        ],
      },
    },
  ],
  'remote-collab': [
    {
      id: 'sk-rc-1',
      title: 'Multi-Time-Zone Async Handover Brief',
      deliverableType: 'Async Communication',
      context: 'Remote Collaboration & Communication',
      summary:
        'Structured end-of-day handoff note for overseas clients in US/EU time zones summarizing completed work, blockers, and next priorities.',
      toolsUsed: ['Email Systems', 'Slack / Async Notes', 'Time Management'],
      outcome: 'Kept overseas managers informed before their workday started without extra calls.',
      preview: {
        kind: 'spec',
        blocks: [
          { label: 'Completed Today', detail: 'Audited and uploaded 450 cleaned vendor records to /03_QA_Checked/.' },
          { label: 'Clarifications Needed', detail: '3 rows highlighted in yellow on Sheet2 pending PO reference numbers.' },
          { label: 'Next Shift Plan', detail: 'Begin Batch 04 formatting and weekly turnaround summary at 08:00 EAT.' },
        ],
      },
    },
    {
      id: 'sk-rc-2',
      title: 'Client Priority Alignment & Turnaround Tracker',
      deliverableType: 'Workflow Schedule',
      context: 'Remote Collaboration & Communication',
      summary:
        'Transparent task priority table shared with remote clients so urgent deadlines and standard queue items stay clearly sequenced.',
      toolsUsed: ['Google Sheets', 'Remote Operations', 'Time Management'],
      outcome: 'Zero missed deadlines across concurrent freelance engagements.',
      preview: {
        kind: 'table',
        columns: ['Task Batch', 'Client Time Zone', 'Priority', 'Agreed Delivery'],
        rows: [
          ['Monthly Invoice QA', 'EST (UTC-5)', 'High', 'Same-day 17:00 EST'],
          ['CRM Contact Cleanup', 'GMT (UTC+0)', 'Medium', 'Wednesday 12:00 GMT'],
          ['UI Review Checklist', 'EAT (UTC+3)', 'Standard', 'Friday 16:00 EAT'],
        ],
      },
    },
    {
      id: 'sk-rc-3',
      title: 'Independent Remote Readiness & Security Protocol',
      deliverableType: 'Work-Style Standard',
      context: 'Remote Collaboration & Communication',
      summary:
        'Personal operating checklist ensuring reliable connectivity, confidential data protection, and proactive client updates.',
      toolsUsed: ['SOP Compliance', 'Confidentiality', 'Remote Support'],
      outcome: 'Consistent professional reliability across global remote engagements.',
      preview: {
        kind: 'checklist',
        sections: [
          {
            heading: 'Daily Remote Standards',
            items: [
              'Verify primary and backup internet readiness ahead of scheduled handoffs',
              'Communicate early if upstream source files arrive incomplete or delayed',
              'Maintain strict workspace privacy and NDA-compliant file handling',
            ],
          },
        ],
      },
    },
  ],
};
