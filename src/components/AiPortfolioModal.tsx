import React, { useState, useEffect } from 'react';
import { Opportunity, StudentProfile, GeneratedPortfolio, Language } from '../types';
import { translations } from '../utils/i18n';
import { generateAiPortfolio } from '../utils/aiClient';
import {
  X,
  Sparkles,
  Download,
  Eye,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  Printer,
  Copy,
} from 'lucide-react';

interface AiPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  studentProfile: StudentProfile | null;
  language: Language;
  onNotify: (msg: string) => void;
}

export const AiPortfolioModal: React.FC<AiPortfolioModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  studentProfile,
  language,
  onNotify,
}) => {
  const t = translations[language];

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');

  // Additional form details
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  // Additional projects state
  const [projects, setProjects] = useState<
    Array<{ title: string; techStack: string; relevance?: string; description: string; link?: string }>
  >([
    {
      title: 'Smart Campus IoT & Opportunity Engine',
      techStack: 'React, Node.js, Python, PostgreSQL',
      relevance: 'Demonstrates end-to-end full-stack and API capabilities',
      description: 'Built a localized notification and discovery portal for students in Kerala.',
      link: 'https://github.com/my-profile/project',
    },
  ]);

  // Additional achievements
  const [achievements, setAchievements] = useState<string[]>([
    'Top 5 percentile in semester examinations at college.',
    'IEDC Hackathon finalist at Kerala Startup Mission.',
  ]);

  // Generated output
  const [portfolioData, setPortfolioData] = useState<GeneratedPortfolio | null>(null);

  // Initialize defaults on open
  useEffect(() => {
    if (isOpen && studentProfile && opportunity) {
      setEmail(`${studentProfile.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`);
      setGithub(`https://github.com/${studentProfile.name.toLowerCase().replace(/\s+/g, '')}`);
      setLinkedin(`https://linkedin.com/in/${studentProfile.name.toLowerCase().replace(/\s+/g, '')}`);

      // Auto generate initial portfolio
      handleGenerate();
    }
  }, [isOpen, opportunity?.id]);

  if (!isOpen || !opportunity || !studentProfile) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateAiPortfolio(
        studentProfile,
        {
          bio,
          projects,
          achievements,
          email,
          github,
          linkedin,
          portfolio: portfolioLink,
        },
        opportunity,
        language
      );
      setPortfolioData(generated);
      setActiveTab('preview');
      onNotify('Tailored portfolio generated successfully!');
    } catch (err) {
      console.error(err);
      onNotify('Failed to generate tailored portfolio');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 my-4 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-50 dark:from-slate-900 via-white dark:via-slate-900 to-amber-50/30 dark:to-slate-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] text-white shadow-xs">
              <Sparkles className="h-5 w-5 text-[#e28b22]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {t.portfolio.modalTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                Targeting: <strong className="text-[#0d7c70] dark:text-[#14b8a6]">{opportunity.title}</strong> ({opportunity.provider})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {portfolioData && (
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-2xs">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    activeTab === 'preview'
                      ? 'bg-[#0d7c70] dark:bg-[#14b8a6] text-white dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{t.portfolio.previewMode}</span>
                </button>
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    activeTab === 'edit'
                      ? 'bg-[#0d7c70] dark:bg-[#14b8a6] text-white dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{t.portfolio.editMode}</span>
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isGenerating ? (
            /* Loading State */
            <div className="py-20 text-center space-y-4">
              <div className="relative mx-auto h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-teal-200 dark:border-teal-900 border-t-[#0d7c70] dark:border-t-[#14b8a6] animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto h-7 w-7 text-[#e28b22] animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {t.portfolio.generating}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Analyzing required skills for {opportunity.title} and tailoring your coursework, projects, and achievements...
              </p>
            </div>
          ) : activeTab === 'edit' && portfolioData ? (
            /* Inline Edit Mode */
            <div className="space-y-6">
              <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/40 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>{t.portfolio.editPrompt}</span>
                <button
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 font-bold text-white shadow-2xs hover:bg-amber-700"
                >
                  <Sparkles className="h-3 w-3" />
                  Regenerate with AI
                </button>
              </div>

              {/* Editable Headline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.portfolio.headline}
                </label>
                <input
                  type="text"
                  value={portfolioData.headline}
                  onChange={(e) =>
                    setPortfolioData({ ...portfolioData, headline: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20"
                />
              </div>

              {/* Editable Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.portfolio.summary}
                </label>
                <textarea
                  rows={3}
                  value={portfolioData.summary}
                  onChange={(e) =>
                    setPortfolioData({ ...portfolioData, summary: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed focus:border-[#0d7c70] dark:focus:border-[#14b8a6] focus:ring-2 focus:ring-[#0d7c70]/20"
                />
              </div>

              {/* Editable Matching Strengths */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.portfolio.matchingStrengths}
                </label>
                {portfolioData.matchingStrengths.map((str, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={str}
                    onChange={(e) => {
                      const updated = [...portfolioData.matchingStrengths];
                      updated[idx] = e.target.value;
                      setPortfolioData({ ...portfolioData, matchingStrengths: updated });
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                  />
                ))}
              </div>

              {/* Editable Projects */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.portfolio.projects}
                  </label>
                  <button
                    onClick={() => {
                      setPortfolioData({
                        ...portfolioData,
                        projects: [
                          ...portfolioData.projects,
                          {
                            title: 'New Highlighted Project',
                            techStack: 'React, Node.js, Python',
                            relevance: 'Demonstrates key skills',
                            description: 'Built scalable end-to-end prototype.',
                            link: 'https://github.com',
                          },
                        ],
                      });
                    }}
                    className="text-xs font-bold text-[#0d7c70] dark:text-[#14b8a6] hover:underline"
                  >
                    + Add Project
                  </button>
                </div>

                {portfolioData.projects.map((proj, pIdx) => (
                  <div key={pIdx} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-800/60">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...portfolioData.projects];
                          updated[pIdx].title = e.target.value;
                          setPortfolioData({ ...portfolioData, projects: updated });
                        }}
                        className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 bg-transparent w-full focus:outline-none focus:border-[#0d7c70]"
                        placeholder="Project Title"
                      />
                      <button
                        onClick={() => {
                          const updated = portfolioData.projects.filter((_, i) => i !== pIdx);
                          setPortfolioData({ ...portfolioData, projects: updated });
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={proj.techStack}
                      onChange={(e) => {
                        const updated = [...portfolioData.projects];
                        updated[pIdx].techStack = e.target.value;
                        setPortfolioData({ ...portfolioData, projects: updated });
                      }}
                      className="text-xs font-semibold text-[#0d7c70] dark:text-[#14b8a6] border-b border-slate-200 dark:border-slate-700 bg-transparent w-full focus:outline-none"
                      placeholder="Tech Stack (e.g. React, TypeScript, Python)"
                    />

                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...portfolioData.projects];
                        updated[pIdx].description = e.target.value;
                        setPortfolioData({ ...portfolioData, projects: updated });
                      }}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-700 dark:text-slate-200"
                      placeholder="Project description & impact"
                    />
                  </div>
                ))}
              </div>

              {/* Editable Achievements */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.portfolio.achievements}
                </label>
                {portfolioData.achievements.map((ach, aIdx) => (
                  <div key={aIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ach}
                      onChange={(e) => {
                        const updated = [...portfolioData.achievements];
                        updated[aIdx] = e.target.value;
                        setPortfolioData({ ...portfolioData, achievements: updated });
                      }}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                    />
                    <button
                      onClick={() => {
                        const updated = portfolioData.achievements.filter((_, i) => i !== aIdx);
                        setPortfolioData({ ...portfolioData, achievements: updated });
                      }}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Call to action note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.portfolio.callToAction}
                </label>
                <input
                  type="text"
                  value={portfolioData.callToAction}
                  onChange={(e) =>
                    setPortfolioData({ ...portfolioData, callToAction: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          ) : portfolioData ? (
            /* Viewable Webpage & Printable Resume Layout */
            <div id="portfolio-printable" className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8">
              {/* Header Profile Info */}
              <div className="border-b border-slate-100 dark:border-slate-700/80 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-md bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 text-[11px] font-bold text-[#0d7c70] dark:text-[#14b8a6] border border-teal-200 dark:border-teal-800">
                      Tailored Candidate Dossier
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {opportunity.provider}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {portfolioData.fullName}
                  </h1>
                  <p className="text-sm font-semibold text-[#0d7c70] dark:text-[#14b8a6] mt-1">
                    {portfolioData.headline}
                  </p>
                </div>

                {/* Contact Pills */}
                <div className="flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300 sm:text-right">
                  <div className="flex items-center gap-1.5 sm:justify-end">
                    <Building className="h-3.5 w-3.5 text-slate-400" />
                    <span>{portfolioData.contactInfo.college}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:justify-end">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="capitalize">{portfolioData.contactInfo.district}, Kerala</span>
                  </div>
                  {portfolioData.contactInfo.github && (
                    <div className="flex items-center gap-1.5 sm:justify-end text-[#0d7c70] dark:text-[#14b8a6]">
                      <Github className="h-3.5 w-3.5" />
                      <span className="underline truncate max-w-[200px]">{portfolioData.contactInfo.github}</span>
                    </div>
                  )}
                  {portfolioData.contactInfo.linkedin && (
                    <div className="flex items-center gap-1.5 sm:justify-end text-[#0d7c70] dark:text-[#14b8a6]">
                      <Linkedin className="h-3.5 w-3.5" />
                      <span className="underline truncate max-w-[200px]">{portfolioData.contactInfo.linkedin}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tailored Executive Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Targeted Executive Summary
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                  {portfolioData.summary}
                </p>
              </div>

              {/* Matching Strengths */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Why I Match {opportunity.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {portfolioData.matchingStrengths.map((str, idx) => (
                    <div key={idx} className="rounded-xl border border-teal-100 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/40 p-3 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0d7c70] dark:text-[#14b8a6] shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Skills */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Highlighted Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.keySkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured Tailored Projects */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Featured Projects & Evidence
                </h3>
                <div className="space-y-3">
                  {portfolioData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                          <span className="text-xs font-semibold text-[#0d7c70] dark:text-[#14b8a6]">{proj.techStack}</span>
                        </div>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0d7c70] dark:hover:text-[#14b8a6]"
                          >
                            <span>Code / Demo</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{proj.description}</p>
                      {proj.relevance && (
                        <p className="text-[11px] text-[#e28b22] font-semibold">
                          ✦ {proj.relevance}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Honors & Achievements */}
              {portfolioData.achievements.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recognitions & Credentials
                  </h3>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                    {portfolioData.achievements.map((ach, idx) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Closing Call to Action Note */}
              <div className="rounded-xl bg-[#0d7c70]/5 dark:bg-[#14b8a6]/10 border border-[#0d7c70]/20 dark:border-[#14b8a6]/30 p-4 text-xs font-semibold text-[#0d7c70] dark:text-[#14b8a6] flex items-center justify-between">
                <span>{portfolioData.callToAction}</span>
                <span className="text-[11px] text-slate-400 uppercase font-bold">KSOP Tailored Match</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'preview' ? 'edit' : 'preview')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {activeTab === 'preview' ? (
                <>
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{t.portfolio.editMode}</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>{t.portfolio.previewMode}</span>
                </>
              )}
            </button>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 px-3.5 py-2 text-xs font-bold text-[#0d7c70] dark:text-[#14b8a6] hover:bg-teal-100 dark:hover:bg-teal-900/40"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#e28b22]" />
              <span>Regenerate with AI</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d7c70] to-[#08564e] dark:from-[#14b8a6] dark:to-[#0d7c70] px-4 py-2 text-xs sm:text-sm font-bold text-white dark:text-slate-950 shadow-xs hover:from-[#08564e] hover:to-[#053d37]"
            >
              <Printer className="h-4 w-4" />
              <span>{t.portfolio.downloadPdf}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
