import React from 'react';
import { ViewRoute, Language } from '../types';
import { translations } from '../utils/i18n';
import { Building2 } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigate: (route: ViewRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const t = translations[language];

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] py-10 mt-auto transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg overflow-hidden bg-white p-0.5 border border-[#0d7c70]/20 dark:border-slate-700 shadow-2xs">
            <img
              src="/ksop_logo.png"
              alt="KSOP Logo"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-extrabold text-[#0d7c70] dark:text-[#14b8a6] text-sm tracking-tight">
              KSOP
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.footer.copy}</span>
          </div>
        </div>

        {/* Center / Rights */}
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          {t.footer.rights}
        </p>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('institution')}
            className="flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>{t.footer.institution}</span>
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0d7c70] dark:hover:text-[#14b8a6] transition-colors"
          >
            {t.footer.about}
          </button>
        </div>
      </div>
    </footer>
  );
};
