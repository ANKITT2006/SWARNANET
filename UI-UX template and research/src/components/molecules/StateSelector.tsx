"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { ALL_INDIAN_STATES } from "@/lib/stream/indiaTransactionEngine";

interface StateSelectorProps {
  value: string;
  onChange: (stateCode: string) => void;
}

const REGION_GROUPS = ["West", "South", "North", "East", "Central", "North-East"] as const;

export function StateSelector({ value, onChange }: StateSelectorProps) {
  return (
    <div className="relative flex items-center">
      <MapPin className="absolute left-3.5 h-4 w-4 text-[#D6D0C4] pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select Indian State or Territory"
        className="w-full appearance-none rounded-xl border border-[#292D32] bg-[#111316] pl-10 pr-9 py-2.5 text-sm font-medium text-[#F2F0EA] shadow-inner transition-colors focus:border-[#8995A3] focus:outline-none focus:ring-1 focus:ring-[#8995A3] hover:border-[#8995A3] cursor-pointer"
      >
        <option value="ALL" className="bg-[#111316] font-bold text-[#D6D0C4]">
          🇮🇳 All India (36 States & UTs)
        </option>

        {REGION_GROUPS.map((region) => {
          const statesInRegion = ALL_INDIAN_STATES.filter((s) => s.region === region);
          return (
            <optgroup key={region} label={`${region} India`} className="bg-[#181A1D] font-bold text-[#9299A3]">
              {statesInRegion.map((s) => (
                <option key={s.code} value={s.code} className="bg-[#111316] font-medium text-[#F2F0EA]">
                  {s.name} ({s.code})
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
      <div className="pointer-events-none absolute right-3 text-xs text-[#9299A3]">▼</div>
    </div>
  );
}
