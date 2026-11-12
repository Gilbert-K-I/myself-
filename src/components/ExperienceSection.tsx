import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Code2,
  FileText,
  FolderOpen,
  Headset,
  Wrench,
} from 'lucide-react';
import { EXPERIENCE_ITEMS, ExperienceItem } from '../data/portfolioData';
import { EXPERIENCE_WORK_SAMPLES, WorkSample } from '../data/workSamplesData';
import { ThemeTokens } from '../types/settings';

interface ExperienceSectionProps {
  tokens: ThemeTokens;
  expandedByDefault: boolean;
  onOpenFullCredentials: () => void;
  onOpenSample: (sample: WorkSample, siblings: WorkSample[]) => void;
}

function renderRoleIcon(iconKey: ExperienceItem['iconKey']) {
  const props = { className: 'h-4 w-4 text-[#4DA8FF]', 'aria-hidden': true as const };
  switch (iconKey) {
    case 'briefcase':
      return <Briefcase {...props} />;
    case 'headset':
      return <Headset {...props} />;
    case 'code-2':
      return <Code2 {...props} />;
    case 'wrench':
      return <Wrench {...props} />;
  }
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  tokens,
  expandedByDefault,
  onOpenFullCredentials,
  onOpenSample,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (expandedByDefault) {
      const all: Record<string, boolean> = {};
      EXPERIENCE_ITEMS.forEach((item) => {
        all[item.id] = true;
      });
      setExpandedIds(all);
    } else {
      setExpandedIds({});
    }
  }, [expandedByDefault]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="experience" className={`border-b py-14 lg:py-16 ${tokens.divider}`}>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Column Intro */}
          <div className="lg:col-span-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.14em] text-[#1D93FF] uppercase">
                MY EXPERIENCE
              </span>
              <span className="h-[1.5px] w-12 bg-[#1D93FF]/70" aria-hidden="true" />
            </div>

            <h2
              className={`font-display text-balance text-2xl font-bold tracking-tight sm:text-[32px] ${tokens.textPrimary}`}
            >
              Professional Journey
            </h2>

            <p className={`mt-3 text-sm leading-relaxed sm:text-[15px] ${tokens.textSecondary}`}>
              Hands-on experience in data support, customer service, and technology. Select any role
              to inspect achievements and work samples.
            </p>

            <button
              type="button"
              onClick={onOpenFullCredentials}
              className={`mt-6 inline-flex h-10 items-center gap-2 whitespace-nowrap shrink-0 rounded-full border px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${tokens.outlineButton}`}
            >
              <span>View Full Experience</span>
              <ArrowRight className="h-4 w-4 text-[#1D93FF]" aria-hidden="true" />
            </button>
          </div>

          {/* Right Column Vertical Timeline */}
          <div className="relative lg:col-span-8">
            {/* Vertical Timeline Line */}
            <div
              className="absolute top-5 bottom-5 left-[7px] w-px bg-gradient-to-b from-[#1D93FF] via-[#1D93FF]/60 to-[#1D93FF]/15"
              aria-hidden="true"
            />

            <div className="space-y-4">
              {EXPERIENCE_ITEMS.map((item) => {
                const isExpanded = Boolean(expandedIds[item.id]);
                const roleSamples = EXPERIENCE_WORK_SAMPLES[item.id] ?? [];

                return (
                  <div key={item.id} className="relative pl-8">
                    {/* Timeline Node Dot */}
                    <span
                      className={`absolute top-5 left-0 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-[#1D93FF]/40 ${
                        tokens.isDark ? 'bg-[#060E1F]' : 'bg-[#F4F7FC]'
                      }`}
                      aria-hidden="true"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#2EA0FF] shadow-[0_0_8px_#2EA0FF]" />
                    </span>

                    <div
                      className={`rounded-xl border transition-colors duration-150 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderHover}`}
                    >
                      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={isExpanded}
                          className="flex min-w-0 flex-1 items-start gap-3.5 text-left sm:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] rounded-lg"
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                              tokens.isDark
                                ? 'border-[#25447A] bg-[#0B1730]'
                                : 'border-[#CBD8EE] bg-[#F0F5FF]'
                            }`}
                          >
                            {renderRoleIcon(item.iconKey)}
                          </span>
                          <div className="min-w-0">
                            <h3 className={`font-display text-sm font-bold sm:text-[15px] ${tokens.textPrimary}`}>
                              {item.role}
                            </h3>
                            <div
                              className={`mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs ${tokens.textMuted}`}
                            >
                              <span>{item.location}</span>
                              <span aria-hidden="true">|</span>
                              <span>{item.organization}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono-tabular">{item.period}</span>
                            </div>
                            <p className={`mt-1 text-xs leading-relaxed sm:hidden ${tokens.textSecondary}`}>
                              {item.shortSummary}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <p
                            className={`hidden max-w-[230px] text-right text-xs leading-relaxed xl:block ${tokens.textSecondary}`}
                          >
                            {item.shortSummary}
                          </p>

                          {roleSamples.length > 0 && (
                            <button
                              type="button"
                              onClick={() => onOpenSample(roleSamples[0], roleSamples)}
                              className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#1D93FF]/35 bg-[#1684FF]/10 px-2.5 text-xs font-semibold text-[#1D93FF] transition-colors hover:bg-[#1684FF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF]"
                            >
                              <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Samples ({roleSamples.length})</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? `Collapse ${item.role}` : `Expand ${item.role}`}
                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                              tokens.isDark
                                ? 'border-white/10 text-[#9EB5D9] hover:bg-white/10 hover:text-white'
                                : 'border-[#DCE5F4] text-[#334669] hover:bg-[#F0F5FF]'
                            }`}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-4 w-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div
                          className={`border-t px-4 py-4 sm:pl-[70px] ${
                            tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
                          }`}
                        >
                          <ul className={`space-y-2 text-xs leading-relaxed sm:text-[13px] ${tokens.textSecondary}`}>
                            {item.bullets.map((bullet, idx) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <span
                                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D93FF]"
                                  aria-hidden="true"
                                />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          {/* 3 Work Samples for this Role */}
                          {roleSamples.length > 0 && (
                            <div
                              className={`mt-4 border-t pt-4 ${
                                tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
                              }`}
                            >
                              <div className={`mb-2.5 text-[11px] font-bold uppercase tracking-wider ${tokens.accentText}`}>
                                Work Samples ({roleSamples.length})
                              </div>
                              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                {roleSamples.map((sample) => (
                                  <button
                                    key={sample.id}
                                    type="button"
                                    onClick={() => onOpenSample(sample, roleSamples)}
                                    className={`group flex flex-col justify-between rounded-xl border p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${
                                      tokens.isDark
                                        ? 'border-[#1B335E] bg-[#081226] hover:border-[#2F8BFF]'
                                        : 'border-[#DCE5F4] bg-[#F6F9FF] hover:border-[#1684FF]'
                                    }`}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between gap-1.5 text-[11px] font-semibold text-[#1D93FF]">
                                        <span className="truncate">{sample.deliverableType}</span>
                                        <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                      </div>
                                      <div
                                        className={`mt-1.5 text-xs font-bold leading-snug group-hover:text-[#1D93FF] ${tokens.textPrimary}`}
                                      >
                                        {sample.title}
                                      </div>
                                    </div>
                                    <span className={`mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold ${tokens.textMuted} group-hover:text-[#1D93FF]`}>
                                      <span>Open sample</span>
                                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
