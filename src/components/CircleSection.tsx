import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Users } from 'lucide-react';
import { CIRCLE_TOPICS } from '../data/portfolioData';
import { ThemeTokens } from '../types/settings';

interface CircleSectionProps {
  tokens: ThemeTokens;
  onJoinCollaborate: () => void;
}

export const CircleSection: React.FC<CircleSectionProps> = ({
  tokens,
  onJoinCollaborate,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const activeTopic = CIRCLE_TOPICS.find((t) => t.id === selectedTopicId) ?? null;

  return (
    <section id="groups" className="py-14 lg:py-16">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Column Intro */}
          <div className="lg:col-span-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.14em] text-[#1D93FF] uppercase">
                MY GROUP
              </span>
              <span className="h-[1.5px] w-12 bg-[#1D93FF]/70" aria-hidden="true" />
            </div>

            <h2
              className={`font-display text-balance text-2xl font-bold tracking-tight sm:text-[32px] ${tokens.textPrimary}`}
            >
              Professional Circle
            </h2>

            <p className={`mt-3 text-sm leading-relaxed sm:text-[15px] ${tokens.textSecondary}`}>
              A member of a dynamic community of tech and data professionals.
            </p>

            <button
              type="button"
              onClick={onJoinCollaborate}
              className={`mt-6 inline-flex h-10 items-center gap-2 whitespace-nowrap shrink-0 rounded-full border px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${tokens.outlineButton}`}
            >
              <span>Join &amp; Collaborate</span>
              <ArrowRight className="h-4 w-4 text-[#1D93FF]" aria-hidden="true" />
            </button>
          </div>

          {/* Right Column Featured Group Card */}
          <div className="lg:col-span-8">
            <div
              className={`rounded-2xl border p-6 transition-colors duration-150 sm:p-7 ${tokens.cardBg} ${tokens.cardBorder}`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border ${
                    tokens.isDark
                      ? 'border-[#1E3B70] bg-gradient-to-br from-[#0E244D] to-[#081329]'
                      : 'border-[#CBD8EE] bg-[#EEF4FF]'
                  }`}
                >
                  <Users className="h-10 w-10 text-[#1D93FF]" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className={`font-display text-lg font-bold sm:text-xl ${tokens.textPrimary}`}>
                    Data &amp; Technology Professionals
                  </h3>
                  <p className={`mt-1 text-sm ${tokens.textSecondary}`}>
                    Data, AI, Web &amp; Digital Solutions Community
                  </p>

                  {/* 4 Interactive Specialization Focus Items */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {CIRCLE_TOPICS.map((topic) => {
                      const isSelected = selectedTopicId === topic.id;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() =>
                            setSelectedTopicId((prev) => (prev === topic.id ? null : topic.id))
                          }
                          aria-pressed={isSelected}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${
                            isSelected
                              ? tokens.isDark
                                ? 'border-[#10B981]/80 bg-[#10B981]/15 text-emerald-300'
                                : 'border-[#059669] bg-[#10B981]/15 text-[#065F46]'
                              : tokens.isDark
                              ? 'border-[#1E3663] bg-[#09142A] text-[#D7E3F7] hover:border-[#10B981]/60'
                              : 'border-[#DCE5F4] bg-[#F6F9FF] text-[#1C3156] hover:border-[#10B981]'
                          }`}
                        >
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-[#10B981]"
                            aria-hidden="true"
                          />
                          <span className="truncate">{topic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {activeTopic && (
                <div
                  className={`mt-4 rounded-xl border px-4 py-3 text-xs leading-relaxed sm:text-sm ${
                    tokens.isDark
                      ? 'border-[#1E3B70] bg-[#081226] text-[#B7C8E4]'
                      : 'border-[#DCE5F4] bg-[#F5F8FF] text-[#334669]'
                  }`}
                >
                  <span className={`font-semibold ${tokens.textPrimary}`}>
                    {activeTopic.label}:{' '}
                  </span>
                  {activeTopic.detail}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
