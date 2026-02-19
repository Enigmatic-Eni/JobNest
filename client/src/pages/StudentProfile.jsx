import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { PenLine, CheckCircle, AlertCircle } from "lucide-react";
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
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    educationInstitution: "",
    educationCourse: "",
    experienceLevel: "",
    skills: [],
    preferencesLocation: [],
    preferencesJobTitles: [],
    preferencesRemote: false,
    bio: "",
    linksLinkedin: "",
    linksPortfolio: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // ---------------------- FETCH PROFILE ----------------------
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/home");
        return;
      }

      const res = await API.get("/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = res.data.user;
      setUser(userData);

      const info = userData.jobSeekerInfo || {};
      setFormData({
        fullName: userData.fullName || "",
        phone: userData.phone || "",
        educationInstitution: info.education?.institution || "",
        educationCourse: info.education?.course || "",
        experienceLevel: info.experienceLevel || "",
        skills: info.skills || [],
        preferencesLocation: info.preferences?.location || [],
        preferencesJobTitles: info.preferences?.jobTitles || [],
        preferencesRemote: info.preferences?.remote || false,
        bio: info.bio || "",
        linksLinkedin: info.links?.linkedin || "",
        linksPortfolio: info.links?.portfolio || ""
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- HANDLE INPUT CHANGE ----------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ---------------------- SAVE PROFILE ----------------------
  const handleSave = async () => {
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const dataToSend = {
        fullName: formData.fullName,
        phone: formData.phone,
        jobSeekerInfo: {
          education: {
            institution: formData.educationInstitution,
            course: formData.educationCourse
          },
          experienceLevel: formData.experienceLevel,
          skills: Array.isArray(formData.skills) 
            ? formData.skills 
            : formData.skills.split(",").map(s => s.trim()).filter(Boolean),
          preferences: {
            location: Array.isArray(formData.preferencesLocation) 
              ? formData.preferencesLocation 
              : formData.preferencesLocation.split(",").map(s => s.trim()).filter(Boolean),
            jobTitles: Array.isArray(formData.preferencesJobTitles) 
              ? formData.preferencesJobTitles 
              : formData.preferencesJobTitles.split(",").map(s => s.trim()).filter(Boolean),
            remote: formData.preferencesRemote
          },
          bio: formData.bio,
          links: {
            linkedin: formData.linksLinkedin,
            portfolio: formData.linksPortfolio
          }
        }
      };

      const res = await API.put("/profile", dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess("Profile updated successfully! ✅");
      setEditMode(false);
      fetchProfile();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  // ---------------------- DOCUMENT HANDLERS ----------------------
  const handleFileUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and Word documents are allowed");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", documentType);

      const res = await API.post("/profile/upload", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccess(`${documentType === 'baseCv' ? 'CV' : 'Cover Letter'} uploaded successfully! ✅`);
      fetchProfile();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  // NEW: Handle viewing document with fresh signed URL
  const handleViewDocument = async (documentType) => {
    try {
      const token = localStorage.getItem("token");
      
      const res = await API.get(`/profile/document/${documentType}/url`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.url) {
        // Open in new tab
        window.open(res.data.url, "_blank", "noopener,noreferrer");
      } else {
        setError("Failed to generate document URL");
      }
    } catch (err) {
      console.error("View document error:", err);
      setError(err.response?.data?.message || "Failed to open document");
    }
  };

  const handleDeleteDocument = async (documentType) => {
    const docName = documentType === 'baseCv' ? 'CV' : 'Cover Letter';
    
    if (!confirm(`Are you sure you want to delete your ${docName}?`)) return;

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await API.delete(`/profile/document/${documentType}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(`${docName} deleted successfully ✅`);
      fetchProfile();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Failed to delete document");
    }
  };

  // NEW: Get profile completion status
  const getProfileCompletionStatus = () => {
    if (!user || !user.jobSeekerInfo) return { complete: false, missing: [] };

    const missing = [];
    
    if (!user.jobSeekerInfo.education?.institution) missing.push("Institution");
    if (!user.jobSeekerInfo.education?.course) missing.push("Course");
    if (!user.jobSeekerInfo.experienceLevel) missing.push("Experience Level");
    if (!user.jobSeekerInfo.bio) missing.push("Bio");
    if (!user.jobSeekerInfo.skills?.length) missing.push("Skills");
    if (user.jobSeekerInfo.skills?.length > 7) missing.push("Too many skills (max 7)");
    if (!user.jobSeekerInfo.links?.linkedin) missing.push("LinkedIn URL");
    if (!user.jobSeekerInfo.links?.portfolio) missing.push("Portfolio URL");
    if (!user.jobSeekerInfo.preferences?.location?.length) missing.push("Preferred Locations");
    if (!user.jobSeekerInfo.preferences?.jobTitles?.length) missing.push("Preferred Job Titles");
    if (typeof user.jobSeekerInfo.preferences?.remote !== "boolean") missing.push("Remote Preference");
    if (!user.jobSeekerInfo.documents?.baseCv?.storagePath) missing.push("CV Upload");

    return {
      complete: user.profileCompleted,
      missing
    };
  };

  // ---------------------- LOADING ----------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If no user data, return early
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile. Please try again.</p>
          <button 
            onClick={() => navigate("/home")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const completionStatus = getProfileCompletionStatus();

  // ---------------------- UI ----------------------
  return (
    <motion.div 
      className="px-5 pb-10 min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />

      <motion.div className="px-5 md:px-16 mt-6 max-w-5xl mx-auto">
        <p className="pb-3 text-2xl font-bold text-gray-800">My Profile</p>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* Profile Completion Status */}
        {!completionStatus.complete && completionStatus.missing.length > 0 && (
          <motion.div 
            className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 mb-1">Profile Incomplete</p>
                <p className="text-sm text-yellow-700">
                  Complete your profile to start applying for jobs. Missing: {completionStatus.missing.join(", ")}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {completionStatus.complete && (
          <motion.div 
            className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="font-medium text-green-800">Profile Complete! 🎉</p>
            </div>
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.div 
          className="mb-4 flex flex-col md:flex-row md:justify-between border rounded-2xl p-6 shadow-md bg-white items-center hover:shadow-lg transition-all"
          whileHover={{ scale: 1.01 }}
        >
          <div>
            <p className="pb-1 text-xl font-medium">{user.fullName}</p>
            <p className="pb-1 text-[14px] text-gray-500">
              {user.jobSeekerInfo?.skills?.length > 0 
                ? user.jobSeekerInfo.skills.join(", ") 
                : "No skills added"}
            </p>
            {user.jobSeekerInfo?.experienceLevel && (
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {user.jobSeekerInfo?.experienceLevel}
              </span>
            )}
          </div>

          <motion.div 
            className="flex gap-2 items-center p-2 rounded-3xl border border-gray-200 text-gray-400 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setEditMode(!editMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <p>{editMode ? "Cancel" : "Edit"}</p>
            <PenLine className="w-3" />
          </motion.div>
        </motion.div>

        {/* Personal Info */}
        <div className="mb-4 border rounded-lg p-5 border-gray-100 shadow-sm bg-white">
          <p className="pb-3 font-semibold text-gray-800">Personal Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-gray-500 mb-1 font-medium">Full Name</p>
              {editMode ? (
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              ) : (
                <p className="text-gray-800">{user.fullName}</p>
              )}
            </div>

            <div>
              <p className="text-[12px] text-gray-500 mb-1 font-medium">Phone</p>
              {editMode ? (
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              ) : (
                <p className="text-gray-800">{user.phone || "Not provided"}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <p className="text-[12px] text-gray-500 mb-1 font-medium">Bio</p>
              {editMode ? (
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange} 
                  rows="3" 
                  maxLength="500"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-800">{user.jobSeekerInfo?.bio || "No bio provided"}</p>
              )}
              {editMode && (
                <p className="text-[10px] text-gray-400 mt-1">
                  {formData.bio?.length || 0}/500 characters
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="mb-4 border rounded-lg p-5 border-gray-100 shadow-sm bg-white">
          <p className="pb-3 font-semibold text-gray-800">Academic Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-gray-500 mb-1 font-medium">Institution</p>
              {editMode ? (
                <input 
                  type="text" 
                  name="educationInstitution" 
                  value={formData.educationInstitution} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. University of Lagos"
                />
              ) : (
                <p className="text-gray-800">{user.jobSeekerInfo?.education?.institution || "Not provided"}</p>
              )}
            </div>

            <div>
              <p className="text-[12px] text-gray-500 mb-1 font-medium">Course</p>
              {editMode ? (
                <input 
                  type="text" 
                  name="educationCourse" 
                  value={formData.educationCourse} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Computer Science"
                />
              ) : (
                <p className="text-gray-800">{user.jobSeekerInfo?.education?.course || "Not provided"}</p>
              )}
            </div>

            <div>
              <p className="text-[12px] text-gray-500 mb-1 font-medium">Experience Level</p>
              {editMode ? (
                <select 
                  name="experienceLevel" 
                  value={formData.experienceLevel} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Level</option>
                  <option value="intern">Intern</option>
                  <option value="entry">Entry</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                </select>
              ) : (
                <p className="text-gray-800 capitalize">{user.jobSeekerInfo?.experienceLevel || "Not provided"}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <p className="text-[12px] text-gray-500 mb-1 font-medium">
                Skills (comma-separated, max 7)
              </p>
              {editMode ? (
                <input 
                  type="text" 
                  name="skills" 
                  value={Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. JavaScript, React, Node.js"
                />
              ) : (
                <p className="text-gray-800">
                  {user.jobSeekerInfo?.skills?.length > 0 
                    ? user.jobSeekerInfo.skills.join(", ") 
                    : "No skills added"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Job Preferences */}
        <div className="mb-4 border rounded-lg p-5 border-gray-100 shadow-sm bg-white">
          <p className="pb-3 font-semibold text-gray-800">Job Preferences</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <p className="text-[12px] text-gray-500 mb-1 font-medium">Preferred Locations</p>
              {editMode ? (
                <input 
                  type="text" 
                  name="preferencesLocation" 
                  value={Array.isArray(formData.preferencesLocation) 
                    ? formData.preferencesLocation.join(", ") 
                    : formData.preferencesLocation} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Lagos, Abuja, Remote"
                />
              ) : (
                <p className="text-gray-800">
                  {user.jobSeekerInfo?.preferences?.location?.length > 0 
                    ? user.jobSeekerInfo.preferences.location.join(", ") 
                    : "Not specified"}
                </p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <p className="text-[12px] text-gray-500 mb-1 font-medium">Preferred Job Titles</p>
              {editMode ? (
                <input 
                  type="text" 
                  name="preferencesJobTitles" 
                  value={Array.isArray(formData.preferencesJobTitles) 
                    ? formData.preferencesJobTitles.join(", ") 
                    : formData.preferencesJobTitles} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Software Engineer, Frontend Developer"
                />
              ) : (
                <p className="text-gray-800">
                  {user.jobSeekerInfo?.preferences?.jobTitles?.length > 0 
                    ? user.jobSeekerInfo.preferences.jobTitles.join(", ") 
                    : "Not specified"}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <p className="text-[12px] text-gray-500 mb-2 font-medium">Remote Work</p>
              {editMode ? (
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="preferencesRemote" 
                    checked={formData.preferencesRemote} 
                    onChange={handleInputChange} 
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Open to remote positions</span>
                </label>
              ) : (
                <p className="text-gray-800">
                  {user.jobSeekerInfo?.preferences?.remote ? "Yes" : "No"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mb-4 border rounded-lg p-5 border-gray-100 shadow-sm bg-white">
          <p className="pb-3 font-semibold text-gray-800">Professional Links</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-gray-500 mb-1 font-medium">LinkedIn</p>
              {editMode ? (
                <input 
                  type="url" 
                  name="linksLinkedin" 
                  value={formData.linksLinkedin} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="https://linkedin.com/in/username"
                />
              ) : (
                <p className="text-gray-800 truncate">
                  {user.jobSeekerInfo?.links?.linkedin ? (
                    <a 
                      href={user.jobSeekerInfo?.links?.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {user.jobSeekerInfo?.links?.linkedin}
                    </a>
                  ) : "Not provided"}
                </p>
              )}
            </div>

            <div>
              <p className="text-[12px] text-gray-500 mb-1 font-medium">Portfolio</p>
              {editMode ? (
                <input 
                  type="url" 
                  name="linksPortfolio" 
                  value={formData.linksPortfolio} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="https://yourportfolio.com"
                />
              ) : (
                <p className="text-gray-800 truncate">
                  {user.jobSeekerInfo?.links?.portfolio ? (
                    <a 
                      href={user.jobSeekerInfo?.links?.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {user.jobSeekerInfo?.links?.portfolio}
                    </a>
                  ) : "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mb-4 border rounded-lg p-5 border-gray-100 shadow-sm bg-white">
          <p className="pb-3 font-semibold text-gray-800">Documents</p>

          {uploading && (
            <div className="mb-3 p-3 bg-blue-50 text-blue-700 rounded-lg">
              Uploading... Please wait
            </div>
          )}

          <div className="space-y-3">
            <DocumentUpload
              label="CV / Resume"
              documentType="baseCv"
              document={user.jobSeekerInfo?.documents?.baseCv}
              onUpload={handleFileUpload}
              onDelete={handleDeleteDocument}
              onView={handleViewDocument}
              required={true}
            />
          </div>
        </div>

        {/* Save Button */}
        {editMode && (
          <div className="flex justify-end space-x-3 mb-6">
            <button 
              onClick={() => setEditMode(false)} 
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}