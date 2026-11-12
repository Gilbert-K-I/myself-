import React, { useState } from 'react';
import { ArrowRight, Award, Check, Copy, Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { ThemeTokens } from '../types/settings';

interface ContactFooterProps {
  tokens: ThemeTokens;
  onOpenContactModal: () => void;
  onOpenWhatsApp: () => void;
  onCopyContact: (label: string, value: string) => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  tokens,
  onOpenContactModal,
  onOpenWhatsApp,
  onCopyContact,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (label: string, value: string) => {
    onCopyContact(label, value);
    setCopiedKey(label);
    window.setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* Vibrant Blue Wave CTA Banner matching the reference image */}
      <div
        className="relative overflow-hidden border-t border-[#1D6BE0]/40"
        style={{
          background:
            'linear-gradient(110deg, #072264 0%, #0A46C7 45%, #07339A 78%, #041A52 100%)',
        }}
      >
        {/* Subtle geometric wave mesh overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 120%, rgba(56, 189, 248, 0.55) 0%, transparent 55%), radial-gradient(circle at 20% 0%, rgba(37, 99, 235, 0.45) 0%, transparent 50%)',
          }}
        />

        <div className="relative mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-10">
          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <Award className="h-7 w-7 text-[#FBBF24]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                Let&apos;s Work Together
              </h2>
              <p className="mt-1 text-sm text-[#DCE9FF] sm:text-base">
                I&apos;m open for remote opportunities in data, tech and digital solutions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenContactModal}
            className="inline-flex h-12 items-center gap-2.5 whitespace-nowrap shrink-0 rounded-full bg-gradient-to-r from-[#29A0FF] to-[#0D74F3] px-7 text-sm font-bold text-white shadow-[0_10px_28px_rgba(4,20,66,0.45)] transition-all duration-150 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>Get In Touch</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Structured Direct Contact Details & Copyright */}
      <div
        className={`border-t pt-6 pb-20 sm:pb-8 ${
          tokens.isDark
            ? 'border-[#15284B] bg-[#050C1B]'
            : 'border-[#DCE5F4] bg-[#EDF2FA]'
        }`}
      >
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-xs sm:text-sm">
            <a
              href={`mailto:${PROFILE.email}`}
              className={`inline-flex items-center gap-2 break-all font-medium transition-colors hover:text-[#1D93FF] ${tokens.textSecondary}`}
            >
              <Mail className="h-4 w-4 shrink-0 text-[#1D93FF]" aria-hidden="true" />
              <span>{PROFILE.email}</span>
            </a>

            <button
              type="button"
              onClick={() => handleCopy('Email', PROFILE.email)}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                tokens.isDark
                  ? 'bg-white/5 text-[#9EB5D9] hover:bg-white/10 hover:text-white'
                  : 'bg-white text-[#334669] hover:text-[#0B1730]'
              }`}
              title="Copy email address"
            >
              {copiedKey === 'Email' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={`tel:${PROFILE.phone.replace(/\s+/g, '')}`}
              className={`inline-flex items-center gap-2 font-mono-tabular font-medium transition-colors hover:text-[#1D93FF] ${tokens.textSecondary}`}
            >
              <Phone className="h-4 w-4 shrink-0 text-[#1D93FF]" aria-hidden="true" />
              <span>{PROFILE.phone}</span>
            </a>

            <button
              type="button"
              onClick={() => handleCopy('Phone', PROFILE.phone)}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                tokens.isDark
                  ? 'bg-white/5 text-[#9EB5D9] hover:bg-white/10 hover:text-white'
                  : 'bg-white text-[#334669] hover:text-[#0B1730]'
              }`}
              title="Copy phone number"
            >
              {copiedKey === 'Phone' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/45 bg-[#25D366]/10 px-3 py-1 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>WhatsApp Bot</span>
            </button>

            <span className={`inline-flex flex-wrap items-center gap-1.5 ${tokens.textMuted}`}>
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#1D93FF]" aria-hidden="true" />
              <span>{PROFILE.location}</span>
              <span aria-hidden="true">·</span>
              <Globe className="h-3.5 w-3.5 shrink-0 text-[#1D93FF]" aria-hidden="true" />
              <span>{PROFILE.availability}</span>
            </span>
          </div>

          <p className={`text-xs ${tokens.textMuted}`}>
            © {new Date().getFullYear()} {PROFILE.fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
