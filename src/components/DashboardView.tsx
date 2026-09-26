import React, { useState, useMemo } from 'react';
import { Opportunity, Language, StudentProfile, OpportunityCategory, ViewRoute } from '../types';
import { translations } from '../utils/i18n';
import { keralaDistricts } from '../data/opportunities';
import { OpportunityCard } from './OpportunityCard';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  MapPin,
  Edit3,
  Calendar,
  Layers,
  Inbox,
} from 'lucide-react';

interface DashboardViewProps {
  opportunities: Opportunity[];
  language: Language;
  profile: StudentProfile | null;
  savedIds: Set<string>;
  onNavigate: (route: ViewRoute) => void;
  onToggleSave: (opp: Opportunity) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
  onGeneratePortfolio: (opp: Opportunity) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  opportunities,
  language,
  profile,
  savedIds,
  onNavigate,
  onToggleSave,
  onSelectOpportunity,
  onGeneratePortfolio,
}) => {
  const t = translations[language];

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'soon' | 'new' | 'award'>('soon');

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: opportunities.length,
      scholarships: 0,
      internships: 0,
      hackathons: 0,
      certifications: 0,
      schemes: 0,
    };
    opportunities.forEach((opp) => {
      if (counts[opp.category] !== undefined) {
        counts[opp.category]++;
      }
    });
    return counts;
  }, [opportunities]);

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        // Category filter
        if (activeCategory !== 'all' && opp.category !== activeCategory) {
          return false;
        }

        // District filter
        if (
          selectedDistrict !== 'all' &&
          opp.district !== 'all' &&
          opp.district !== selectedDistrict
        ) {
          return false;
        }

        // Search query filter (matches title, provider, description, tags)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle =
            opp.title.toLowerCase().includes(q) || opp.titleMl.toLowerCase().includes(q);
          const matchProvider = opp.provider.toLowerCase().includes(q);
          const matchDesc =
            opp.description.toLowerCase().includes(q) ||
            opp.descriptionMl.toLowerCase().includes(q);
          const matchTags = opp.tags.some((tag) => tag.toLowerCase().includes(q));

          if (!matchTitle && !matchProvider && !matchDesc && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'soon') {
          return a.daysLeft - b.daysLeft;
        }
        if (sortBy === 'new') {
          return a.id.localeCompare(b.id);
        }
        if (sortBy === 'award') {
          return b.tags.length - a.tags.length;
        }
        return 0;
      });
  }, [opportunities, activeCategory, selectedDistrict, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedDistrict('all');
    setSortBy('soon');
  };

  const studentName = profile?.name ? profile.name : 'Student';
  const branchName =
    profile?.branch && t.branch[profile.branch as keyof typeof t.branch]
      ? t.branch[profile.branch as keyof typeof t.branch]
      : 'All Streams';
  const districtName =
    profile?.district &&
    keralaDistricts.find((d) => d.id === profile.district)
      ? language === 'ml'
        ? keralaDistricts.find((d) => d.id === profile.district)?.nameMl
        : keralaDistricts.find((d) => d.id === profile.district)?.nameEn
      : 'Kerala';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Dashboard Head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#0d7c70] dark:text-[#14b8a6] uppercase">
            {t.dashboard.eyebrow}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {t.dashboard.title}{' '}
            <span className="text-[#0d7c70] dark:text-[#14b8a6] underline decoration-[#e28b22] decoration-2 underline-offset-4">
              {studentName}
            </span>
            .
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {t.dashboard.showingMatches} ({branchName} · {districtName})
          </p>
        </div>

        <button
          onClick={() => onNavigate('profile')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-2xs hover:border-[#0d7c70] dark:hover:border-[#14b8a6] hover:text-[#0d7c70] dark:hover:text-[#14b8a6] transition-colors self-start sm:self-center"
        >
          <Edit3 className="h-4 w-4" />
          <span>{t.dashboard.edit}</span>
        </button>
      </div>

      {/* Dashboard Tools: Search Bar & District Dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.dashboard.searchPlaceholder}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* District Filter Dropdown */}
        <div className="md:col-span-3">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
          >
            <option value="all">📍 {t.district.all}</option>
            {keralaDistricts.map((d) => (
              <option key={d.id} value={d.id}>
                {language === 'ml' ? d.nameMl : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Control */}
        <div className="md:col-span-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              {t.dashboard.sort}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20 focus:outline-none"
            >
              <option value="soon">{t.dashboard.soon}</option>
              <option value="new">{t.dashboard.newest}</option>
              <option value="award">{t.dashboard.highReward}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-2 min-w-max border-b border-slate-200/80 dark:border-slate-800 pb-3" role="tablist">
          {[
            { id: 'all', label: t.category.all, count: categoryCounts.all },
            { id: 'scholarships', label: t.category.scholarships, count: categoryCounts.scholarships },
            { id: 'internships', label: t.category.internships, count: categoryCounts.internships },
            { id: 'hackathons', label: t.category.hackathons, count: categoryCounts.hackathons },
            { id: 'certifications', label: t.category.certifications, count: categoryCounts.certifications },
            { id: 'schemes', label: t.category.schemes, count: categoryCounts.schemes },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#0d7c70] dark:bg-[#14b8a6] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#0d7c70]/30 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Meta Banner */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <p>
          <strong className="text-slate-800 dark:text-slate-200 font-bold">{filteredOpportunities.length}</strong>{' '}
          {t.dashboard.matchedCount}
          {activeCategory !== 'all' && (
            <span> in <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{activeCategory}</span></span>
          )}
        </p>

        {(activeCategory !== 'all' || selectedDistrict !== 'all' || searchQuery) && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 font-bold text-[#0d7c70] dark:text-[#14b8a6] hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t.dashboard.clear}</span>
          </button>
        )}
      </div>

      {/* Opportunities Card Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              language={language}
              isSaved={savedIds.has(opp.id)}
              onToggleSave={onToggleSave}
              onSelect={onSelectOpportunity}
              onGeneratePortfolio={onGeneratePortfolio}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-12 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto text-2xl font-light">
            —
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.dashboard.emptyTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.dashboard.emptyCopy}
          </p>
          <div className="pt-2">
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 rounded-xl border border-[#0d7c70] dark:border-[#14b8a6] px-4 py-2 text-sm font-bold text-[#0d7c70] dark:text-[#14b8a6] hover:bg-[#0d7c70]/5 dark:hover:bg-[#14b8a6]/10 transition-colors"
            >
              <span>{t.dashboard.emptyCta}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
