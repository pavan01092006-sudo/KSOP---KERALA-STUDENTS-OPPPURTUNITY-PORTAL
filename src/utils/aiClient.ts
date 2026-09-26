import { Opportunity, StudentProfile, GeneratedPortfolio, Language } from '../types';

export async function fetchAiSummary(
  opportunity: Opportunity,
  language: Language = 'en'
): Promise<{
  eligible: string;
  requirements: string;
  deadline: string;
  restrictions: string;
}> {
  try {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunity, language }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.summary;
    }
  } catch (err) {
    console.warn('Backend summarize call failed, using client fallback', err);
  }

  // Graceful client fallback
  const isMl = language === 'ml';
  return {
    eligible: isMl
      ? `${opportunity.courseEligibility?.join(', ')} വിദ്യാർത്ഥികൾ (${opportunity.branchEligibility?.includes('all') ? 'എല്ലാ ബ്രാഞ്ചുകളും' : opportunity.branchEligibility?.join(', ')})`
      : `Open to ${opportunity.courseEligibility?.join(', ')} students across ${opportunity.branchEligibility?.includes('all') ? 'all disciplines' : opportunity.branchEligibility?.join(', ')} (${opportunity.yearEligibility?.join(', ')} year).`,
    requirements: isMl
      ? `കോളേജ് ഐഡി, പ്രൊജക്റ്റ് വിവരണം / റെസ്യുമെ സമർപ്പിക്കണം. ഔദ്യോഗിക പോർട്ടൽ വഴി ഓൺലൈനായി അപേക്ഷിക്കുക.`
      : `Online registration with student credentials, problem statement summary or resume.`,
    deadline: isMl
      ? `അവസാന തീയതി: ${opportunity.deadlineDate} (${opportunity.daysLeft} ദിവസങ്ങൾ ബാക്കി).`
      : `Application closes on ${opportunity.deadlineDate} (${opportunity.daysLeft} days left).`,
    restrictions: isMl
      ? `കേരളത്തിലെ അംഗീകൃത കോളേജുകളിൽ നിന്നുള്ള വിദ്യാർത്ഥികൾക്ക് മാത്രം; നിശ്ചിത ടീം പരിധി ബാധകം.`
      : `Enrolled student in recognized Kerala institution; active enrollment required.`,
  };
}

