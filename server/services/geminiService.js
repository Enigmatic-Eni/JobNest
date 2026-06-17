const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models in order of preference — if one fails, try the next
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

// Try each model until one works
const generateWithFallback = async (prompt) => {
  let lastError;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      console.log(`✅ Used model: ${modelName}`);
      return result.response.text();
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed: ${error.message}`);
      lastError = error;

      // Only retry on 503 (overloaded) or 429 (quota)
      // For other errors like 404 (model not found), skip immediately
      if (
        !error.message.includes("503") &&
        !error.message.includes("429") &&
        !error.message.includes("overloaded") &&
        !error.message.includes("high demand")
      ) {
        continue;
      }
    }
  }

  // All models failed
  throw new Error(
    `All models unavailable. Last error: ${lastError?.message}`
  );
};

// ---------------------- TAILOR CV ----------------------
const tailorCV = async (cvText, jobDescription, jobTitle, company, userProfile = {}) => {
  const { fullName, email, phone, linkedin, portfolio, allLinks = [] } = userProfile;

  const linksSection =
    allLinks.length > 0
      ? `\nALL LINKS FOUND IN CANDIDATE'S CV (preserve and include these where relevant):
${allLinks.map((link) => `- ${link}`).join("\n")}`
      : "";

  const prompt = `You are an expert CV writer and ATS optimization specialist.

TASK: Rewrite the candidate's CV to be perfectly tailored for the job below.

JOB TITLE: ${jobTitle}
COMPANY: ${company}
JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S CURRENT CV:
${cvText}

CANDIDATE CONTACT DETAILS (use these exactly as provided):
Full Name: ${fullName || ""}
Email: ${email || ""}
Phone: ${phone || ""}
LinkedIn: ${linkedin || ""}
Portfolio: ${portfolio || ""}
${linksSection}

STRICT RULES:
1. NEVER invent experience, skills, or qualifications the candidate does not have
2. Only reorder, rephrase, and emphasize what already exists in the CV
3. Mirror keywords from the job description naturally throughout
4. Make bullet points achievement-focused where possible
5. Prioritize the most relevant experience sections for this specific role
6. Write a new professional summary tailored to this specific job
7. Return ONLY the CV content in clean plain text
8. No commentary, no explanations, no markdown symbols like ** or ##
9. Always include the exact contact details provided above in the header
10. For each project, include its URL on the line immediately after the project name

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

${fullName || "[FULL NAME]"}
${email || "[EMAIL]"} | ${phone || "[PHONE]"} | Lagos, Nigeria | ${linkedin || "[LINKEDIN]"} | ${portfolio || "[PORTFOLIO]"}

PROFESSIONAL SUMMARY
[2-3 sentences tailored to this specific role]

EXPERIENCE
[Company Name] — [Job Title] | [Start Date] - [End Date]
- [Achievement bullet point]
- [Achievement bullet point]

PERSONAL PROJECTS
[Project Name]
[Project URL from the links provided above]
- [What was built and the impact]
- [Tech stack or key contribution]

SKILLS
[Most relevant skills for this role listed first]

EDUCATION
[Degree, Institution, Year]`;

  try {
    return await generateWithFallback(prompt);
  } catch (error) {
    console.error("Gemini CV tailoring failed:", error.message);
    throw new Error("Failed to generate tailored CV");
  }
};

// ---------------------- GENERATE COVER LETTER ----------------------
const generateCoverLetter = async (
  cvText,
  jobDescription,
  jobTitle,
  company,
  userProfile = {}
) => {
  const { fullName, email, phone, linkedin, portfolio } = userProfile;

  const prompt = `You are an expert cover letter writer.

TASK: Write a compelling personalized cover letter for the job below.

JOB TITLE: ${jobTitle}
COMPANY: ${company}
JOB DESCRIPTION:
${jobDescription}

CANDIDATE BACKGROUND (extracted from their CV):
${cvText}

CANDIDATE CONTACT DETAILS (use these exactly):
Full Name: ${fullName || ""}
Email: ${email || ""}
Phone: ${phone || ""}
LinkedIn: ${linkedin || ""}
Portfolio: ${portfolio || ""}

STRICT RULES:
1. NEVER invent experience or qualifications not found in the CV
2. Be specific — reference actual skills and experience from the CV
3. Show genuine enthusiasm for the company and role
4. Keep it to 4 paragraphs maximum
5. Return ONLY the cover letter text
6. No commentary, no explanations, no markdown symbols like ** or ##

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

${fullName || "[Full Name]"}
${email || "[Email]"} | ${phone || "[Phone]"} | ${linkedin || "[LinkedIn]"} | ${portfolio || "[Portfolio]"}
[Today's Date]

Hiring Manager
${company}

Dear Hiring Manager,

[Opening paragraph — express interest in the role and hook the reader]

[Body paragraph — most relevant experience and achievements for this role]

[Body paragraph — why this specific company interests you]

[Closing paragraph — call to action and thank you]

Sincerely,
${fullName || "[Full Name]"}`;

  try {
    return await generateWithFallback(prompt);
  } catch (error) {
    console.error("Gemini cover letter generation failed:", error.message);
    throw new Error("Failed to generate cover letter");
  }
};

module.exports = { tailorCV, generateCoverLetter };