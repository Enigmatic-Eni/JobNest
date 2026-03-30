import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signup as signupAPI } from "@/services/auth";
import { Eye, EyeClosed, X } from "lucide-react";

export default function SignUp({ closeDialog, openLoginDialog }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await signupAPI(data);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="font-montserrat bg-white rounded-2xl overflow-hidden">
        {/* Close button */}
        <div className="flex justify-end p-3">
          <button
            onClick={closeDialog}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="px-8 pb-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Registration Successful!
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Your account has been created successfully.
          </p>
          <button
            onClick={() => { closeDialog?.(); navigate("/home"); }}
            className="w-full py-2.5 bg-theme text-white rounded-xl font-medium   transition-all duration-200"
          >
            Proceed to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-montserrat bg-white rounded-2xl overflow-hidden">
      {/* Header with close button */}
      <div className="bg-linear-to-r from-theme to-[#130121] px-5 py-3 flex text-white justify-between items-center">
        <div></div>
        <div className=" flex ">

        <h2 className="text-xl font-bold ">Create Account</h2>
        </div>
        <button
          type="button"
          onClick={closeDialog}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable form body */}
      <div className="overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* First + Last Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                {...register("firstName", { required: "Required" })}
                placeholder="Sarah"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme focus:border-transparent outline-none"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                {...register("lastName", { required: "Required" })}
                placeholder="Doe"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme focus:border-transparent outline-none"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              placeholder="sarah@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme focus:border-transparent outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              {...register("phone", { required: "Phone number is required" })}
              placeholder="+2348100000000"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme focus:border-transparent outline-none"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              placeholder="Enter password"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme focus:border-transparent outline-none"
            />
            <button className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 " onClick={()=> setShowPassword(!showPassword)}>
              {showPassword ? <EyeClosed className=" w-[80%]"/> : <Eye className=" w-[80%]"/>}
            </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (v) => v === password || "Passwords do not match",
              })}
              placeholder="Re-enter password"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme focus:border-transparent outline-none"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-2.5 bg-theme text-white rounded-xl text-sm font-medium hover:bg-theme-hover disabled:opacity-50 transition-all duration-200"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Switch to login */}
          {openLoginDialog && (
            <p className="text-center text-xs text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={openLoginDialog}
                className="text-theme font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}