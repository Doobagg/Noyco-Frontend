"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    if (!email) {
      setError("Please enter your e-mail");
      showToast("Please enter your e-mail", "error");
      return;
    }
    try {
      setStatus("sending");
      await apiRequest("/auth/password/reset/request", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStatus("sent");
      showToast("Reset code sent to your e-mail", "success");
    } catch (e) {
      console.error(e);
      setStatus("error");
      setError("Could not send reset code. Please try again later.");
      showToast("Could not send reset code. Please try again later.", "error");
    }
  };

  if (status === "sent") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
          <h1 className="text-xl font-semibold mb-4 text-center">Check your e-mail</h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            If an account exists for <span className="font-medium">{email}</span>, we’ve sent a 6-digit verification
            code.&nbsp;Enter that code on the next screen to reset your password.
          </p>
          <button
            onClick={() => router.push("/auth/reset?email=" + encodeURIComponent(email))}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
          >
            Enter Code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">Forgot your password?</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter the e-mail address you used when you registered and we’ll send you a verification code.
        </p>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={status === "sending"}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg"
        >
          {status === "sending" ? "Sending…" : "Send verification code"}
        </button>
        <button onClick={() => router.push("/auth/login")} className="w-full mt-3 text-sm text-gray-500 hover:underline">
          Back to sign-in
        </button>
      </div>
    </div>
  );
}
