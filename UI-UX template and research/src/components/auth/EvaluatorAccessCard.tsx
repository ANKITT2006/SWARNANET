"use client";

import React, { useState } from "react";
import { Zap, ArrowRight, Loader2 } from "lucide-react";

interface EvaluatorAccessCardProps {
  onBypass: () => void | Promise<void>;
}

export function EvaluatorAccessCard({ onBypass }: EvaluatorAccessCardProps) {
  const [isBypassing, setIsBypassing] = useState(false);

  const handleClick = async () => {
    setIsBypassing(true);
    try {
      await onBypass();
    } finally {
      setIsBypassing(false);
    }
  };

  return (
    <div className="mb-4">
      {/* Top Header Row matching Photo 1 */}
      <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 fill-current text-[#D5B16D]" aria-hidden="true" />
          <span className="text-xs font-semibold text-[#F1EEE7]">
            Evaluator / Quick Bypass Mode
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#858D97]">
          No credentials required
        </span>
      </div>

      {/* Primary Gold / Champagne Demo Action Button matching Photo 1 */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isBypassing}
        className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#17191B] bg-[#E5D7B7] hover:bg-[#EFE2C5] active:scale-[0.99] transition-all shadow-md focus:outline-none focus:ring-1 focus:ring-[#D5B16D] disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
        aria-label="Launch Demo Terminal Directly without credentials"
      >
        <span className="flex items-center gap-2">
          {isBypassing ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#17191B]" aria-hidden="true" />
          ) : (
            <Zap className="h-4 w-4 fill-[#17191B] text-[#17191B]" aria-hidden="true" />
          )}
          <span>{isBypassing ? "Launching Terminal..." : "Launch Demo Terminal Directly"}</span>
        </span>
        <ArrowRight className="h-4 w-4 text-[#17191B] shrink-0" aria-hidden="true" />
      </button>
    </div>
  );
}
