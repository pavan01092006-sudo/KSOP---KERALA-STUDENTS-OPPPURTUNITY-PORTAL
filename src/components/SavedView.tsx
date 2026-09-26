import React from 'react';
import { Opportunity, Language, ViewRoute } from '../types';
import { translations } from '../utils/i18n';
import { OpportunityCard } from './OpportunityCard';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';

interface SavedViewProps {
  savedOpportunities: Opportunity[];
  language: Language;
  onNavigate: (route: ViewRoute) => void;
  onToggleSave: (opp: Opportunity) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  savedOpportunities,
  language,
  onNavigate,
  onToggleSave,
  onSelectOpportunity,
}) => {
  const t = translations[language];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#0d7c70] dark:text-[#14b8a6] uppercase">
            {t.saved.eyebrow}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {t.saved.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {t.saved.subtitle}
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:border-[#0d7c70] dark:hover:border-[#14b8a6] hover:text-[#0d7c70] dark:hover:text-[#14b8a6] transition-colors self-start sm:self-center"
        >
          <Compass className="h-4 w-4" />
          <span>{t.saved.explore}</span>
        </button>
      </div>

      {/* Content */}
      {savedOpportunities.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            {savedOpportunities.length} {t.saved.savedCount}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                language={language}
                isSaved={true}
                onToggleSave={onToggleSave}
                onSelect={onSelectOpportunity}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-12 sm:p-16 text-center space-y-4 max-w-md mx-auto my-12 shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d7c70]/10 dark:bg-[#14b8a6]/20 text-2xl text-[#0d7c70] dark:text-[#14b8a6] mx-auto">
            <Bookmark className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.saved.emptyTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.saved.emptyCopy}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] px-6 py-3 text-sm font-bold text-white shadow-xs hover:shadow-md transition-all"
            >
              <span>{t.saved.emptyCta}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
