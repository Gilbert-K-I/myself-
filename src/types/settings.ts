export type ThemeMode = 'navy' | 'obsidian' | 'light';

export interface PortfolioSettings {
  theme: ThemeMode;
  expandedExperienceByDefault: boolean;
  showPhoneInHero: boolean;
  reducedMotion: boolean;
}

export const DEFAULT_SETTINGS: PortfolioSettings = {
  theme: 'navy',
  expandedExperienceByDefault: false,
  showPhoneInHero: true,
  reducedMotion: false,
};

export interface ThemeTokens {
  isDark: boolean;
  pageBg: string;
  headerBg: string;
  cardBg: string;
  cardBgHover: string;
  cardBorder: string;
  cardBorderHover: string;
  surfaceSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  navLink: string;
  navLinkActive: string;
  heroGradient: string;
  divider: string;
  accentText: string;
  outlineButton: string;
  modalBg: string;
  inputBg: string;
}

export function getThemeTokens(theme: ThemeMode): ThemeTokens {
  if (theme === 'light') {
    return {
      isDark: false,
      pageBg: 'bg-[#F4F7FC] text-[#0B1730]',
      headerBg: 'bg-white/90 border-[#DCE5F4] backdrop-blur-md',
      cardBg: 'bg-white',
      cardBgHover: 'hover:bg-[#F8FAFF]',
      cardBorder: 'border-[#DCE5F4]',
      cardBorderHover: 'hover:border-[#1684FF]/60',
      surfaceSubtle: 'bg-[#EBF1FA]',
      textPrimary: 'text-[#0B1730]',
      textSecondary: 'text-[#334669]',
      textMuted: 'text-[#5A6D8E]',
      navLink: 'text-[#334669] hover:text-[#0B1730]',
      navLinkActive: 'bg-[#1684FF] text-white shadow-sm',
      heroGradient:
        'bg-gradient-to-br from-[#EAF1FF] via-[#F4F7FC] to-[#DCE9FF]',
      divider: 'border-[#DCE5F4]',
      accentText: 'text-[#0D6EFD]',
      outlineButton:
        'border-[#1684FF]/60 text-[#0B1730] bg-white/80 hover:bg-[#1684FF]/10 hover:border-[#1684FF]',
      modalBg: 'bg-white border-[#DCE5F4] text-[#0B1730]',
      inputBg: 'bg-[#F8FAFF] border-[#CBD8EE] text-[#0B1730] placeholder:text-[#7B8EAD]',
    };
  }

  if (theme === 'obsidian') {
    return {
      isDark: true,
      pageBg: 'bg-[#05080F] text-white',
      headerBg: 'bg-[#070B14]/90 border-white/10 backdrop-blur-md',
      cardBg: 'bg-[#0C1220]',
      cardBgHover: 'hover:bg-[#121B2E]',
      cardBorder: 'border-white/10',
      cardBorderHover: 'hover:border-[#2F8BFF]/60',
      surfaceSubtle: 'bg-[#101829]',
      textPrimary: 'text-white',
      textSecondary: 'text-[#B5C4DC]',
      textMuted: 'text-[#8194B4]',
      navLink: 'text-[#B5C4DC] hover:text-white',
      navLinkActive: 'bg-[#1684FF] text-white shadow-[0_0_20px_rgba(22,132,255,0.35)]',
      heroGradient:
        'bg-[radial-gradient(ellipse_at_75%_35%,rgba(22,102,224,0.28),rgba(5,8,15,0.98)_68%)]',
      divider: 'border-white/10',
      accentText: 'text-[#2896FF]',
      outlineButton:
        'border-[#2896FF]/60 text-white bg-[#0C1426]/80 hover:bg-[#1684FF]/15 hover:border-[#3FA3FF]',
      modalBg: 'bg-[#0B111E] border-white/15 text-white',
      inputBg: 'bg-[#070B14] border-white/15 text-white placeholder:text-[#6D81A3]',
    };
  }

  // Default: 'navy' — matches Gilbert_Kariithi_Ihugo_Tech_Portfolio-3_cbeaee69.png
  return {
    isDark: true,
    pageBg: 'bg-[#060E1F] text-white',
    headerBg: 'bg-[#071126]/90 border-[#1A2F56]/80 backdrop-blur-md',
    cardBg: 'bg-[#0D1A33]',
    cardBgHover: 'hover:bg-[#122242]',
    cardBorder: 'border-[#1B335E]',
    cardBorderHover: 'hover:border-[#2F8BFF]/70',
    surfaceSubtle: 'bg-[#0F203E]',
    textPrimary: 'text-white',
    textSecondary: 'text-[#B7C8E4]',
    textMuted: 'text-[#89A0C4]',
    navLink: 'text-[#C6D5EE] hover:text-white',
    navLinkActive:
      'bg-gradient-to-r from-[#1D8FFF] to-[#0B6EF0] text-white shadow-[0_4px_18px_rgba(19,126,255,0.38)]',
    heroGradient:
      'bg-[radial-gradient(ellipse_at_72%_42%,rgba(24,108,242,0.34),rgba(7,16,36,0.96)_66%)]',
    divider: 'border-[#162B50]',
    accentText: 'text-[#1D93FF]',
    outlineButton:
      'border-[#1E75E6]/75 text-white bg-[#0A1833]/80 hover:bg-[#1684FF]/15 hover:border-[#4BA3FF]',
    modalBg: 'bg-[#09152B] border-[#1F3A6B] text-white',
    inputBg: 'bg-[#060E1F] border-[#1E3968] text-white placeholder:text-[#6E86AF]',
  };
}
