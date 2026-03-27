const Groq = require("groq-sdk");
const User = require("../models/User");
const Job = require("../models/Job");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// In-memory conversation store (use Redis in production)
const conversationHistory = new Map();
const MAX_HISTORY = 20;

// ============================================================
// INTENT DETECTION
// ============================================================
const INTENTS = {
  JOB_SEARCH: ["job", "jobs", "hiring", "vacancy", "openings", "work", "position", "career opportunity"],
  RESUME: ["resume", "cv", "curriculum vitae", "cover letter", "application"],
  INTERVIEW: ["interview", "interviewing", "prepare", "questions", "behavioral"],
  SALARY: ["salary", "pay", "compensation", "negotiate", "offer", "package"],
  SKILLS: ["skill", "learn", "course", "training", "upskill", "certification"],
  CAREER_CHANGE: ["switch", "transition", "change career", "pivot", "new field"],
  WORK_LIFE: ["balance", "remote", "flexible", "work from home", "burnout"],
  NETWORKING: ["network", "linkedin", "connect", "mentor", "referral"],
  CONFIDENCE: ["confidence", "imposter", "nervous", "anxiety", "scared", "doubt"],
  GREETING: ["hello", "hi", "hey", "good morning", "good evening"],
  THANKS: ["thank", "thanks", "appreciate", "helpful"],
  JOB_RECOMMENDATION: ["recommend", "suggest", "match", "fit", "suitable", "best job for me"],
};

const detectIntent = (message) => {
  const lower = message.toLowerCase();
  const detected = [];

  for (const [intent, keywords] of Object.entries(INTENTS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      detected.push(intent);
    }
  }

  return detected.length > 0 ? detected : ["GENERAL"];
};

// ============================================================
// ENHANCED SYSTEM PROMPT
// ============================================================
const getSystemPrompt = (userContext, jobs, intents) => {
  const skillsList = userContext.skills.length > 0 
    ? userContext.skills.join(", ") 
    : "Not specified yet";

  const experienceLevel = getExperienceLevel(userContext);
  const intentContext = getIntentGuidance(intents);

  return `You are HerHustle AI, an expert career coach specializing in empowering women in their professional journeys.

## USER PROFILE
- **Name:** ${userContext.name}
- **Current Role:** ${userContext.role}
- **Experience Level:** ${experienceLevel}
- **Location:** ${userContext.location}
- **Skills:** ${skillsList}
- **Career Interests:** ${userContext.interests?.join(", ") || "Exploring options"}

## YOUR EXPERTISE
- Job search strategies tailored for women
- Resume optimization and ATS compatibility
- Interview preparation and salary negotiation
- Overcoming workplace challenges and bias
- Work-life balance and career transitions
- Building confidence and professional presence

## COMMUNICATION STYLE
- Warm, encouraging, and professional
- Give specific, actionable advice
- Use data and examples when relevant
- Acknowledge challenges women face in the workplace
- Celebrate achievements, no matter how small
- Keep responses focused and practical (3-5 sentences unless detail is requested)

## CURRENT CONTEXT
${intentContext}

## AVAILABLE JOBS ON PLATFORM
${formatJobsForContext(jobs, userContext)}

When recommending jobs, explain WHY each job matches the user's profile. Consider skill overlap, location, experience level, and career goals.`;
};

const getExperienceLevel = (userContext) => {
  const role = userContext.role?.toLowerCase() || "";
  if (role.includes("intern") || role.includes("entry") || role.includes("junior")) {
    return "Entry Level (0-2 years)";
  } else if (role.includes("senior") || role.includes("lead")) {
    return "Senior (5+ years)";
  } else if (role.includes("manager") || role.includes("director") || role.includes("head")) {
    return "Management/Leadership";
  }
  return "Mid-Level (2-5 years)";
};

const getIntentGuidance = (intents) => {
  const guidance = [];

  if (intents.includes("JOB_SEARCH") || intents.includes("JOB_RECOMMENDATION")) {
    guidance.push("User is looking for job opportunities. Provide personalized recommendations from available jobs.");
  }
  if (intents.includes("SALARY")) {
    guidance.push("User wants salary advice. Provide negotiation strategies and market insights.");
  }
  if (intents.includes("CONFIDENCE")) {
    guidance.push("User may need encouragement. Be extra supportive and share confidence-building strategies.");
  }
  if (intents.includes("INTERVIEW")) {
    guidance.push("User is preparing for interviews. Offer specific techniques and common questions.");
  }

  return guidance.length > 0 ? guidance.join("\n") : "General career guidance requested.";
};

