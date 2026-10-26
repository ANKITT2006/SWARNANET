"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  RefreshCw,
  Clock,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { User, clearStoredUser } from "@/lib/auth";
import { BhavcopyValidationDrawer } from "./BhavcopyValidationDrawer";

interface TerminalHeaderProps {
  user: User | null;
  onSignOut: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  onToggleLoginOverlay?: () => void;
}

interface IstClockState {
  formattedString: string;
  statusText: string;
  statusTone: "morning" | "evening" | "closed";
}

function calculateIstClock(): IstClockState {
  const now = new Date();

  // Create date time formatter targeting Asia/Kolkata (IST)
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";

  const day = getPart("day");
  const month = getPart("month").toUpperCase();
  const year = getPart("year");
  const hour = parseInt(getPart("hour"), 10);
  const minute = parseInt(getPart("minute"), 10);
  const second = getPart("second");

  const formattedString = `${day}-${month}-${year} | ${getPart("hour")}:${minute.toString().padStart(2, "0")}:${second} IST`;

  // Check day of week in IST
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  });
  const weekday = weekdayFormatter.format(now);
  const isWeekend = weekday === "Sat" || weekday === "Sun";

  // MCX Trading Session Hours in IST:
  // Morning Session: 09:00 AM to 05:00 PM (09:00 - 17:00)
  // Evening Bullion Session: 05:00 PM to 11:30 PM / 11:55 PM (17:00 - 23:55)
  // Outside or Weekends: Market Closed (EOD Bhavcopy Settlement)
  const totalMinutes = hour * 60 + minute;
  const morningStart = 9 * 60; // 09:00
  const eveningStart = 17 * 60; // 17:00
  const eveningEnd = 23 * 60 + 55; // 23:55

  let statusText = "🔴 Market Closed (EOD Bhavcopy Settlement)";
  let statusTone: "morning" | "evening" | "closed" = "closed";

  if (!isWeekend) {
    if (totalMinutes >= morningStart && totalMinutes < eveningStart) {
      statusText = "🟢 MCX Morning Session (Active)";
      statusTone = "morning";
    } else if (totalMinutes >= eveningStart && totalMinutes <= eveningEnd) {
      statusText = "🟡 MCX Evening Bullion Session (Active)";
      statusTone = "evening";
    }
  }

  return { formattedString, statusText, statusTone };
}

export function TerminalHeader({
  user,
  onSignOut,
  onRefreshData,
  isRefreshing = false,
  onToggleLoginOverlay,
}: TerminalHeaderProps) {
  const [clockState, setClockState] = useState<IstClockState>({
    formattedString: "20-OCT-2026 | 17:30:00 IST",
    statusText: "🟡 MCX Evening Bullion Session (Active)",
    statusTone: "evening",
  });
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  // Active clock running on Indian Standard Time (IST) updating every 1,000ms
  useEffect(() => {
    setClockState(calculateIstClock());
    const intervalId = setInterval(() => {
      setClockState(calculateIstClock());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLockSignOut = () => {
    clearStoredUser();
    onSignOut();
  };

  return (
    <>
      <header className="bg-[#151719] rounded-xl p-4 sm:p-5 border border-[#2D3237] shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Terminal Identity & System Status */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#181A1C] border border-[#2D3237] p-2">
              <Cpu className="h-5 w-5 text-[#D8D0C0]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#45BD91]" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#45BD91]" />
                <h1 className="text-xl sm:text-2xl font-sans font-bold tracking-tight text-[#F1EEE7]">
                  SWARNANET
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-[#181A1C] border border-[#2D3237] text-[10px] font-mono font-semibold text-[#B0B5BC] tracking-wider uppercase">
                  MCX BULLION DERIVATIVES INTELLIGENCE
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#142A23] border border-[#285D49] text-[10px] font-mono text-[#45BD91]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#45BD91]" />
                  <span>Feed Latency: 24ms</span>
                </span>
              </div>
              <p className="text-xs text-[#858D97] font-mono mt-1 font-medium">
                Bullion Cross-Contract Relative Value & Risk Gateway • Multi-Expiry Calendar Carry Engine
              </p>
            </div>
          </div>

          {/* Right: Two-Tier Controls (Top: Sync, Audit Pill, Clock, Session Pill, Trader; Bottom: Lock) */}
          <div className="flex flex-col items-start lg:items-end gap-2.5">
            {/* Top Row Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Feature B: Data Audit Pill (Clickable trigger for Audit Drawer) */}
              <button
                type="button"
                onClick={() => setIsAuditDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#142A23] hover:bg-[#1C3B31] text-[#45BD91] border border-[#285D49] hover:border-[#3D8569] transition-all cursor-pointer shadow-none active:scale-95"
                title="Open MCX Bhavcopy Scraper Validation & Data Integrity Audit Drawer"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#45BD91]" />
                <span>Data Audit: PASSED ✓</span>
              </button>

              {/* Refresh / Sync Bhavcopy button */}
              <button
                type="button"
                onClick={onRefreshData}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#181A1C] hover:bg-[#1D2023] text-[#F1EEE7] border border-[#2D3237] hover:border-[#41474E] transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-none"
                title="Poll fresh MCX settlement prices"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-[#D8D0C0] ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Sync Bhavcopy</span>
              </button>

              {/* Feature A: Real-Time Dynamic IST Market Clock */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181A1C] border border-[#2D3237] text-xs font-mono text-[#F1EEE7] tabular-nums">
                <Clock className="h-3.5 w-3.5 text-[#B0B5BC] shrink-0" />
                <span className="font-semibold">{clockState.formattedString}</span>
              </div>

              {/* Feature A: Dynamic Market Status Pill */}
              <div
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                  clockState.statusTone === "morning"
                    ? "bg-[#142A23] text-[#45BD91] border-[#285D49]"
                    : clockState.statusTone === "evening"
                    ? "bg-[#2B2417] text-[#D5B16D] border-[#5C4B2C]"
                    : "bg-[#301C1E] text-[#E47777] border-[#704044]"
                }`}
              >
                <span>{clockState.statusText}</span>
              </div>

              {/* Authenticated Trader Badge */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181A1C] border border-[#2D3237] text-left"
              >
                <div className="h-6 w-6 rounded-md bg-[#22262A] border border-[#2D3237] flex items-center justify-center text-[10px] font-bold text-[#F1EEE7]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "T"}
                </div>
                <div className="hidden sm:block">
                  <span className="block text-[11px] font-bold text-[#F1EEE7] font-mono leading-none">
                    {user?.name || "Institutional Desk"}
                  </span>
                  <span className="block text-[9px] font-mono text-[#858D97] leading-none mt-1">
                    {user?.traderId || "MCX Session Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Lock Terminal Control */}
            <div className="w-full flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleLockSignOut}
                className="flex items-center gap-2 px-3.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#301C1E] hover:bg-[#3D2225] text-[#E47777] border border-[#704044] hover:border-[#8E5257] transition-all active:scale-95 cursor-pointer"
                title="Lock terminal and return immediately to login interface"
              >
                <Lock className="h-3.5 w-3.5 text-[#E47777]" />
                <span>Lock Terminal</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Feature B Slide-Out Validation Drawer */}
      <BhavcopyValidationDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
      />
    </>
  );
}
