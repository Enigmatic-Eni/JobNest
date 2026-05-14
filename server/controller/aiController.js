const User = require("../models/user");
const Job = require("../models/job");
const supabase = require("../config/supabase");
const { extractTextFromCV } = require("../services/cvParser");
const { tailorCV, generateCoverLetter } = require("../services/geminiService");
const { generateAndUploadDocument } = require("../services/documentGenerator");

// ---------------------- SHARED HELPER ----------------------
// Validates user has a CV and extracts both text and links from it
const getUserCVData = async (user) => {
  const cvDoc = user.jobSeekerInfo?.documents?.baseCv;

  if (!cvDoc?.storagePath) {
    const err = new Error(
      "Please upload your CV first before generating documents"
    );
    err.status = 400;
    throw err;
  }

  // extractTextFromCV now returns { cvText, links }
  const { cvText, links } = await extractTextFromCV(
    cvDoc.storagePath,
    cvDoc.mimeType
  );

  if (!cvText || cvText.trim().length < 50) {
    const err = new Error(
      "Could not read your CV. Please make sure it is not a scanned image and contains selectable text."
    );
    err.status = 400;
    throw err;
  }

  return { cvText, links };
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

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    // Get CV text and all links extracted from the CV file
    const { cvText, links } = await getUserCVData(user);

    // Build user profile — includes MongoDB stored links + all links from CV file
    const userProfile = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      linkedin: user.jobSeekerInfo?.links?.linkedin || "",
      portfolio: user.jobSeekerInfo?.links?.portfolio || "",
      allLinks: links // GitHub, project URLs, etc extracted from the CV
    };

    const tailoredContent = await tailorCV(
      cvText,
      job.description,
      job.title,
      job.company,
      userProfile
    );

    const { docxUrl, docxPath } = await generateAndUploadDocument(
      tailoredContent,
      userId,
      jobId,
      "cv",
      user.fullName // used for filename
    );

    if (!user.jobSeekerInfo.generatedDocs) {
      user.jobSeekerInfo.generatedDocs = new Map();
    }

    const existing = user.jobSeekerInfo.generatedDocs.get(jobId) || {};

    user.jobSeekerInfo.generatedDocs.set(jobId, {
      ...existing,
      cv: { docxUrl, docxPath, generatedAt: new Date() }
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
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
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

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    const { cvText, links } = await getUserCVData(user);

    const userProfile = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      linkedin: user.jobSeekerInfo?.links?.linkedin || "",
      portfolio: user.jobSeekerInfo?.links?.portfolio || "",
      allLinks: links
    };

    const coverLetterContent = await generateCoverLetter(
      cvText,
      job.description,
      job.title,
      job.company,
      userProfile
    );

    const { docxUrl, docxPath } = await generateAndUploadDocument(
      coverLetterContent,
      userId,
      jobId,
      "coverletter",
      user.fullName
    );

    if (!user.jobSeekerInfo.generatedDocs) {
      user.jobSeekerInfo.generatedDocs = new Map();
    }

    const existing = user.jobSeekerInfo.generatedDocs.get(jobId) || {};

    user.jobSeekerInfo.generatedDocs.set(jobId, {
      ...existing,
      coverLetter: { docxUrl, docxPath, generatedAt: new Date() }
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
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    console.error("Generate cover letter error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate cover letter" });
  }
};

// ---------------------- GET GENERATED DOCS ----------------------
const getGeneratedDocs = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { jobId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingDocs = user.jobSeekerInfo.generatedDocs?.get(jobId);

    if (!existingDocs) {
      return res.status(200).json({ success: true, cv: null, coverLetter: null });
    }

    let cvUrl = null;
    let coverLetterUrl = null;

    if (existingDocs.cv?.docxPath) {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(existingDocs.cv.docxPath, 60 * 60 * 24 * 7);
      if (!error) cvUrl = data.signedUrl;
    }

    if (existingDocs.coverLetter?.docxPath) {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(existingDocs.coverLetter.docxPath, 60 * 60 * 24 * 7);
      if (!error) coverLetterUrl = data.signedUrl;
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