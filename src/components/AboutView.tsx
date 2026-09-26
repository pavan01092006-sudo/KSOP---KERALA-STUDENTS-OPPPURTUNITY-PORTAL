import React from 'react';
import { Language, ViewRoute } from '../types';
import { translations } from '../utils/i18n';
import { ArrowRight, Sparkles, Building2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface AboutViewProps {
  language: Language;
  onNavigate: (route: ViewRoute) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ language, onNavigate }) => {
  const t = translations[language];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* About Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-block text-xs font-bold tracking-widest text-[#0d7c70] dark:text-[#14b8a6] uppercase">
          {t.about.eyebrow}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.about.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.about.subtitle}
        </p>
      </div>

      {/* How it works 3-step grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <article className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-7 sm:p-8 shadow-xs hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 transition-all">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d7c70]/10 dark:bg-[#14b8a6]/20 text-sm font-extrabold text-[#0d7c70] dark:text-[#14b8a6] mb-5">
            01
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t.about.one.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.about.one.copy}
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-7 sm:p-8 shadow-xs hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 transition-all">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e28b22]/10 dark:bg-amber-950/40 text-sm font-extrabold text-[#e28b22] mb-5">
            02
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t.about.two.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.about.two.copy}
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-7 sm:p-8 shadow-xs hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 transition-all">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-sm font-extrabold text-[#0d7c70] dark:text-[#14b8a6] mb-5">
            03
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t.about.three.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.about.three.copy}
          </p>
        </article>
      </div>

      {/* About Note with Official Logo Emblem */}
      <div className="rounded-3xl border border-[#0d7c70]/20 dark:border-teal-800/40 bg-gradient-to-br from-white dark:from-[#1e293b] via-teal-50/20 dark:via-teal-950/20 to-white dark:to-[#1e293b] p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden bg-white p-1 border border-[#0d7c70]/20 shadow-md">
          <img
            src="/ksop_logo.png"
            alt="KSOP Official Kerala Student Opportunity Platform Emblem"
            className="h-full w-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.about.note.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.about.note.copy}
          </p>
        </div>
      </div>

      {/* Ecosystem Partners Grid */}
      <div className="space-y-6 text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {t.about.ecosystem}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t.about.ecosystemCopy}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[
            { name: 'Kerala Startup Mission', tag: 'KSUM' },
            { name: 'ASAP Kerala', tag: 'Higher Education' },
            { name: 'K-DISC / YIP', tag: 'Govt. of Kerala' },
            { name: 'Digital University Kerala', tag: 'Technocity' },
            { name: 'APJ Abdul Kalam Tech Univ', tag: 'KTU' },
            { name: 'ICFOSS Open Source', tag: 'Govt. Entity' },
            { name: 'Maker Village Kochi', tag: 'Hardware TBI' },
            { name: 'GTech MuLearn', tag: 'Consortium' },
          ].map((partner, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-4 text-center hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 transition-colors shadow-2xs"
            >
              <span className="block text-xs font-bold text-[#0d7c70] dark:text-[#14b8a6]">{partner.tag}</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('profile')}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] px-8 py-4 text-sm sm:text-base font-bold text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          <span>{t.home.cta}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
