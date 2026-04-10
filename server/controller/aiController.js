const User = require("../models/user");
const Job = require("../models/job");
const supabase = require("../config/supabase");
const { extractTextFromCV } = require("../services/cvParser");
const { tailorCV, generateCoverLetter } = require("../services/geminiService");
const { generateAndUploadDocument } = require("../services/documentGenerator");

// ---------------------- SHARED HELPER ----------------------
const getUserCVText = async (user) => {
  const cvDoc = user.jobSeekerInfo?.documents?.baseCv;

  console.log("🔍 CV doc:", cvDoc); // DEBUG

  if (!cvDoc?.storagePath) {
    const err = new Error("Please upload your CV first before generating documents");
    err.status = 400;
    throw err;
  }

  const cvText = await extractTextFromCV(cvDoc.storagePath, cvDoc.mimeType);
  
  // ✅ SAFE: cvText is ALWAYS string now
  if (!cvText || cvText.trim().length === 0) {
    const err = new Error("Could not read your CV. Please make sure it is not a scanned image and contains selectable text.");
    err.status = 400;
    throw err;
  }

  return cvText;
};
// ---------------------- GENERATE TAILORED CV ----------------------
const generateCV = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { jobId } = req.params;

    const [user, job] = await Promise.all([
      User.findById(userId),
      Job.findById(jobId)
    ]);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const cvText = await getUserCVText(user);

    const tailoredContent = await tailorCV(
      cvText,
      job.description,
      job.title,
      job.company
    );

    const { docxUrl, docxPath } = await generateAndUploadDocument(
      tailoredContent,
      userId,
      jobId,
      "cv"
    );

    if (!user.jobSeekerInfo.generatedDocs) {
      user.jobSeekerInfo.generatedDocs = new Map();
    }

    const existing = user.jobSeekerInfo.generatedDocs.get(jobId) || {};

    user.jobSeekerInfo.generatedDocs.set(jobId, {
      ...existing,
      cv: {
        docxUrl,
        docxPath,
        generatedAt: new Date()
      }
    });

    user.markModified("jobSeekerInfo.generatedDocs");
    await user.save();

    res.status(200).json({
      success: true,
      message: "CV generated successfully",
      cv: { docxUrl }
    });

  } catch (error) {
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

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

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

// ---------------------- GET GENERATED DOCS ----------------------
// Called when user opens a job detail page
// Checks if they already generated docs for this job
// If yes, regenerates fresh signed URLs from the stored paths
// This means even after 7 days, the download links work again
const getGeneratedDocs = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { jobId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user has generated any docs for this job
    const existingDocs = user.jobSeekerInfo.generatedDocs?.get(jobId);

    // No docs generated yet for this job — return nulls
    // Frontend will show the generate buttons in their default state
    if (!existingDocs) {
      return res.status(200).json({
        success: true,
        cv: null,
        coverLetter: null
      });
    }

    // Docs exist — regenerate fresh signed URLs from stored paths
    // The file is still in Supabase even if the old URL expired
    let cvUrl = null;
    let coverLetterUrl = null;

    // Regenerate CV signed URL if CV was previously generated
    if (existingDocs.cv?.docxPath) {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(existingDocs.cv.docxPath, 60 * 60 * 24 * 7);

      if (!error) {
        cvUrl = data.signedUrl;
      }
    }

    // Regenerate cover letter signed URL if cover letter was previously generated
    if (existingDocs.coverLetter?.docxPath) {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(existingDocs.coverLetter.docxPath, 60 * 60 * 24 * 7);

      if (!error) {
        coverLetterUrl = data.signedUrl;
      }
    }

    res.status(200).json({
      success: true,
      cv: cvUrl ? { docxUrl: cvUrl } : null,
      coverLetter: coverLetterUrl ? { docxUrl: coverLetterUrl } : null
    });

  } catch (error) {
    console.error("Get generated docs error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { generateCV, generateCoverLetterDoc, getGeneratedDocs };