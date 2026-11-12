import React, { useEffect } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
} from 'lucide-react';
import { WorkSample } from '../data/workSamplesData';
import { ThemeTokens } from '../types/settings';

interface WorkSampleModalProps {
  sample: WorkSample | null;
  siblings?: WorkSample[];
  onSelectSample?: (sample: WorkSample) => void;
  onClose: () => void;
  tokens: ThemeTokens;
}

export const WorkSampleModal: React.FC<WorkSampleModalProps> = ({
  sample,
  siblings = [],
  onSelectSample,
  onClose,
  tokens,
}) => {
  useEffect(() => {
    if (!sample) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && siblings.length > 1 && onSelectSample) {
        const idx = siblings.findIndex((s) => s.id === sample.id);
        if (idx >= 0) {
          onSelectSample(siblings[(idx + 1) % siblings.length]);
        }
      } else if (e.key === 'ArrowLeft' && siblings.length > 1 && onSelectSample) {
        const idx = siblings.findIndex((s) => s.id === sample.id);
        if (idx >= 0) {
          onSelectSample(siblings[(idx - 1 + siblings.length) % siblings.length]);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sample, siblings, onSelectSample, onClose]);

  if (!sample) return null;

  const currentIdx = siblings.findIndex((s) => s.id === sample.id);
  const hasNavigation = siblings.length > 1 && currentIdx >= 0 && Boolean(onSelectSample);

  const goPrev = () => {
    if (!hasNavigation || !onSelectSample) return;
    onSelectSample(siblings[(currentIdx - 1 + siblings.length) % siblings.length]);
  };

  const goNext = () => {
    if (!hasNavigation || !onSelectSample) return;
    onSelectSample(siblings[(currentIdx + 1) % siblings.length]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={sample.title}
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative z-10 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${tokens.modalBg}`}
      >
        {/* Header */}
        <div
          className={`flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 sm:px-6 ${
            tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
          }`}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#1D93FF]">
              <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{sample.deliverableType}</span>
              <span aria-hidden="true">·</span>
              <span className={tokens.textMuted}>{sample.context}</span>
            </div>
            <h3 className={`font-display mt-1 text-lg font-bold sm:text-xl ${tokens.textPrimary}`}>
              {sample.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
              tokens.isDark
                ? 'border-white/15 text-[#B7C8E4] hover:bg-white/10 hover:text-white'
                : 'border-[#DCE5F4] text-[#334669] hover:bg-[#F0F5FF]'
            }`}
            aria-label="Close work sample"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <p className={`text-sm leading-relaxed ${tokens.textSecondary}`}>{sample.summary}</p>

          {/* Structured Deliverable Preview */}
          <div
            className={`rounded-xl border p-4 ${
              tokens.isDark ? 'border-[#1E3A6B] bg-[#060E1F]' : 'border-[#DCE5F4] bg-[#F7FAFF]'
            }`}
          >
            <div className={`mb-3 text-[11px] font-bold uppercase tracking-wider ${tokens.textMuted}`}>
              Deliverable Preview
            </div>

            {sample.preview.kind === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[460px] border-collapse text-left text-xs">
                  <thead>
                    <tr
                      className={`border-b ${
                        tokens.isDark ? 'border-white/15 text-[#9EB5D9]' : 'border-[#CBD8EE] text-[#334669]'
                      }`}
                    >
                      {sample.preview.columns.map((col) => (
                        <th key={col} className="px-2.5 py-2 font-bold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      tokens.isDark ? 'divide-white/10' : 'divide-[#DCE5F4]'
                    }`}
                  >
                    {sample.preview.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-2.5 py-2.5 font-mono-tabular ${
                              cIdx === 0 ? `font-semibold ${tokens.textPrimary}` : tokens.textSecondary
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {sample.preview.kind === 'checklist' && (
              <div className="space-y-4">
                {sample.preview.sections.map((section) => (
                  <div key={section.heading}>
                    <h4 className={`text-xs font-bold ${tokens.textPrimary}`}>{section.heading}</h4>
                    <ul className={`mt-2 space-y-2 text-xs leading-relaxed ${tokens.textSecondary}`}>
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10B981]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {sample.preview.kind === 'spec' && (
              <div className="space-y-3">
                {sample.preview.blocks.map((block) => (
                  <div
                    key={block.label}
                    className={`rounded-lg border p-3 ${
                      tokens.isDark
                        ? 'border-[#1B335E] bg-[#0B1730]'
                        : 'border-[#DCE5F4] bg-white'
                    }`}
                  >
                    <div className={`text-xs font-bold ${tokens.accentText}`}>{block.label}</div>
                    <p className={`mt-1 text-xs leading-relaxed ${tokens.textSecondary}`}>
                      {block.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tools & Outcome */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className={`rounded-xl border p-3.5 ${tokens.cardBg} ${tokens.cardBorder}`}>
              <div className={`text-[11px] font-bold uppercase tracking-wider ${tokens.textMuted}`}>
                Tools &amp; Methods
              </div>
              <p className={`mt-1.5 text-xs font-medium leading-relaxed ${tokens.textPrimary}`}>
                {sample.toolsUsed.join(' · ')}
              </p>
            </div>
            <div className={`rounded-xl border p-3.5 ${tokens.cardBg} ${tokens.cardBorder}`}>
              <div className={`text-[11px] font-bold uppercase tracking-wider ${tokens.textMuted}`}>
                Measured Outcome
              </div>
              <p className={`mt-1.5 text-xs leading-relaxed ${tokens.textSecondary}`}>
                {sample.outcome}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div
          className={`flex shrink-0 flex-wrap items-center justify-between gap-3 border-t px-5 py-3.5 sm:px-6 ${
            tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
          }`}
        >
          {hasNavigation ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-xs font-semibold ${tokens.outlineButton}`}
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Previous</span>
              </button>
              <span className={`font-mono-tabular text-xs ${tokens.textMuted}`}>
                {currentIdx + 1} / {siblings.length}
              </span>
              <button
                type="button"
                onClick={goNext}
                className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-xs font-semibold ${tokens.outlineButton}`}
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg bg-[#1684FF] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#0B6EF0]"
          >
            Close Sample
          </button>
        </div>
      </div>
    </div>
  );
};
