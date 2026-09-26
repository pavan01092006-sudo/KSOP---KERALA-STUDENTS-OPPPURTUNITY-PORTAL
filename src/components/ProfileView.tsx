import React, { useState } from 'react';
import { ViewRoute, Language, StudentProfile } from '../types';
import { translations } from '../utils/i18n';
import { availableInterests, keralaDistricts } from '../data/opportunities';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Sparkles, User } from 'lucide-react';

interface ProfileViewProps {
  onNavigate: (route: ViewRoute) => void;
  language: Language;
  initialProfile: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigate,
  language,
  initialProfile,
  onSaveProfile,
}) => {
  const t = translations[language];

  const [name, setName] = useState(initialProfile?.name || 'Gautham');
  const [course, setCourse] = useState(initialProfile?.course || 'undergraduate');
  const [branch, setBranch] = useState(initialProfile?.branch || 'computer-science');
  const [year, setYear] = useState(initialProfile?.year || '3');
  const [college, setCollege] = useState(
    initialProfile?.college || 'Government Engineering College'
  );
  const [district, setDistrict] = useState(initialProfile?.district || 'kochi');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialProfile?.interests && initialProfile.interests.length > 0
      ? initialProfile.interests
      : ['ai-ml', 'web-dev', 'robotics-iot']
  );
  const [errorMessage, setErrorMessage] = useState('');

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length === 1) {
        setErrorMessage(t.profile.errorRequired);
        return;
      }
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
      setErrorMessage('');
    } else {
      setSelectedInterests([...selectedInterests, id]);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !branch || !year || !district || selectedInterests.length === 0) {
      setErrorMessage(t.profile.errorRequired);
      return;
    }

    const updatedProfile: StudentProfile = {
      name: name.trim() || 'Learner',
      course,
      branch,
      year,
      college: college.trim(),
      district,
      interests: selectedInterests,
    };

    onSaveProfile(updatedProfile);
    onNavigate('dashboard');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Back button and page header */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0d7c70] dark:hover:text-[#14b8a6] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.common.back}</span>
        </button>

        <span className="block text-xs font-bold tracking-widest text-[#0d7c70] dark:text-[#14b8a6] uppercase mb-1">
          {t.profile.step}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.profile.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          {t.profile.subtitle}
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name input */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-6 sm:p-8 shadow-xs">
          <label className="block">
            <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              {t.profile.nameLabel}
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.profile.namePlaceholder}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
            />
          </label>
        </div>

        {/* Section 01: Education */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d7c70]/10 dark:bg-[#14b8a6]/20 text-sm font-extrabold text-[#0d7c70] dark:text-[#14b8a6]">
              01
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.profile.education.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.profile.education.copy}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Course level */}
            <label className="block">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.course}
              </span>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
              >
                <option value="">{t.profile.choose}</option>
                <option value="undergraduate">{t.profile.undergraduate}</option>
                <option value="diploma">{t.profile.diploma}</option>
                <option value="pg">{t.profile.pg}</option>
              </select>
            </label>

            {/* Branch / course */}
            <label className="block">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.branch}
              </span>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
              >
                <option value="">{t.profile.choose}</option>
                <option value="computer-science">{t.branch.cs}</option>
                <option value="engineering">{t.branch.engineering}</option>
                <option value="commerce">{t.branch.commerce}</option>
                <option value="science">{t.branch.science}</option>
                <option value="arts">{t.branch.arts}</option>
                <option value="health">{t.branch.health}</option>
              </select>
            </label>

            {/* Year / semester */}
            <label className="block">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.year}
              </span>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
              >
                <option value="">{t.profile.choose}</option>
                <option value="1">{t.year.one}</option>
                <option value="2">{t.year.two}</option>
                <option value="3">{t.year.three}</option>
                <option value="4">{t.year.four}</option>
                <option value="final">{t.year.final}</option>
              </select>
            </label>

            {/* College Name */}
            <label className="block">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.profile.college}{' '}
                <em className="text-slate-400 dark:text-slate-500 font-normal not-italic">{t.common.optional}</em>
              </span>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder={t.profile.collegePlaceholder}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Section 02: Interests */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e28b22]/10 dark:bg-amber-950/40 text-sm font-extrabold text-[#e28b22]">
              02
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.profile.interests.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.profile.interests.copy}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {availableInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id);
              const label = language === 'ml' ? interest.labelMl : interest.labelEn;
              return (
                <button
                  type="button"
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#0d7c70] dark:bg-[#14b8a6] text-white dark:text-slate-950 shadow-xs scale-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 03: Location */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/40 text-sm font-extrabold text-[#0d7c70] dark:text-[#14b8a6]">
              03
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.profile.location.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.profile.location.copy}</p>
            </div>
          </div>

          <label className="block">
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.profile.district}
            </span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
            >
              <option value="">{t.profile.choose}</option>
              {keralaDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {language === 'ml' ? d.nameMl : d.nameEn}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Error message if validation fails */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] px-8 py-4 text-sm sm:text-base font-bold text-white dark:text-slate-950 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-100"
          >
            <span>{t.profile.submit}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
