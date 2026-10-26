"use client";

import React from "react";
import { BrandHeader } from "./BrandHeader";
import { EvaluatorAccessCard } from "./EvaluatorAccessCard";
import { TraderAuthenticationForm } from "./TraderAuthenticationForm";
import { loginDemoUser } from "@/lib/auth";

interface SignInCardProps {
  onLoginSuccess?: () => void;
}

export function SignInCard({ onLoginSuccess }: SignInCardProps) {
  const handleDemoBypass = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    loginDemoUser();
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* Frosted Glass Translucent Card */}
      <div className="bg-[#12161E]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.7)] transition-all">
        {/* Header Section */}
        <BrandHeader />

        {/* Evaluator / Demo Bypass Button */}
        <div className="mt-4">
          <EvaluatorAccessCard onBypass={handleDemoBypass} />
        </div>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono tracking-wider uppercase">
            <span className="bg-[#12161E] px-3 py-0.5 text-[#858D97]">
              Or Authenticate with Desk Credentials
            </span>
          </div>
        </div>

        {/* Trader Authentication Form */}
        <TraderAuthenticationForm onSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}


