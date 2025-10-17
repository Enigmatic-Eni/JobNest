import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp({openLoginDialog}) {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    // Job seeker fields
    location: "",
    skills: "",
    // Recruiter fields
    companyName: "",
    companyWebsite: "",
    industry: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const nextStep = () => {
    if (step === 1 && !accountType) {
      setError("Please select an account type");
      return;
    }
    if (step === 2) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError("Please fill in all required fields");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }
    setError("");
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      console.log("Success:", response.data);
      setSuccess(true); // Set success state
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message ||
          "An error occurred during registration."
      );
    }
  };

  const handleLogin = () =>{
    openLoginDialog();
  }

  if (success) {
    return (
      <div className="font-montserrat">
        <div className="max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-theme to-[#130121] p-6 text-white">
            <h2 className="text-2xl font-bold text-center">Create Account</h2>
          </div>

          {/* Success Content */}
          <div className="p-8">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Registration Successful!
              </h3>
              <p className="text-gray-600 mb-8">
                Your account has been created successfully.
              </p>
              
              <button onClick={handleLogin}
                className="w-full px-6 py-3 bg-gradient-to-r from-theme to-[#130121] text-white rounded-xl font-medium hover:from-theme hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
              >
                Proceed to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" font-montserrat">
      <div className="max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-theme to-[#130121] p-6 text-white">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
          <div className="flex justify-center mt-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= num ? "bg-white text-theme" : "bg-theme text-white"
                  }`}
                >
                  {step > num ? "✓" : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-8 h-1 mx-1 ${
                      step > num ? "bg-white" : "bg-theme"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-blue-100 mt-2 text-sm">
            Step {step} of 3
          </p>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1: Account Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Choose Your Path
                </h3>
                <p className="text-gray-600 text-sm">
                  Select the type of account you'd like to create
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: "jobseeker",
                    label: "Job Seeker",
                    icon: "👤",
                    desc: "Looking for opportunities",
                  },
                  {
                    value: "recruiter",
                    label: "Recruiter",
                    icon: "🏢",
                    desc: "Hiring talented people",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setAccountType(option.value);
                      setFormData((prev) => ({
                        ...prev,
                        accountType: option.value,
                      })); // Update formData with accountType
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      accountType === option.value
                        ? "border-theme bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{option.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {option.label}
                        </h4>
                        <p className="text-sm text-gray-500">{option.desc}</p>
                      </div>
                      {/* <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          accountType === option.value
                            ? "border-theme bg-theme"
                            : "border-gray-300"
                        }`}
                      >
                        {accountType === option.value && (
                          <div className="w-full h-full rounded-full bg-theme flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Basic Information */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Basic Information
                </h3>
                <p className="text-gray-600 text-sm">
                  Tell us a bit about yourself
                </p>
              </div>

              {[
                {
                  name: "fullName",
                  label: "Full Name",
                  type: "text",
                  placeholder: "Enter your full name",
                },
                {
                  name: "email",
                  label: "Email Address",
                  type: "email",
                  placeholder: "Enter your email",
                },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  placeholder: "Create a password (min. 6 characters)",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Role-specific fields */}
          {step === 3 && accountType === "jobseeker" && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Job Seeker Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Help us match you with the right opportunities
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript, React, Node.js"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          )}

          {step === 3 && accountType === "recruiter" && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Company Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Tell us about your company
                </p>
              </div>

              {[
                {
                  name: "companyName",
                  label: "Company Name",
                  type: "text",
                  placeholder: "Enter company name",
                },
                {
                  name: "companyWebsite",
                  label: "Company Website",
                  type: "url",
                  placeholder: "https://example.com",
                },
                {
                  name: "industry",
                  label: "Industry",
                  type: "text",
                  placeholder: "e.g., Technology, Healthcare",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                ← Back
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={step === 1 && !accountType}
                className="px-6 py-3 bg-gradient-to-r from-theme to-[#130121] text-white rounded-xl font-medium hover:from-theme hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 ml-auto"
              >
                Next →
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 ml-auto flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Account ✨"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