const formatJobsForContext = (jobs, userContext) => {
  if (!jobs || jobs.length === 0) {
    return "No active jobs currently listed. Encourage user to check back or set up job alerts.";
  }

  const userSkills = new Set(userContext.skills.map((s) => s.toLowerCase()));

  const jobsWithMatch = jobs.map((job) => {
    const jobSkills = job.skills || [];
    const matchingSkills = jobSkills.filter((s) => userSkills.has(s.toLowerCase()));
    const matchScore = jobSkills.length > 0 
      ? Math.round((matchingSkills.length / jobSkills.length) * 100) 
      : 0;

    return {
      ...job,
      matchScore,
      matchingSkills,
    };
  });

  jobsWithMatch.sort((a, b) => b.matchScore - a.matchScore);

  return jobsWithMatch
    .slice(0, 8)
    .map((j, i) => {
      const matchInfo = j.matchScore > 0 
        ? `(${j.matchScore}% skill match: ${j.matchingSkills.join(", ")})` 
        : "";
      return `${i + 1}. **${j.title}** at ${j.company} - ${j.location} ${j.salary ? `| ${j.salary}` : ""} ${matchInfo}`;
    })
    .join("\n");
};

// ============================================================
// USER CONTEXT (ENHANCED)
// ============================================================
const getUserContext = async (userId) => {
  try {
    const user = await User.findById(userId).select(
      "name role location skills interests experience education preferences"
    );

    return {
      name: user?.name || "there",
      role: user?.role || "Job Seeker",
      location: user?.location || "Not specified",
      skills: user?.skills || [],
      interests: user?.interests || [],
      experience: user?.experience || [],
      education: user?.education || [],
      preferences: user?.preferences || {},
    };
  } catch (error) {
    console.error("Error fetching user context:", error);
    return {
      name: "there",
      role: "Job Seeker",
      location: "Not specified",
      skills: [],
      interests: [],
      experience: [],
      education: [],
      preferences: {},
    };
  }
};

