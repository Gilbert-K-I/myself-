import React from 'react';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  FileSpreadsheet,
  Headset,
  Settings,
  ShieldCheck,
  Table2,
} from 'lucide-react';
import { COMPETENCY_CARDS, CompetencyCard } from '../data/portfolioData';
import { ThemeTokens } from '../types/settings';

interface SkillsSectionProps {
  tokens: ThemeTokens;
  onSelectSkill: (skill: CompetencyCard) => void;
  onExploreAllSkills: () => void;
}

function renderSkillIcon(iconKey: CompetencyCard['iconKey'], color: string) {
  const props = { className: 'h-6 w-6', style: { color }, 'aria-hidden': true as const };
  switch (iconKey) {
    case 'file-spreadsheet':
      return <FileSpreadsheet {...props} />;
    case 'shield-check':
      return <ShieldCheck {...props} />;
    case 'brain-circuit':
      return <BrainCircuit {...props} />;
    case 'database':
      return <Database {...props} />;
    case 'table-2':
      return <Table2 {...props} />;
    case 'headset':
      return <Headset {...props} />;
    case 'code-2':
      return <Code2 {...props} />;
    case 'bar-chart-3':
      return <BarChart3 {...props} />;
    case 'settings':
      return <Settings {...props} />;
    case 'cloud':
      return <Cloud {...props} />;
  }
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  tokens,
  onSelectSkill,
  onExploreAllSkills,
}) => {
  return (
    <section id="skills" className={`border-b py-14 lg:py-16 ${tokens.divider}`}>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Column Intro */}
          <div className="lg:col-span-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.14em] text-[#1D93FF] uppercase">
                MY SKILLS
              </span>
              <span className="h-[1.5px] w-12 bg-[#1D93FF]/70" aria-hidden="true" />
            </div>

            <h2
              className={`font-display text-balance text-2xl font-bold tracking-tight sm:text-[32px] ${tokens.textPrimary}`}
            >
              Core Competencies
            </h2>

            <p className={`mt-3 text-sm leading-relaxed sm:text-[15px] ${tokens.textSecondary}`}>
              A versatile professional with strong skills in data, technology and digital solutions.
            </p>

            <button
              type="button"
              onClick={onExploreAllSkills}
              className={`mt-6 inline-flex h-10 items-center gap-2 whitespace-nowrap shrink-0 rounded-full border px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${tokens.outlineButton}`}
            >
              <span>Explore All Skills</span>
              <ArrowRight className="h-4 w-4 text-[#1D93FF]" aria-hidden="true" />
            </button>
          </div>

          {/* Right Column 5x2 Competency Grid */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5 lg:col-span-8">
            {COMPETENCY_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectSkill(card)}
                className={`group flex min-h-[120px] flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${tokens.cardBg} ${tokens.cardBgHover} ${tokens.cardBorder} ${tokens.cardBorderHover}`}
              >
                <span
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg transition-transform duration-150 group-hover:scale-105 ${
                    tokens.isDark ? 'bg-[#081226]/90' : 'bg-[#F0F5FF]'
                  }`}
                >
                  {renderSkillIcon(card.iconKey, card.accentColor)}
                </span>
                <span
                  className={`text-xs font-semibold leading-snug sm:text-[13px] ${tokens.textPrimary}`}
                >
                  {card.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
