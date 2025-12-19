import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import { motion } from "framer-motion";
import DocumentUpload from "@/components/JobSeeker/DocumentUpload";

export default function StudentProfile() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [editMode, setEditMode] = useState(false)
const [uploading, setUploading] = useState(false);

const [formData, setFormData] = useState({
  fullName: "",
  phone: "",
  programType: "",
  institution: "",
  course: "",
  fieldOfStudy: "",
  graduationYear: "",
  skills: [],
  statePreferences: [],
  deployedState: "",
  availableDuration: "",
  bio: "",
  linkedIn: "",
  portfolio: ""
})

useEffect(()=>{
  fetchProfile()
}, [navigate]);

// fetch profile data from backend
const fetchProfile = async () =>{
  try {
    const token = localStorage.getItem("token");

    if(!token){
      navigate("/home");
      return;
    }

    const res = await API.get("/profile", {
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });

    const userData = res.data.user || res.data;
    setUser(userData);

    setFormData({
       fullName: userData.fullName || "",
        phone: userData.phone || "",
        programType: userData.studentInfo?.programType || "",
        institution: userData.studentInfo?.institution || "",
        course: userData.studentInfo?.course || "",
        skills: userData.studentInfo?.skills || [],
        statePreferences: userData.studentInfo?.statePreferences || [],
        deployedState: userData.studentInfo?.deployedState || "",
        availableDuration: userData.studentInfo?.availableDuration || "",
        bio: userData.studentInfo?.bio || "",
        linkedin: userData.studentInfo?.linkedin || "",
        portfolio: userData.studentInfo?.portfolio || ""
    });
  } catch (error) {
    console.error("Error fetching profile: ", error);
    setError("Failed to load profile");
    
  }finally{
    setLoading(false);
  }
}

const handleInputChange = (e) =>{
  const {name, value} = e.target;
  setFormData(prev => ({...prev, [name]: value}));
};

const handleSave = async()=>{
  setError("");
  setSuccess("");

  try {
    const token = localStorage.getItem("token");

    // convert skills and state preference to Array if they are strings
 const skillsArray = Array.isArray(formData.skills)
        ? formData.skills
        : formData.skills.split(",").map(s => s.trim()).filter(Boolean);

      const statePrefsArray = Array.isArray(formData.statePreferences)
        ? formData.statePreferences
        : formData.statePreferences.split(",").map(s => s.trim()).filter(Boolean);

          const dataToSend = {
        fullName: formData.fullName,
        phone: formData.phone,
        studentInfo: {
          programType: formData.programType,
          institution: formData.institution,
          course: formData.course,
          fieldOfStudy: formData.fieldOfStudy,
          graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
          skills: skillsArray,
          statePreferences: statePrefsArray,
          deployedState: formData.deployedState,
          availableDuration: formData.availableDuration,
          bio: formData.bio,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio
        }
      };

      const res = await API.put("/profile", dataToSend, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });


      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess("Profile Updated Successfully!");
      setEditMode(false);
      fetchProfile()

      setTimeout(()=> setSuccess(""), 3000)
  } catch (error) {
    console.error("Error updating profile:", error);
    setError(error.response?.data?.message || "Failed to update profile")
    
  }
}

const handleFileUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);

      await API.post("/profile/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser sets it automatically
        },
      });

      setSuccess(`${documentType} uploaded successfully! ✅`);
      fetchProfile(); // Refresh to show new document

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentType) => {
    if (!confirm(`Are you sure you want to delete your ${documentType}?`)) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/profile/document/${documentType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(`${documentType} deleted successfully`);
      fetchProfile();

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.response?.data?.message || "Failed to delete document");
    }
  };

const fadeUp = {
  hidden: {opacity: 0, y: 30},
  visible: {opacity: 1, y: 0}
}

if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
    className="px-5 pb-10 min-h-screen bg-linear-to-br from-white via-gray-50 to-gray-100"
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.6}}>
      <Navbar />

      <motion.div className="px-5 md:px-16 mt-6"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{duration: 0.5}}>
        <p className=" pb-3 text-2xl font-bold text-gray-800">My Profile</p>

