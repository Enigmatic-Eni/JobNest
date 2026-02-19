const User = require("../models/user");
const supabase = require("../config/supabase");

// ---------------------- GET PROFILE ----------------------
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userInfo.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileCompleted: user.profileCompleted,
        jobSeekerInfo: user.jobSeekerInfo
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ---------------------- UPDATE PROFILE ----------------------
const updateProfile = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { fullName, phone, jobSeekerInfo } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update basic fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    // Update jobSeekerInfo subfields
    if (jobSeekerInfo) {
      user.jobSeekerInfo.education = jobSeekerInfo.education || user.jobSeekerInfo.education;
      user.jobSeekerInfo.experienceLevel = jobSeekerInfo.experienceLevel || user.jobSeekerInfo.experienceLevel;
      user.jobSeekerInfo.skills = jobSeekerInfo.skills || user.jobSeekerInfo.skills;
      user.jobSeekerInfo.preferences = jobSeekerInfo.preferences || user.jobSeekerInfo.preferences;
      user.jobSeekerInfo.bio = jobSeekerInfo.bio || user.jobSeekerInfo.bio;
      user.jobSeekerInfo.links = jobSeekerInfo.links || user.jobSeekerInfo.links;
    }

    // ---------------------- CHECK IF PROFILE IS COMPLETE ----------------------
    const isComplete = !!(
      user.jobSeekerInfo.education?.institution &&
      user.jobSeekerInfo.education?.course &&
      user.jobSeekerInfo.experienceLevel &&
      user.jobSeekerInfo.bio &&
      user.jobSeekerInfo.skills?.length > 0 &&
      user.jobSeekerInfo.skills.length <= 7 &&
      user.jobSeekerInfo.links?.linkedin &&
      user.jobSeekerInfo.links?.portfolio &&
      user.jobSeekerInfo.preferences?.location?.length > 0 &&
      user.jobSeekerInfo.preferences?.jobTitles?.length > 0 &&
      typeof user.jobSeekerInfo.preferences?.remote === "boolean" &&
      user.jobSeekerInfo.documents?.baseCv?.storagePath
    );

    user.profileCompleted = isComplete;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileCompleted: user.profileCompleted,
        jobSeekerInfo: user.jobSeekerInfo
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ---------------------- UPLOAD DOCUMENT ----------------------
const uploadDocument = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { documentType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const allowedTypes = ["baseCv", "coverLetter"];
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({ success: false, message: "Invalid document type" });
    }

    // Allowed MIME types
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        message: "Unsupported file format. Please upload PDF or Word documents." 
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

 if (user.jobSeekerInfo.documents?.[documentType]?.storagePath) {
      try {
        await supabase.storage
          .from("Documents")
          .remove([user.jobSeekerInfo.documents[documentType].storagePath]);
      } catch (deleteError) {
        console.error("Error deleting old document:", deleteError);
        // Continue with upload even if delete fails
      }
    }


    const filePath = `users/${userId}/${documentType}-${Date.now()}-${file.originalname}`;


   
    // Upload to Supabase
const uploadResult = await supabase.storage
  .from("documents")
  .upload(filePath, file.buffer, {
    contentType: file.mimetype,
    upsert: true
  });

if (uploadResult.error) {
  console.error("UPLOAD FAILED:", uploadResult.error);
  throw uploadResult.error;
}

if (!user.jobSeekerInfo) {
  user.jobSeekerInfo = {};
}

    // Update user document
    if (!user.jobSeekerInfo.documents) {
      user.jobSeekerInfo.documents = {};
    }

    user.jobSeekerInfo.documents[documentType] = {
      filename: file.originalname,
      url: "",
      storagePath: filePath,
      mimeType: file.mimetype,
      uploadedAt: new Date()
    };

    await user.save();

    res.status(200).json({
      success: true,
      document: user.jobSeekerInfo.documents[documentType]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

const getDocumentUrl = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { documentType } = req.params;

    if (!documentType) {
  return res.status(400).json({
    success: false,
    message: "documentType is required"
  });
}


    const allowedTypes = ["baseCv", "coverLetter"];
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({ success: false, message: "Invalid document type" });
    }

    const user = await User.findById(userId);
    const doc = user?.jobSeekerInfo?.documents?.[documentType];

    if (!doc?.storagePath) {
      return res.status(404).json({ 
        success: false, 
        message: "Document not found" 
      });
    }

    // Generate fresh signed URL (valid for 1 hour)
    const { data: signedUrl, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storagePath, 60 * 60); // 1 hour

    if (error) {
      console.error("Error generating signed URL:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to generate document URL" 
      });
    }

    res.status(200).json({
      success: true,
      url: signedUrl.signedUrl,
      filename: doc.filename,
      mimeType: doc.mimeType
    });

  } catch (error) {
    console.error("Get document URL error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// ---------------------- DELETE DOCUMENT ----------------------
const deleteDocument = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { documentType } = req.params;

    // ADDED: Validate document type
    const allowedTypes = ["baseCv", "coverLetter"];
    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({ success: false, message: "Invalid document type" });
    }

    const user = await User.findById(userId);
    const doc = user?.jobSeekerInfo?.documents?.[documentType];

    if (!doc?.storagePath) {
      return res.status(404).json({ 
        success: false, 
        message: "Document not found" 
      });
    }

    // Delete from Supabase
    const { error } = await supabase.storage
      .from("documents")
      .remove([doc.storagePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      // Continue to update DB even if storage delete fails
    }

    // Update user document
    user.jobSeekerInfo.documents[documentType] = undefined;
    
    // ADDED: Recalculate profile completion
    const isComplete = !!(
      user.jobSeekerInfo.education?.institution &&
      user.jobSeekerInfo.education?.course &&
      user.jobSeekerInfo.experienceLevel &&
      user.jobSeekerInfo.bio &&
      user.jobSeekerInfo.skills?.length > 0 &&
      user.jobSeekerInfo.skills.length <= 7 &&
      user.jobSeekerInfo.links?.linkedin &&
      user.jobSeekerInfo.links?.portfolio &&
      user.jobSeekerInfo.preferences?.location?.length > 0 &&
      user.jobSeekerInfo.preferences?.jobTitles?.length > 0 &&
      typeof user.jobSeekerInfo.preferences?.remote === "boolean" &&
      user.jobSeekerInfo.documents?.baseCv?.storagePath
    );

    user.profileCompleted = isComplete;
    
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Document deleted successfully",
      profileCompleted: user.profileCompleted
    });
    
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Delete failed" 
    });
  }
};

module.exports = { 
  getProfile, 
  updateProfile, 
  uploadDocument, 
  getDocumentUrl,
  deleteDocument 
};