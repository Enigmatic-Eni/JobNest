const {GoogleGenerativeAI} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

const tailorCV = async(cvText, jobDescription, jobTitle, company)=>{
    const prompt = `You are an expert CV writer and ATS optimization specialist.

TASK: Rewrite the candidate's CV to be perfectly tailored for the job below.

JOB TITLE: ${jobTitle}
COMPANY: ${company}
JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S CURRENT CV:
${cvText}

STRICT RULES:
1. NEVER invent experience, skills, or qualifications the candidate does not have
2. Only reorder, rephrase, and emphasize what already exists in the CV
3. Mirror keywords from the job description naturally throughout
4. Make bullet points achievement-focused where possible
5. Prioritize the most relevant experience sections for this specific role
6. Write a new professional summary tailored to this specific job
7. Return ONLY the CV content in clean plain text
8. No commentary, no explanations, no markdown symbols like ** or ##

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

[FULL NAME]
[EMAIL] | [PHONE] | [LOCATION] | [LINKEDIN]

PROFESSIONAL SUMMARY
[2-3 sentences tailored to this specific role]

EXPERIENCE
[Company Name] — [Job Title] | [Start Date] - [End Date]
- [Achievement bullet point]
- [Achievement bullet point]

SKILLS
[Most relevant skills for this role listed first]

EDUCATION
[Degree, Institution, Year]`

 try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini CV tailoring failed:", error.message);
    throw new Error("Failed to generate tailored CV");
  }
}

// ---------------------- GENERATE COVER LETTER ----------------------
const generateCoverLetter = async (cvText, jobDescription, jobTitle, company) => {
  const prompt = `
You are an expert cover letter writer.

TASK: Write a compelling personalized cover letter for the job below.

JOB TITLE: ${jobTitle}
COMPANY: ${company}
JOB DESCRIPTION:
${jobDescription}

CANDIDATE BACKGROUND (extracted from their CV):
${cvText}

STRICT RULES:
1. NEVER invent experience or qualifications not found in the CV
2. Be specific — reference actual skills and experience from the CV
3. Show genuine enthusiasm for the company and role
4. Keep it to 4 paragraphs maximum
5. Return ONLY the cover letter text
6. No commentary, no explanations, no markdown symbols like ** or ##

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

[Full Name]
[Email] | [Phone]
[Today's Date]

Hiring Manager
${company}

Dear Hiring Manager,

[Opening paragraph — express interest in the role and hook the reader]

[Body paragraph — most relevant experience and achievements for this role]

[Body paragraph — why this specific company interests you]

[Closing paragraph — call to action and thank you]

Sincerely,
[Full Name]
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini cover letter generation failed:", error.message);
    throw new Error("Failed to generate cover letter");
  }
};

module.exports = { tailorCV, generateCoverLetter };