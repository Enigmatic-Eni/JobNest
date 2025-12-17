const User = require("../models/user");

// First get userId from req.userInfo (set by authMiddleware)
const getProfile = async (req, res)=>{
    try {
        const user = await User.findById(req.userInfo.userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // If a user is found, return the complete profile
        res.status(200).json({
            success: true,
            user:{
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

// get userId and latest data from req
const updateProfile = async (req, res) =>{
    try {
        const  userId = req.userInfo.userId;
        const {fullName, phone, studentInfo, recruiterInfo} = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Update the basic fields
        if(fullName) user.fullName = fullName;
        if(phone) user.phone = phone;

        if(user.accountType === "student" && studentInfo){
            // Using the spread opearator (...) Get old data and merge with new data into studentInfo
            user.studentInfo = {
                ...user.studentInfo?.toObject(),
                ...studentInfo
            };
            if(studentInfo.documents){
                user.studentInfo.documents ={
                    ...user.studentInfo.documents?.toObject(),
                    ...studentInfo.documents
                };
            }

            // check if profile is complete
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

        if(user.accountType === "recruiter" && recruiterInfo){
            user.recruiterInfo = {
                ...user.recruiterInfo?.toObject(),
                ...recruiterInfo
            };
            if(recruiterInfo.companyLogo){
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

        // Save all the updated info to the database
        await user.save();

        // return the updated profile
        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user:{
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
        })
        
    }
}

const uploadDocument = async (req, res) =>{
    try {
        const userId = req.userInfo.userId;
        const {documentType} = req.body;

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "No file upload"
            });
        }

        // validate the document type
        const validTypes = ["cv", "callUpLetter", "itLetter"];
        if(!validTypes.includes(documentType)){
            return res.status(400).json({
                success: false,
                message: "Invalid document type"
            });
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if(user.accountType !== "student"){
            return res.status(403)({
                success: false,
                message: "Only students can upload documents"
            });
        }
        if(!user.studentInfo){
            user.studentInfo = {};
        }
        if(!user.studentInfo.documents){
            user.studentInfo.documents = {};
        }

        user.studentInfo.documents[documentType] ={
            filename: req.file.originalname,
            url: req.file.path,
            uploadedAt: new Date()
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: "Document uploaded successfully",
            document: user.studentInfo.documents[documentType]
        })

    } catch (error) {
        console.error("Document Upload Error: ", error);
         res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
    }
}

const deleteDocument = async (req, res) =>{
    try {
        const userId =req.userInfo.userId;
        const {documentType} = req.params;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if(!user.studentInfo?.documents?.[documentType]){
            return res.status(404).json({
                success: false,
                message: "Document not found"
            })
        }

        // remove document and its details by making the folder empty/null in the database
        user.studentInfo.documents[documentType] ={
            filename: null,
            url: null,
            uploadedAt: null
        };
        await user.save();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        console.error("Delete document error: ",error);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
        
    }
}

module.exports = { getProfile, updateProfile, uploadDocument, deleteDocument}