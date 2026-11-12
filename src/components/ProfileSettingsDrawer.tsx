import React, { useEffect } from 'react';
import {
  Award,
  Briefcase,
  Check,
  ChevronRight,
  Copy,
  FileText,
  Globe,
  Layers,
  LayoutGrid,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { PortfolioSettings, ThemeMode, ThemeTokens } from '../types/settings';
import { NavSectionId } from './TopNav';

interface ProfileSettingsDrawerProps {
  isOpen: boolean;
  activeTab: 'profile' | 'settings';
  onTabChange: (tab: 'profile' | 'settings') => void;
  onClose: () => void;
  tokens: ThemeTokens;
  settings: PortfolioSettings;
  onUpdateSettings: (partial: Partial<PortfolioSettings>) => void;
  onResetSettings: () => void;
  onNavigateSection: (section: NavSectionId) => void;
  onOpenCredentials: (tab: 'skills' | 'education' | 'summary') => void;
  onOpenContact: () => void;
  onOpenWhatsApp: () => void;
  onViewCV: () => void;
  onCopyContact: (label: string, value: string) => void;
}

const THEME_OPTIONS: { id: ThemeMode; label: string; desc: string; swatch: string }[] = [
  {
    id: 'navy',
    label: 'Midnight Navy',
    desc: 'Reference portfolio palette',
    swatch: 'bg-gradient-to-br from-[#060E1F] via-[#0D1A33] to-[#1D8FFF]',
  },
  {
    id: 'obsidian',
    label: 'Deep Obsidian',
    desc: 'High-contrast carbon dark',
    swatch: 'bg-gradient-to-br from-[#05080F] via-[#121B2E] to-[#2896FF]',
  },
  {
    id: 'light',
    label: 'Crisp Light',
    desc: 'Daylight slate & cobalt',
    swatch: 'bg-gradient-to-br from-[#F4F7FC] via-[#FFFFFF] to-[#1684FF]',
  },
];

export const ProfileSettingsDrawer: React.FC<ProfileSettingsDrawerProps> = ({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
  tokens,
  settings,
  onUpdateSettings,
  onResetSettings,
  onNavigateSection,
  onOpenCredentials,
  onOpenContact,
  onOpenWhatsApp,
  onViewCV,
  onCopyContact,
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

  const navTargets: {
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    action: () => void;
  }[] = [
    {
      label: 'Profile Overview & Summary',
      sublabel: 'Hero bio, location & availability',
      icon: <User className="h-4 w-4 text-[#1D93FF]" aria-hidden="true" />,
      action: () => {
        onNavigateSection('home');
        onClose();
      },
    },
    {
      label: 'Core Competencies',
      sublabel: '10 skill pillars & technical tools',
      icon: <Layers className="h-4 w-4 text-[#10B981]" aria-hidden="true" />,
      action: () => {
        onNavigateSection('skills');
        onClose();
      },
    },
    {
      label: 'Professional Journey',
      sublabel: '2020 – Present experience & role samples',
      icon: <Briefcase className="h-4 w-4 text-[#3B82F6]" aria-hidden="true" />,
      action: () => {
        onNavigateSection('experience');
        onClose();
      },
    },
    {
      label: 'Work Samples by Skill',
      sublabel: '3 deliverables for each core skill',
      icon: <FileText className="h-4 w-4 text-[#10B981]" aria-hidden="true" /> ,
      action: () => {
        onNavigateSection('samples');
        onClose();
      },
    },
    {
      label: 'Education & Certifications',
      sublabel: 'NIBS, NITA, HP LIFE & IBM credentials',
      icon: <Award className="h-4 w-4 text-[#8B5CF6]" aria-hidden="true" />,
      action: () => {
        onClose();
        onOpenCredentials('education');
      },
    },
    {
      label: 'Professional Circle',
      sublabel: 'Data & Technology Professionals',
      icon: <Users className="h-4 w-4 text-[#06B6D4]" aria-hidden="true" />,
      action: () => {
        onNavigateSection('groups');
        onClose();
      },
    },
    {
      label: 'Google Workspace Hub',
      sublabel: 'Gmail, Contacts, Calendar, Tasks, Forms',
      icon: <LayoutGrid className="h-4 w-4 text-[#1D93FF]" aria-hidden="true" />,
      action: () => {
        onNavigateSection('workspace');
        onClose();
      },
    },
    {
      label: 'Contact & Inquiry',
      sublabel: 'Direct message, email & phone',
      icon: <Mail className="h-4 w-4 text-[#1D93FF]" aria-hidden="true" />,
      action: () => {
        onClose();
        onOpenContact();
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="User Profile Navigation and Settings"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <aside
        className={`relative z-10 flex h-[100dvh] w-full max-w-md flex-col border-l shadow-2xl ${tokens.modalBg}`}
      >
        {/* Drawer Header */}
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${
            tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={PROFILE.avatarUrl}
              alt={PROFILE.fullName}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#1D93FF]/70"
            />
            <div>
              <h2 className={`font-display text-sm font-bold ${tokens.textPrimary}`}>
                {PROFILE.fullName}
              </h2>
              <p className={`text-xs ${tokens.textMuted}`}>{PROFILE.roleTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              tokens.isDark
                ? 'border-white/10 text-[#B7C8E4] hover:bg-white/10 hover:text-white'
                : 'border-[#DCE5F4] text-[#334669] hover:bg-[#F0F5FF]'
            }`}
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="px-5 pt-4">
          <div
            className={`grid grid-cols-2 gap-1 rounded-xl p-1 ${
              tokens.isDark ? 'bg-[#060E1F]' : 'bg-[#EEF3FB]'
            }`}
          >
            <button
              type="button"
              onClick={() => onTabChange('profile')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#1684FF] text-white shadow-sm'
                  : `${tokens.textSecondary} hover:opacity-80`
              }`}
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Profile Navigation</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange('settings')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#1684FF] text-white shadow-sm'
                  : `${tokens.textSecondary} hover:opacity-80`
              }`}
            >
              <Settings className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              {/* Contact Information Card */}
              <div
                className={`rounded-xl border p-4 ${tokens.cardBg} ${tokens.cardBorder}`}
              >
                <h3 className={`text-xs font-bold uppercase tracking-wider ${tokens.accentText}`}>
                  Direct Contact Information
                </h3>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className={`flex min-w-0 items-center gap-2 truncate font-medium hover:text-[#1D93FF] ${tokens.textPrimary}`}
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0 text-[#1D93FF]" aria-hidden="true" />
                      <span className="truncate">{PROFILE.email}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onCopyContact('Email', PROFILE.email)}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${
                        tokens.isDark
                          ? 'bg-white/5 text-[#B7C8E4] hover:bg-white/10'
                          : 'bg-[#F0F5FF] text-[#334669] hover:bg-[#DCE7FA]'
                      }`}
                    >
                      <Copy className="h-3 w-3" aria-hidden="true" />
                      <span>Copy</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`tel:${PROFILE.phone.replace(/\s+/g, '')}`}
                      className={`flex items-center gap-2 font-mono-tabular font-medium hover:text-[#1D93FF] ${tokens.textPrimary}`}
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0 text-[#1D93FF]" aria-hidden="true" />
                      <span>{PROFILE.phone}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onCopyContact('Phone', PROFILE.phone)}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${
                        tokens.isDark
                          ? 'bg-white/5 text-[#B7C8E4] hover:bg-white/10'
                          : 'bg-[#F0F5FF] text-[#334669] hover:bg-[#DCE7FA]'
                      }`}
                    >
                      <Copy className="h-3 w-3" aria-hidden="true" />
                      <span>Copy</span>
                    </button>
                  </div>

                  <div className={`flex flex-wrap items-center gap-3 pt-1 ${tokens.textMuted}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#1D93FF]" aria-hidden="true" />
                      {PROFILE.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-[#1D93FF]" aria-hidden="true" />
                      {PROFILE.availability}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenWhatsApp();
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#25D366]/45 bg-[#25D366]/10 px-3 py-2 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Open WhatsApp Bot ({PROFILE.phone})</span>
                  </button>
                </div>
              </div>

              {/* Section Navigation List */}
              <div>
                <h3 className={`mb-2.5 text-xs font-bold uppercase tracking-wider ${tokens.textMuted}`}>
                  Portfolio Sections
                </h3>
                <div className="space-y-2">
                  {navTargets.map((target) => (
                    <button
                      key={target.label}
                      type="button"
                      onClick={target.action}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all duration-150 ${tokens.cardBg} ${tokens.cardBgHover} ${tokens.cardBorder} ${tokens.cardBorderHover}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            tokens.isDark ? 'bg-[#081226]' : 'bg-[#F0F5FF]'
                          }`}
                        >
                          {target.icon}
                        </span>
                        <div>
                          <div className={`text-xs font-bold ${tokens.textPrimary}`}>
                            {target.label}
                          </div>
                          <div className={`text-[11px] ${tokens.textMuted}`}>
                            {target.sublabel}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 ${tokens.textMuted}`} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages & Resume Action */}
              <div
                className={`rounded-xl border p-4 text-xs ${tokens.cardBg} ${tokens.cardBorder}`}
              >
                <div className={`font-semibold ${tokens.textPrimary}`}>Languages</div>
                <p className={`mt-1 ${tokens.textSecondary}`}>
                  Swahili — Native · English — Fluent, Professional Working Proficiency
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewCV();
                  }}
                  className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1684FF] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0B6EF0]"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>View CV</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Theme Mode Selection */}
              <div>
                <h3 className={`mb-2.5 text-xs font-bold uppercase tracking-wider ${tokens.textMuted}`}>
                  Color Palette
                </h3>
                <div className="space-y-2.5">
                  {THEME_OPTIONS.map((opt) => {
                    const isSelected = settings.theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onUpdateSettings({ theme: opt.id })}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-[#1D93FF] bg-[#1684FF]/10'
                            : `${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderHover}`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-9 w-9 shrink-0 rounded-lg border border-white/15 ${opt.swatch}`}
                            aria-hidden="true"
                          />
                          <div>
                            <div className={`text-xs font-bold ${tokens.textPrimary}`}>
                              {opt.label}
                            </div>
                            <div className={`text-[11px] ${tokens.textMuted}`}>{opt.desc}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1684FF] text-white">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Preferences */}
              <div>
                <h3 className={`mb-2.5 text-xs font-bold uppercase tracking-wider ${tokens.textMuted}`}>
                  Display Preferences
                </h3>
                <div className="space-y-2.5">
                  <label
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 ${tokens.cardBg} ${tokens.cardBorder}`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${tokens.textPrimary}`}>
                        Expand Experience Details
                      </div>
                      <div className={`text-[11px] ${tokens.textMuted}`}>
                        Show full resume bullet points automatically
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.expandedExperienceByDefault}
                      onChange={(e) =>
                        onUpdateSettings({ expandedExperienceByDefault: e.target.checked })
                      }
                      className="h-4 w-4 accent-[#1684FF]"
                    />
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 ${tokens.cardBg} ${tokens.cardBorder}`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${tokens.textPrimary}`}>
                        Show Phone in Hero Bar
                      </div>
                      <div className={`text-[11px] ${tokens.textMuted}`}>
                        Display +254 746 750 677 alongside email
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showPhoneInHero}
                      onChange={(e) =>
                        onUpdateSettings({ showPhoneInHero: e.target.checked })
                      }
                      className="h-4 w-4 accent-[#1684FF]"
                    />
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 ${tokens.cardBg} ${tokens.cardBorder}`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${tokens.textPrimary}`}>
                        Reduced Motion
                      </div>
                      <div className={`text-[11px] ${tokens.textMuted}`}>
                        Minimize hover lift and scroll transitions
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) =>
                        onUpdateSettings({ reducedMotion: e.target.checked })
                      }
                      className="h-4 w-4 accent-[#1684FF]"
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={onResetSettings}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-colors ${tokens.outlineButton}`}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset to Reference Defaults</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
