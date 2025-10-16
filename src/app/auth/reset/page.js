"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const defaultEmail = params.get("email") || "";
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 digits
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null); // null | processing | done
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const router = useRouter();

  useEffect(() => setEmail(defaultEmail), [defaultEmail]);

  // Ensure password fields are empty on component mount
  useEffect(() => {
    setNewPassword("");
    setConfirmPassword("");
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // Handle OTP input change
  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return; // allow single digit only
    const copy = [...otp];
    copy[idx] = val;
    setOtp(copy);
    setError("");

    // auto-focus next box
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      next && next.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const prev = document.getElementById(`otp-${idx - 1}`);
      prev && prev.focus();
    }
  };

  const handleSubmit = async () => {
    setError("");
    const otpCode = otp.join("");
    
    if (!email || otpCode.length !== 6 || !newPassword || !confirmPassword) {
      setError("All fields are required and OTP must be 6 digits");
      showToast("All fields are required and OTP must be 6 digits", "error");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      showToast("Passwords do not match", "error");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      showToast("Password must be at least 8 characters long", "error");
      return;
    }
    
    try {
      setStatus("processing");
      await apiRequest("/auth/password/reset/confirm", {
        method: "POST",
        body: JSON.stringify({ email, otp: otpCode, new_password: newPassword }),
      });
      setStatus("done");
      showToast("Password reset successfully", "success");
    } catch (e) {
      console.error(e);
      setError(e?.message || "Unable to reset password");
      setStatus(null);
      showToast(e?.message || "Unable to reset password", "error");
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    try {
      await apiRequest("/auth/password/reset/request", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setTimer(60); // 60 second countdown
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]); // Clear OTP fields
      setError("");
      showToast("Verification code resent", "success");
      // Focus first OTP input
      setTimeout(() => {
        const first = document.getElementById("otp-0");
        first && first.focus();
      }, 100);
    } catch (e) {
      console.error(e);
      setError("Failed to resend OTP. Please try again.");
      showToast("Failed to resend OTP. Please try again.", "error");
    }
  };

  if (status === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Password Reset Complete!</h1>
            <p className="text-sm text-gray-600">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
          </div>
          
          <button 
            onClick={() => router.push("/auth/login")}
            className="w-full py-3 bg-black text-white rounded-xl hover:opacity-90 transition font-medium"
          >
            Go to Sign-in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reset your password</h1>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to <span className="font-medium">{email}</span> and create a new password
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
        {/* Email Field (readonly) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            placeholder="Email address"
          />
        </div>

        {/* OTP Input Boxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                maxLength={1}
                inputMode="numeric"
                className="w-12 h-14 text-center text-lg font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            ))}
          </div>
        </div>

        {/* New Password Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            key="new-password-field"
            type={showNewPwd ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowNewPwd(!showNewPwd)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showNewPwd ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            key="confirm-password-field"
            type={showConfirmPwd ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPwd(!showConfirmPwd)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPwd ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="text-xs text-gray-500">
          Password must be at least 8 characters long
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={status === "processing"}
          className="w-full py-3 bg-black text-white rounded-xl hover:opacity-90 transition disabled:opacity-60 font-medium"
        >
          {status === "processing" ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting Password...
            </div>
          ) : (
            "Reset Password"
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center text-xs text-gray-500">
          {timer > 0 ? (
            <>Resend code in {timer}s</>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              disabled={!canResend}
            >
              Resend verification code
            </button>
          )}
        </div>

        {/* Back to Sign-in */}
        <div className="text-center">
          <button
            onClick={() => router.push("/auth/login")}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Back to sign-in
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
