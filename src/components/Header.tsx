import React, { useState } from 'react';
import { ViewRoute, Language, StudentProfile, Theme } from '../types';
import { translations, getTranslation } from '../utils/i18n';
import {
  Bookmark,
  User,
  Menu,
  X,
  Globe,
  Sparkles,
  Building2,
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  currentRoute: ViewRoute;
  onNavigate: (route: ViewRoute) => void;
  language: Language;
  onToggleLanguage: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  savedCount: number;
  profile: StudentProfile | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  savedCount,
  profile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const handleNavClick = (route: ViewRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const avatarInitial = profile?.name ? profile.name.trim().charAt(0).toUpperCase() : 'G';
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#0d7c70]/10 dark:border-slate-800 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Link */}
        <button
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d7c70] rounded-xl p-1"
          aria-label="KSOP Home"
        >
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 shadow-sm ring-1 ring-[#0d7c70]/20 dark:ring-slate-700 transition-transform duration-200 group-hover:scale-105">
            <img
              src="/ksop_logo.png"
              alt="KSOP Kerala Student Opportunity Platform Logo"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('ksop_logo_1790342465769.jpg')) {
                  target.src = '/src/assets/images/ksop_logo_1790342465769.jpg';
                }
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 font-extrabold tracking-tight text-xl text-[#0d7c70] dark:text-[#14b8a6] leading-none">
              KSOP
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#e28b22]"></span>
            </span>
            <small className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
              {t.brand.tagline}
            </small>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              currentRoute === 'home'
                ? 'bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              currentRoute === 'dashboard'
                ? 'bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
            }`}
          >
            {t.nav.explore}
          </button>
          <button
            onClick={() => handleNavClick('saved')}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              currentRoute === 'saved'
                ? 'bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            {t.nav.saved}
            {savedCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#0d7c70] dark:bg-[#14b8a6] px-1.5 text-[11px] font-bold text-white shadow-xs">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('institution')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              currentRoute === 'institution'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold border border-amber-300/40'
                : 'text-amber-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
            title="Colleges, Companies & Govt departments"
          >
            <Building2 className="h-4 w-4 text-[#e28b22]" />
            <span>{t.nav.institution}</span>
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              currentRoute === 'about'
                ? 'bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800'
            }`}
          >
            {t.nav.how}
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 hover:bg-[#0d7c70]/5 dark:hover:bg-slate-700 transition-all focus:outline-none"
            aria-label={isDark ? t.theme.light : t.theme.dark}
            title={isDark ? t.theme.light : t.theme.dark}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600 transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="group flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 hover:bg-[#0d7c70]/5 dark:hover:bg-slate-700 hover:text-[#0d7c70] dark:hover:text-[#14b8a6] transition-colors focus:outline-none"
            aria-label="Switch language"
            title={language === 'en' ? 'മലയാളത്തിലേക്ക് മാറ്റുക' : 'Switch to English'}
          >
            <Globe className="h-4 w-4 text-[#0d7c70] dark:text-[#14b8a6] transition-transform group-hover:rotate-12" />
            <span className="font-medium">{language === 'en' ? 'മലയാളം' : 'English'}</span>
          </button>

          {/* Profile Chip */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition-all ${
              currentRoute === 'profile'
                ? 'border-[#0d7c70] dark:border-[#14b8a6] bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            aria-label="Open profile"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] text-xs font-bold text-white shadow-xs">
              {avatarInitial}
            </span>
            <span className="text-xs sm:text-sm font-semibold truncate max-w-[110px]">
              {profile?.name ? profile.name : t.nav.profile}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-4 py-4 md:hidden shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold ${
                currentRoute === 'home'
                  ? 'bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{t.nav.home}</span>
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold ${
                currentRoute === 'dashboard'
                  ? 'bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{t.nav.explore}</span>
            </button>
            <button
              onClick={() => handleNavClick('saved')}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold ${
                currentRoute === 'saved'
                  ? 'bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span>{t.nav.saved}</span>
              </div>
              {savedCount > 0 && (
                <span className="rounded-full bg-[#0d7c70] px-2 py-0.5 text-xs font-bold text-white">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('institution')}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold ${
                currentRoute === 'institution'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                  : 'text-amber-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              <Building2 className="h-4 w-4 text-[#e28b22]" />
              <span>{t.nav.institution}</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold ${
                currentRoute === 'about'
                  ? 'bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{t.nav.how}</span>
            </button>
            <button
              onClick={() => handleNavClick('profile')}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                currentRoute === 'profile'
                  ? 'bg-[#0d7c70]/10 dark:bg-[#0d7c70]/20 text-[#0d7c70] dark:text-[#14b8a6]'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <User className="h-4 w-4" />
              <span>{profile?.name ? profile.name : t.nav.profile}</span>
            </button>

            {/* Mobile Theme Toggle Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3 py-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t.theme.toggle}
              </span>
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                {isDark ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    <span>{t.theme.light}</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-slate-600" />
                    <span>{t.theme.dark}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
