const User = require('../models/user');
const Job = require('../models/job')
const {extractTextFromCV} = require('../services/cvParser')
const { tailorCV, generateCoverLetter} = require('../services/geminiService')
const {generateAndUploadDocument} = require('../services/documentGenerator')

const getUserCVText = async(user)=>{
    const cvDoc = user.jobSeekerInfo?.documents?.baseCv;

    if(!cvDoc.storagePath){
        const err =  new Error("Please upload your CV before generating documents");
        err.satus = 400;
        throw err;
    }

    const cvText = await extractTextFromCV(cvDoc.storagePath, cvDoc.mimeType);

    if(!cvText || cv.Text.trim().length < 50){
        const err = new Error("Could not read your CV. Please make sure it is not a scanned image and contains selectable text.")
        err.status = 400;
        throw err;
    }

    return cvText;
}

const generateCV = async(req, res)=>{
    try {
        const userId = req.userInfo.userId;
        const {jobId} = req.params;

        const [user, job]= await Promise.all([
            User.findById(userId),
            Job.findById(jobId)
        ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Step 1 — Extract text from user's uploaded CV
    const cvText = await getUserCVText(user);

    // Step 2 — Send CV text + job description to Gemini
    // Gemini returns a tailored CV as plain text
    const tailoredContent = await tailorCV(
      cvText,
      job.description,
      job.title,
      job.company
    );

    // Step 3 — Convert tailored text to DOCX and upload to Supabase
    const { docxUrl, docxPath } = await generateAndUploadDocument(
      tailoredContent,
      userId,
      jobId,
      "cv"
    );

    // Step 4 — Save the generated doc URL to the user's record in MongoDB
    // This lets us show previously generated docs without regenerating
    if (!user.jobSeekerInfo.generatedDocs) {
      user.jobSeekerInfo.generatedDocs = new Map();
    }

    // Get existing entry for this job if it exists
    const existing = user.jobSeekerInfo.generatedDocs.get(jobId) || {};

    user.jobSeekerInfo.generatedDocs.set(jobId, {
      ...existing,
      cv: {
        docxUrl,
        docxPath,
        generatedAt: new Date()
      }
    });

    // markModified tells Mongoose that the Map changed
    // Without this, Mongoose won't detect the change and won't save it
    user.markModified("jobSeekerInfo.generatedDocs");
    await user.save();

    res.status(200).json({
      success: true,
      message: "CV generated successfully",
      cv: { docxUrl }
    });

  } catch (error) {
    // If it's our custom error with a status, use that status
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    console.error("Generate CV error:", error);
    res.status(500).json({ success: false, message: "Failed to generate CV" });
  }
};

// ---------------------- GENERATE COVER LETTER ----------------------
const generateCoverLetterDoc = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { jobId } = req.params;

    const [user, job] = await Promise.all([
      User.findById(userId),
      Job.findById(jobId)
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Same flow as CV — extract text, send to Gemini, generate DOCX
    const cvText = await getUserCVText(user);

    const coverLetterContent = await generateCoverLetter(
      cvText,
      job.description,
      job.title,
      job.company
    );

    const { docxUrl, docxPath } = await generateAndUploadDocument(
      coverLetterContent,
      userId,
      jobId,
      "coverletter"
    );

    if (!user.jobSeekerInfo.generatedDocs) {
      user.jobSeekerInfo.generatedDocs = new Map();
    }

    const existing = user.jobSeekerInfo.generatedDocs.get(jobId) || {};

    user.jobSeekerInfo.generatedDocs.set(jobId, {
      ...existing,
      coverLetter: {
        docxUrl,
        docxPath,
        generatedAt: new Date()
      }
    });

    user.markModified("jobSeekerInfo.generatedDocs");
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cover letter generated successfully",
      coverLetter: { docxUrl }
    });

  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    console.error("Generate cover letter error:", error);
    res.status(500).json({ success: false, message: "Failed to generate cover letter" });
  }
};

module.exports = { generateCV, generateCoverLetterDoc };