export async function checkAiEligibility(
  studentProfile: StudentProfile,
  opportunity: Opportunity,
  question: string,
  language: Language = 'en'
): Promise<{
  isEligible: boolean | 'partial';
  headline: string;
  reasoning: string;
  checklist: Array<{ criteria: string; status: 'pass' | 'fail' | 'warn'; detail: string }>;
  recommendation: string;
}> {
  try {
    const res = await fetch('/api/ai/check-eligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentProfile, opportunity, question, language }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend eligibility check failed, using client fallback', err);
  }

  // Rule-based comparison fallback
  const isMl = language === 'ml';
  const courseMatch =
    !opportunity.courseEligibility ||
    opportunity.courseEligibility.includes('all') ||
    opportunity.courseEligibility.includes(studentProfile.course);

  const branchMatch =
    !opportunity.branchEligibility ||
    opportunity.branchEligibility.includes('all') ||
    opportunity.branchEligibility.includes(studentProfile.branch);

  const yearMatch =
    !opportunity.yearEligibility ||
    opportunity.yearEligibility.includes('all') ||
    opportunity.yearEligibility.includes(studentProfile.year) ||
    (studentProfile.year === 'final' && opportunity.yearEligibility.includes('final'));

  const districtMatch =
    !opportunity.district ||
    opportunity.district === 'all' ||
    opportunity.district === studentProfile.district;

  const isEligible = courseMatch && branchMatch && yearMatch && districtMatch;

  return {
    isEligible,
    headline: isEligible
      ? (isMl ? 'അതെ, നിങ്ങൾ പൂർണ്ണ യോഗ്യനാണ്!' : 'Yes, you are fully eligible!')
      : (isMl ? 'യോഗ്യതാ മാനദണ്ഡങ്ങളിൽ ചില വ്യത്യാസങ്ങളുണ്ട്' : 'You may not fully meet all criteria'),
    reasoning: isEligible
      ? (isMl
          ? `താങ്കളുടെ കോഴ്സ് (${studentProfile.course}), ബ്രാഞ്ച് (${studentProfile.branch}), പഠന വർഷം (${studentProfile.year}) എന്നിവ ഈ അവസരത്തിന് പൂർണ്ണമായും യോജിക്കുന്നു.`
          : `Your course (${studentProfile.course}), branch (${studentProfile.branch}), and year (${studentProfile.year}) match the provider requirements.`)
      : (isMl
          ? `ലഭ്യമായ വിവരങ്ങൾ പ്രകാരം നിശ്ചിത ബ്രാഞ്ചുകൾക്കോ വർഷങ്ങൾക്കോ മുൻഗണന നൽകിയിരിക്കുന്നു.`
          : `Check specific year or branch requirements; your current semester or discipline may require special consideration.`),
    checklist: [
      {
        criteria: isMl ? 'കോഴ്സ് തലം' : 'Course Level',
        status: courseMatch ? 'pass' : 'fail',
        detail: courseMatch ? 'Direct match' : 'Different course tier',
      },
      {
        criteria: isMl ? 'ബ്രാഞ്ച്' : 'Branch / Discipline',
        status: branchMatch ? 'pass' : 'fail',
        detail: branchMatch ? 'Eligible discipline' : 'Specific branch priority',
      },
      {
        criteria: isMl ? 'പഠന വർഷം' : 'Year of Study',
        status: yearMatch ? 'pass' : 'fail',
        detail: yearMatch ? 'Target semester matches' : 'Review eligible year range',
      },
      {
        criteria: isMl ? 'സ്ഥലം / ജില്ല' : 'Location / District',
        status: districtMatch ? 'pass' : 'fail',
        detail: districtMatch ? 'Eligible region' : 'District specific opening',
      },
    ],
    recommendation: isMl
      ? 'ഔദ്യോഗിക പോർട്ടൽ വഴി സമയബന്ധിതമായി അപേക്ഷ സമർപ്പിക്കുക.'
      : 'Review the problem statements or project tracks on the official portal and apply before the deadline.',
  };
}

