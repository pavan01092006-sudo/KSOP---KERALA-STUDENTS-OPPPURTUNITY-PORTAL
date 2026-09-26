import React, { useState } from 'react';
import { Opportunity, InstitutionUser, Language, ViewRoute } from '../types';
import { translations } from '../utils/i18n';
import { keralaDistricts, availableInterests } from '../data/opportunities';
import { autoTagOpportunity } from '../utils/aiClient';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  ExternalLink,
  Plus,
  ArrowRight,
  UserCheck,
  Check,
  XCircle,
  RefreshCw,
} from 'lucide-react';

interface InstitutionPortalProps {
  language: Language;
  onNavigate: (route: ViewRoute) => void;
  currentUser: InstitutionUser | null;
  onLogin: (user: InstitutionUser) => void;
  onLogout: () => void;
  opportunities: Opportunity[];
  onSubmitOpportunity: (newOpp: Opportunity) => void;
  onApproveOpportunity: (oppId: string) => void;
  onRejectOpportunity: (oppId: string) => void;
  onNotify: (msg: string) => void;
}

export const InstitutionPortal: React.FC<InstitutionPortalProps> = ({
  language,
  onNavigate,
  currentUser,
  onLogin,
  onLogout,
  opportunities,
  onSubmitOpportunity,
  onApproveOpportunity,
  onRejectOpportunity,
  onNotify,
}) => {
  const t = translations[language];

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'college' | 'company' | 'government' | 'incubator'>('college');
  const [district, setDistrict] = useState('kochi');
  const [authError, setAuthError] = useState('');

  // Portal view mode: 'list' | 'create' | 'admin'
  const [portalTab, setPortalTab] = useState<'list' | 'create' | 'admin'>('list');

  // Opportunity creation form
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<any>('internships');
  const [formDesc, setFormDesc] = useState('');
  const [formDistrict, setFormDistrict] = useState('all');
  const [formBranches, setFormBranches] = useState<string[]>(['computer-science']);
  const [formCourses, setFormCourses] = useState<string[]>(['undergraduate']);
  const [formYears, setFormYears] = useState<string[]>(['3', '4', 'final']);
  const [formSkillsText, setFormSkillsText] = useState('Full-Stack Web & Apps, AI & ML');
  const [formDeadline, setFormDeadline] = useState('2026-11-15');
  const [formAward, setFormAward] = useState('₹18,000 / month Stipend');
  const [formUrl, setFormUrl] = useState('https://portal.kerala.gov.in');
  const [formDocName, setFormDocName] = useState('');
  const [isAutoTagging, setIsAutoTagging] = useState(false);

  // Validate official domain
  const isValidOfficialDomain = (emailStr: string): boolean => {
    const parts = emailStr.toLowerCase().split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    // Must be .edu, .ac.in, .gov.in, .res.in, .org, or legitimate institution/company domain (not generic gmail/yahoo)
    const validEnds = ['.edu', '.ac.in', '.gov.in', '.res.in', '.org', '.in'];
    const forbidden = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    if (forbidden.includes(domain)) return false;
    return validEnds.some((ext) => domain.endsWith(ext)) || domain.includes('.co') || domain.includes('.tech') || domain.includes('.io');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthError('Please enter institutional email.');
      return;
    }

    if (!isValidOfficialDomain(email)) {
      setAuthError(
        'Please use an official organization or educational email (e.g. name@cet.ac.in, info@startupmission.in, hr@company.com). Generic consumer webmail is not accepted.'
      );
      return;
    }

    const domain = email.split('@')[1];
    const newUser: InstitutionUser = {
      id: 'inst-' + Date.now(),
      name: name.trim() || (type === 'college' ? 'Kerala Engineering Institution' : 'Kerala Tech Enterprise'),
      type,
      email: email.trim(),
      domain,
      verified: true,
      district,
    };

    onLogin(newUser);
    setAuthError('');
    onNotify(`Welcome, ${newUser.name}! Verified under @${domain}.`);
  };

  // FEATURE 5: AUTO-TAGGING FOR NEW SUBMISSIONS
  const handleAutoTagWithAi = async () => {
    if (!formDesc.trim() && !formTitle.trim()) {
      onNotify('Please enter a description or title first for AI auto-tagging.');
      return;
    }

    setIsAutoTagging(true);
    try {
      const suggestions = await autoTagOpportunity(formDesc, formTitle);

      if (suggestions.suggestedTitle && !formTitle) {
        setFormTitle(suggestions.suggestedTitle);
      }
      if (suggestions.category) {
        setFormCategory(suggestions.category);
      }
      if (suggestions.branchEligibility && suggestions.branchEligibility.length > 0) {
        setFormBranches(suggestions.branchEligibility);
      }
      if (suggestions.courseEligibility && suggestions.courseEligibility.length > 0) {
        setFormCourses(suggestions.courseEligibility);
      }
      if (suggestions.yearEligibility && suggestions.yearEligibility.length > 0) {
        setFormYears(suggestions.yearEligibility);
      }
      if (suggestions.district) {
        setFormDistrict(suggestions.district);
      }
      if (suggestions.tags && suggestions.tags.length > 0) {
        setFormSkillsText(suggestions.tags.join(', '));
      }
      if (suggestions.awardOrStipend && !formAward) {
        setFormAward(suggestions.awardOrStipend);
      }

      onNotify('AI automatically extracted categories, branches, and skill tags!');
    } catch (err) {
      console.error(err);
      onNotify('Auto-tagging completed with default rules');
    } finally {
      setIsAutoTagging(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim()) {
      onNotify('Please fill in title and description.');
      return;
    }

    const newOpportunity: Opportunity = {
      id: 'inst-opp-' + Date.now(),
      title: formTitle.trim(),
      titleMl: formTitle.trim(),
      category: formCategory,
      provider: currentUser?.name || 'Verified Institution Partner',
      description: formDesc.trim().slice(0, 180) + '...',
      descriptionMl: formDesc.trim().slice(0, 180) + '...',
      longDescription: formDesc.trim(),
      longDescriptionMl: formDesc.trim(),
      district: formDistrict,
      districtNameEn: formDistrict === 'all' ? 'Statewide' : formDistrict,
      districtNameMl: formDistrict === 'all' ? 'കേരളം ഒട്ടാകെ' : formDistrict,
      branchEligibility: formBranches,
      courseEligibility: formCourses,
      yearEligibility: formYears,
      tags: formSkillsText.split(',').map((s) => s.trim()).filter(Boolean),
      awardOrStipend: formAward.trim() || 'Merit Certificate & Benefits',
      deadlineDate: formDeadline,
      daysLeft: Math.max(
        1,
        Math.round((new Date(formDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      ),
      applicationUrl: formUrl.trim() || 'https://kerala.gov.in',
      mode: 'Hybrid',
      modeMl: 'ഹൈബ്രിഡ്',
      perks: [
        'Verified opportunity from official institution partner',
        'Official co-signed certificate on completion',
        'Direct mentorship from domain practitioners',
      ],
      perksMl: [
        'അംഗീകൃത സ്ഥാപന പങ്കാളിയിൽ നിന്നുള്ള അവസരം',
        'പൂർത്തിയാക്കുന്നവർക്ക് ഔദ്യോഗിക സർട്ടിഫിക്കറ്റ്',
        'വിദഗ്ദ്ധ പരിശീലനം',
      ],
      stepsToApply: [
        'Complete registration on the institution portal link.',
        'Upload student ID credentials and portfolio summary.',
        'Shortlisted candidates notified via official institutional email.',
      ],
      stepsToApplyMl: [
        'ലിങ്ക് വഴി വിവരങ്ങൾ രജിസ്റ്റർ ചെയ്യുക.',
        'കോളേജ് ഐഡിയും പ്രൊഫൈലും അപ്‌ലോഡ് ചെയ്യുക.',
        'തിരഞ്ഞെടുക്കപ്പെടുന്നവർക്ക് ഇമെയിൽ വഴി വിവരം ലഭിക്കും.',
      ],
      // Institution workflow fields:
      status: 'pending', // Pending approval queue
      institutionName: currentUser?.name || 'Institution Partner',
      isVerifiedPartner: true,
      postedByEmail: currentUser?.email,
      supportingDocName: formDocName.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    onSubmitOpportunity(newOpportunity);
    onNotify(t.institution.submittedToast);
    setPortalTab('list');

    // Reset fields
    setFormTitle('');
    setFormDesc('');
    setFormDocName('');
  };

  const branchList = [
    { id: 'computer-science', label: t.branch.cs },
    { id: 'engineering', label: t.branch.engineering },
    { id: 'commerce', label: t.branch.commerce },
    { id: 'science', label: t.branch.science },
    { id: 'arts', label: t.branch.arts },
    { id: 'health', label: t.branch.health },
  ];

  // Opportunities posted by this institution
  const mySubmissions = opportunities.filter(
    (o) => o.postedByEmail === currentUser?.email || o.institutionName === currentUser?.name
  );

  // All pending opportunities for admin desk
  const pendingQueue = opportunities.filter((o) => o.status === 'pending');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl border border-[#0d7c70]/20 dark:border-teal-900/60 bg-gradient-to-r from-teal-50/80 dark:from-teal-950/40 via-white dark:via-[#1e293b] to-amber-50/40 dark:to-slate-900 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0d7c70]/10 dark:bg-[#14b8a6]/20 px-3 py-1 text-xs font-bold text-[#0d7c70] dark:text-[#14b8a6]">
            <Building2 className="h-3.5 w-3.5" />
            <span>KSOP Verified Partner Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.institution.portalTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {t.institution.portalSubtitle}
          </p>
        </div>

        {currentUser ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-2xs">
              <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Logged in as</span>
              <strong className="block text-sm font-bold text-slate-800 dark:text-white">{currentUser.name}</strong>
              <span className="text-xs text-[#0d7c70] dark:text-[#14b8a6] font-medium">{currentUser.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 underline"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>

      {/* Main Container */}
      {!currentUser ? (
        /* Sign up / Login Flow */
        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => {
                setAuthMode('signup');
                setAuthError('');
              }}
              className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all ${
                authMode === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-[#0d7c70] dark:text-[#14b8a6] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.institution.signupTab}
            </button>
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
              }}
              className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all ${
                authMode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-[#0d7c70] dark:text-[#14b8a6] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.institution.loginTab}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.institution.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.institution.namePlaceholder}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.institution.emailLabel}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.institution.emailPlaceholder}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                🔒 {t.institution.officialDomainNote}
              </p>
            </div>

            {authMode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.institution.typeLabel}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 text-sm font-medium focus:border-[#0d7c70] dark:focus:border-[#14b8a6]"
                  >
                    <option value="college">{t.institution.college}</option>
                    <option value="company">{t.institution.company}</option>
                    <option value="government">{t.institution.government}</option>
                    <option value="incubator">{t.institution.incubator}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.institution.districtLabel}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2.5 text-sm font-medium focus:border-[#0d7c70] dark:focus:border-[#14b8a6]"
                  >
                    {keralaDistricts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {language === 'ml' ? d.nameMl : d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {authError && (
              <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] py-3 text-sm font-bold text-white shadow-xs hover:shadow-md transition-all"
            >
              {authMode === 'signup' ? t.institution.registerBtn : t.institution.loginBtn}
            </button>
          </form>
        </div>
      ) : (
        /* Logged in Dashboard */
        <div className="space-y-6">
          {/* Sub Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPortalTab('list')}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                  portalTab === 'list'
                    ? 'bg-[#0d7c70] dark:bg-[#14b8a6] text-white dark:text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                My Posted Opportunities ({mySubmissions.length})
              </button>

              <button
                onClick={() => setPortalTab('create')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                  portalTab === 'create'
                    ? 'bg-[#0d7c70] dark:bg-[#14b8a6] text-white dark:text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>{t.institution.postNewOpportunity}</span>
              </button>

              <button
                onClick={() => setPortalTab('admin')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                  portalTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{t.institution.adminReviewMode}</span>
                {pendingQueue.length > 0 && (
                  <span className="rounded-full bg-white dark:bg-amber-400 text-amber-900 px-1.5 py-0.2 text-[10px] font-extrabold">
                    {pendingQueue.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-bold text-[#0d7c70] dark:text-[#14b8a6] hover:underline flex items-center gap-1"
            >
              <span>View Public Student Feed</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* TAB 1: Submissions List */}
          {portalTab === 'list' && (
            <div className="space-y-4">
              {mySubmissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mySubmissions.map((opp) => (
                    <div
                      key={opp.id}
                      className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold capitalize text-slate-700 dark:text-slate-300">
                          {opp.category}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            opp.status === 'approved'
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                              : opp.status === 'rejected'
                              ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {opp.status === 'approved' ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>{t.institution.statusApproved}</span>
                            </>
                          ) : opp.status === 'rejected' ? (
                            <>
                              <XCircle className="h-3.5 w-3.5" />
                              <span>{t.institution.statusRejected}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5" />
                              <span>{t.institution.statusPending}</span>
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{opp.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{opp.description}</p>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Deadline: {opp.deadlineDate}</span>
                        <span className="font-semibold text-[#0d7c70] dark:text-[#14b8a6]">{opp.awardOrStipend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-12 text-center space-y-3">
                  <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                    {t.institution.noSubmissionsYet}
                  </h3>
                  <button
                    onClick={() => setPortalTab('create')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d7c70] dark:bg-[#14b8a6] px-4 py-2 text-xs font-bold text-white dark:text-slate-950 shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t.institution.postNewOpportunity}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Post New Opportunity with FEATURE 5: AI AUTO-TAGGING */}
          {portalTab === 'create' && (
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t.institution.postNewOpportunity}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Publish your circular or opening directly to matching college students across Kerala.
                  </p>
                </div>

                {/* Auto-Tagging Action */}
                <button
                  type="button"
                  onClick={handleAutoTagWithAi}
                  disabled={isAutoTagging}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 px-3.5 py-2 text-xs font-bold text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors shadow-2xs"
                  title={t.institution.autoTagHint}
                >
                  <Sparkles className={`h-4 w-4 text-[#e28b22] ${isAutoTagging ? 'animate-spin' : ''}`} />
                  <span>{isAutoTagging ? t.institution.autoTagging : t.institution.autoTagBtn}</span>
                </button>
              </div>

              {/* AI Auto-Tag Tip Box */}
              <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>💡 {t.institution.autoTagHint}</span>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.institution.formTitleLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Kerala AI Fellowship & Summer Micro-Internship 2026"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.institution.formDescLabel}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Paste the announcement circular, eligibility criteria, problem statements, and selection process..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.institution.formCategoryLabel}
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm font-medium focus:border-[#0d7c70] dark:focus:border-[#14b8a6]"
                    >
                      <option value="internships">{t.category.internships}</option>
                      <option value="hackathons">{t.category.hackathons}</option>
                      <option value="scholarships">{t.category.scholarships}</option>
                      <option value="certifications">{t.category.certifications}</option>
                      <option value="schemes">{t.category.schemes}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.institution.formDistrictLabel}
                    </label>
                    <select
                      value={formDistrict}
                      onChange={(e) => setFormDistrict(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm font-medium focus:border-[#0d7c70] dark:focus:border-[#14b8a6]"
                    >
                      <option value="all">📍 {t.district.all}</option>
                      {keralaDistricts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {language === 'ml' ? d.nameMl : d.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.institution.formDeadlineLabel}
                    </label>
                    <input
                      type="date"
                      required
                      value={formDeadline}
                      onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm focus:border-[#0d7c70] dark:focus:border-[#14b8a6]"
                    />
                  </div>
                </div>

                {/* Branches checkboxes */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.institution.formBranchLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {branchList.map((b) => {
                      const isSel = formBranches.includes(b.id);
                      return (
                        <button
                          type="button"
                          key={b.id}
                          onClick={() => {
                            if (isSel) {
                              if (formBranches.length > 1) {
                                setFormBranches(formBranches.filter((x) => x !== b.id));
                              }
                            } else {
                              setFormBranches([...formBranches, b.id]);
                            }
                          }}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            isSel
                              ? 'bg-[#0d7c70] dark:bg-[#14b8a6] text-white dark:text-slate-950'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.institution.formSkillsLabel}
                    </label>
                    <input
                      type="text"
                      value={formSkillsText}
                      onChange={(e) => setFormSkillsText(e.target.value)}
                      placeholder="e.g. AI & ML, Full-Stack Web, IoT"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-[#0d7c70] dark:focus:border-[#14b8a6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.institution.formAwardLabel}
                    </label>
                    <input
                      type="text"
                      value={formAward}
                      onChange={(e) => setFormAward(e.target.value)}
                      placeholder="e.g. ₹15,000 / month or ₹1,00,000 Prize Pool"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-[#0d7c70] dark:focus:border-[#14b8a6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.institution.formUrlLabel}
                    </label>
                    <input
                      type="url"
                      required
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-[#0d7c70] dark:focus:border-[#14b8a6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.institution.formDocLabel}
                    </label>
                    <input
                      type="text"
                      value={formDocName}
                      onChange={(e) => setFormDocName(e.target.value)}
                      placeholder="e.g. Official_Circular_Ref_2026.pdf"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-sm focus:border-[#0d7c70] dark:focus:border-[#14b8a6]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] px-6 py-3 text-sm font-bold text-white dark:text-slate-950 shadow-xs hover:shadow-md transition-all"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>{t.institution.submitForApproval}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: ADMIN APPROVAL DESK */}
          {portalTab === 'admin' && (
            <div className="rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-[#1e293b] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-amber-100 dark:border-amber-900/60 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <span>{t.institution.adminReviewMode}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review and verify incoming opportunity submissions from partner colleges and companies.
                  </p>
                </div>
              </div>

              {pendingQueue.length > 0 ? (
                <div className="space-y-4">
                  {pendingQueue.map((opp) => (
                    <div
                      key={opp.id}
                      className="rounded-2xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20 p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 text-xs font-bold">
                            Pending Review
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Posted by: <strong className="text-slate-700 dark:text-slate-300">{opp.institutionName || opp.provider}</strong> ({opp.postedByEmail || 'domain verified'})
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#0d7c70] dark:text-[#14b8a6]">{opp.awardOrStipend}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{opp.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{opp.longDescription || opp.description}</p>

                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {opp.tags.map((tg, i) => (
                          <span key={i} className="rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                            {tg}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-amber-200/60 dark:border-amber-900/40 pt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Deadline: {opp.deadlineDate}</span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onRejectOpportunity(opp.id);
                              onNotify('Opportunity marked as changes requested.');
                            }}
                            className="rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          >
                            {t.institution.rejectBtn}
                          </button>
                          <button
                            onClick={() => {
                              onApproveOpportunity(opp.id);
                              onNotify(`Approved "${opp.title}"! It is now live on the public feed with Verified Partner badge.`);
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>{t.institution.approveBtn}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-8 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">All submissions reviewed!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No pending opportunities in the queue. New submissions from colleges and companies will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
