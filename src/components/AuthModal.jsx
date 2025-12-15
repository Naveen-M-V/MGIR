import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [animateIn, setAnimateIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  
  // 3-Step Signup Flow
  const [signupStep, setSignupStep] = useState(1); // 1: Email+OTP, 2: Details, 3: Confirmation
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(5);
  const [resendTimer, setResendTimer] = useState(0);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    remindMe: false,
  });

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    country: "",
    province: "",
    address: "",
    zip: "",
    city: "",
    agreeTerms: false,
  });

  useEffect(() => {
    if (isOpen) setAnimateIn(true);
    else setAnimateIn(false);
  }, [isOpen]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: loginData.username,
        password: loginData.password,
        remindMe: loginData.remindMe
      });

      if (response.data.success) {
        login(response.data.data.user, response.data.token);
        console.log('Login successful:', response.data);

        setLoginData({ username: "", password: "", remindMe: false });
        onClose();
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!signupData.email || !signupData.username) {
      setError("Email and username are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username: signupData.username,
        email: signupData.email
      });

      if (response.data.success) {
        setOtpSent(true);
        setSignupStep(1.5); // Show OTP verification
      }
    } catch (error) {
      console.error('OTP request error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 1.5: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter a 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      // Send only email + otp for verification step — do not send placeholder
      // password/fullName/agreeTerms. The server will respond 200 if OTP is
      // valid and needs completion.
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email: signupData.email,
        otp: otp,
        username: signupData.username
      });

      if (response.data.success) {
        setSignupStep(2); // Move to details form
        // Don't clear OTP - keep it for the final submission
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      
      // Extract attempts from error message
      const match = errorMessage.match(/(\d+) attempts remaining/);
      if (match) {
        setOtpAttempts(parseInt(match[1]));
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete Details
  const handleCompleteDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!signupData.password || signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!signupData.fullName || !signupData.phone) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!signupData.agreeTerms) {
      setError("Please accept the Terms and Conditions");
      setLoading(false);
      return;
    }

    try {
      // Update user with complete details
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email: signupData.email,
        otp: otp,
        username: signupData.username,
        password: signupData.password,
        fullName: signupData.fullName,
        phone: signupData.phone,
        country: signupData.country,
        province: signupData.province,
        address: signupData.address,
        zip: signupData.zip,
        city: signupData.city,
        agreeTerms: signupData.agreeTerms
      });

      if (response.data.success) {
        login(response.data.data.user, response.data.token);
        console.log('Signup successful:', response.data);

        setSignupData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          phone: "",
          country: "",
          province: "",
          address: "",
          zip: "",
          city: "",
          agreeTerms: false,
        });
        setSignupStep(1);
        setOtpSent(false);
        onClose();
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-otp', {
        email: signupData.email
      });

      if (response.data.success) {
        setOtp("");
        setOtpAttempts(5);
        setResendTimer(60);
        
        // Countdown timer
        const interval = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-3xl p-4 animate-fadeIn overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
      </div>

      <div
        className={`relative max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          animateIn
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-8"
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/10 backdrop-blur-3xl border border-white/30">
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none">
            <div className="absolute inset-0 rounded-3xl bg-[conic-gradient(from_0deg,rgba(59,130,246,0.3),rgba(147,51,234,0.3),rgba(236,72,153,0.3),rgba(59,130,246,0.3))] animate-rotateBorder blur-xl opacity-40"></div>
          </div>

          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 pointer-events-none"></div>

          {/* Decorative animated orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none animate-float" style={{ animationDelay: "2s" }}></div>

          <div className="relative p-6 md:p-8 z-10 flex flex-col justify-center max-h-[calc(90vh-40px)] overflow-hidden">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white shadow-lg border border-white/30 transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
            >
              <span className="text-xl group-hover:rotate-90 transition-transform duration-300">✕</span>
            </button>

            {/* Header */}
            <div className="text-center mb-8 animate-slideDown">
              <h2 className="text-4xl font-bold text-white mb-2">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-white/70 text-sm font-light tracking-wide">
                {mode === "login" 
                  ? "Access your account to continue" 
                  : "Join our exclusive community"}
              </p>
            </div>

            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5 animate-slideUp max-w-md mx-auto w-full">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-white/90 mb-2">Email or Username</label>
                    <input
                      type="text"
                      placeholder="you@example.com"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm hover:bg-white/15"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-white/90 mb-2">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm hover:bg-white/15"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-11 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginData.remindMe}
                      onChange={(e) => setLoginData({ ...loginData, remindMe: e.target.checked })}
                      className="w-4 h-4 rounded border-white/30 focus:ring-blue-400 cursor-pointer accent-blue-400"
                    />
                    <span className="text-white/80">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-blue-300 hover:text-blue-200 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Terms & Conditions for Login */}
                <div className="flex items-start gap-3 text-sm bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
                  <input
                    type="checkbox"
                    id="loginTerms"
                    className="w-4 h-4 rounded border-white/30 focus:ring-blue-400 cursor-pointer mt-0.5 flex-shrink-0 accent-blue-400"
                  />
                  <label htmlFor="loginTerms" className="cursor-pointer text-white/80">
                    I accept the{" "}
                    <a href="/terms-and-conditions" className="text-blue-300 hover:text-blue-200 underline font-medium">
                      Terms and Conditions
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 hover:scale-105 backdrop-blur-sm border border-white/20"
                >
                  {loading && <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <div className="text-center pt-4 border-t border-white/20">
                  <p className="text-white/80 text-sm">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <>
                {/* STEP 1: Email & Username */}
                {signupStep === 1 && !otpSent && (
                  <form onSubmit={handleRequestOTP} className="space-y-4 animate-slideUp max-w-md mx-auto w-full">
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">1</div>
                        <div>
                          <p className="text-white text-sm font-semibold">Email Verification</p>
                          <p className="text-white/60 text-xs">Step 1 of 3</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Username"
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm hover:bg-white/15"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm hover:bg-white/15"
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                        <p className="text-red-200 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 hover:scale-105 backdrop-blur-sm border border-white/20"
                    >
                      {loading && <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>

                    <div className="text-center pt-2 border-t border-white/20">
                      <p className="text-white/80 text-sm">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
                        >
                          Sign in
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* STEP 1.5: OTP Verification */}
                {signupStep === 1.5 && otpSent && (
                  <form onSubmit={handleVerifyOTP} className="space-y-4 animate-slideUp max-w-md mx-auto w-full">
                    <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm">1.5</div>
                        <div>
                          <p className="text-white text-sm font-semibold">OTP Verification</p>
                          <p className="text-white/60 text-xs">Confirm your email address</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <p className="text-white/80 text-sm">OTP sent to <span className="font-semibold text-white">{signupData.email}</span></p>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm hover:bg-white/15 font-mono"
                      />
                      <p className="text-center text-white/60 text-sm">Enter the 6-digit code sent to your email</p>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                        <p className="text-red-200 text-sm">{error}</p>
                        {otpAttempts < 5 && <p className="text-red-300 text-xs mt-1">Attempts remaining: {otpAttempts}</p>}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 hover:scale-105 backdrop-blur-sm border border-white/20"
                    >
                      {loading && <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || loading}
                      className="w-full py-2 text-blue-300 hover:text-blue-200 font-medium text-sm disabled:text-white/40 transition-colors"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSignupStep(1); setOtpSent(false); setOtp(""); setError(""); }}
                      className="w-full py-2 text-white/60 hover:text-white/80 font-medium text-sm transition-colors"
                    >
                      Back
                    </button>
                  </form>
                )}

                {/* STEP 2: Complete Details */}
                {signupStep === 2 && (
                  <form onSubmit={handleCompleteDetails} className="space-y-3 animate-slideUp max-w-md mx-auto w-full overflow-y-auto hide-scrollbar max-h-[calc(90vh-200px)]">
                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/20 rounded-xl backdrop-blur-sm sticky top-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">2</div>
                        <div>
                          <p className="text-white text-sm font-semibold">Complete Profile</p>
                          <p className="text-white/60 text-xs">Step 2 of 3</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 text-sm backdrop-blur-sm hover:bg-white/15"
                        required
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 text-sm backdrop-blur-sm hover:bg-white/15"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 text-sm backdrop-blur-sm hover:bg-white/15"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 text-sm backdrop-blur-sm hover:bg-white/15"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={signupData.country}
                        onChange={(e) => setSignupData({ ...signupData, country: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 text-sm backdrop-blur-sm hover:bg-white/15"
                      />
                      <input
                        type="text"
                        placeholder="Province"
                        value={signupData.province}
                        onChange={(e) => setSignupData({ ...signupData, province: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 text-sm backdrop-blur-sm hover:bg-white/15"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={signupData.address}
                        onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 text-sm backdrop-blur-sm hover:bg-white/15"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Zip Code"
                          value={signupData.zip}
                          onChange={(e) => setSignupData({ ...signupData, zip: e.target.value })}
                          className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 text-sm backdrop-blur-sm hover:bg-white/15"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={signupData.city}
                          onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                          className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-white/50 outline-none transition-all duration-300 text-white placeholder-white/50 text-sm backdrop-blur-sm hover:bg-white/15"
                        />
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-2 text-xs bg-white/10 p-3 rounded-lg border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all">
                      <input
                        type="checkbox"
                        checked={signupData.agreeTerms}
                        onChange={(e) => setSignupData({ ...signupData, agreeTerms: e.target.checked })}
                        className="w-4 h-4 rounded border-white/30 focus:ring-blue-400 cursor-pointer mt-0.5 flex-shrink-0 accent-blue-400"
                        required
                      />
                      <label className="cursor-pointer text-white/80">
                        I accept the{" "}
                        <a href="/terms-and-conditions" className="text-blue-300 hover:text-blue-200 underline font-medium">
                          Terms and Conditions
                        </a>
                      </label>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                        <p className="text-red-200 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 hover:scale-105 backdrop-blur-sm border border-white/20 text-sm"
                    >
                      {loading && <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSignupStep(1.5); setError(""); }}
                      className="w-full py-2 text-white/60 hover:text-white/80 font-medium text-sm transition-colors"
                    >
                      Back
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0); } }
        @keyframes rotateBorder { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes button-glow { 0% { box-shadow: 0 0 5px rgba(255, 191, 0, 0.3); } 50% { box-shadow: 0 0 20px rgba(255, 191, 0, 0.6); } 100% { box-shadow: 0 0 5px rgba(255, 191, 0, 0.3); } }

        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-rotateBorder { animation: rotateBorder 6s linear infinite; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        input {
          background: rgba(255, 255, 255, 0.06);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          width: 100%;
          color: white;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        input:focus {
          outline: none;
          border-color: rgba(255, 191, 0, 0.8);
          box-shadow: 0 0 20px rgba(255, 191, 0, 0.3), inset 0 0 10px rgba(255, 191, 0, 0.1);
          background: rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </div>
    );
}

/* Animated Input Field Component */
function AnimatedInputField({ 
  icon, 
  label, 
  type = "text", 
  placeholder, 
  isFocused = false,
  ...props 
}) {
  return (
    <div className="relative group">
      {label && <label className="block mb-2 text-xs text-white/80 font-medium">{label}</label>}
      <div className="relative flex items-center">
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            isFocused ? "text-amber-400 scale-110" : "text-white/40"
          }`}>
            {icon}
          </div>
        )}
        <input 
          type={type} 
          placeholder={placeholder} 
          className={`${icon ? "pl-10" : "pl-4"} pr-4 py-3 w-full bg-white/6 border border-white/15 rounded-lg text-white placeholder-white/40 transition-all duration-300 focus:border-amber-400 focus:bg-white/12 focus:shadow-[0_0_20px_rgba(255,191,0,0.2)]`}
          {...props}
        />
        {isFocused && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 pointer-events-none animate-pulse"></div>
        )}
      </div>
    </div>
  );
}

/* Feature Item Component */
function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/20 to-emerald-400/20 flex items-center justify-center text-amber-300 group-hover:from-amber-400/40 group-hover:to-emerald-400/40 transition-all duration-300">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
        <p className="text-white/60 text-xs">{desc}</p>
      </div>
    </div>
  );
}

/* Animated Button Component */
function AnimatedButton({ children, isLoading = false, disabled = false, ...rest }) {
  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className="group relative w-full px-6 py-3 font-semibold text-white overflow-hidden rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer" style={{
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite"
      }}></div>

      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-emerald-500 transition-all duration-300 rounded-xl"></div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
        boxShadow: "0 0 20px rgba(255, 191, 0, 0.4)",
        animation: "button-glow 2s ease-in-out infinite"
      }}></div>

      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        )}
        {children}
      </span>

      {/* Bottom border animation */}
      <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-amber-300 to-emerald-300 group-hover:w-full transition-all duration-500 rounded-full"></span>
    </button>
  );
}
