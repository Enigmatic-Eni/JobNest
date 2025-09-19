import React, { useState } from "react";

export default function SignIn() {
  const [accountType, setAccountType] = useState("");
  return (
    <div className=" font-montserrat">
      <div className=" max-w-md bg-white rounded-2xl overflow-hidden">
        <div className=" bg-gradient-to-r mb-4 from-theme to-[#130121] text-white p-6">
          <p className=" text-2xl font-bold text-center">Contine as</p>
        </div>
        <div className=" px-8">
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

            {/* {STEP 2} */}

          <button className="px-6 py-3 bg-gradient-to-r from-theme to-[#130121] text-white rounded-xl font-medium hover:from-theme hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 ml-auto"
              >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
