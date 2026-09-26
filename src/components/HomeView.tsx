import React from 'react';
import { ViewRoute, Language, Opportunity } from '../types';
import { translations } from '../utils/i18n';
import { OpportunityCard } from './OpportunityCard';
import {
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle,
  GraduationCap,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
  Bookmark,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (route: ViewRoute) => void;
  language: Language;
  featuredOpportunities: Opportunity[];
  savedIds: Set<string>;
  onToggleSave: (opp: Opportunity) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  language,
  featuredOpportunities,
  savedIds,
  onToggleSave,
  onSelectOpportunity,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0d7c70]/20 dark:border-[#14b8a6]/30 bg-[#0d7c70]/5 dark:bg-[#14b8a6]/10 px-3.5 py-1 text-xs font-bold tracking-wider text-[#0d7c70] dark:text-[#14b8a6]">
                <Sparkles className="h-3.5 w-3.5 text-[#e28b22]" />
                <span>{t.home.eyebrow}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                {t.home.title}
              </h1>

              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {t.home.subtitle}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('profile')}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-[#0d7c70]/20 transition-all hover:shadow-lg hover:shadow-[#0d7c70]/30 hover:scale-[1.02] active:scale-100"
                >
                  <span>{t.home.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:border-[#0d7c70] dark:hover:border-[#14b8a6] hover:text-[#0d7c70] dark:hover:text-[#14b8a6] transition-colors"
                >
                  <span>{t.home.secondary}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              {/* Trust Indicator */}
              <div className="flex items-center gap-2.5 pt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950"></span>
                <span>{t.home.trust}</span>
              </div>
            </div>

            {/* Hero Interactive Art preview with official logo and cards */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Background Glow / Orbits */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#0d7c70]/10 dark:from-[#14b8a6]/20 via-[#e28b22]/10 to-transparent blur-2xl -z-10 pointer-events-none"></div>

              <div className="relative w-full max-w-md p-4">
                {/* Subtle Decorative Rings */}
                <div className="absolute inset-0 rounded-full border border-teal-100/80 dark:border-teal-900/60 animate-orbit pointer-events-none"></div>
                <div className="absolute inset-6 rounded-full border border-dashed border-amber-200/60 dark:border-amber-900/40 pointer-events-none"></div>

                {/* Main Opportunity Card Preview */}
                <div
                  onClick={() => {
                    const nitOpp = featuredOpportunities.find((o) => o.id === 'nit-calicut-innovation-2026');
                    if (nitOpp) onSelectOpportunity(nitOpp);
                  }}
                  className="cursor-pointer relative z-10 rounded-3xl border border-[#0d7c70]/20 dark:border-slate-700 bg-white/95 dark:bg-[#1e293b]/95 p-6 shadow-xl shadow-[#0d7c70]/10 dark:shadow-black/40 backdrop-blur-md transition-all hover:scale-[1.02] hover:border-[#0d7c70]/40 group"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg overflow-hidden bg-white p-0.5 border border-[#0d7c70]/20">
                        <img
                          src="/ksop_logo.png"
                          alt="KSOP"
                          className="h-full w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="rounded-md bg-[#0d7c70]/10 dark:bg-[#14b8a6]/20 px-2 py-0.5 text-[11px] font-bold text-[#0d7c70] dark:text-[#14b8a6]">
                        KSOP
                      </span>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      {t.home.preview.live}
                    </span>
                  </div>

                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#e28b22] mb-1">
                    {t.home.preview.label}
                  </span>

                  <strong className="block text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0d7c70] dark:group-hover:text-[#14b8a6] transition-colors leading-snug">
                    {t.home.preview.title}
                  </strong>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    NIT Calicut Technology Business Incubator (TBI)
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/80 pt-3 text-xs">
                    <span className="rounded-md bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {t.home.preview.type}
                    </span>
                    <b className="font-bold text-rose-600 dark:text-rose-400">{t.home.preview.deadline}</b>
                  </div>
                </div>

                {/* Floating Second Card */}
                <div
                  onClick={() => {
                    const prathibhaOpp = featuredOpportunities.find((o) => o.id === 'kscste-prathibha-scholarship');
                    if (prathibhaOpp) onSelectOpportunity(prathibhaOpp);
                  }}
                  className="cursor-pointer absolute -bottom-5 -left-4 z-20 flex items-center gap-3 rounded-2xl border border-[#e28b22]/30 dark:border-amber-700/50 bg-white/95 dark:bg-[#1e293b]/95 p-3.5 shadow-lg backdrop-blur-md transition-all hover:scale-105 animate-float-slow"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#e28b22] to-amber-400 text-lg font-extrabold text-white shadow-xs">
                    ₹
                  </div>
                  <div>
                    <small className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {t.home.preview.scholarship}
                    </small>
                    <strong className="block text-sm font-bold text-slate-900 dark:text-white">
                      {t.home.preview.amount}
                    </strong>
                  </div>
                </div>

                {/* Decorative Pins */}
                <div className="absolute -top-3 -right-2 text-xl font-bold text-[#e28b22] select-none animate-pulse">
                  ✦
                </div>
                <div className="absolute top-1/2 -left-6 text-lg font-bold text-[#0d7c70] dark:text-[#14b8a6] select-none">
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-4 pl-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d7c70]/10 dark:bg-[#14b8a6]/20 text-2xl font-black text-[#0d7c70] dark:text-[#14b8a6]">
              5
            </div>
            <div>
              <strong className="block text-2xl font-black text-slate-900 dark:text-white leading-none">05</strong>
              <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{t.home.stats.categories}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pl-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e28b22]/10 dark:bg-amber-950/40 text-2xl font-black text-[#e28b22]">
              14
            </div>
            <div>
              <strong className="block text-2xl font-black text-slate-900 dark:text-white leading-none">14</strong>
              <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{t.home.stats.districts}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pl-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-2xl font-black text-teal-700 dark:text-teal-300">
              01
            </div>
            <div>
              <strong className="block text-2xl font-black text-slate-900 dark:text-white leading-none">01</strong>
              <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{t.home.stats.profile}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why KSOP Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-[#0d7c70] dark:text-[#14b8a6] uppercase">
            {t.home.why.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.home.why.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.home.why.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          <article className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-7 sm:p-8 shadow-2xs hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 hover:shadow-lg transition-all">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d7c70]/10 dark:bg-[#14b8a6]/20 text-sm font-extrabold text-[#0d7c70] dark:text-[#14b8a6] mb-5">
              01
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#0d7c70] dark:group-hover:text-[#14b8a6] transition-colors">
              {t.home.why.one.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.home.why.one.copy}
            </p>
          </article>

          <article className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-7 sm:p-8 shadow-2xs hover:border-[#e28b22]/40 dark:hover:border-amber-600/40 hover:shadow-lg transition-all">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e28b22]/10 dark:bg-amber-950/40 text-sm font-extrabold text-[#e28b22] mb-5">
              02
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#e28b22] transition-colors">
              {t.home.why.two.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.home.why.two.copy}
            </p>
          </article>

          <article className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-7 sm:p-8 shadow-2xs hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 hover:shadow-lg transition-all">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-sm font-extrabold text-[#0d7c70] dark:text-[#14b8a6] mb-5">
              03
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#0d7c70] dark:group-hover:text-[#14b8a6] transition-colors">
              {t.home.why.three.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.home.why.three.copy}
            </p>
          </article>
        </div>
      </section>

      {/* Curated Opportunities Preview Grid on Home */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.home.curatedHeading}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {t.home.curatedSub}
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0d7c70] dark:text-[#14b8a6] hover:underline transition-colors"
          >
            <span>{t.home.viewAllBtn}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOpportunities.slice(0, 3).map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              language={language}
              isSaved={savedIds.has(opp.id)}
              onToggleSave={onToggleSave}
              onSelect={onSelectOpportunity}
            />
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d7c70] via-[#095c53] to-[#043d37] dark:from-[#0d7c70]/90 dark:via-[#095c53]/90 dark:to-[#022c27] p-8 sm:p-12 text-white shadow-xl">
          {/* Subtle logo emblem in background */}
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 opacity-10 pointer-events-none">
            <img
              src="/ksop_logo.png"
              alt="KSOP"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-100">
              Kerala Collegiate Network
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to find scholarships & projects made for you?
            </h3>
            <p className="text-sm sm:text-base text-teal-100 leading-relaxed">
              Join students from KTU, Calicut, Kerala Univ, MG Univ, CUSAT, and government polytechnics getting matched daily.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('profile')}
                className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-6 py-3.5 text-sm sm:text-base font-bold text-[#0d7c70] dark:text-[#14b8a6] shadow-md hover:bg-teal-50 dark:hover:bg-slate-800 transition-all hover:scale-105"
              >
                <span>{t.home.cta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
