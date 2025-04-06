"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("citizen");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  // Emergency login states
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergencyStep, setEmergencyStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [emergencyError, setEmergencyError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role:
            activeTab === "citizen"
              ? "user"
              : activeTab === "police"
              ? "admin"
              : "superAdmin",
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect based on user role
        if (data.role === "user") {
          router.push("/u/dashboard");
        } else if (data.role === "admin") {
          router.push("/a/dashboard");
        } else if (data.role === "superAdmin") {
          router.push("/sa/dashboard");
        }
      } else {
        setErrors({
          form: data.error || "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ form: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Only update the handleSendOTP function - modify the development OTP part
  const handleSendOTP = async (e) => {
    e.preventDefault();
  
    if (!phoneNumber || phoneNumber.length < 10) {
      setEmergencyError("Please enter a valid phone number");
      return;
    }
  
    // Prevent double submission
    if (loading) {
      return;
    }
  
    setLoading(true);
    setEmergencyError("");
  
    try {
      const response = await fetch("/api/auth/emergency/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Use normalized phone number
        if (data.phone) {
          setPhoneNumber(data.phone);
        }
  
        setEmergencyStep("otp");
  
        // Start countdown
        setOtpCountdown(data.expiresIn || 600);
        const interval = setInterval(() => {
          setOtpCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
  
        // Don't auto-fill the OTP, but still log it in development mode for testing
        if (process.env.NODE_ENV === "development" && data.otp) {
          console.log(
            "Development OTP for testing (enter manually):",
            data.otp
          );
        }
      } else {
        setEmergencyError(
          data.error || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setEmergencyError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otpValue || otpValue.length !== 6) {
      setEmergencyError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setEmergencyError("");

    try {
      const response = await fetch("/api/auth/emergency/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to emergency reporting page
        router.push("/u/emergency-report");
      } else {
        setEmergencyError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      setEmergencyError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Toggle between regular and emergency login
  const toggleEmergencyForm = () => {
    setShowEmergencyForm((prev) => !prev);
    setEmergencyStep("phone");
    setPhoneNumber("");
    setOtpValue("");
    setEmergencyError("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/images/kavach-logo.svg"
                alt="Kavach Logo"
                width={180}
                height={48}
                className="mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">
              {showEmergencyForm ? "Emergency Access" : "Welcome back"}
            </h1>
            <p className="text-gray-500">
              {showEmergencyForm
                ? "Quick access in emergency situations"
                : "Sign in to your account to continue"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              {/* Emergency form toggle */}
              <div className="mb-4 text-center">
                <button
                  type="button"
                  onClick={toggleEmergencyForm}
                  className={`text-sm font-medium ${
                    showEmergencyForm ? "text-blue-600" : "text-red-500"
                  }`}
                >
                  {showEmergencyForm ? (
                    <span className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Back to regular login
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Emergency Login with Phone
                    </span>
                  )}
                </button>
              </div>

              {/* Emergency Phone Login */}
              {showEmergencyForm ? (
                <>
                  {emergencyError && (
                    <div className="mb-4 p-3 rounded bg-red-50 text-red-500 text-sm">
                      {emergencyError}
                    </div>
                  )}

                  {emergencyStep === "phone" ? (
                    <form onSubmit={handleSendOTP}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone Number
                          </label>
                          <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            We'll send a verification code to this number
                          </p>
                        </div>

                        <button
                          type="submit"
                          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          disabled={loading}
                        >
                          {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="otp"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Verification Code
                          </label>
                          <input
                            id="otp"
                            name="otp"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            maxLength={6}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {otpCountdown > 0 && (
                            <p className="mt-1 text-xs text-gray-500">
                              Code expires in {formatTime(otpCountdown)}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          disabled={loading}
                        >
                          {loading ? "Verifying..." : "Verify & Continue"}
                        </button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setEmergencyStep("phone")}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Use a different phone number
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <>
                  {/* Regular Login Form with Tabs */}
                  <div className="mb-6">
                    <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg">
                      {["citizen", "police", "admin"].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === tab
                              ? "bg-white shadow-sm text-blue-600"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {errors.form && (
                    <div className="mb-4 p-3 rounded bg-red-50 text-red-500 text-sm">
                      {errors.form}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`block w-full px-3 py-2 border ${
                            errors.email ? "border-red-300" : "border-gray-300"
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className={`block w-full px-3 py-2 border ${
                            errors.password
                              ? "border-red-300"
                              : "border-gray-300"
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="rememberMe"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Remember me
                          </label>
                        </div>

                        <Link
                          href="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                      Don't have an account?{" "}
                      <Link
                        href="/auth/signup"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image and description */}
      <div className="hidden lg:flex flex-1 relative bg-blue-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-500 opacity-90"></div>
        <div className="relative z-10 p-12 flex flex-col justify-center text-white max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Your safety is our priority
          </h2>
          <p className="mb-6">
            Kavach connects citizens directly with law enforcement, enabling
            quick reporting and efficient response to incidents. Together, we're
            building safer communities.
          </p>

          <div className="space-y-4 mt-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Quick Reporting</h3>
                <p className="text-white text-opacity-80 text-sm">
                  Report incidents in minutes with our easy-to-use platform
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Emergency Access</h3>
                <p className="text-white text-opacity-80 text-sm">
                  Quick login with just your phone number during emergencies
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Direct Communication</h3>
                <p className="text-white text-opacity-80 text-sm">
                  Communicate directly with assigned officers working on your
                  case
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
