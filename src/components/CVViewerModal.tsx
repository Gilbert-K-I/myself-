import React, { useEffect } from 'react';
import { FileText, Globe, Mail, MapPin, Phone, X } from 'lucide-react';
import {
  ALL_CORE_COMPETENCIES,
  CERTIFICATIONS,
  EDUCATION_ITEMS,
  EXPERIENCE_ITEMS,
  PROFILE,
  TARGET_ROLES,
  TECHNICAL_SKILL_GROUPS,
} from '../data/portfolioData';
import { ThemeTokens } from '../types/settings';

interface CVViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: ThemeTokens;
}

export const CVViewerModal: React.FC<CVViewerModalProps> = ({
  isOpen,
  onClose,
  tokens,
}) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Curriculum Vitae — View Only"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${tokens.modalBg}`}
      >
        {/* Top Bar */}
        <div
          className={`flex shrink-0 items-center justify-between gap-4 border-b px-5 py-3.5 sm:px-6 ${
            tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1684FF]/15 text-[#1D93FF]">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className={`font-display text-sm font-bold sm:text-base ${tokens.textPrimary}`}>
                Curriculum Vitae — {PROFILE.fullName}
              </h2>
              <p className={`text-[11px] ${tokens.textMuted}`}>View-only document</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
              tokens.isDark
                ? 'border-white/15 text-[#B7C8E4] hover:bg-white/10 hover:text-white'
                : 'border-[#DCE5F4] text-[#334669] hover:bg-[#F0F5FF]'
            }`}
            aria-label="Close CV viewer"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 sm:px-8">
          <div
            className={`mx-auto max-w-3xl space-y-6 rounded-xl border p-5 sm:p-8 ${
              tokens.isDark
                ? 'border-[#1B335E] bg-[#060E1F]'
                : 'border-[#DCE5F4] bg-white'
            }`}
          >
            {/* CV Header */}
            <header
              className={`border-b pb-5 text-center ${
                tokens.isDark ? 'border-white/15' : 'border-[#DCE5F4]'
              }`}
            >
              <h1
                className={`font-display text-2xl font-extrabold tracking-tight sm:text-3xl ${tokens.textPrimary}`}
              >
                {PROFILE.fullName.toUpperCase()}
              </h1>
              <p className={`mt-1 text-sm font-semibold ${tokens.accentText}`}>
                {PROFILE.roleTitle}
              </p>
              <div
                className={`mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs ${tokens.textSecondary}`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#1D93FF]" aria-hidden="true" />
                  {PROFILE.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-[#1D93FF]" aria-hidden="true" />
                  {PROFILE.availability}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#1D93FF]" aria-hidden="true" />
                  {PROFILE.email}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono-tabular">
                  <Phone className="h-3.5 w-3.5 text-[#1D93FF]" aria-hidden="true" />
                  {PROFILE.phone}
                </span>
              </div>
            </header>

            {/* Professional Summary */}
            <section>
              <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                Professional Summary
              </h3>
              <p className={`mt-2 text-xs leading-relaxed sm:text-sm ${tokens.textSecondary}`}>
                {PROFILE.fullSummary}
              </p>
            </section>

            {/* Core Competencies */}
            <section>
              <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                Core Competencies
              </h3>
              <div className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-3">
                {ALL_CORE_COMPETENCIES.map((item) => (
                  <div key={item} className={`text-xs ${tokens.textSecondary}`}>
                    • {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Professional Experience */}
            <section>
              <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                Professional Experience
              </h3>
              <div className="mt-3 space-y-5">
                {EXPERIENCE_ITEMS.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col justify-between gap-0.5 sm:flex-row sm:items-baseline">
                      <h4 className={`text-sm font-bold ${tokens.textPrimary}`}>{exp.role}</h4>
                      <span className={`font-mono-tabular text-xs ${tokens.textMuted}`}>
                        {exp.period}
                      </span>
                    </div>
                    <div className={`text-xs font-medium ${tokens.textMuted}`}>
                      {exp.organization} · {exp.location}
                    </div>
                    <ul className={`mt-2 space-y-1.5 text-xs leading-relaxed ${tokens.textSecondary}`}>
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span aria-hidden="true">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education & Certifications */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <section>
                <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  Education
                </h3>
                <div className="mt-2.5 space-y-2.5">
                  {EDUCATION_ITEMS.map((edu) => (
                    <div key={edu.degree} className="text-xs">
                      <div className={`font-bold ${tokens.textPrimary}`}>{edu.degree}</div>
                      <div className={tokens.textSecondary}>
                        {edu.institution} · <span className="font-mono-tabular">{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  Certifications
                </h3>
                <ul className={`mt-2.5 space-y-1.5 text-xs ${tokens.textSecondary}`}>
                  {CERTIFICATIONS.map((cert) => (
                    <li key={`${cert.issuer}-${cert.title}`}>
                      • <strong className={tokens.textPrimary}>{cert.issuer}</strong> — {cert.title}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Technical Skills & Tools */}
            <section>
              <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                Technical Skills &amp; Tools
              </h3>
              <div className="mt-2.5 space-y-2 text-xs leading-relaxed">
                {TECHNICAL_SKILL_GROUPS.map((group) => (
                  <p key={group.category} className={tokens.textSecondary}>
                    <strong className={tokens.textPrimary}>{group.category}:</strong>{' '}
                    {group.items.join(', ')}.
                  </p>
                ))}
              </div>
            </section>

            {/* Additional Strengths & Target Role Alignment */}
            <section className="space-y-2 text-xs leading-relaxed">
              <h3 className={`font-display text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                Additional Strengths &amp; Role Alignment
              </h3>
              <p className={tokens.textSecondary}>
                <strong className={tokens.textPrimary}>Languages:</strong> Swahili — Native ·
                English — Fluent, Professional Working Proficiency
              </p>
              <p className={tokens.textSecondary}>
                <strong className={tokens.textPrimary}>Work Style:</strong> SOP compliance,
                confidentiality, quality checking, attention to detail, time management, independent
                work, remote collaboration across time zones.
              </p>
              <p className={tokens.textSecondary}>
                <strong className={tokens.textPrimary}>Target Roles:</strong>{' '}
                {TARGET_ROLES.join(', ')}.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex shrink-0 items-center justify-end border-t px-5 py-3.5 sm:px-6 ${
            tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg bg-[#1684FF] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#0B6EF0]"
          >
            Close CV
          </button>
        </div>
      </div>
    </div>
  );
};
