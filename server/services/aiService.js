const { GoogleGenAI } = require('@google/generative-ai');

// Helper to query Gemini if key exists
async function queryGemini(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = ai.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction || 'You are an expert career consultant and professional resume writer.'
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error('Gemini API Error, using fallback engine:', error.message);
    throw error;
  }
}

// ==========================================
// FALLBACK ENGINES (Context-Aware)
// ==========================================

function fallbackSummary(skills = '', experience = '', education = '') {
  const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);
  const mainSkill = skillsList[0] || 'Software Engineering';
  const otherSkills = skillsList.slice(1, 4).join(', ') || 'modern technology stacks';
  
  return `Results-driven Professional with a strong foundation in ${mainSkill}${education ? ` backed by education at ${education}` : ''}. Proven track record of leveraging skills in ${otherSkills} to build scalable solutions and streamline processes. Recognized for combining technical expertise with strategic problem-solving to deliver high-quality project outcomes. Commited to continuous learning, collaborative development, and driving technological efficiency.`;
}

function fallbackProjectBullets(projectName = '', technologies = []) {
  const techStr = technologies.join(' and ') || 'modern frameworks';
  const name = projectName || 'Core Platform';
  
  return [
    `Architected and deployed ${name} using ${techStr}, improving system scalability and reducing service latency by 25%.`,
    `Engineered secure RESTful endpoints and integrated database logic, optimizing query resolution rates for high concurrent workloads.`,
    `Collaborated with cross-functional teams to integrate responsive user layouts, boosting engagement indices by 40%.`
  ];
}

function fallbackSuggestedSkills(jobRole = '', experience = '') {
  const role = jobRole.toLowerCase();
  
  const techSkills = {
    developer: ['React.js', 'Node.js', 'MongoDB', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'Git & GitHub', 'REST APIs', 'AWS', 'Docker'],
    designer: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Adobe Illustrator', 'Visual Hierarchy', 'Responsive Layouts', 'Design Systems'],
    manager: ['Agile Methodologies', 'Scrum Master', 'Jira', 'Project Roadmap', 'Cross-functional Leadership', 'Risk Management', 'Stakeholder Communication'],
    analyst: ['SQL', 'Python (Pandas)', 'Tableau', 'PowerBI', 'Data Modeling', 'Excel (Advanced)', 'Statistical Analysis', 'A/B Testing']
  };

  for (let key in techSkills) {
    if (role.includes(key)) return techSkills[key];
  }

  return ['Communication', 'Team Collaboration', 'Problem Solving', 'Git', 'Agile Methodologies', 'Software Development Life Cycle (SDLC)'];
}

function fallbackEnhancement(text = '') {
  if (!text) return 'Detail-oriented professional with experience in technical projects.';
  
  // Replace simple verbs with action verbs
  let polished = text
    .replace(/\b(make|built|created)\b/gi, 'engineered')
    .replace(/\b(worked on|helped with)\b/gi, 'spearheaded development of')
    .replace(/\b(added|put)\b/gi, 'implemented')
    .replace(/\b(fast|quick)\b/gi, 'highly optimized')
    .replace(/\b(good)\b/gi, 'robust and scalable');

  return polished;
}

function fallbackATSChecker(resume) {
  let score = 65;
  const missingKeywords = [];
  const suggestions = [];

  const text = JSON.stringify(resume).toLowerCase();

  // Keyword check
  const criticalKeywords = ['agile', 'git', 'collaboration', 'deployment', 'optimization', 'testing', 'security', 'database', 'rest api'];
  criticalKeywords.forEach(kw => {
    if (!text.includes(kw)) {
      missingKeywords.push(kw);
      score -= 3;
    }
  });

  // Structural check
  if (!resume.summary || resume.summary.length < 50) {
    suggestions.push('Add a professional summary containing at least 2-3 sentences outlining your core values.');
    score -= 8;
  }
  if (!resume.experience || resume.experience.length === 0) {
    suggestions.push('Provide details about your work experience or internships to establish professional credibility.');
    score -= 15;
  }
  if (!resume.projects || resume.projects.length === 0) {
    suggestions.push('Add projects to showcase practical application of your skillset.');
    score -= 10;
  }
  if (!resume.skills || resume.skills.length < 5) {
    suggestions.push('List at least 5-8 core professional skills related to your target role.');
    score -= 7;
  }

  // Cap score limits
  score = Math.max(30, Math.min(100, score));

  if (suggestions.length === 0) {
    suggestions.push('Your resume structure looks stellar! Try adding specific performance percentages to experience descriptions.');
  }

  return {
    score,
    missingKeywords,
    suggestions
  };
}

// ==========================================
// EXPOSED API SERVICES
// ==========================================

const getResumeSummary = async (skills, experience, education) => {
  const prompt = `Generate a high-impact, professional, ATS-friendly resume professional summary based on:
  Skills: ${skills}
  Experience: ${experience}
  Education: ${education}
  Include action words, keep it concise (around 3-4 sentences), and output ONLY the summary text, no surrounding comments or intro.`;

  try {
    return await queryGemini(prompt);
  } catch (error) {
    return fallbackSummary(skills, experience, education);
  }
};

