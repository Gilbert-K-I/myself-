import React, { useState } from 'react';
import { FileText, Menu, Settings, User, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { ThemeTokens } from '../types/settings';

export type NavSectionId =
  | 'home'
  | 'skills'
  | 'experience'
  | 'samples'
  | 'groups'
  | 'workspace'
  | 'contact';

interface TopNavProps {
  activeSection: NavSectionId;
  tokens: ThemeTokens;
  onNavigate: (section: NavSectionId) => void;
  onOpenProfileDrawer: (initialTab: 'profile' | 'settings') => void;
  onViewCV: () => void;
}

const NAV_ITEMS: { id: NavSectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'samples', label: 'Samples' },
  { id: 'groups', label: 'Groups' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'contact', label: 'Contact' },
];

export const TopNav: React.FC<TopNavProps> = ({
  activeSection,
  tokens,
  onNavigate,
  onOpenProfileDrawer,
  onViewCV,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: NavSectionId) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${tokens.headerBg}`}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        {/* Left: Brand & User Profile Trigger */}
        <button
          type="button"
          onClick={() => onOpenProfileDrawer('profile')}
          className="group flex items-center gap-3 rounded-lg py-1 pr-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF]"
          aria-label="Open Gilbert Kariithi Ihugo profile navigation"
          title="Open Profile Navigation"
        >
          <span className="font-display flex items-center text-[26px] font-extrabold leading-none tracking-tighter">
            <span className="text-[#1D93FF]">G</span>
            <span className={tokens.textPrimary}>K</span>
          </span>
          <span
            className={`hidden h-7 w-px sm:block ${
              tokens.isDark ? 'bg-[#264173]' : 'bg-[#CBD8EE]'
            }`}
            aria-hidden="true"
          />
          <span className="hidden flex-col sm:flex">
            <span
              className={`font-display whitespace-nowrap text-sm font-bold leading-tight transition-colors group-hover:text-[#1D93FF] ${tokens.textPrimary}`}
            >
              {PROFILE.fullName}
            </span>
            <span className={`whitespace-nowrap text-[11px] font-medium ${tokens.textMuted}`}>
              {PROFILE.tagline}
            </span>
          </span>
        </button>

        {/* Center: Primary Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-0.5 lg:flex xl:gap-1.5"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] xl:px-3.5 ${
                  isActive
                    ? tokens.navLinkActive
                    : `${tokens.navLink} hover:bg-[#1684FF]/10`
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (CV + User Profile & Settings) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onViewCV}
            className={`hidden items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] sm:inline-flex ${
              tokens.isDark
                ? 'border-[#2B487D] bg-[#0B1730]/90 text-white hover:border-[#3E97FF] hover:bg-[#13264B]'
                : 'border-[#CBD8EE] bg-white text-[#0B1730] hover:border-[#1684FF] hover:bg-[#F0F6FF]'
            }`}
            aria-label="View CV"
          >
            <FileText className="h-3.5 w-3.5 text-[#1D93FF]" aria-hidden="true" />
            <span>CV</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenProfileDrawer('profile')}
            className={`inline-flex h-10 items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border px-2.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${
              tokens.isDark
                ? 'border-[#2B487D] bg-[#0B1730]/90 text-white hover:border-[#3E97FF] hover:bg-[#13264B]'
                : 'border-[#CBD8EE] bg-white text-[#0B1730] hover:border-[#1684FF] hover:bg-[#F0F6FF]'
            }`}
            aria-label="User profile navigation"
            title="Profile Navigation"
          >
            <img
              src={PROFILE.avatarUrl}
              alt={PROFILE.fullName}
              referrerPolicy="no-referrer"
              className="h-6 w-6 rounded-full object-cover ring-1 ring-[#1D93FF]/60"
            />
            <span className="hidden lg:inline">Profile</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenProfileDrawer('settings')}
            className={`inline-flex h-10 w-10 items-center justify-center shrink-0 rounded-lg border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D93FF] ${
              tokens.isDark
                ? 'border-[#2B487D] bg-[#0B1730]/90 text-[#B7C8E4] hover:border-[#3E97FF] hover:bg-[#13264B] hover:text-white'
                : 'border-[#CBD8EE] bg-white text-[#334669] hover:border-[#1684FF] hover:bg-[#F0F6FF] hover:text-[#0B1730]'
            }`}
            aria-label="Open portfolio settings"
            title="Settings"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border lg:hidden ${
              tokens.isDark
                ? 'border-[#2B487D] bg-[#0B1730] text-white'
                : 'border-[#CBD8EE] bg-white text-[#0B1730]'
            }`}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div
          className={`border-t px-4 py-3 lg:hidden ${
            tokens.isDark ? 'border-[#1A2F56] bg-[#071126]' : 'border-[#DCE5F4] bg-white'
          }`}
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${
                    isActive ? tokens.navLinkActive : tokens.navLink
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div
              className={`mt-2 flex items-center gap-2 border-t pt-2 ${
                tokens.isDark ? 'border-white/10' : 'border-[#DCE5F4]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onViewCV();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1684FF] px-3 py-2.5 text-xs font-semibold text-white"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                <span>CV</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfileDrawer('profile');
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold ${tokens.outlineButton}`}
              >
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
