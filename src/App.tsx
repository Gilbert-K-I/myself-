import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CircleSection } from './components/CircleSection';
import { ContactFooter } from './components/ContactFooter';
import { CVViewerModal } from './components/CVViewerModal';
import { ExperienceSection } from './components/ExperienceSection';
import { HeroSection } from './components/HeroSection';
import { AllCredentialsModal, ContactModal, SkillDetailModal } from './components/Modals';
import { ProfileSettingsDrawer } from './components/ProfileSettingsDrawer';
import { SkillsSection } from './components/SkillsSection';
import { NavSectionId, TopNav } from './components/TopNav';
import { WhatsAppBot } from './components/WhatsAppBot';
import { WorkSampleModal } from './components/WorkSampleModal';
import { WorkSamplesSection } from './components/WorkSamplesSection';
import { WorkspaceHub } from './components/WorkspaceHub';
import { COMPETENCY_CARDS, CompetencyCard } from './data/portfolioData';
import { WorkSample } from './data/workSamplesData';
import {
  DEFAULT_SETTINGS,
  getThemeTokens,
  PortfolioSettings,
} from './types/settings';

const SETTINGS_STORAGE_KEY = 'gilbert_portfolio_settings_v1';

function loadStoredSettings(): PortfolioSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function App() {
  const [settings, setSettings] = useState<PortfolioSettings>(loadStoredSettings);
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'profile' | 'settings'>('profile');
  const [selectedSkill, setSelectedSkill] = useState<CompetencyCard | null>(null);
  const [credentialsModal, setCredentialsModal] = useState<{
    open: boolean;
    tab: 'skills' | 'education' | 'summary';
  }>({ open: false, tab: 'skills' });
  const [contactModal, setContactModal] = useState<{
    open: boolean;
    subject: string;
  }>({ open: false, subject: 'Remote Opportunity / Collaboration' });
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [selectedSampleSkillId, setSelectedSampleSkillId] = useState<string>(
    COMPETENCY_CARDS[0].id
  );
  const [activeSampleModal, setActiveSampleModal] = useState<{
    sample: WorkSample;
    siblings: WorkSample[];
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const tokens = useMemo(() => getThemeTokens(settings.theme), [settings.theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }
    const root = document.documentElement;
    if (tokens.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.scrollBehavior = settings.reducedMotion ? 'auto' : 'smooth';
  }, [settings, tokens.isDark]);

  useEffect(() => {
    const hasOverlayOpen =
      drawerOpen ||
      Boolean(selectedSkill) ||
      credentialsModal.open ||
      contactModal.open ||
      cvModalOpen ||
      Boolean(activeSampleModal);

    if (!hasOverlayOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [
    drawerOpen,
    selectedSkill,
    credentialsModal.open,
    contactModal.open,
    cvModalOpen,
    activeSampleModal,
  ]);

  useEffect(() => {
    const sectionIds: NavSectionId[] = [
      'home',
      'skills',
      'experience',
      'samples',
      'groups',
      'workspace',
      'contact',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as NavSectionId);
          }
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0.05 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScrollBottom = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      if (reachedBottom) {
        setActiveSection('contact');
      }
    };

    window.addEventListener('scroll', handleScrollBottom, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollBottom);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2600);
  }, []);

  const handleNavigate = useCallback(
    (section: NavSectionId) => {
      setActiveSection(section);
      const target = document.getElementById(section);
      if (target) {
        target.scrollIntoView({
          behavior: settings.reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    },
    [settings.reducedMotion]
  );

  const handleCopyContact = useCallback(
    (label: string, value: string) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(() => {});
      }
      showToast(`${label} copied: ${value}`);
    },
    [showToast]
  );

  const handleUpdateSettings = useCallback((partial: Partial<PortfolioSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleResetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    showToast('Settings reset to reference defaults');
  }, [showToast]);

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-200 ${tokens.pageBg}`}>
      <TopNav
        activeSection={activeSection}
        tokens={tokens}
        onNavigate={handleNavigate}
        onOpenProfileDrawer={(tab) => {
          setDrawerTab(tab);
          setDrawerOpen(true);
        }}
        onViewCV={() => setCvModalOpen(true)}
      />

      <main>
        <HeroSection
          tokens={tokens}
          showPhoneInHero={settings.showPhoneInHero}
          onViewExperience={() => handleNavigate('experience')}
          onOpenContact={() =>
            setContactModal({ open: true, subject: 'Remote Opportunity / Collaboration' })
          }
          onOpenWhatsApp={() => setWhatsappOpen(true)}
          onCopyContact={handleCopyContact}
        />

        <SkillsSection
          tokens={tokens}
          onSelectSkill={(skill) => setSelectedSkill(skill)}
          onExploreAllSkills={() => setCredentialsModal({ open: true, tab: 'skills' })}
        />

        <ExperienceSection
          tokens={tokens}
          expandedByDefault={settings.expandedExperienceByDefault}
          onOpenFullCredentials={() =>
            setCredentialsModal({ open: true, tab: 'education' })
          }
          onOpenSample={(sample, siblings) => setActiveSampleModal({ sample, siblings })}
        />

        <WorkSamplesSection
          tokens={tokens}
          selectedSkillId={selectedSampleSkillId}
          onSelectSkillId={setSelectedSampleSkillId}
          onOpenSample={(sample, siblings) => setActiveSampleModal({ sample, siblings })}
        />

        <CircleSection
          tokens={tokens}
          onJoinCollaborate={() =>
            setContactModal({ open: true, subject: 'Join Professional Circle' })
          }
        />

        <WorkspaceHub tokens={tokens} onNotify={showToast} />
      </main>

      <ContactFooter
        tokens={tokens}
        onOpenContactModal={() =>
          setContactModal({ open: true, subject: 'Remote Opportunity / Collaboration' })
        }
        onOpenWhatsApp={() => setWhatsappOpen(true)}
        onCopyContact={handleCopyContact}
      />

      <ProfileSettingsDrawer
        isOpen={drawerOpen}
        activeTab={drawerTab}
        onTabChange={setDrawerTab}
        onClose={() => setDrawerOpen(false)}
        tokens={tokens}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
        onNavigateSection={handleNavigate}
        onOpenCredentials={(tab) => setCredentialsModal({ open: true, tab })}
        onOpenContact={() =>
          setContactModal({ open: true, subject: 'Remote Opportunity / Collaboration' })
        }
        onOpenWhatsApp={() => setWhatsappOpen(true)}
        onViewCV={() => setCvModalOpen(true)}
        onCopyContact={handleCopyContact}
      />

      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        tokens={tokens}
        onOpenContact={() =>
          setContactModal({
            open: true,
            subject: selectedSkill ? `Inquiry: ${selectedSkill.title}` : 'Remote Opportunity / Collaboration',
          })
        }
        onViewSkillSamples={(skillId) => {
          setSelectedSampleSkillId(skillId);
          handleNavigate('samples');
        }}
      />

      <AllCredentialsModal
        isOpen={credentialsModal.open}
        initialTab={credentialsModal.tab}
        onClose={() => setCredentialsModal((prev) => ({ ...prev, open: false }))}
        tokens={tokens}
        onViewCV={() => setCvModalOpen(true)}
      />

      <CVViewerModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        tokens={tokens}
      />

      <ContactModal
        isOpen={contactModal.open}
        initialSubject={contactModal.subject}
        onClose={() => setContactModal((prev) => ({ ...prev, open: false }))}
        onOpenWhatsApp={() => setWhatsappOpen(true)}
        tokens={tokens}
        onCopyContact={handleCopyContact}
      />

      <WorkSampleModal
        sample={activeSampleModal?.sample ?? null}
        siblings={activeSampleModal?.siblings ?? []}
        onSelectSample={(sample) =>
          setActiveSampleModal((prev) => (prev ? { ...prev, sample } : null))
        }
        onClose={() => setActiveSampleModal(null)}
        tokens={tokens}
      />

      <WhatsAppBot
        isOpen={whatsappOpen}
        onOpenChange={setWhatsappOpen}
        tokens={tokens}
        onCopyContact={handleCopyContact}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-xl border border-[#1D93FF]/40 bg-[#08152E] px-4 py-3 text-xs font-semibold text-white shadow-xl sm:right-auto sm:bottom-6 sm:left-6"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#10B981]" aria-hidden="true" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