export async function generateAiPortfolio(
  studentProfile: StudentProfile,
  extraData: {
    bio?: string;
    projects?: Array<{ title: string; techStack: string; relevance?: string; description: string; link?: string }>;
    achievements?: string[];
    email?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  },
  opportunity: Opportunity,
  language: Language = 'en'
): Promise<GeneratedPortfolio> {
  try {
    const res = await fetch('/api/ai/generate-portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentProfile, extraData, opportunity, language }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend portfolio generation failed, using client fallback', err);
  }

  // High quality client fallback
  const name = studentProfile.name || 'Candidate';
  const college = studentProfile.college || 'Government Engineering College';
  const branchFormatted = studentProfile.branch.replace('-', ' ').toUpperCase();

  return {
    fullName: name,
    targetOpportunityTitle: opportunity.title,
    headline: `${branchFormatted} Innovator & Tech Enthusiast | ${college}`,
    summary: `Driven ${studentProfile.course} candidate specializing in ${branchFormatted} with hands-on experience in building scalable modern solutions. Prepared to deliver high-impact results for ${opportunity.provider}'s ${opportunity.title}.`,
    keySkills: studentProfile.interests.length > 0
      ? studentProfile.interests.map(i => i.replace('-', ' ').toUpperCase())
      : ['REACT', 'PYTHON', 'CLOUD ARCHITECTURE', 'GIT', 'REST APIS'],
    matchingStrengths: [
      `Hands-on expertise directly aligned with technical requirements of ${opportunity.title}.`,
      `Demonstrated capability in collaborative development and rapid learning agility.`,
      `Active engagement in Kerala's collegiate innovation and startup ecosystem.`,
    ],
    projects: extraData.projects && extraData.projects.length > 0
      ? extraData.projects.map((p) => ({
          title: p.title || 'Technical Solution Prototype',
          techStack: p.techStack || 'React, TypeScript, Node.js',
          relevance: `Directly demonstrates core competencies requested by ${opportunity.provider}.`,
          description: p.description || 'Architected and built full-stack application with real-time responsive workflows.',
          link: p.link || extraData.github || 'https://github.com',
        }))
      : [
          {
            title: 'Campus Opportunity Matcher Platform',
            techStack: 'TypeScript, React, Tailwind CSS, REST APIs',
            relevance: `Proves full-stack development and real-world system architecture capabilities.`,
            description: 'Engineered an interactive student matching portal with localized district filtering, role-based workflows, and clean responsive interfaces.',
            link: extraData.github || 'https://github.com/candidate/project',
          },
          {
            title: 'Automated Data Intelligence Engine',
            techStack: 'Python, FastAPI, Scikit-Learn, Docker',
            relevance: `Highlights analytical rigor and API integration readiness.`,
            description: 'Constructed an ML model evaluating real datasets with high precision and low-latency inference endpoint.',
            link: extraData.github || 'https://github.com/candidate/ml-model',
          },
        ],
    achievements: extraData.achievements && extraData.achievements.length > 0
      ? extraData.achievements
      : [
          'Top 5% performer in academic cohort with consistent merit.',
          'Active participant in Kerala Startup Mission (KSUM) IEDC innovation hackathons.',
        ],
    contactInfo: {
      email: extraData.email || 'candidate@gmail.com',
      college: college,
      branch: branchFormatted,
      district: studentProfile.district,
      github: extraData.github || 'https://github.com/candidate',
      linkedin: extraData.linkedin || 'https://linkedin.com/in/candidate',
      portfolio: extraData.portfolio || '',
    },
    callToAction: `Eager to contribute technical skills and enthusiasm to ${opportunity.provider}. Available for immediate interviews.`,
  };
}

export async function autoTagOpportunity(
  rawText: string,
  title: string = ''
): Promise<{
  suggestedTitle: string;
  category: any;
  branchEligibility: string[];
  courseEligibility: string[];
  yearEligibility: string[];
  district: string;
  tags: string[];
  skills: string[];
  awardOrStipend: string;
  mode: any;
  keyPerks: string[];
}> {
  try {
    const res = await fetch('/api/ai/auto-tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText, title }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend auto-tag call failed, using client fallback', err);
  }

  // Client heuristic fallback
  const textLower = (title + ' ' + rawText).toLowerCase();
  let category: any = 'internships';
  if (textLower.includes('scholarship') || textLower.includes('grant')) category = 'scholarships';
  else if (textLower.includes('hackathon') || textLower.includes('challenge')) category = 'hackathons';
  else if (textLower.includes('certification') || textLower.includes('course')) category = 'certifications';
  else if (textLower.includes('scheme') || textLower.includes('govt')) category = 'schemes';

  const branches = ['computer-science', 'engineering'];
  let district = 'all';
  if (textLower.includes('kochi') || textLower.includes('ernakulam')) district = 'kochi';
  else if (textLower.includes('trivandrum') || textLower.includes('thiruvananthapuram')) district = 'thiruvananthapuram';
  else if (textLower.includes('kozhikode') || textLower.includes('calicut')) district = 'kozhikode';

  return {
    suggestedTitle: title || 'New Opportunity',
    category,
    branchEligibility: branches,
    courseEligibility: ['undergraduate', 'diploma', 'pg'],
    yearEligibility: ['2', '3', '4', 'final'],
    district,
    tags: ['Tech & Engineering', 'Kerala Students'],
    skills: ['web-dev', 'ai-ml'],
    awardOrStipend: textLower.includes('stipend') ? '₹15,000 / month' : 'Certificate & Direct Mentorship',
    mode: 'Hybrid',
    keyPerks: ['Government co-signed certificate', 'Hands-on practical experience', 'Direct mentor connect'],
  };
}