{success &&(
    <motion.div initial={{opacity: 0, y:-10}} animate={{opacity: 1, y:0}}>{success}</motion.div>
  )}

  {error &&(
    <motion.div initial={{opacity: 0, y:-10}} animate={{opacity: 1, y:0}} >
     ❌ {error}
    </motion.div>
  )}
        <motion.div className=" mb-4 flex flex-col  md:flex-row md:justify-between border rounded-2xl p-6 shadow-md bg-white border-gray-100 items-center hover:shadow-lg transition-all"
        variants={fadeUp}
        transition={{delay: 0.1}}>
          <div className="">
            <p className=" pb-1 text-xl font-medium">{user?.fullName}</p>
            <p className=" pb-1 text-[14px] text-gray-500">{user?.studentInfo?.skills?.length > 0 ? user.studentInfo.skills.join(", ") : "No skills added"}</p>
            <p className=" text-[12px] text-gray-400">{user?.studentInfo?.institution || "No institution added"}</p>
          </div>

          <motion.div className="flex gap-2 hover:cursor-pointer items-center p-2 rounded-3xl border border-gray-200 text-gray-400 text-sm" onClick={()=> setEditMode(!editMode)}>
            <p>{editMode ? "Cancel" : "Edit"}</p>
            <PenLine className=" w-3" />
          </motion.div>
        </motion.div>

{/* Personal Information Card */}
        <motion.div
          className="mb-4 border rounded-lg p-5 border-gray-100 shadow-sm bg-white"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="pb-1 text-lg font-medium">Personal Information</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-[12px] text-gray-400 mb-1">Full Name</p>
              {editMode ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                />
              ) : (
                <p className="pb-1 text-[14px]">{user?.fullName}</p>
              )}
            </div>

             {/* Email (Read-only) */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-[12px] text-gray-400 mb-1">Email Address</p>
              <p className="pb-1 text-[14px]">{user?.email}</p>
            </div>

            {/* Phone */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-[12px] text-gray-400 mb-1">Phone</p>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                  placeholder="+234..."
                />
              ) : (
                <p className="pb-1 text-[14px]">{user?.phone || "Not provided"}</p>
              )}
            </div>

            {/* Bio */}
            <div className="col-span-2">
              <p className="text-[12px] text-gray-400 mb-1">Bio</p>
              {editMode ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="pb-1 text-[14px]">{user?.studentInfo?.bio || "No bio provided"}</p>
              )}
            </div>
          </div>
        </motion.div>


