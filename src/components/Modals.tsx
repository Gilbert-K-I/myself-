import React, { useEffect, useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  X,
} from 'lucide-react';
import {
  ALL_CORE_COMPETENCIES,
  CERTIFICATIONS,
  CompetencyCard,
  EDUCATION_ITEMS,
  PROFILE,
  TARGET_ROLES,
  TECHNICAL_SKILL_GROUPS,
} from '../data/portfolioData';
import { ThemeTokens } from '../types/settings';

interface SkillDetailModalProps {
  skill: CompetencyCard | null;
  onClose: () => void;
  tokens: ThemeTokens;
  onOpenContact: () => void;
  onViewSkillSamples?: (skillId: string) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  onClose,
  tokens,
  onOpenContact,
  onViewSkillSamples,
}) => {
  useEffect(() => {
    if (!skill) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [skill, onClose]);

  if (!skill) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={skill.title}
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={`relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-2xl border p-6 shadow-2xl ${tokens.modalBg}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D93FF]">
              Core Competency
            </span>
            <h3 className={`font-display mt-1 text-xl font-bold ${tokens.textPrimary}`}>
              {skill.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
              tokens.isDark
                ? 'border-white/10 text-[#B7C8E4] hover:bg-white/10'
                : 'border-[#DCE5F4] text-[#334669] hover:bg-[#F0F5FF]'
            }`}
            aria-label="Close skill detail"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className={`mt-3 text-sm leading-relaxed ${tokens.textSecondary}`}>{skill.summary}</p>

        <div className="mt-5">
          <h4 className={`text-xs font-bold uppercase tracking-wider ${tokens.textMuted}`}>
            Key Highlights
          </h4>
          <ul className={`mt-2.5 space-y-2 text-sm ${tokens.textSecondary}`}>
            {skill.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <h4 className={`text-xs font-bold uppercase tracking-wider ${tokens.textMuted}`}>
            Tools &amp; Platforms
          </h4>
          <p className={`mt-1.5 text-sm font-medium ${tokens.textPrimary}`}>
            {skill.tools.join(' · ')}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg border px-4 py-2 text-xs font-semibold ${tokens.outlineButton}`}
          >
            Close
          </button>
          {onViewSkillSamples && (
            <button
              type="button"
              onClick={() => {
                const id = skill.id;
                onClose();
                onViewSkillSamples(id);
              }}
              className={`rounded-lg border px-4 py-2 text-xs font-semibold ${tokens.outlineButton}`}
            >
              View 3 Work Samples
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            className="rounded-lg bg-[#1684FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
          >
            Discuss a Project
          </button>
        </div>
      </div>
    </div>
  );
};

interface AllCredentialsModalProps {
  isOpen: boolean;
  initialTab: 'skills' | 'education' | 'summary';
  onClose: () => void;
  tokens: ThemeTokens;
  onViewCV: () => void;
}

export const AllCredentialsModal: React.FC<AllCredentialsModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  tokens,
  onViewCV,
}) => {
  const [tab, setTab] = useState<'skills' | 'education' | 'summary'>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Full Skills, Education and Credentials"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={`relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col rounded-2xl border shadow-2xl ${tokens.modalBg}`}
      >
        <div
          className={`flex items-center justify-between border-b px-6 py-4 ${
            tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D93FF]">
              Full Profile &amp; ATS Resume Details
            </span>
            <h3 className={`font-display text-lg font-bold ${tokens.textPrimary}`}>
              {PROFILE.fullName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
              tokens.isDark
                ? 'border-white/10 text-[#B7C8E4] hover:bg-white/10'
                : 'border-[#DCE5F4] text-[#334669] hover:bg-[#F0F5FF]'
            }`}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div
            className={`grid grid-cols-3 gap-1 rounded-xl p-1 ${
              tokens.isDark ? 'bg-[#060E1F]' : 'bg-[#EEF3FB]'
            }`}
          >
            {(
              [
                { id: 'skills', label: 'Skills & Tools' },
                { id: 'education', label: 'Education & Certs' },
                { id: 'summary', label: 'Summary & Roles' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  tab === item.id
                    ? 'bg-[#1684FF] text-white shadow-sm'
                    : `${tokens.textSecondary} hover:opacity-85`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === 'skills' && (
            <div className="space-y-6">
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  15 Core Competencies
                </h4>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {ALL_CORE_COMPETENCIES.map((item) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${tokens.cardBg} ${tokens.cardBorder} ${tokens.textPrimary}`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#10B981]" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  Technical Skills &amp; Platforms
                </h4>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {TECHNICAL_SKILL_GROUPS.map((group) => (
                    <div
                      key={group.category}
                      className={`rounded-xl border p-4 ${tokens.cardBg} ${tokens.cardBorder}`}
                    >
                      <div className={`text-xs font-bold ${tokens.textPrimary}`}>
                        {group.category}
                      </div>
                      <p className={`mt-1.5 text-xs leading-relaxed ${tokens.textSecondary}`}>
                        {group.items.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'education' && (
            <div className="space-y-6">
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  Education
                </h4>
                <div className="mt-3 space-y-3">
                  {EDUCATION_ITEMS.map((edu) => (
                    <div
                      key={edu.degree}
                      className={`flex items-start gap-3.5 rounded-xl border p-4 ${tokens.cardBg} ${tokens.cardBorder}`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1684FF]/15 text-[#1D93FF]">
                        <GraduationCap className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <div className={`text-sm font-bold ${tokens.textPrimary}`}>
                          {edu.degree}
                        </div>
                        <div className={`mt-0.5 text-xs ${tokens.textSecondary}`}>
                          {edu.institution} · <span className="font-mono-tabular">{edu.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  Certifications
                </h4>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {CERTIFICATIONS.map((cert) => (
                    <div
                      key={`${cert.issuer}-${cert.title}`}
                      className={`rounded-xl border p-4 ${tokens.cardBg} ${tokens.cardBorder}`}
                    >
                      <Award className="h-5 w-5 text-[#1D93FF]" aria-hidden="true" />
                      <div className={`mt-2.5 text-xs font-bold ${tokens.accentText}`}>
                        {cert.issuer}
                      </div>
                      <div className={`mt-1 text-xs font-semibold ${tokens.textPrimary}`}>
                        {cert.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'summary' && (
            <div className="space-y-5">
              <div className={`rounded-xl border p-4 ${tokens.cardBg} ${tokens.cardBorder}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  Professional Summary
                </h4>
                <p className={`mt-2 text-sm leading-relaxed ${tokens.textSecondary}`}>
                  {PROFILE.fullSummary}
                </p>
              </div>

              <div className={`rounded-xl border p-4 ${tokens.cardBg} ${tokens.cardBorder}`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  Additional Strengths
                </h4>
                <p className={`mt-2 text-xs leading-relaxed ${tokens.textSecondary}`}>
                  <strong className={tokens.textPrimary}>Languages:</strong> Swahili (Native) ·
                  English (Fluent, Professional Working Proficiency)
                </p>
                <p className={`mt-1.5 text-xs leading-relaxed ${tokens.textSecondary}`}>
                  <strong className={tokens.textPrimary}>Work Style:</strong> SOP compliance,
                  confidentiality, quality checking, attention to detail, time management,
                  independent work, remote collaboration across time zones.
                </p>
              </div>

              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  Target Role Alignment
                </h4>
                <p className={`mt-2 text-xs leading-relaxed ${tokens.textSecondary}`}>
                  {TARGET_ROLES.join(' · ')}
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4 ${
            tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewCV();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>View CV</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg border px-4 py-2 text-xs font-semibold ${tokens.outlineButton}`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  initialSubject?: string;
  onClose: () => void;
  onOpenWhatsApp: () => void;
  tokens: ThemeTokens;
  onCopyContact: (label: string, value: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  initialSubject = 'Remote Opportunity / Collaboration',
  onClose,
  onOpenWhatsApp,
  tokens,
  onCopyContact,
}) => {
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [topic, setTopic] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setTopic(initialSubject);
    if (isOpen) {
      setSubmitted(false);
      setErrorMsg('');
    }
  }, [initialSubject, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (label: string, value: string) => {
    onCopyContact(label, value);
    setCopiedField(label);
    window.setTimeout(() => setCopiedField(null), 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !senderEmail.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email address, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  const mailtoHref = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    `[Portfolio Inquiry] ${topic} — ${name || 'Prospective Client'}`
  )}&body=${encodeURIComponent(
    `${message}\n\nFrom: ${name}\nReply to: ${senderEmail}`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Contact Gilbert Kariithi Ihugo"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={`relative z-10 max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-2xl border p-6 shadow-2xl ${tokens.modalBg}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D93FF]">
              Contact &amp; Collaboration
            </span>
            <h3 className={`font-display mt-1 text-xl font-bold ${tokens.textPrimary}`}>
              Get In Touch with {PROFILE.firstName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${
              tokens.isDark
                ? 'border-white/10 text-[#B7C8E4] hover:bg-white/10'
                : 'border-[#DCE5F4] text-[#334669] hover:bg-[#F0F5FF]'
            }`}
            aria-label="Close contact dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Direct Contact Cards */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div
            className={`flex items-center justify-between gap-2 rounded-xl border p-3 ${tokens.cardBg} ${tokens.cardBorder}`}
          >
            <div className="min-w-0">
              <div className={`text-[11px] font-semibold ${tokens.textMuted}`}>Email</div>
              <a
                href={`mailto:${PROFILE.email}`}
                className={`block truncate text-xs font-semibold hover:text-[#1D93FF] ${tokens.textPrimary}`}
              >
                {PROFILE.email}
              </a>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('Email', PROFILE.email)}
              className="shrink-0 rounded-lg bg-[#1684FF]/15 p-2 text-[#1D93FF] hover:bg-[#1684FF]/25"
              aria-label="Copy email address"
            >
              {copiedField === 'Email' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div
            className={`flex items-center justify-between gap-2 rounded-xl border p-3 ${tokens.cardBg} ${tokens.cardBorder}`}
          >
            <div className="min-w-0">
              <div className={`text-[11px] font-semibold ${tokens.textMuted}`}>Phone / WhatsApp</div>
              <a
                href={`tel:${PROFILE.phone.replace(/\s+/g, '')}`}
                className={`block font-mono-tabular text-xs font-semibold hover:text-[#1D93FF] ${tokens.textPrimary}`}
              >
                {PROFILE.phone}
              </a>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('Phone', PROFILE.phone)}
              className="shrink-0 rounded-lg bg-[#1684FF]/15 p-2 text-[#1D93FF] hover:bg-[#1684FF]/25"
              aria-label="Copy phone number"
            >
              {copiedField === 'Phone' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <div className={`mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs ${tokens.textMuted}`}>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#1D93FF]" aria-hidden="true" />
            <span>{PROFILE.location} · {PROFILE.availability}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenWhatsApp();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/45 bg-[#25D366]/10 px-3 py-1 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Chat on WhatsApp Bot</span>
          </button>
        </div>

        {submitted ? (
          <div
            className={`mt-5 rounded-xl border p-5 text-center ${tokens.cardBg} border-[#10B981]/50`}
          >
            <CheckCircle2 className="mx-auto h-9 w-9 text-[#10B981]" aria-hidden="true" />
            <h4 className={`font-display mt-2.5 text-base font-bold ${tokens.textPrimary}`}>
              Message Ready to Send
            </h4>
            <p className={`mt-1 text-xs leading-relaxed ${tokens.textSecondary}`}>
              Thank you, {name}. Click below to dispatch directly via your email client, or copy{' '}
              <span className="font-semibold">{PROFILE.email}</span>.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Open Email Client</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setSenderEmail('');
                  setMessage('');
                }}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold ${tokens.outlineButton}`}
              >
                Send Another Note
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={`mb-1 block text-xs font-semibold ${tokens.textSecondary}`}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-semibold ${tokens.textSecondary}`}>
                  Your Email
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`mb-1 block text-xs font-semibold ${tokens.textSecondary}`}>
                Inquiry Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
              >
                <option value="Remote Opportunity / Collaboration">Remote Opportunity / Collaboration</option>
                <option value="Data Entry & Data Support">Data Entry &amp; Data Support</option>
                <option value="AI Data Annotation & Training">AI Data Annotation &amp; Training</option>
                <option value="Web & UI/UX Development">Web &amp; UI/UX Development</option>
                <option value="ICT Technical Support">ICT Technical Support</option>
                <option value="Join Professional Circle">Join Professional Circle</option>
              </select>
            </div>

            <div>
              <label className={`mb-1 block text-xs font-semibold ${tokens.textSecondary}`}>
                Message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share project details, role scope, or time zone requirements..."
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-[#1D93FF] focus:outline-none ${tokens.inputBg}`}
              />
            </div>

            {errorMsg && (
              <p
                role="alert"
                className={`text-xs font-medium ${
                  tokens.isDark ? 'text-rose-400' : 'text-rose-700'
                }`}
              >
                {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className={`rounded-lg border px-4 py-2 text-xs font-semibold ${tokens.outlineButton}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1684FF] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0B6EF0]"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Send Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
