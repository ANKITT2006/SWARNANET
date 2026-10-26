"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  MailCheck,
  KeyRound,
} from "lucide-react";

export function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validate = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Institutional email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid institutional address");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSubmitted(true);
    } catch {
      setErrorMessage("Failed to issue recovery token. Please contact exchange desk admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[450px] mx-auto">
      <div className="relative rounded-2xl border border-[#34383D] bg-[#181A1D] p-7 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-[#1C1F22] border border-[#34383D] text-[#D6D0C4] mb-2">
            <KeyRound className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#F2F0EA]">
            SWARNANET // Security Token Recovery
          </h2>
          <p className="text-xs text-[#9299A3] mt-1">
            Request an encrypted token reset for your institutional trader account
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#142A23] text-[#48B58A] border border-[#285D49]">
              <MailCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F2F0EA]">Recovery Token Dispatched</h3>
              <p className="mt-1 text-xs text-[#9299A3]">
                If an authorized seat exists for <span className="font-mono text-[#E6E1D6]">{email}</span>, a secure authentication key has been sent.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D6D0C4] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Terminal Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-[#704044] bg-[#301C1E] p-3 text-xs text-[#E07878]">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#E07878]" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#F2F0EA] mb-1">Trader Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter institutional email address"
                className="w-full rounded-xl border border-[#292D32] bg-[#111316] px-3.5 py-2.5 text-xs text-[#F2F0EA] placeholder-[#9299A3]/40 font-mono focus:border-[#8995A3] focus:outline-none"
              />
              {emailError && <p className="mt-1 text-[11px] text-[#E07878]">{emailError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#17191C] bg-[#D6D0C4] hover:bg-[#E5E0D6] border border-[#8995A3] active:scale-[0.98] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isLoading ? "Dispatching Token..." : "Send Cryptographic Reset Key"}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1 text-xs text-[#9299A3] hover:text-[#F2F0EA]">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Terminal Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
