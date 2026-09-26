import React from 'react';
import { Opportunity, Language } from '../types';
import { translations } from '../utils/i18n';
import {
  Bookmark,
  Calendar,
  MapPin,
  Award,
  ExternalLink,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  language: Language;
  isSaved: boolean;
  onToggleSave: (opp: Opportunity) => void;
  onSelect: (opp: Opportunity) => void;
  onGeneratePortfolio?: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  language,
  isSaved,
  onToggleSave,
  onSelect,
  onGeneratePortfolio,
}) => {
  const t = translations[language];

  // Category color accents
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'scholarships':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
          label: t.category.scholarships,
        };
      case 'internships':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/60',
          text: 'text-sky-700 dark:text-sky-300',
          border: 'border-sky-200 dark:border-sky-800',
          label: t.category.internships,
        };
      case 'hackathons':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
          label: t.category.hackathons,
        };
      case 'certifications':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/60',
          text: 'text-purple-700 dark:text-purple-300',
          border: 'border-purple-200 dark:border-purple-800',
          label: t.category.certifications,
        };
      case 'schemes':
      default:
        return {
          bg: 'bg-teal-50 dark:bg-teal-950/60',
          text: 'text-[#0d7c70] dark:text-[#14b8a6]',
          border: 'border-teal-200 dark:border-teal-800',
          label: t.category.schemes,
        };
    }
  };

  const theme = getCategoryTheme(opportunity.category);
  const title = language === 'ml' ? opportunity.titleMl : opportunity.title;
  const description = language === 'ml' ? opportunity.descriptionMl : opportunity.description;
  const districtName = language === 'ml' ? opportunity.districtNameMl : opportunity.districtNameEn;
  const awardText = language === 'ml' && opportunity.awardOrStipendMl ? opportunity.awardOrStipendMl : opportunity.awardOrStipend;

  const isUrgent = opportunity.daysLeft <= 7;
  const isInternshipOrProject =
    opportunity.category === 'internships' || opportunity.category === 'hackathons';

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-5 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#0d7c70]/40 dark:hover:border-[#14b8a6]/40 hover:shadow-lg hover:shadow-[#0d7c70]/5 dark:hover:shadow-black/30">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}
            >
              {theme.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <MapPin className="h-3 w-3 text-slate-500 dark:text-slate-400" />
              {districtName}
            </span>

            {/* Verified Partner Badge */}
            {(opportunity.isVerifiedPartner || opportunity.institutionName) && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 text-[10px] font-bold">
                <ShieldCheck className="h-3 w-3 text-amber-700 dark:text-amber-400" />
                <span>
                  {opportunity.institutionName
                    ? `${t.dialog.postedBy} ${opportunity.institutionName}`
                    : t.dialog.verifiedPartnerBadge}
                </span>
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(opportunity);
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
              isSaved
                ? 'border-[#0d7c70] dark:border-[#14b8a6] bg-[#0d7c70] dark:bg-[#14b8a6] text-white shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-300 hover:border-[#0d7c70] dark:hover:border-[#14b8a6] hover:text-[#0d7c70] dark:hover:text-[#14b8a6]'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Provider */}
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 mb-1">
          {opportunity.provider}
        </p>

        {/* Title */}
        <h3
          onClick={() => onSelect(opportunity)}
          className="cursor-pointer text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0d7c70] dark:group-hover:text-[#14b8a6] transition-colors mb-2 line-clamp-2"
        >
          {title}
        </h3>

        {/* Description snippet */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {opportunity.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-block rounded-md bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700"
            >
              {tag}
            </span>
          ))}
          {opportunity.tags.length > 3 && (
            <span className="inline-block rounded-md bg-slate-50 dark:bg-slate-800/80 px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
              +{opportunity.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Award className="h-3.5 w-3.5 text-[#e28b22]" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">{awardText}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Clock
              className={`h-3.5 w-3.5 ${isUrgent ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}
            />
            <span className={`font-medium ${isUrgent ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
              {opportunity.daysLeft <= 0
                ? 'Closing Today'
                : `${opportunity.daysLeft} ${t.common.daysLeft}`}
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-1">
          {/* Generate Portfolio Button */}
          {onGeneratePortfolio && (
            <button
              onClick={() => onGeneratePortfolio(opportunity)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                isInternshipOrProject
                  ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/70'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title="Tailor your student portfolio for this opening using AI"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#e28b22]" />
              <span className="truncate">{t.dashboard.generatePortfolio}</span>
            </button>
          )}

          {/* View Details CTA */}
          <button
            onClick={() => onSelect(opportunity)}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-all hover:bg-[#0d7c70] dark:hover:bg-[#14b8a6] hover:text-white dark:hover:text-slate-950 shrink-0"
          >
            <span>{t.common.viewDetails}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
