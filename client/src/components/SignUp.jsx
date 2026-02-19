import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp({openLoginDialog}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
const {fullName, email, password} = formData;

if(!fullName || !email || !password) {
  setError("Fullname, email and password are required");
  return;
}
if(password.length < 6){
  setError("Password must be at least 6 characters");
  return;
}

    setLoading(true);
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.post(`${API_URL}/auth/register`, {...formData,
        phone: formData.phone || undefined,
      });

      console.log("Success:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSuccess(true);

    } catch (error) {
      console.error("Error:", error);
      setError( error.response?.data?.message || "An error occured during registration. Please try again."
      );
    }finally {
      setLoading(false);
    }
  };

  const handleLogin = () =>{
  navigate("/home");
    }

  if (success) {
    return (
      <div className="font-montserrat">
        <div className="max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
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
                className="w-full px-6 py-3 bg-linear-to-r from-theme to-[#130121] text-white rounded-xl font-medium hover:from-theme hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
              >
                Proceed to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} >
    <div className=" font-montserrat">
      <div className="max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-theme to-[#130121] p-6 text-white">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

            <div className="space-y-5">

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
                {
                  name: "phone",
                  label: "Phone Number",
                  type: "tel",
                  placeholder: "Enter your phone number. +234..."
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
            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 ml-auto flex items-center"
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

            </div>
          </div>
        </div>
      </div>
      </form>
  );
}