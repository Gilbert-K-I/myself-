import React, { useState } from 'react';
import { ArrowRight, FileText, FolderOpen } from 'lucide-react';
import { COMPETENCY_CARDS } from '../data/portfolioData';
import { SKILL_WORK_SAMPLES, WorkSample } from '../data/workSamplesData';
import { ThemeTokens } from '../types/settings';

interface WorkSamplesSectionProps {
  tokens: ThemeTokens;
  selectedSkillId?: string;
  onSelectSkillId?: (skillId: string) => void;
  onOpenSample: (sample: WorkSample, siblings: WorkSample[]) => void;
}

export const WorkSamplesSection: React.FC<WorkSamplesSectionProps> = ({
  tokens,
  selectedSkillId,
  onSelectSkillId,
  onOpenSample,
}) => {
  const [internalSkillId, setInternalSkillId] = useState<string>(COMPETENCY_CARDS[0].id);

  const activeSkillId = selectedSkillId ?? internalSkillId;
  const setActiveSkillId = (id: string) => {
    if (onSelectSkillId) {
      onSelectSkillId(id);
    } else {
      setInternalSkillId(id);
    }
  };

  const activeSkill =
    COMPETENCY_CARDS.find((card) => card.id === activeSkillId) ?? COMPETENCY_CARDS[0];
  const activeSamples = SKILL_WORK_SAMPLES[activeSkill.id] ?? [];

  return (
    <section id="samples" className={`border-b py-14 lg:py-16 ${tokens.divider}`}>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.14em] text-[#1D93FF] uppercase">
                WORK SAMPLES
              </span>
              <span className="h-[1.5px] w-12 bg-[#1D93FF]/70" aria-hidden="true" />
            </div>

            <h2
              className={`font-display text-balance text-2xl font-bold tracking-tight sm:text-[32px] ${tokens.textPrimary}`}
            >
              Deliverables by Skill
            </h2>

            <p className={`mt-2.5 text-sm leading-relaxed sm:text-[15px] ${tokens.textSecondary}`}>
              Select any competency below to inspect three structured work samples showing formats,
              workflows, and outcomes.
            </p>
          </div>

          <div className={`font-mono-tabular text-xs font-medium ${tokens.textMuted}`}>
            {COMPETENCY_CARDS.length} Skill Areas · 3 Samples Each
          </div>
        </div>

        {/* Skill Filter Tabs */}
        <div
          className="mt-7 flex items-center gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Filter work samples by skill"
        >
          {COMPETENCY_CARDS.map((skill) => {
            const isActive = skill.id === activeSkill.id;
            return (
              <button
                key={skill.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveSkillId(skill.id)}
                className={`whitespace-nowrap shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${
                  isActive
                    ? 'border-[#1D93FF] bg-[#1684FF] text-white shadow-sm'
                    : `${tokens.cardBg} ${tokens.cardBorder} ${tokens.textSecondary} ${tokens.cardBorderHover}`
                }`}
              >
                {skill.title}
              </button>
            );
          })}
        </div>

        {/* 3 Sample Cards for Active Skill */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {activeSamples.map((sample, index) => (
            <div
              key={sample.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-150 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderHover}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#1D93FF]">
                    0{index + 1}. {sample.deliverableType}
                  </span>
                  <FileText className={`h-4 w-4 shrink-0 ${tokens.textMuted}`} aria-hidden="true" />
                </div>

                <h3
                  className={`font-display mt-2.5 text-base font-bold leading-snug ${tokens.textPrimary}`}
                >
                  {sample.title}
                </h3>

                <p className={`mt-2 text-xs leading-relaxed sm:text-[13px] ${tokens.textSecondary}`}>
                  {sample.summary}
                </p>

                <p className={`mt-3 text-[11px] font-medium ${tokens.textMuted}`}>
                  {sample.toolsUsed.join(' · ')}
                </p>
              </div>

              <div
                className={`mt-5 flex items-center justify-between gap-3 border-t pt-3.5 ${
                  tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
                }`}
              >
                <span className={`truncate text-[11px] ${tokens.textMuted}`}>
                  {sample.outcome}
                </span>

                <button
                  type="button"
                  onClick={() => onOpenSample(sample, activeSamples)}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#1684FF]/15 px-3 text-xs font-semibold text-[#1D93FF] transition-colors hover:bg-[#1684FF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF]"
                >
                  <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Open Sample</span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
