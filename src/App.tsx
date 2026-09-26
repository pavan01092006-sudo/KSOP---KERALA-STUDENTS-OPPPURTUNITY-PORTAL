/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ViewRoute, Language, StudentProfile, Opportunity, InstitutionUser } from './types';
import { opportunitiesData } from './data/opportunities';
import { translations } from './utils/i18n';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ProfileView } from './components/ProfileView';
import { DashboardView } from './components/DashboardView';
import { SavedView } from './components/SavedView';
import { AboutView } from './components/AboutView';
import { InstitutionPortal } from './components/InstitutionPortal';
import { Footer } from './components/Footer';
import { OpportunityDialog } from './components/OpportunityDialog';
import { AiPortfolioModal } from './components/AiPortfolioModal';
import { Toast } from './components/Toast';

const STORAGE_KEY_PROFILE = 'ksop_user_profile';
const STORAGE_KEY_SAVED = 'ksop_saved_opportunities';
const STORAGE_KEY_LANG = 'ksop_user_language';
const STORAGE_KEY_CUSTOM_OPPS = 'ksop_custom_opportunities';
const STORAGE_KEY_INST_USER = 'ksop_institution_user';
const STORAGE_KEY_THEME = 'ksop_theme_preference';

const defaultProfile: StudentProfile = {
  name: 'Gautham',
  course: 'undergraduate',
  branch: 'computer-science',
  year: '3',
  college: 'Government Engineering College, Barton Hill',
  district: 'kochi',
  interests: ['ai-ml', 'web-dev', 'robotics-iot'],
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<ViewRoute>('home');
  const [language, setLanguage] = useState<Language>('en');
  // Detect theme from localStorage or OS system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  });
  const [profile, setProfile] = useState<StudentProfile | null>(defaultProfile);
  const [savedIds, setSavedIds] = useState<Set<string>>(
    new Set(['nit-calicut-innovation-2026', 'kscste-prathibha-scholarship'])
  );

  // Opportunities state (curated + institution submissions)
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_OPPS);
      if (stored) {
        const parsed: Opportunity[] = JSON.parse(stored);
        // Merge with defaults
        const defaultIds = new Set(opportunitiesData.map((o) => o.id));
        const additional = parsed.filter((o) => !defaultIds.has(o.id));
        return [...opportunitiesData, ...additional];
      }
    } catch {}
    return opportunitiesData;
  });

  // Institution user state
  const [institutionUser, setInstitutionUser] = useState<InstitutionUser | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_INST_USER);
      if (savedUser) return JSON.parse(savedUser);
    } catch {}
    return null;
  });

  // Modals state
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [portfolioModalOpp, setPortfolioModalOpp] = useState<Opportunity | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize theme with HTML document element, meta theme-color, and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Update meta theme-color for mobile address bars
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0b111e' : '#0d7c70');
    }

    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {}
  }, [theme]);

  // Listen for system color-scheme changes if user hasn't explicitly set one
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const savedPref = localStorage.getItem(STORAGE_KEY_THEME);
      // If user hasn't saved an explicit preference, adapt automatically
      if (!savedPref) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Sync state from localStorage on first mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === 'en' || savedLang === 'ml') {
        setLanguage(savedLang);
      }

      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }

      const savedProf = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (savedProf) {
        setProfile(JSON.parse(savedProf));
      }

      const savedOppIds = localStorage.getItem(STORAGE_KEY_SAVED);
      if (savedOppIds) {
        setSavedIds(new Set(JSON.parse(savedOppIds)));
      }
    } catch {}

    const hash = window.location.hash.replace('#', '');
    if (['home', 'dashboard', 'saved', 'about', 'profile', 'institution'].includes(hash)) {
      setCurrentRoute(hash as ViewRoute);
    }

    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (['home', 'dashboard', 'saved', 'about', 'profile', 'institution'].includes(h)) {
        setCurrentRoute(h as ViewRoute);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (route: ViewRoute) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    const nextTheme: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, nextTheme);
    } catch {}
    setToastMessage(
      language === 'ml'
        ? nextTheme === 'dark'
          ? translations.ml.theme.switchedDark
          : translations.ml.theme.switchedLight
        : translations.en.theme[nextTheme === 'dark' ? 'switchedDark' : 'switchedLight']
    );
  };

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'ml' : 'en';
    setLanguage(nextLang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, nextLang);
    } catch {}
    setToastMessage(nextLang === 'ml' ? 'ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി' : 'Language switched to English');
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    } catch {}
    setToastMessage(translations[language].profile.savedToast);
  };

  const handleToggleSave = (opp: Opportunity) => {
    setSavedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(opp.id)) {
        updated.delete(opp.id);
        setToastMessage(
          language === 'ml' ? 'ലിസ്റ്റിൽ നിന്ന് നീക്കം ചെയ്തു' : 'Removed from shortlist'
        );
      } else {
        updated.add(opp.id);
        setToastMessage(
          language === 'ml' ? 'അവസരം സേവ് ചെയ്തു' : 'Saved to your shortlist'
        );
      }
      try {
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(Array.from(updated)));
      } catch {}
      return updated;
    });
  };

  const handleShare = (opp: Opportunity) => {
    const oppTitle = language === 'ml' ? opp.titleMl : opp.title;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${oppTitle} - ${window.location.origin}/#dashboard`);
      setToastMessage(
        language === 'ml' ? 'ലിങ്ക് കോപ്പി ചെയ്തു!' : 'Opportunity link copied to clipboard!'
      );
    } else {
      setToastMessage(language === 'ml' ? 'ലിങ്ക് തയ്യാറാണ്' : 'Link ready to share');
    }
  };

  // Institution Actions
  const handleInstitutionLogin = (user: InstitutionUser) => {
    setInstitutionUser(user);
    try {
      localStorage.setItem(STORAGE_KEY_INST_USER, JSON.stringify(user));
    } catch {}
  };

  const handleInstitutionLogout = () => {
    setInstitutionUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_INST_USER);
    } catch {}
    setToastMessage('Signed out of Institution Portal.');
  };

  const handleSubmitOpportunity = (newOpp: Opportunity) => {
    setAllOpportunities((prev) => {
      const updated = [newOpp, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_OPPS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleApproveOpportunity = (oppId: string) => {
    setAllOpportunities((prev) => {
      const updated = prev.map((o) =>
        o.id === oppId ? { ...o, status: 'approved' as const, isVerifiedPartner: true } : o
      );
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_OPPS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRejectOpportunity = (oppId: string) => {
    setAllOpportunities((prev) => {
      const updated = prev.map((o) =>
        o.id === oppId ? { ...o, status: 'rejected' as const } : o
      );
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_OPPS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Opportunities visible on public feed: approved or default (undefined status)
  const publicOpportunities = useMemo(() => {
    return allOpportunities.filter((opp) => opp.status === undefined || opp.status === 'approved');
  }, [allOpportunities]);

  const savedOpportunities = useMemo(() => {
    return allOpportunities.filter((opp) => savedIds.has(opp.id));
  }, [allOpportunities, savedIds]);

  return (
    <div
      lang={language}
      className={`min-h-screen flex flex-col bg-[#fafaf8] dark:bg-[#0b111e] text-[#1e293b] dark:text-slate-100 antialiased transition-colors duration-200 ${
        language === 'ml' ? 'font-malayalam' : ''
      }`}
    >
      {/* App Header with Logo & Controls */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        savedCount={savedIds.size}
        profile={profile}
      />

      {/* Main Views Container */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            language={language}
            featuredOpportunities={publicOpportunities}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectOpportunity={setSelectedOpportunity}
          />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardView
            opportunities={publicOpportunities}
            language={language}
            profile={profile}
            savedIds={savedIds}
            onNavigate={handleNavigate}
            onToggleSave={handleToggleSave}
            onSelectOpportunity={setSelectedOpportunity}
            onGeneratePortfolio={(opp) => setPortfolioModalOpp(opp)}
          />
        )}

        {currentRoute === 'saved' && (
          <SavedView
            savedOpportunities={savedOpportunities}
            language={language}
            onNavigate={handleNavigate}
            onToggleSave={handleToggleSave}
            onSelectOpportunity={setSelectedOpportunity}
          />
        )}

        {currentRoute === 'profile' && (
          <ProfileView
            onNavigate={handleNavigate}
            language={language}
            initialProfile={profile}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {currentRoute === 'institution' && (
          <InstitutionPortal
            language={language}
            onNavigate={handleNavigate}
            currentUser={institutionUser}
            onLogin={handleInstitutionLogin}
            onLogout={handleInstitutionLogout}
            opportunities={allOpportunities}
            onSubmitOpportunity={handleSubmitOpportunity}
            onApproveOpportunity={handleApproveOpportunity}
            onRejectOpportunity={handleRejectOpportunity}
            onNotify={(msg) => setToastMessage(msg)}
          />
        )}

        {currentRoute === 'about' && (
          <AboutView language={language} onNavigate={handleNavigate} />
        )}
      </main>

      {/* Opportunity Details Dialog / Modal (with AI Summarizer & Eligibility Checker) */}
      <OpportunityDialog
        opportunity={selectedOpportunity}
        language={language}
        studentProfile={profile}
        isSaved={selectedOpportunity ? savedIds.has(selectedOpportunity.id) : false}
        onClose={() => setSelectedOpportunity(null)}
        onToggleSave={handleToggleSave}
        onShare={handleShare}
        onOpenPortfolioGenerator={(opp) => setPortfolioModalOpp(opp)}
      />

      {/* AI Tailored Portfolio Generator Modal */}
      <AiPortfolioModal
        isOpen={Boolean(portfolioModalOpp)}
        onClose={() => setPortfolioModalOpp(null)}
        opportunity={portfolioModalOpp}
        studentProfile={profile}
        language={language}
        onNotify={(msg) => setToastMessage(msg)}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Footer */}
      <Footer language={language} onNavigate={handleNavigate} />
    </div>
  );
}