const getProjectDescription = async (projectName, technologies) => {
  const prompt = `Generate 3 professional resume-ready bullet points describing a project called "${projectName}" built using technologies: ${technologies}.
  Each bullet point should start with an action verb (e.g. Spearheaded, Engineered, Integrated, Optimized) and focus on results.
  Output ONLY the list items as plain text bullet lines starting with "-" without any wrapper texts.`;

  try {
    const text = await queryGemini(prompt);
    return text.split('\n').map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean);
  } catch (error) {
    return fallbackProjectBullets(projectName, technologies.split(',').map(t => t.trim()));
  }
};

const getSkillSuggestions = async (jobRole, experience) => {
  const prompt = `List the top 10 most in-demand technical and soft skills for the role of "${jobRole}" with ${experience} of experience.
  Return only a comma-separated list of skills (e.g. React.js, Node.js, Project Management). Nothing else.`;

  try {
    const text = await queryGemini(prompt);
    return text.split(',').map(s => s.trim()).filter(Boolean);
  } catch (error) {
    return fallbackSuggestedSkills(jobRole, experience);
  }
};

const getEnhancedResumeText = async (text) => {
  const prompt = `Polishing the following resume section text. Improve grammar, write it in professional corporate vocabulary, and embed strong active verbs.
  Original text: "${text}"
  Return ONLY the improved text, no quotes or additional notes.`;

  try {
    return await queryGemini(prompt);
  } catch (error) {
    return fallbackEnhancement(text);
  }
};

const getATSAnalysis = async (resumeData) => {
  const cleanDataForPrompt = {
    personalInfo: resumeData.personalInfo,
    summary: resumeData.summary,
    skills: resumeData.skills,
    experience: resumeData.experience,
    projects: resumeData.projects
  };

  const prompt = `Analyze this resume structure for Applicant Tracking System (ATS) compatibility.
  Resume JSON data: ${JSON.stringify(cleanDataForPrompt)}

  Return a JSON object containing EXACTLY this structure:
  {
    "score": 85, // number from 0 to 100
    "missingKeywords": ["agile", "kubernetes", "testing"], // array of keywords commonly missing in this profile
    "suggestions": ["Add numbers to highlight your project impacts.", "Write a detailed summary."] // specific recommendations
  }
  Ensure your response is valid JSON and only the JSON code itself.`;

  try {
    const responseText = await queryGemini(prompt, 'You are an expert recruiter and ATS analytics validator. Return JSON only.');
    // Extract JSON block if surrounded by markdown
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(responseText);
  } catch (error) {
    return fallbackATSChecker(resumeData);
  }
};

function fallbackCoverLetter(resumeData, jobTitle = 'Software Engineer', companyName = 'Target Company') {
  const name = resumeData?.personalInfo?.fullName || 'John Doe';
  const email = resumeData?.personalInfo?.email || 'john.doe@example.com';
  const phone = resumeData?.personalInfo?.phone || '123-456-7890';
  const location = resumeData?.personalInfo?.location || 'San Francisco, CA';
  
  const skillList = (resumeData?.skills || []).map(s => typeof s === 'string' ? s : (s.name || '')).filter(Boolean).slice(0, 4).join(', ') || 'software development, problem solving, and collaboration';
  
  const recentJob = resumeData?.experience?.[0];
  const recentJobTitle = recentJob?.role || 'Professional';
  const recentCompany = recentJob?.company || 'Previous Company';

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `${name}
${location} | ${phone} | ${email}

${date}

Hiring Manager
${companyName}

Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${companyName}. With a strong background in building software solutions and a proven skillset that includes ${skillList}, I am confident in my ability to make a significant contribution to your team.

In my recent role as ${recentJobTitle} at ${recentCompany}, I successfully delivered critical initiatives and worked closely with cross-functional partners to enhance product efficiency. My experience aligns closely with the goals of ${companyName}, and I am excited about the opportunity to bring my technical expertise and problem-solving abilities to this new challenge.

Thank you for your time and consideration. I welcome the opportunity to discuss how my background and skills align with your team's current objectives in an interview.

Sincerely,

${name}`;
}

const getCoverLetter = async (resumeData, jobTitle, companyName, jobDescription) => {
  const cleanDataForPrompt = {
    personalInfo: resumeData.personalInfo,
    summary: resumeData.summary,
    skills: resumeData.skills,
    experience: resumeData.experience,
    projects: resumeData.projects
  };

  const prompt = `Write a highly tailored, professional, and compelling cover letter for:
  Job Title: ${jobTitle}
  Company Name: ${companyName}
  Job Description: ${jobDescription}
  
  Based on the following resume data:
  ${JSON.stringify(cleanDataForPrompt)}

  The cover letter should contain a professional header, dynamic introduction referencing the target role, body paragraphs that align the applicant's experience and skills with the job description requirements, and a strong call-to-action closing. Keep the tone professional, persuasive, and confident.
  Return only the text of the cover letter. Do not include markdown code block syntax (like \`\`\` or \`\`\`text) around it, or introductory/concluding filler text.`;

  try {
    return await queryGemini(prompt);
  } catch (error) {
    return fallbackCoverLetter(resumeData, jobTitle, companyName);
  }
};

module.exports = {
  getResumeSummary,
  getProjectDescription,
  getSkillSuggestions,
  getEnhancedResumeText,
  getATSAnalysis,
  getCoverLetter
};
