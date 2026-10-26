"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Building,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { setStoredUser, setAuthToken, User } from "@/lib/auth";

export function SignUpCard() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [clearingMemberId, setClearingMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    clearingMemberId?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!fullName.trim()) errors.fullName = "Trader/Analyst name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid institutional email required";
    if (!password || password.length < 8) errors.password = "Passcode must be at least 8 characters";
    if (password !== confirmPassword) errors.confirmPassword = "Passcodes do not match";
    if (!agreeTerms) errors.terms = "Trading desk compliance agreement required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const accessToken = `token_quant_${Date.now()}`;
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: fullName.trim(),
        email: email.trim(),
        role: "Quantitative Trader",
        companyName: clearingMemberId.trim() || "Alpha Trading Desk",
        traderId: `MCX-${Math.floor(Math.random() * 8000 + 1000)}`,
      };

      setStoredUser(newUser);
      setAuthToken(accessToken);
      router.push("/");
    } catch {
      setErrorMessage("Registration failed. Please check network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      <div className="relative rounded-2xl border border-[#34383D] bg-[#181A1D] p-7 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-[#1C1F22] border border-[#34383D] text-[#D6D0C4] mb-2">
            <UserCheck className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#F2F0EA]">
            SWARNANET // Terminal Registration
          </h2>
          <p className="text-xs text-[#9299A3] mt-1">
            Provision access to MCX Bullion Cross-Contract Terminal
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#704044] bg-[#301C1E] p-3 text-xs text-[#E07878]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#E07878]" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#F2F0EA] mb-1">Trader Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Vikram Malhotra"
              className="w-full rounded-xl border border-[#292D32] bg-[#111316] px-3.5 py-2 text-xs text-[#F2F0EA] placeholder-[#9299A3]/40 font-mono focus:border-[#8995A3] focus:outline-none"
            />
            {fieldErrors.fullName && <p className="mt-1 text-[11px] text-[#E07878]">{fieldErrors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F2F0EA] mb-1">Institutional Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@quantfirm.in"
              className="w-full rounded-xl border border-[#292D32] bg-[#111316] px-3.5 py-2 text-xs text-[#F2F0EA] placeholder-[#9299A3]/40 font-mono focus:border-[#8995A3] focus:outline-none"
            />
            {fieldErrors.email && <p className="mt-1 text-[11px] text-[#E07878]">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F2F0EA] mb-1">MCX Clearing Member ID / Desk Name</label>
            <input
              type="text"
              value={clearingMemberId}
              onChange={(e) => setClearingMemberId(e.target.value)}
              placeholder="e.g. AlphaVault Quant / Member #48210"
              className="w-full rounded-xl border border-[#292D32] bg-[#111316] px-3.5 py-2 text-xs text-[#F2F0EA] placeholder-[#9299A3]/40 font-mono focus:border-[#8995A3] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#F2F0EA] mb-1">Passcode</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full rounded-xl border border-[#292D32] bg-[#111316] px-3 py-2 text-xs text-[#F2F0EA] placeholder-[#9299A3]/40 font-mono focus:border-[#8995A3] focus:outline-none"
              />
              {fieldErrors.password && <p className="mt-1 text-[10px] text-[#E07878]">{fieldErrors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#F2F0EA] mb-1">Confirm</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter"
                className="w-full rounded-xl border border-[#292D32] bg-[#111316] px-3 py-2 text-xs text-[#F2F0EA] placeholder-[#9299A3]/40 font-mono focus:border-[#8995A3] focus:outline-none"
              />
              {fieldErrors.confirmPassword && <p className="mt-1 text-[10px] text-[#E07878]">{fieldErrors.confirmPassword}</p>}
            </div>
          </div>

          <label className="flex items-start gap-2 pt-1 text-[11px] text-[#9299A3] cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-[#34383D] bg-[#111316] text-[#D6D0C4] focus:ring-[#8995A3]"
            />
            <span>I acknowledge MCX Commodity Derivatives trading risk and algorithmic discipline rules.</span>
          </label>
          {fieldErrors.terms && <p className="text-[11px] text-[#E07878]">{fieldErrors.terms}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#17191C] bg-[#D6D0C4] hover:bg-[#E5E0D6] border border-[#8995A3] active:scale-[0.98] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isLoading ? "Provisioning Terminal Seat..." : "Register & Enter Terminal"}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-[#25292E] text-center text-xs text-[#9299A3]">
          Already hold credentials?{" "}
          <Link href="/login" className="text-[#D6D0C4] hover:text-[#E5E0D6] hover:underline font-semibold">
            Access Terminal Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
