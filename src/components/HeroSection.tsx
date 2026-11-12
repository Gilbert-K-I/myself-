import React, { useState } from 'react';
import { ArrowRight, Briefcase, Check, Copy, Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { ThemeTokens } from '../types/settings';

interface HeroSectionProps {
  tokens: ThemeTokens;
  showPhoneInHero: boolean;
  onViewExperience: () => void;
  onOpenContact: () => void;
  onOpenWhatsApp: () => void;
  onCopyContact: (label: string, value: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  tokens,
  showPhoneInHero,
  onViewExperience,
  onOpenContact,
  onOpenWhatsApp,
  onCopyContact,
}) => {
  const [imgError, setImgError] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (field: string, value: string) => {
    onCopyContact(field, value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <section
      id="home"
      className={`relative overflow-hidden border-b ${tokens.divider} ${tokens.heroGradient}`}
    >
      {/* Subtle architectural ambient glow matching the studio blue backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background: tokens.isDark
            ? 'radial-gradient(circle at 76% 38%, rgba(29, 147, 255, 0.24) 0%, rgba(11, 41, 102, 0.14) 36%, transparent 72%)'
            : 'radial-gradient(circle at 76% 38%, rgba(22, 132, 255, 0.14) 0%, transparent 65%)',
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 pt-10 pb-8 sm:px-6 lg:px-10 lg:pt-14 lg:pb-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Left Hero Typography & Actions */}
          <div className="z-10 lg:col-span-7">
            <div className="mb-4 flex items-center gap-4">
              <span
                className={`text-xs font-bold tracking-[0.16em] uppercase ${
                  tokens.isDark ? 'text-[#C8DAF4]' : 'text-[#1E3A68]'
                }`}
              >
                {PROFILE.eyebrow}
              </span>
              <span className="h-[2px] w-14 bg-[#1D93FF]" aria-hidden="true" />
            </div>

            <h1
              className="font-display text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[54px]"
            >
              <span className={tokens.textPrimary}>{PROFILE.firstName} </span>
              <span className="text-[#1D93FF]">{PROFILE.lastName}</span>
            </h1>

            <p
              className={`font-display mt-3 text-xl font-semibold tracking-tight sm:text-2xl ${
                tokens.isDark ? 'text-[#E3ECFA]' : 'text-[#1B2F52]'
              }`}
            >
              {PROFILE.roleTitle}
            </p>

            <p
              className={`mt-4 max-w-xl text-base leading-relaxed sm:text-[17px] ${tokens.textSecondary}`}
            >
              {PROFILE.heroSummary}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onViewExperience}
                className="inline-flex h-11 items-center gap-2.5 whitespace-nowrap shrink-0 rounded-full bg-gradient-to-r from-[#2298FF] to-[#0B6EF0] px-6 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(19,126,255,0.4)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(19,126,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60B4FF]"
              >
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                <span>View My Experience</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenContact}
                className={`inline-flex h-11 items-center gap-2.5 whitespace-nowrap shrink-0 rounded-full border px-6 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${tokens.outlineButton}`}
              >
                <Mail className="h-4 w-4 text-[#1D93FF]" aria-hidden="true" />
                <span>Contact Me</span>
              </button>
            </div>

            {/* Contact Info Strip */}
            <div
              className={`mt-9 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t pt-5 text-sm ${
                tokens.isDark ? 'border-white/10' : 'border-[#CBD8EE]'
              }`}
            >
              <div className={`inline-flex items-center gap-2 ${tokens.textSecondary}`}>
                <MapPin className="h-4 w-4 shrink-0 text-[#89A5D1]" aria-hidden="true" />
                <span>{PROFILE.location}</span>
              </div>

              <span className={`hidden h-4 w-px sm:inline-block ${tokens.isDark ? 'bg-white/20' : 'bg-[#CBD8EE]'}`} aria-hidden="true" />

              <div className={`inline-flex items-center gap-2 ${tokens.textSecondary}`}>
                <Globe className="h-4 w-4 shrink-0 text-[#89A5D1]" aria-hidden="true" />
                <span>Open to Remote Work</span>
              </div>

              <span className={`hidden h-4 w-px sm:inline-block ${tokens.isDark ? 'bg-white/20' : 'bg-[#CBD8EE]'}`} aria-hidden="true" />

              <button
                type="button"
                onClick={() => handleCopy('Email', PROFILE.email)}
                className={`group inline-flex items-center gap-2 rounded-md py-0.5 text-left transition-colors hover:text-[#1D93FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${tokens.textSecondary}`}
                title="Click to copy email address"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#89A5D1] group-hover:text-[#1D93FF]" aria-hidden="true" />
                <span>{PROFILE.email}</span>
                {copiedField === 'Email' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-80" aria-hidden="true" />
                )}
              </button>

              {showPhoneInHero && (
                <>
                  <span className={`hidden h-4 w-px lg:inline-block ${tokens.isDark ? 'bg-white/20' : 'bg-[#CBD8EE]'}`} aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => handleCopy('Phone', PROFILE.phone)}
                    className={`group inline-flex items-center gap-2 rounded-md py-0.5 font-mono-tabular text-[13px] transition-colors hover:text-[#1D93FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${tokens.textSecondary}`}
                    title="Click to copy phone number"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-[#89A5D1] group-hover:text-[#1D93FF]" aria-hidden="true" />
                    <span>{PROFILE.phone}</span>
                    {copiedField === 'Phone' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-80" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onOpenWhatsApp}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/45 bg-[#25D366]/10 px-3 py-1 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                    title="Chat with Gilbert's WhatsApp Bot"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>WhatsApp Bot</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Portrait Area */}
          <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
            <div
              className={`relative w-full max-w-[520px] overflow-hidden rounded-2xl border ${
                tokens.isDark
                  ? 'border-[#1E4484]/50 shadow-[0_20px_50px_rgba(3,10,28,0.55)]'
                  : 'border-[#CBD8EE] shadow-[0_16px_40px_rgba(11,23,48,0.12)]'
              }`}
            >
              {!imgError ? (
                <img
                  src={PROFILE.portraitUrl}
                  alt="Gilbert Kariithi Ihugo — Data Entry & Data Support Specialist"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="aspect-[574/423] w-full object-cover object-top"
                />
              ) : (
                <div className="flex aspect-[574/423] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F244D] to-[#061126] p-6 text-center">
                  <span className="font-display text-4xl font-extrabold text-[#1D93FF]">GK</span>
                  <span className="mt-2 text-sm font-medium text-[#B7C8E4]">{PROFILE.fullName}</span>
                </div>
              )}
              {/* Edge blending gradient so portrait merges naturally into the dark navy scene */}
              {tokens.isDark && (
                <div
                  className="pointer-events-none absolute inset-0"
                  aria-hidden="true"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(8,18,40,0.48) 0%, transparent 22%), linear-gradient(0deg, rgba(6,14,31,0.58) 0%, transparent 28%)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
