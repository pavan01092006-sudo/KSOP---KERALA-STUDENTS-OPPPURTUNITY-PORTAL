import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent as instructed by skill
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to clean JSON string from model
function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
  }
  return cleaned.trim();
}

// 1. AI Guideline Summarizer
app.post('/api/ai/summarize', async (req, res) => {
  const { opportunity, language = 'en' } = req.body;

  if (!opportunity) {
    return res.status(400).json({ error: 'Opportunity details are required' });
  }

  const isMalayalam = language === 'ml';

  try {
    if (ai) {
      const prompt = `You are an expert academic advisor for Kerala college students.
Condense the opportunity details below into exactly 4 concise, high-impact bullet points:
1. Who is eligible: (courses, years, branches, districts)
2. What's required to apply: (documents, pitch deck, GitHub, quiz, etc.)
3. The deadline: (exact date and countdown urgency)
4. Important restrictions: (team size limit, age caps, attendance, exclusivity, etc.)

Opportunity Title: ${opportunity.title}
Provider: ${opportunity.provider}
Category: ${opportunity.category}
Location/District: ${opportunity.districtNameEn || opportunity.district}
Eligible Branches: ${JSON.stringify(opportunity.branchEligibility)}
Eligible Courses: ${JSON.stringify(opportunity.courseEligibility)}
Eligible Years: ${JSON.stringify(opportunity.yearEligibility)}
Description: ${opportunity.description}
Full Details: ${opportunity.longDescription}
Perks: ${JSON.stringify(opportunity.perks)}
Steps to apply: ${JSON.stringify(opportunity.stepsToApply)}
Deadline: ${opportunity.deadlineDate} (${opportunity.daysLeft} days left)

${isMalayalam ? 'Respond in natural, grammatically correct Malayalam (മലയാളം).' : 'Respond in clear, professional English.'}

Return your answer strictly in valid JSON matching this schema:
{
  "eligible": "string",
  "requirements": "string",
  "deadline": "string",
  "restrictions": "string"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(cleanJsonOutput(text));
      return res.json({
        summary: parsed,
        bullets: [
          parsed.eligible,
          parsed.requirements,
          parsed.deadline,
          parsed.restrictions,
        ],
      });
    }
  } catch (err) {
    console.error('Gemini summarizer error:', err);
  }

  // High quality deterministic fallback
  const eligibleStr = isMalayalam
    ? `${opportunity.courseEligibility?.join(', ')} വിദ്യാർത്ഥികൾ (${opportunity.branchEligibility?.includes('all') ? 'എല്ലാ ബ്രാഞ്ചുകളും' : opportunity.branchEligibility?.join(', ')})`
    : `Open to ${opportunity.courseEligibility?.join(', ')} students across ${opportunity.branchEligibility?.includes('all') ? 'all disciplines' : opportunity.branchEligibility?.join(', ')} (${opportunity.yearEligibility?.join(', ')} year).`;

  const reqStr = isMalayalam
    ? `കോളേജ് ഐഡി, പ്രൊജക്റ്റ് വിവരണം / റെസ്യുമെ സമർപ്പിക്കണം. ഔദ്യോഗിക പോർട്ടൽ വഴി ഓൺലൈനായി അപേക്ഷിക്കുക.`
    : `Online registration with student ID credentials, brief statement of purpose, and academic transcript.`;

  const deadlineStr = isMalayalam
    ? `അവസാന തീയതി: ${opportunity.deadlineDate} (${opportunity.daysLeft} ദിവസങ്ങൾ ബാക്കി).`
    : `Application deadline is ${opportunity.deadlineDate} (${opportunity.daysLeft} days remaining).`;

  const restrictionsStr = isMalayalam
    ? `ടീം പരിധി: 2-4 അംഗങ്ങൾ; കേരളത്തിലെ അംഗീകൃത കോളേജുകളിൽ നിന്നുള്ളവർക്ക് മാത്രം.`
    : `Must be actively enrolled in a recognized institution in Kerala; team or individual submissions as stipulated.`;

  res.json({
    summary: {
      eligible: eligibleStr,
      requirements: reqStr,
      deadline: deadlineStr,
      restrictions: restrictionsStr,
    },
    bullets: [eligibleStr, reqStr, deadlineStr, restrictionsStr],
  });
});

// 2. AI Eligibility Checker
app.post('/api/ai/check-eligibility', async (req, res) => {
  const { studentProfile, opportunity, question = 'Am I eligible?', language = 'en' } = req.body;

  if (!studentProfile || !opportunity) {
    return res.status(400).json({ error: 'Profile and opportunity details required' });
  }

  const isMalayalam = language === 'ml';

  try {
    if (ai) {
      const prompt = `You are a knowledgeable student eligibility counselor for Kerala collegiate opportunities (KTU, Kerala University, Calicut University, CUSAT, etc.).
Compare this student's profile with the opportunity's criteria and answer their query: "${question}".

Student Profile:
- Name: ${studentProfile.name || 'Student'}
- Course Level: ${studentProfile.course}
- Branch: ${studentProfile.branch}
- Year of Study: ${studentProfile.year}
- College: ${studentProfile.college || 'College in Kerala'}
- District: ${studentProfile.district}
- Skills/Interests: ${JSON.stringify(studentProfile.interests)}

Target Opportunity:
- Title: ${opportunity.title}
- Provider: ${opportunity.provider}
- Category: ${opportunity.category}
- Eligible Courses: ${JSON.stringify(opportunity.courseEligibility)}
- Eligible Branches: ${JSON.stringify(opportunity.branchEligibility)}
- Eligible Years: ${JSON.stringify(opportunity.yearEligibility)}
- District/Location: ${opportunity.district} (${opportunity.districtNameEn || 'Statewide'})
- Required Tags: ${JSON.stringify(opportunity.tags)}
- Description: ${opportunity.description}

Analyze thoroughly:
1. Is the student course level accepted?
2. Is their branch/discipline accepted or is it 'all'?
3. Is their year of study included?
4. Is their district compatible (statewide 'all' matches everyone)?
5. Do their skills/interests match the target domains?

${isMalayalam ? 'Respond in natural, supportive Malayalam (മലയാളം).' : 'Respond in encouraging, concise English.'}

Return strictly in valid JSON:
{
  "isEligible": true, // or false, or "partial"
  "headline": "Short 1-line verdict e.g. 'Yes, you are fully eligible!' or 'You qualify with minor notes'",
  "reasoning": "Clear 2-3 sentence explanation referencing their specific branch, year, and district",
  "checklist": [
    { "criteria": "Course Level", "status": "pass", "detail": "..." },
    { "criteria": "Branch / Stream", "status": "pass", "detail": "..." },
    { "criteria": "Year of Study", "status": "pass", "detail": "..." },
    { "criteria": "Location / District", "status": "pass", "detail": "..." }
  ],
  "recommendation": "1 actionable advice on preparing their application"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(cleanJsonOutput(response.text || ''));
      return res.json(parsed);
    }
  } catch (err) {
    console.error('Gemini eligibility checker error:', err);
  }

  // Rule-based fallback verification
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

  res.json({
    isEligible: isEligible,
    headline: isEligible
      ? (isMalayalam ? 'അതെ, നിങ്ങൾ പൂർണ്ണ യോഗ്യനാണ്!' : 'Yes, you are fully eligible!')
      : (isMalayalam ? 'യോഗ്യതാ മാനദണ്ഡങ്ങളിൽ ചില വ്യത്യാസങ്ങളുണ്ട്' : 'You may not fully meet all criteria'),
    reasoning: isEligible
      ? (isMalayalam
          ? `നിങ്ങളുടെ കോഴ്സ് (${studentProfile.course}), ബ്രാഞ്ച് (${studentProfile.branch}), വർഷം (${studentProfile.year}) എന്നിവ ഈ അവസരത്തിന് പൂർണ്ണമായും യോജിക്കുന്നു.`
          : `Your course (${studentProfile.course}), branch (${studentProfile.branch}), and year (${studentProfile.year}) perfectly align with the provider requirements.`)
      : (isMalayalam
          ? `ഈ അവസരത്തിൽ നിർദ്ദേശിച്ച ബ്രാഞ്ചുകളോ പഠനവർഷമോ താങ്കളുടെ നിലവിലെ പ്രൊഫൈലുമായി വ്യത്യാസപ്പെട്ടിരിക്കുന്നു.`
          : `Check specific year or branch requirements; your current semester or discipline may require an exemption request.`),
    checklist: [
      {
        criteria: isMalayalam ? 'കോഴ്സ് തലം' : 'Course Level',
        status: courseMatch ? 'pass' : 'fail',
        detail: courseMatch ? 'Matches eligibility' : 'Different course requirement',
      },
      {
        criteria: isMalayalam ? 'ബ്രാഞ്ച്' : 'Branch / Stream',
        status: branchMatch ? 'pass' : 'fail',
        detail: branchMatch ? 'Branch is eligible' : 'Targeted towards specific departments',
      },
      {
        criteria: isMalayalam ? 'പഠന വർഷം' : 'Year of Study',
        status: yearMatch ? 'pass' : 'fail',
        detail: yearMatch ? 'Year level matches' : 'Review target semester range',
      },
      {
        criteria: isMalayalam ? 'ജില്ല' : 'District / Region',
        status: districtMatch ? 'pass' : 'fail',
        detail: districtMatch ? 'Eligible location' : 'Specific district priority',
      },
    ],
    recommendation: isMalayalam
      ? 'സമയബന്ധിതമായി ഔദ്യോഗിക ലിങ്ക് വഴി അപേക്ഷ പൂർത്തിയാക്കുക.'
      : 'Review the problem statements or project tracks on the official portal and apply before the deadline.',
  });
});

// 3. AI Tailored Portfolio Generator
app.post('/api/ai/generate-portfolio', async (req, res) => {
  const { studentProfile, extraData, opportunity, language = 'en' } = req.body;

  if (!studentProfile || !opportunity) {
    return res.status(400).json({ error: 'Student profile and opportunity are required' });
  }

  const isMalayalam = language === 'ml';

  try {
    if (ai) {
      const prompt = `You are a career strategist who builds standout, highly tailored one-page student portfolios and resumes for Kerala engineering, polytechnic, and university students applying for competitive internships, hackathons, and fellowships.

Opportunity being applied to:
- Title: ${opportunity.title}
- Provider: ${opportunity.provider}
- Category: ${opportunity.category}
- Required Skills/Domain: ${JSON.stringify(opportunity.tags)}
- Description: ${opportunity.description}
- Long Description: ${opportunity.longDescription}

Student Profile:
- Name: ${studentProfile.name || 'Candidate'}
- College: ${studentProfile.college || 'Engineering College, Kerala'}
- Course & Branch: ${studentProfile.course} in ${studentProfile.branch}
- Current Year: ${studentProfile.year}
- District: ${studentProfile.district}
- Core Skills: ${JSON.stringify(studentProfile.interests)}

Additional Candidate Details:
- Bio / Intro: ${extraData?.bio || ''}
- Projects provided: ${JSON.stringify(extraData?.projects || [])}
- Key Achievements: ${JSON.stringify(extraData?.achievements || [])}
- Contact / Links: Email: ${extraData?.email || ''}, GitHub: ${extraData?.github || ''}, LinkedIn: ${extraData?.linkedin || ''}, Portfolio: ${extraData?.portfolio || ''}

TASK:
Craft a tailored, professional one-page portfolio specifically targeted to ${opportunity.title} at ${opportunity.provider}.
- The headline must connect the candidate's core strengths to the opportunity.
- The summary (2-3 sentences) must explain why they are a top match for ${opportunity.provider}.
- Highlight 2-3 relevant projects (refining or expanding any provided projects, or framing them with realistic tech stacks like React, Python, IoT, FastApi, PyTorch, Node.js).
- Select the top 5-8 matching skills and 3 key strengths tailored to this role.
- Provide a strong closing statement.

${isMalayalam ? 'Write the portfolio content in professional, formal Malayalam (മലയാളം).' : 'Write in clear, persuasive English.'}

Return strictly in valid JSON matching this schema:
{
  "fullName": "Candidate Name",
  "targetOpportunityTitle": "${opportunity.title}",
  "headline": "e.g. Aspiring Full-Stack & AI Engineer | 3rd Year B.Tech at GEC",
  "summary": "Compelling 2-3 sentence executive summary linking student skills directly to the opportunity requirements...",
  "keySkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "matchingStrengths": [
    "Strength 1 tailored to provider",
    "Strength 2 tailored to provider",
    "Strength 3 tailored to provider"
  ],
  "projects": [
    {
      "title": "Project Name",
      "techStack": "Technologies used",
      "relevance": "Why this project proves readiness for this opportunity",
      "description": "2-3 bullet description of problem, solution, and impact",
      "link": "https://github.com/..."
    }
  ],
  "achievements": [
    "Achievement 1",
    "Achievement 2"
  ],
  "contactInfo": {
    "email": "${extraData?.email || 'student@example.com'}",
    "college": "${studentProfile.college || 'Kerala Technical University'}",
    "branch": "${studentProfile.branch}",
    "district": "${studentProfile.district}",
    "github": "${extraData?.github || 'github.com/student'}",
    "linkedin": "${extraData?.linkedin || 'linkedin.com/in/student'}",
    "portfolio": "${extraData?.portfolio || ''}"
  },
  "callToAction": "Closing statement expressing enthusiasm for contributing to ${opportunity.provider}."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(cleanJsonOutput(response.text || ''));
      return res.json(parsed);
    }
  } catch (err) {
    console.error('Gemini portfolio generation error:', err);
  }

  // Fallback tailored portfolio
  const candidateName = studentProfile.name || 'Gautham S.';
  const college = studentProfile.college || 'Government Engineering College';
  const branchFormatted = studentProfile.branch.replace('-', ' ').toUpperCase();

  res.json({
    fullName: candidateName,
    targetOpportunityTitle: opportunity.title,
    headline: `${branchFormatted} Scholar & Tech Builder | ${college}`,
    summary: `Driven ${studentProfile.course} candidate specializing in ${branchFormatted} with hands-on experience in building scalable web and software applications. Eager to contribute practical problem-solving skills and domain knowledge to ${opportunity.provider}'s ${opportunity.title}.`,
    keySkills: studentProfile.interests.length > 0
      ? studentProfile.interests.map((i: string) => i.replace('-', ' ').toUpperCase())
      : ['PYTHON', 'REACT', 'MACHINE LEARNING', 'CLOUD ARCHITECTURE', 'GIT'],
    matchingStrengths: [
      `Demonstrated capability in practical technical implementations relevant to ${opportunity.tags?.[0] || 'engineering'}.`,
      `Active problem-solving mindset with fast learning agility in collaborative environments.`,
      `Located in Kerala with deep engagement in collegiate innovation and hackathon ecosystems.`,
    ],
    projects: (extraData?.projects && extraData.projects.length > 0)
      ? extraData.projects.map((p: any) => ({
          title: p.title || 'Innovative Domain Prototype',
          techStack: p.techStack || 'React, Node.js, Python, PostgreSQL',
          relevance: `Directly demonstrates competencies requested by ${opportunity.provider}.`,
          description: p.description || 'Designed and implemented end-to-end architecture with real-time responsive UI and secure backend.',
          link: p.link || extraData?.github || 'https://github.com',
        }))
      : [
          {
            title: 'Campus Opportunity & Project Aggregator',
            techStack: 'TypeScript, React, Tailwind CSS, REST APIs',
            relevance: `Proves full-stack development and real-world system architecture capabilities.`,
            description: 'Engineered an interactive student matching portal with localized district filtering, role-based workflows, and clean responsive interfaces.',
            link: extraData?.github || 'https://github.com/candidate/project',
          },
          {
            title: 'Automated Diagnostic & Prediction Engine',
            techStack: 'Python, Scikit-Learn, FastAPI, Docker',
            relevance: `Highlights data-driven analytical rigor and API integration.`,
            description: 'Constructed an ML model evaluating tabular datasets with 92% precision and low-latency inference endpoint.',
            link: extraData?.github || 'https://github.com/candidate/ml-model',
          },
        ],
    achievements: (extraData?.achievements && extraData.achievements.length > 0)
      ? extraData.achievements
      : [
          'Ranked in top 5% of college cohort with consistent academic merit.',
          'Active participant in Kerala Startup Mission (KSUM) IEDC innovation challenges.',
        ],
    contactInfo: {
      email: extraData?.email || 'candidate@gmail.com',
      college: college,
      branch: branchFormatted,
      district: studentProfile.district,
      github: extraData?.github || 'https://github.com/candidate',
      linkedin: extraData?.linkedin || 'https://linkedin.com/in/candidate',
      portfolio: extraData?.portfolio || '',
    },
    callToAction: `Excited for the opportunity to interview and deliver tangible impact at ${opportunity.provider}.`,
  });
});

// 4. Auto-Tagging for New Submissions
app.post('/api/ai/auto-tag', async (req, res) => {
  const { rawText, title = '' } = req.body;

  if (!rawText && !title) {
    return res.status(400).json({ error: 'Text description or title required for auto-tagging' });
  }

  try {
    if (ai) {
      const prompt = `You are an AI classifier for Kerala Student Opportunity Platform (KSOP).
Analyze the opportunity description below and extract standardized tags and classification metadata.

Opportunity Title / Headline: ${title}
Raw Description / Requirements:
"""
${rawText}
"""

Choose from these standard options:
- Category: 'scholarships' | 'internships' | 'hackathons' | 'certifications' | 'schemes'
- Branches: subset of ['computer-science', 'engineering', 'commerce', 'science', 'arts', 'health'] or ['all']
- Courses: subset of ['undergraduate', 'diploma', 'pg']
- Years: subset of ['1', '2', '3', '4', 'final']
- District: one of ['all', 'thiruvananthapuram', 'kollam', 'pathanamthitta', 'alappuzha', 'kottayam', 'idukki', 'kochi', 'thrissur', 'palakkad', 'malappuram', 'kozhikode', 'wayanad', 'kannur', 'kasaragod']
- Skills/Interests: subset of ['ai-ml', 'web-dev', 'robotics-iot', 'cybersecurity', 'cloud-devops', 'data-analytics', 'ui-ux', 'entrepreneurship', 'cleantech-ev', 'finance-fintech', 'biotech-health', 'competitive-coding', 'research-papers']

Return strictly in valid JSON:
{
  "suggestedTitle": "Clean professional title",
  "category": "internships", // one of 5
  "branchEligibility": ["computer-science", "engineering"],
  "courseEligibility": ["undergraduate", "pg"],
  "yearEligibility": ["3", "4", "final"],
  "district": "kochi", // or 'all'
  "tags": ["AI & ML", "Full-Stack Web"],
  "skills": ["ai-ml", "web-dev"],
  "awardOrStipend": "e.g. ₹15,000 / month or ₹1,00,000 Prize Pool or 100% Free",
  "mode": "Hybrid", // 'Online / Remote' | 'Hybrid' | 'On-Campus'
  "keyPerks": ["Perk 1", "Perk 2", "Perk 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const parsed = JSON.parse(cleanJsonOutput(response.text || ''));
      return res.json(parsed);
    }
  } catch (err) {
    console.error('Gemini auto-tagging error:', err);
  }

  // Keyword heuristic fallback
  const textLower = (title + ' ' + rawText).toLowerCase();

  let category = 'internships';
  if (textLower.includes('scholarship') || textLower.includes('grant') || textLower.includes('financial aid')) {
    category = 'scholarships';
  } else if (textLower.includes('hackathon') || textLower.includes('challenge') || textLower.includes('competition')) {
    category = 'hackathons';
  } else if (textLower.includes('certification') || textLower.includes('course') || textLower.includes('training')) {
    category = 'certifications';
  } else if (textLower.includes('scheme') || textLower.includes('mission') || textLower.includes('govt')) {
    category = 'schemes';
  }

  const branches = ['all'];
  if (textLower.includes('computer') || textLower.includes('software') || textLower.includes('coding')) {
    branches.push('computer-science');
  }
  if (textLower.includes('engineering') || textLower.includes('mechanical') || textLower.includes('electrical')) {
    branches.push('engineering');
  }

  let district = 'all';
  if (textLower.includes('kochi') || textLower.includes('ernakulam')) district = 'kochi';
  else if (textLower.includes('trivandrum') || textLower.includes('thiruvananthapuram')) district = 'thiruvananthapuram';
  else if (textLower.includes('kozhikode') || textLower.includes('calicut')) district = 'kozhikode';

  res.json({
    suggestedTitle: title || 'New Student Opportunity',
    category,
    branchEligibility: branches.filter(b => b !== 'all').length > 0 ? branches.filter(b => b !== 'all') : ['all'],
    courseEligibility: ['undergraduate', 'diploma', 'pg'],
    yearEligibility: ['1', '2', '3', '4', 'final'],
    district,
    tags: ['Student Opportunity', 'Kerala'],
    skills: ['web-dev', 'ai-ml'],
    awardOrStipend: textLower.includes('stipend') ? 'Stipend Provided' : 'Merit Certificate & Benefits',
    mode: 'Hybrid',
    keyPerks: ['Official certificate', 'Industry mentorship', 'Hands-on experience'],
  });
});

// Mount Vite middleware for dev or static serving for prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`KSOP Full-Stack Server running at http://localhost:${port}`);
  });
}

startServer();
