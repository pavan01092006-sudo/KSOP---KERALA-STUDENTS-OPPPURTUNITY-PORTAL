import React, { useState, useEffect } from 'react';
import { Opportunity, Language, StudentProfile } from '../types';
import { translations } from '../utils/i18n';
import { fetchAiSummary, checkAiEligibility } from '../utils/aiClient';
import {
  X,
  Calendar,
  MapPin,
  Award,
  ExternalLink,
  Bookmark,
  Share2,
  CheckCircle2,
  Building,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Send,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  FileText,
  UserCheck,
} from 'lucide-react';

interface OpportunityDialogProps {
  opportunity: Opportunity | null;
  language: Language;
  studentProfile: StudentProfile | null;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (opp: Opportunity) => void;
  onShare: (opp: Opportunity) => void;
  onOpenPortfolioGenerator: (opp: Opportunity) => void;
}

export const OpportunityDialog: React.FC<OpportunityDialogProps> = ({
  opportunity,
  language,
  studentProfile,
  isSaved,
  onClose,
  onToggleSave,
  onShare,
  onOpenPortfolioGenerator,
}) => {
  const t = translations[language];

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<{
    eligible: string;
    requirements: string;
    deadline: string;
    restrictions: string;
  } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // AI Eligibility Checker State
  const [eligibilityQuery, setEligibilityQuery] = useState('Am I eligible?');
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<{
    isEligible: boolean | 'partial';
    headline: string;
    reasoning: string;
    checklist: Array<{ criteria: string; status: 'pass' | 'fail' | 'warn'; detail: string }>;
    recommendation: string;
  } | null>(null);

  // Load AI Summary on opportunity change
  useEffect(() => {
    if (opportunity) {
      if (opportunity.aiSummary) {
        setAiSummary(opportunity.aiSummary);
      } else {
        loadSummary();
      }
      // Reset eligibility checker
      setEligibilityResult(null);
      setEligibilityQuery(t.dialog.askAmIEligible);
    }
  }, [opportunity?.id, language]);

  const loadSummary = async () => {
    if (!opportunity) return;
    setLoadingSummary(true);
    try {
      const summary = await fetchAiSummary(opportunity, language);
      setAiSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleCheckEligibility = async (q?: string) => {
    if (!opportunity || !studentProfile) return;
    const query = q || eligibilityQuery || t.dialog.askAmIEligible;
    setCheckingEligibility(true);
    try {
      const result = await checkAiEligibility(studentProfile, opportunity, query, language);
      setEligibilityResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingEligibility(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!opportunity) return null;

  const title = language === 'ml' ? opportunity.titleMl : opportunity.title;
  const longDesc =
    language === 'ml' ? opportunity.longDescriptionMl : opportunity.longDescription;
  const districtName =
    language === 'ml' ? opportunity.districtNameMl : opportunity.districtNameEn;
  const awardText =
    language === 'ml' && opportunity.awardOrStipendMl
      ? opportunity.awardOrStipendMl
      : opportunity.awardOrStipend;
  const perks = language === 'ml' ? opportunity.perksMl : opportunity.perks;
  const steps = language === 'ml' ? opportunity.stepsToApplyMl : opportunity.stepsToApply;
  const modeText = language === 'ml' ? opportunity.modeMl : opportunity.mode;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-10 my-4 sm:my-8 flex flex-col max-h-[90vh]">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#0d7c70] via-[#095c53] to-[#08564e] dark:from-[#06423c] dark:via-[#04332e] dark:to-[#032320] p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
            aria-label={t.common.back}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-block rounded-md bg-white/20 px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">
              {opportunity.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-0.5 text-xs font-medium">
              <MapPin className="h-3 w-3" />
              {districtName}
            </span>

            {/* Verified Partner Badge */}
            {(opportunity.isVerifiedPartner || opportunity.institutionName) && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#e28b22] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>
                  {opportunity.institutionName
                    ? `${t.dialog.postedBy} ${opportunity.institutionName}`
                    : t.dialog.verifiedPartnerBadge}
                </span>
              </span>
            )}
          </div>

          <p className="text-xs text-teal-100 font-medium">{opportunity.provider}</p>
          <h2
            id="dialog-title"
            className="text-xl sm:text-2xl font-bold mt-1 text-white leading-snug pr-8"
          >
            {title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-[#e28b22] px-3 py-1 text-xs font-bold text-white shadow-xs">
              <Award className="h-3.5 w-3.5" />
              <span>{awardText}</span>
            </div>
            <span className="text-xs text-teal-100">
              {opportunity.daysLeft} {t.common.daysLeft} ({opportunity.deadlineDate})
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-7">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 p-3">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                {t.dialog.mode}
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{modeText}</span>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 p-3">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                {t.dialog.deadline}
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {opportunity.deadlineDate}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 p-3">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                {t.dialog.location}
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate block">
                {districtName}
              </span>
            </div>
          </div>

          {/* FEATURE 1: AI GUIDELINE SUMMARIZER */}
          <div className="rounded-2xl border border-teal-200/80 dark:border-teal-900/60 bg-gradient-to-br from-teal-50/70 dark:from-teal-950/40 via-white dark:via-slate-900 to-amber-50/30 dark:to-slate-900 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 border-b border-teal-100 dark:border-teal-900/60 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0d7c70] dark:bg-[#14b8a6] text-white">
                  <Sparkles className="h-4 w-4 text-[#e28b22]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {t.dialog.aiSummaryTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.dialog.aiSummarySubtitle}</p>
                </div>
              </div>

              <button
                onClick={loadSummary}
                disabled={loadingSummary}
                className="flex items-center gap-1 text-xs font-semibold text-[#0d7c70] dark:text-[#14b8a6] hover:underline p-1 rounded-md"
                title="Regenerate Summary"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingSummary ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {loadingSummary ? (
              <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[#0d7c70] dark:text-[#14b8a6]" />
                <span>{t.dialog.aiChecking}</span>
              </div>
            ) : aiSummary ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. Who is eligible */}
                <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 shadow-2xs">
                  <span className="block font-bold text-[#0d7c70] dark:text-[#14b8a6] mb-1">
                    👤 {t.dialog.eligibleBullet}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiSummary.eligible}</p>
                </div>

                {/* 2. What's required */}
                <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 shadow-2xs">
                  <span className="block font-bold text-[#0d7c70] dark:text-[#14b8a6] mb-1">
                    📝 {t.dialog.requirementsBullet}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiSummary.requirements}</p>
                </div>

                {/* 3. Deadline */}
                <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 shadow-2xs">
                  <span className="block font-bold text-[#e28b22] mb-1">
                    ⏰ {t.dialog.deadlineBullet}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiSummary.deadline}</p>
                </div>

                {/* 4. Important restrictions */}
                <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 shadow-2xs">
                  <span className="block font-bold text-rose-600 dark:text-rose-400 mb-1">
                    ⚠️ {t.dialog.restrictionsBullet}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiSummary.restrictions}</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* FEATURE 2: AI ELIGIBILITY CHECKER */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0d7c70] dark:text-[#14b8a6]">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {t.dialog.aiEligibilityTitle}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.dialog.aiEligibilitySubtitle} (Profile: {studentProfile?.course || 'Undergraduate'}, {studentProfile?.branch || 'CS'}, {studentProfile?.district || 'Kerala'})
                </p>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2">
              {[
                t.dialog.askAmIEligible,
                t.dialog.askBranch,
                t.dialog.askRestrictions,
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setEligibilityQuery(suggestion);
                    handleCheckEligibility(suggestion);
                  }}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#0d7c70]/10 dark:hover:bg-[#14b8a6]/20 hover:text-[#0d7c70] dark:hover:text-[#14b8a6] px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={eligibilityQuery}
                onChange={(e) => setEligibilityQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckEligibility();
                }}
                placeholder="Ask about your eligibility, semester, or marks..."
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
              />
              <button
                onClick={() => handleCheckEligibility()}
                disabled={checkingEligibility}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d7c70] dark:bg-[#14b8a6] px-4 py-2 text-xs sm:text-sm font-bold text-white dark:text-slate-950 hover:bg-[#08564e] dark:hover:bg-[#0d7c70] transition-colors disabled:opacity-50"
              >
                {checkingEligibility ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>{t.dialog.checkButton}</span>
              </button>
            </div>

            {/* AI Eligibility Result */}
            {eligibilityResult && (
              <div
                className={`rounded-2xl border p-4 space-y-3 animate-in fade-in duration-150 ${
                  eligibilityResult.isEligible === true
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/40'
                    : eligibilityResult.isEligible === 'partial'
                    ? 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/40'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {eligibilityResult.isEligible === true ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block text-sm font-bold text-slate-900 dark:text-white">
                      {eligibilityResult.headline}
                    </strong>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {eligibilityResult.reasoning}
                    </p>
                  </div>
                </div>

                {/* Criteria Checklist */}
                {eligibilityResult.checklist && eligibilityResult.checklist.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {eligibilityResult.checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 text-xs shadow-2xs"
                      >
                        <span className="block font-bold text-[11px] text-slate-700 dark:text-slate-300">
                          {item.criteria}
                        </span>
                        <span
                          className={`inline-block font-semibold text-[10px] mt-0.5 ${
                            item.status === 'pass'
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : item.status === 'warn'
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {item.status === 'pass' ? '✓ Eligible' : 'Check requirements'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {eligibilityResult.recommendation && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic border-t border-slate-200/60 dark:border-slate-700 pt-2">
                    💡 Tip: {eligibilityResult.recommendation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Full Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Overview</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{longDesc}</p>
          </div>

          {/* Eligibility Section */}
          <div className="rounded-2xl border border-teal-100 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/30 p-4">
            <h4 className="flex items-center gap-1.5 text-sm font-bold text-[#0d7c70] dark:text-[#14b8a6] mb-2">
              <GraduationCap className="h-4 w-4" />
              {t.dialog.eligibility}
            </h4>
            <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong>Courses: </strong>
                {opportunity.courseEligibility.map((c) => t.profile[c as keyof typeof t.profile] || c).join(', ')}
              </li>
              <li>
                <strong>Target Branches: </strong>
                {opportunity.branchEligibility.includes('all')
                  ? 'All branches eligible'
                  : opportunity.branchEligibility.map((b) => t.branch[b as keyof typeof t.branch] || b).join(', ')}
              </li>
              <li>
                <strong>Year of Study: </strong>
                {opportunity.yearEligibility.includes('final')
                  ? '1st year to Final year students'
                  : opportunity.yearEligibility.join(', ') + ' year'}
              </li>
            </ul>
          </div>

          {/* Key Perks */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2.5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#e28b22]" />
              {t.dialog.perks}
            </h4>
            <div className="space-y-2">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-[#0d7c70] dark:text-[#14b8a6] shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps to Apply */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2.5">{t.dialog.steps}</h4>
            <div className="space-y-2.5">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0d7c70] dark:bg-[#14b8a6] text-[11px] font-bold text-white dark:text-slate-950">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(opportunity)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                isSaved
                  ? 'border-[#0d7c70] dark:border-[#14b8a6] bg-[#0d7c70] dark:bg-[#14b8a6] text-white dark:text-slate-950 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0d7c70] dark:hover:border-[#14b8a6]'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? t.dialog.saved : t.dialog.save}</span>
            </button>

            <button
              onClick={() => onShare(opportunity)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">{t.dialog.share}</span>
            </button>

            {/* Generate Portfolio Trigger Button */}
            <button
              onClick={() => {
                onClose();
                onOpenPortfolioGenerator(opportunity);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2 text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/70 transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#e28b22]" />
              <span>{t.dashboard.generatePortfolio}</span>
            </button>
          </div>

          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] px-5 py-2 text-xs sm:text-sm font-bold text-white dark:text-slate-950 shadow-sm hover:from-[#08564e] hover:to-[#053d37] transition-all"
          >
            <span>{t.dialog.applyOfficial}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