{/* Academic Information Card */}
        <motion.div
          className="mb-4 border rounded-lg p-5 border-gray-100 shadow-sm bg-white"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="pb-1 text-lg font-medium">Academic Information</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Program Type */}
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Program Type</p>
              {editMode ? (
                <select
                  name="programType"
                  value={formData.programType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                >
                  <option value="">Select Program</option>
                  <option value="SIWES">SIWES</option>
                  <option value="NYSC">NYSC</option>
                </select>
                 ) : (
                <p className="pb-1 text-[14px]">{user?.studentInfo?.programType || "Not provided"}</p>
              )}
            </div>

            {/* Institution */}
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Institution</p>
              {editMode ? (
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                  placeholder="e.g., University of Lagos"
                />
              ) : (
                <p className="pb-1 text-[14px]">{user?.studentInfo?.institution || "Not provided"}</p>
              )}
            </div>

             {/* Course */}
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Course</p>
              {editMode ? (
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                  placeholder="e.g., Computer Science"
                />
              ) : (
                <p className="pb-1 text-[14px]">{user?.studentInfo?.course || "Not provided"}</p>
              )}
            </div>

             {/* Available Duration */}
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Available Duration</p>
              {editMode ? (
                <select
                  name="availableDuration"
                  value={formData.availableDuration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                >
                  <option value="">Select Duration</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                </select>
              ) : (
                <p className="pb-1 text-[14px]">{user?.studentInfo?.availableDuration || "Not provided"}</p>
              )}
            </div>

            {/* Skills */}
            <div className="col-span-2">
              <p className="text-[12px] text-gray-400 mb-1">Skills (comma-separated, max 7)</p>
              {editMode ? (
                <input
                  type="text"
                  name="skills"
                  value={Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              ) : (
                <p className="pb-1 text-[14px]">
                  {user?.studentInfo?.skills?.length > 0
                    ? user.studentInfo.skills.join(", ")
                    : "No skills added"}
                </p>
              )}
            </div>
          </div>
        </motion.div>

{/* Other Information */}
        <motion.div
          className="mb-4 border rounded-lg p-5 border-gray-100 shadow-sm bg-white"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="pb-1 text-lg font-medium">Other Information</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
{/* Deployed State */}
                     <div>
              <p className="text-[12px] text-gray-400 mb-1">Deployed State</p>
              {editMode ? ( 
                <input
                  type="text"
                  name="deployedState"
                  value={formData.deployedState}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                  placeholder="e.g., Calabar"
                />
              ) : (
                <p className="pb-1 text-[14px]">{user?.studentInfo?.deployedState || "Not provided"}</p>
              )}
            </div>

            {/* State Preference */}
                <div className="col-span-2">
              <p className="text-[12px] text-gray-400 mb-1">State Preference (comma-separated, max 3)</p>
              {editMode ? (
                <input
                  type="text"
                  name="statePreferences"
                  value={Array.isArray(formData.statePreferences) ? formData.statePreferences.join(", ") : formData.statePreferences}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                  placeholder="e.g., Lagos, Abuja"
                />
              ) : (
                <p className="pb-1 text-[14px]">
                  {user?.studentInfo?.statePreferences?.length > 0
                    ? user.studentInfo.statePreferences.join(", ")
                    : "No state added"}
                </p>
              )}
            </div>

             {/* Portfolio Link */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-[12px] text-gray-400 mb-1">Portfolio</p>
              {editMode ? (
                <input
                  type="text"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                />
              ) : (
                <p className="pb-1 text-[14px]">{user?.studentInfo?.portfolio || "Not provided"}</p>
              )}
            </div>

             {/* LinkedIn */}
        <div className="col-span-2 md:col-span-1">
              <p className="text-[12px] text-gray-400 mb-1">LinkedIn</p>
              {editMode ? (
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-[14px]"
                />
              ) : (
                <p className="pb-1 text-[14px]">{user?.studentInfo?.linkedin || "Not provided"}</p>
              )}
            </div>
    
          </div>
        </motion.div>

         {/* Documents Section */}
        <motion.div
          className="mb-4 border rounded-lg p-5 border-gray-100 shadow-sm bg-white"
          variants={fadeUp}
          transition={{ delay: 0.4 }}
        >
          <p className="pb-4 text-lg font-medium">Documents</p>

          {uploading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
              Uploading... Please wait
            </div>
          )}

          <div className="space-y-3">
            {/* CV */}
            <DocumentUpload
              label="CV / Resume"
              documentType="cv"
              document={user?.studentInfo?.documents?.cv}
              onUpload={handleFileUpload}
              onDelete={handleDeleteDocument}
              required={true}
            />

             {/* Call-up Letter (NYSC only) */}
            {user?.studentInfo?.programType === "NYSC" && (
              <DocumentUpload
                label="NYSC Call-up Letter"
                documentType="callUpLetter"
                document={user?.studentInfo?.documents?.callUpLetter}
                onUpload={handleFileUpload}
                onDelete={handleDeleteDocument}
              />
            )}

            {/* IT Letter */}
            <DocumentUpload
              label="IT Acceptance Letter"
              documentType="itLetter"
              document={user?.studentInfo?.documents?.itLetter}
              onUpload={handleFileUpload}
              onDelete={handleDeleteDocument}
            />

            {/* Transcript */}
            <DocumentUpload
              label="Call Up Letter"
              documentType="callUpLetter"
              document={user?.studentInfo?.documents?.callUpLetter}
              onUpload={handleFileUpload}
              onDelete={handleDeleteDocument}
            />
          </div>
        </motion.div>

         {/* Save Button (only show in edit mode) */}
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end space-x-3"
          >
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Save Changes
            </button>
          </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
}
