const User = require("../models/user");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");
const cloudinary = require("../config/cloudinary");

// Get Profile
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
        accountType: user.accountType,
        profileCompleted: user.profileCompleted,
        studentInfo: user.studentInfo,
        recruiterInfo: user.recruiterInfo
      }
    });
  } catch (error) {
    console.error("Get profile error: ", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { fullName, phone, studentInfo, recruiterInfo } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update basic fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    if (user.accountType === "student" && studentInfo) {
      user.studentInfo = {
        ...user.studentInfo?.toObject(),
        ...studentInfo
      };
      
      if (studentInfo.documents) {
        user.studentInfo.documents = {
          ...user.studentInfo.documents?.toObject(),
          ...studentInfo.documents
        };
      }

      // Check if profile is complete
      const isComplete = !!(
        user.studentInfo.programType &&
        user.studentInfo.institution &&
        user.studentInfo.course &&
        user.studentInfo.availableDuration &&
        user.studentInfo.skills?.length >= 3 &&
        user.studentInfo.documents?.cv?.url
      );
      user.profileCompleted = isComplete;
    }

    if (user.accountType === "recruiter" && recruiterInfo) {
      user.recruiterInfo = {
        ...user.recruiterInfo?.toObject(),
        ...recruiterInfo
      };
      
      if (recruiterInfo.companyLogo) {
        user.recruiterInfo.companyLogo = recruiterInfo.companyLogo;
      }
      
      const isComplete = !!(
        user.recruiterInfo.companyName &&
        user.recruiterInfo.industry &&
        user.recruiterInfo.location?.state &&
        user.recruiterInfo.location?.city &&
        user.recruiterInfo.bio
      );
      user.profileCompleted = isComplete;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        profileCompleted: user.profileCompleted,
        studentInfo: user.studentInfo,
        recruiterInfo: user.recruiterInfo
      }
    });
  } catch (error) {
    console.error("Update profile error: ", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Upload Document
const uploadDocument = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const validTypes = ["cv", "callUpLetter", "itLetter", "transcript"];
    if (!validTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document type"
      });
    }

    const user = await User.findById(userId);
    if (!user || user.accountType !== "student") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!user.studentInfo) user.studentInfo = {};
    if (!user.studentInfo.documents) user.studentInfo.documents = {};

    // Delete old doc if exists
    const existingDoc = user.studentInfo.documents[documentType];
    if (existingDoc?.publicId) {
      await deleteFromCloudinary(existingDoc.publicId);
    }

    const documentData = {
      filename: req.file.originalname,
      publicId: req.file.filename,
      uploadedAt: new Date(),
      mimeType: req.file.mimetype
    };

    user.studentInfo.documents[documentType] = documentData;
    user.markModified("studentInfo.documents");

    await user.save();

    res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      document: documentData
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// Delete Document
const deleteDocument = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { documentType } = req.params;

    const user = await User.findById(userId);
    if (!user?.studentInfo?.documents?.[documentType]) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    const publicId = user.studentInfo.documents[documentType].publicId;
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    user.studentInfo.documents[documentType] = null;
    user.markModified("studentInfo.documents");

    await user.save();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = { getProfile, updateProfile, uploadDocument, deleteDocument };