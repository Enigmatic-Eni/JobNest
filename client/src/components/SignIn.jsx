import React, { useState } from "react";

export default function SignIn() {
  const [accountType, setAccountType] = useState("");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("")

  const handleNext = () => {
    if (accountType) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleLogin = async () => {
    setError("");
    if(!email || !password){
      setError("Please enter all required fields")
      return;
    }
    try{
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password, accountType}),
      });
      const data = await res.json();

      if(!res.ok){
        setError(data.message || "Something went wrong");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Success", data.user)
    }catch(err){
      console.error("Login error:", err);
      setError("Server error. Please try again.")
    }
  };
  return (
    <div className=" font-montserrat">
      <div className=" max-w-md bg-white rounded-2xl overflow-hidden">
        <div className=" bg-gradient-to-r mb-4 from-theme to-[#130121] text-white p-6">
          <p className=" text-2xl font-bold text-center">Contine as</p>
        </div>
        <div className=" px-8 py-8">
          {step === 1 && (
            <div className=" space-y-6">
              {[
                {
                  value: "jobseeker",
                  label: "Job Seeker",
                  icon: "👤",
                },
                {
                  value: "recruiter",
                  label: "Recruiter",
                  icon: "🏢",
                },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setAccountType(option.value);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    accountType === option.value
                      ? "border-theme bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className=" flex items-center">
                    <span>{option.icon}</span>
                    <p>{option.label}</p>
                  </div>
                </div>
              ))}
              <div className="text-right">
              <button
                onClick={handleNext}
                disabled={!accountType}
                className="px-6 py-3 bg-gradient-to-r from-theme to-[#130121] text-white rounded-xl font-medium hover:from-theme hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 ml-auto"
              >
                Next
              </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
            <div className="space-y-4">
              {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="text-gray-500 ">
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
              </div>

              <div className=" flex space-x-3 pt-3">
                <button
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  onClick={handleLogin}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-theme to-[#130121] text-white rounded-xl font-medium hover:from-theme hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
                >
                  Login
                </button>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