// ============================================================
// JOBS (ENHANCED WITH SMART FILTERING)
// ============================================================
const getAvailableJobs = async (userContext, intents, messageKeywords = []) => {
  try {
    const query = { status: "active" };

    // Smart filtering based on user context
    const orConditions = [];

    // Match by user skills
    if (userContext.skills.length > 0) {
      orConditions.push({
        skills: { $in: userContext.skills.map((s) => new RegExp(s, "i")) },
      });
    }

    // Match by keywords in message
    if (messageKeywords.length > 0) {
      orConditions.push({
        $or: [
          { title: { $in: messageKeywords.map((k) => new RegExp(k, "i")) } },
          { description: { $in: messageKeywords.map((k) => new RegExp(k, "i")) } },
        ],
      });
    }

    // Match by location preference
    if (userContext.location && userContext.location !== "Not specified") {
      orConditions.push({
        $or: [
          { location: new RegExp(userContext.location, "i") },
          { location: /remote/i },
        ],
      });
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(15)
      .select("title company location salary skills description type experience");

    return jobs.map((job) => ({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      skills: job.skills || [],
      type: job.type,
      experience: job.experience,
      description: job.description?.substring(0, 200),
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

// ============================================================
// CONVERSATION MEMORY
// ============================================================
const getConversationHistory = (userId) => {
  return conversationHistory.get(userId) || [];
};

const addToConversationHistory = (userId, role, content) => {
  const history = conversationHistory.get(userId) || [];
  history.push({ role, content });

  // Keep only recent messages
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  conversationHistory.set(userId, history);
};

const clearConversationHistory = (userId) => {
  conversationHistory.delete(userId);
};

// ============================================================
// EXTRACT KEYWORDS FOR JOB MATCHING
// ============================================================
const extractKeywords = (message) => {
  const stopWords = new Set([
    "i", "me", "my", "we", "our", "you", "your", "the", "a", "an", "is", "are",
    "was", "were", "be", "been", "being", "have", "has", "had", "do", "does",
    "did", "will", "would", "could", "should", "may", "might", "can", "for",
    "and", "but", "or", "so", "if", "then", "than", "too", "very", "just",
    "about", "into", "through", "during", "before", "after", "above", "below",
    "to", "from", "up", "down", "in", "out", "on", "off", "over", "under",
    "again", "further", "once", "here", "there", "when", "where", "why", "how",
    "all", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "than", "that", "this", "what", "which", "who",
    "want", "need", "looking", "find", "get", "help", "please", "thanks", "thank",
    "job", "jobs", "work", "career", "any", "show", "tell", "give", "know",
  ]);

  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  return [...new Set(words)];
};

// ============================================================
// MAIN CHAT ENDPOINT
// ============================================================
const chat = async (req, res) => {
  try {
    const { message, clearHistory } = req.body;
    const userId = req.user.id;

    // Handle history clear request
    if (clearHistory) {
      clearConversationHistory(userId);
      return res.json({
        message: "Conversation cleared! How can I help you today?",
        timestamp: new Date(),
      });
    }

    if (!message || message.trim().length === 0) {
      return res.json({
        message: "I'm here to help! Ask me about jobs, career advice, interview tips, or anything career-related.",
        timestamp: new Date(),
      });
    }

    // Gather context
    const intents = detectIntent(message);
    const keywords = extractKeywords(message);
    const userContext = await getUserContext(userId);
    const jobs = await getAvailableJobs(userContext, intents, keywords);
    const history = getConversationHistory(userId);

    // Build messages array
    const messages = [
      { role: "system", content: getSystemPrompt(userContext, jobs, intents) },
      ...history.slice(-10), // Include recent conversation
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    });

    const response = completion.choices[0].message.content;

    // Save to history
    addToConversationHistory(userId, "user", message);
    addToConversationHistory(userId, "assistant", response);

    // Build response with metadata
    const responseData = {
      message: response,
      timestamp: new Date(),
      intents,
      hasJobRecommendations: intents.includes("JOB_SEARCH") || intents.includes("JOB_RECOMMENDATION"),
    };

    // Add job matches if relevant
    if (responseData.hasJobRecommendations && jobs.length > 0) {
      responseData.suggestedJobs = jobs.slice(0, 5).map((j) => ({
        title: j.title,
        company: j.company,
        location: j.location,
      }));
    }

    res.json(responseData);
  } catch (error) {
    console.error("❌ Chat Error:", error);

    res.status(500).json({
      message: "I'm having a brief technical moment. Please try again, or explore our job listings directly!",
      timestamp: new Date(),
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ============================================================
// SMART SUGGESTIONS
// ============================================================
const getSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const userContext = await getUserContext(userId);
    const jobs = await getAvailableJobs(userContext, ["JOB_RECOMMENDATION"], []);

    const prompt = `Based on this user profile, provide exactly 3 personalized career action items:

User: ${userContext.name}
Role: ${userContext.role}
Skills: ${userContext.skills.join(", ") || "Not specified"}
Location: ${userContext.location}

Available Jobs: ${jobs.slice(0, 5).map((j) => `${j.title} at ${j.company}`).join(", ")}

Format each suggestion as:
1. [Action Title]: Brief explanation (1 sentence)

Focus on immediate, actionable steps.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a career coach. Provide specific, actionable suggestions.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({
      suggestions: completion.choices[0].message.content,
      matchedJobs: jobs.slice(0, 3),
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Suggestions error:", error);
    res.json({
      suggestions: "1. Update your profile skills\n2. Browse latest job listings\n3. Practice with our interview prep tools",
      timestamp: new Date(),
    });
  }
};

// ============================================================
// QUICK HELP (ENHANCED)
// ============================================================
const QUICK_HELP_PROMPTS = {
  resume: `Provide 5 resume tips specifically for women in tech/professional roles:
- ATS optimization
- Highlighting achievements over duties
- Addressing career gaps positively
- Showcasing leadership without traditional titles
- Personal branding`,

  job_search: `Provide 5 job search strategies for women:
- Finding women-friendly employers
- Leveraging networks effectively
- Identifying hidden job markets
- Evaluating company culture
- Applying strategically`,

  interview: `Provide 5 interview tips for women:
- Answering behavioral questions with STAR
- Negotiating confidently
- Handling bias gracefully
- Showcasing soft skills as strengths
- Asking insightful questions`,

  salary: `Provide 5 salary negotiation tips for women:
- Researching market rates
- Framing the ask confidently
- Negotiating beyond base salary
- Handling pushback
- When to walk away`,

  confidence: `Provide 5 confidence-building tips for professional women:
- Overcoming imposter syndrome
- Owning your achievements
- Speaking up in meetings
- Building executive presence
- Creating a personal board of advisors`,

  networking: `Provide 5 networking tips for women:
- Building genuine connections
- Leveraging LinkedIn effectively
- Finding mentors and sponsors
- Networking as an introvert
- Following up meaningfully`,
};

const getQuickHelp = async (req, res) => {
  try {
    const { topic } = req.body;
    const userId = req.user.id;
    const userContext = await getUserContext(userId);

    const prompt = QUICK_HELP_PROMPTS[topic] || 
      "Provide 5 general career advancement tips for women professionals.";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are HerHustle AI helping ${userContext.name}. Give practical, specific advice. Use bullet points. Be encouraging but not patronizing.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    res.json({
      topic,
      message: completion.choices[0].message.content,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Quick help error:", error);
    res.json({
      message: "Tips are temporarily unavailable. Check our resources section for career guides!",
      timestamp: new Date(),
    });
  }
};

// ============================================================
// JOB MATCH ANALYSIS
// ============================================================
const analyzeJobMatch = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    const [userContext, job] = await Promise.all([
      getUserContext(userId),
      Job.findById(jobId),
    ]);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const prompt = `Analyze how well this candidate matches this job:

CANDIDATE:
- Current Role: ${userContext.role}
- Skills: ${userContext.skills.join(", ")}
- Location: ${userContext.location}

JOB:
- Title: ${job.title}
- Company: ${job.company}
- Required Skills: ${job.skills?.join(", ") || "Not specified"}
- Location: ${job.location}
- Description: ${job.description?.substring(0, 500)}

Provide:
1. Match Score (percentage)
2. Matching Strengths (2-3 points)
3. Skill Gaps (if any)
4. Tips to strengthen application
5. Suggested talking points for interview`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a career matching expert. Provide honest, constructive analysis.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 800,
    });

    res.json({
      job: {
        title: job.title,
        company: job.company,
      },
      analysis: completion.choices[0].message.content,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Job match analysis error:", error);
    res.status(500).json({ error: "Could not analyze job match" });
  }
};

// ============================================================
// INTERVIEW PREP
// ============================================================
const getInterviewPrep = async (req, res) => {
  try {
    const { jobTitle, company } = req.body;
    const userId = req.user.id;
    const userContext = await getUserContext(userId);

    const prompt = `Create interview preparation guide for:

Candidate: ${userContext.name}
Applying for: ${jobTitle} at ${company || "a company"}
Background: ${userContext.role} with skills in ${userContext.skills.join(", ")}

Provide:
1. 5 likely interview questions for this role
2. STAR-format answer framework for 2 behavioral questions
3. 3 smart questions to ask the interviewer
4. Key points to research about ${company || "the company"}
5. Confidence boosting tip`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an interview coach specializing in helping women succeed in interviews.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    res.json({
      jobTitle,
      company,
      preparation: completion.choices[0].message.content,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Interview prep error:", error);
    res.status(500).json({ error: "Could not generate interview prep" });
  }
};

// ============================================================
// SKILL GAP ANALYSIS
// ============================================================
const analyzeSkillGaps = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const userId = req.user.id;
    const userContext = await getUserContext(userId);

    const prompt = `Analyze skill gaps for career transition:

Current Profile:
- Role: ${userContext.role}
- Skills: ${userContext.skills.join(", ") || "Not specified"}

Target Role: ${targetRole}

Provide:
1. Skills they already have that transfer well
2. Critical skills to develop (top 3-5)
3. Recommended learning resources (courses, certifications)
4. Realistic timeline to build these skills
5. Quick wins they can achieve in 30 days`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a career development expert. Provide practical, achievable skill development plans.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.json({
      currentRole: userContext.role,
      targetRole,
      analysis: completion.choices[0].message.content,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Skill gap analysis error:", error);
    res.status(500).json({ error: "Could not analyze skill gaps" });
  }
};

module.exports = {
  chat,
  getSuggestions,
  getQuickHelp,
  analyzeJobMatch,
  getInterviewPrep,
  analyzeSkillGaps,
};