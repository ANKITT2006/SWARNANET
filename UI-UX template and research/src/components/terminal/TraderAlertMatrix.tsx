"use client";

import React, { useState } from "react";
import {
  Bell,
  ShieldAlert,
  Zap,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { ActionableAlert, SuppressedNoiseAlert } from "@/types/terminal";

interface TraderAlertMatrixProps {
  actionableAlerts: ActionableAlert[];
  suppressedNoiseAlerts: SuppressedNoiseAlert[];
}

export function TraderAlertMatrix({
  actionableAlerts,
  suppressedNoiseAlerts,
}: TraderAlertMatrixProps) {
  const [activeTab, setActiveTab] = useState<"actionable" | "suppressed">("actionable");

  return (
    <div className="bg-[#181A1D] border border-[#34383D] rounded-xl p-5 shadow-sm">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#25292E]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold font-mono tracking-wider text-[#F2F0EA] uppercase">
              Low-Noise Trader Alert Matrix
            </h2>
            <span className="px-2 py-0.5 rounded bg-[#222831] border border-[#34383D] text-[10px] font-mono font-medium text-[#AEB4BD]">
              Friction-Aware Signal Filter
            </span>
          </div>
          <p className="text-xs text-[#9299A3] font-mono mt-0.5">
            Real-time cross-contract arb execution gateway with quantitative noise suppression
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-[#292D32] bg-[#111316] p-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("actionable")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors duration-150 cursor-pointer ${
              activeTab === "actionable"
                ? "bg-[#D6D0C4] text-[#17191C]"
                : "text-[#9299A3] hover:text-[#F2F0EA] hover:bg-[#181A1D]"
            }`}
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Actionable Spreads ({actionableAlerts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("suppressed")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors duration-150 cursor-pointer ${
              activeTab === "suppressed"
                ? "bg-[#301C1E] border border-[#704044] text-[#E07878]"
                : "text-[#9299A3] hover:text-[#F2F0EA] hover:bg-[#181A1D]"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Suppressed Noise ({suppressedNoiseAlerts.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Actionable Spreads (Alpha Signal) */}
      {activeTab === "actionable" && (
        <div className="space-y-3">
          {actionableAlerts.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-[#2D3237] text-xs font-mono text-[#5E6570]">
              No active cross-contract spreads currently exceed the hurdle barrier.
            </div>
          ) : (
            actionableAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-[#285D49] bg-[#142A23]/30 font-mono text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#285D49]/40">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#142A23] text-[#45BD91] font-semibold text-[10px] border border-[#285D49]">
                      {alert.convictionLevel}
                    </span>
                    <span className="font-semibold text-[#F1EEE7]">{alert.id}</span>
                    <span className="text-[#5E6570] text-[11px]">• {alert.timestamp}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#1D2023] border border-[#2D3237] text-[#B0B5BC] font-medium">
                      Tender Window Status: {alert.tenderWindowStatus || "Safe / Cash-Settled Window"}
                    </span>
                    <span className="text-[#858D97]">
                      Execution: <strong className="text-[#D8D0C0]">{alert.executionWindow}</strong>
                    </span>
                  </div>
                </div>

                {/* 2-Leg Pair Trade Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {/* Leg 1: Long Cheap */}
                  <div className="p-2.5 rounded-lg bg-[#181A1C] border border-[#2D3237] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#45BD91] font-semibold block uppercase">
                        LEG 1: BUY (CHEAP)
                      </span>
                      <span className="font-semibold text-[#F1EEE7] text-sm">
                        {alert.legLongSymbol} {alert.legLongExpiry}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#858D97] block">Normalized PPG</span>
                      <span className="font-semibold text-[#45BD91]">₹{alert.legLongPpg.toFixed(2)}/g</span>
                    </div>
                  </div>

                  {/* Leg 2: Short Expensive */}
                  <div className="p-2.5 rounded-lg bg-[#181A1C] border border-[#2D3237] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#E47777] font-semibold block uppercase">
                        LEG 2: SELL (EXPENSIVE)
                      </span>
                      <span className="font-semibold text-[#F1EEE7] text-sm">
                        {alert.legShortSymbol} {alert.legShortExpiry}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#858D97] block">Normalized PPG</span>
                      <span className="font-semibold text-[#E47777]">₹{alert.legShortPpg.toFixed(2)}/g</span>
                    </div>
                  </div>
                </div>

                {/* Feature E: Decomposed Calendar Carry & Net Arbitrage Breakdown */}
                <div className="p-3 rounded-lg bg-[#141619] border border-[#2D3237] space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-[#858D97] border-b border-[#2D3237] pb-1.5">
                    <span className="text-[#B0B5BC] font-semibold uppercase">
                      Carry Decomposition ({alert.daysBetweenMaturities}d Maturity Gap @ {alert.annualizedCarryRatePct}% p.a.)
                    </span>
                    <span className="text-[#45BD91] font-semibold">✓ Net Alpha &gt; 0</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                    <div>
                      <span className="text-[10px] text-[#5E6570] block">1. Gross Spread:</span>
                      <strong className="text-[#F1EEE7]">₹{alert.grossSpreadInr.toFixed(2)}/g ({alert.grossSpreadBps} bps)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5E6570] block">2. Expected Carry:</span>
                      <strong className="text-[#D8D0C0]">₹{alert.calendarCarryInr.toFixed(2)}/g ({alert.calendarCarryBps} bps)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5E6570] block">3. Net Basis Mispricing:</span>
                      <strong className="text-[#B0B5BC]">₹{alert.netBasisSpreadInr.toFixed(2)}/g ({alert.netBasisSpreadBps} bps)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5E6570] block">4. Round-Trip Hurdle:</span>
                      <strong className="text-[#E47777]">{alert.roundTripFrictionBps} bps</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#2D3237] text-[11px]">
                    <span className="text-[#858D97]">
                      Net Edge After Carry & Fees: <strong className="text-[#45BD91]">+{alert.netEdgeBps} bps</strong> (~₹{alert.netConvergenceExpectedInr.toFixed(2)}/g profit)
                    </span>
                    <span className="text-[#45BD91] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>SURVIVES SLIPPAGE & STT</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Suppressed Noise Log */}
      {activeTab === "suppressed" && (
        <div className="space-y-3">
          {suppressedNoiseAlerts.map((noise) => (
            <div
              key={noise.id}
              className="p-3.5 rounded-xl border border-[#704044] bg-[#301C1E]/25 font-mono text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 mb-2 border-b border-[#704044]/30">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#301C1E] border border-[#704044] text-[#E07878] font-semibold text-[10px]">
                    {noise.isCalendarCarryFiltered ? "FILTERED / SUB-HURDLE NOISE" : "SUPPRESSED"}
                  </span>
                  <span className="font-semibold text-[#F2F0EA]">{noise.pair}</span>
                  <span className="text-[#686F79] text-[10px]">• {noise.timestamp}</span>
                </div>
                <div className="text-[11px] text-[#E07878] font-semibold">
                  Net Expected Drag: {noise.netPnlExpectedBps} bps
                </div>
              </div>

              {/* Decomposition breakdown for calendar spreads */}
              {noise.isCalendarCarryFiltered ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1 text-[11px] text-[#C4C7CC] bg-[#141619] p-2 rounded-lg border border-[#25292E] mb-2">
                  <div>
                    Raw Disparity: <span className="text-[#F2F0EA] font-semibold">{noise.rawDisparityBps} bps</span>
                  </div>
                  <div>
                    Calendar Carry (36d): <span className="text-[#D6D0C4] font-semibold">+{noise.calendarCarryBps} bps</span>
                  </div>
                  <div>
                    Net Basis: <span className="text-[#AEB4BD] font-semibold">+{noise.netBasisSpreadBps} bps</span>
                  </div>
                  <div>
                    Execution Hurdle: <span className="text-[#E07878] font-semibold">{noise.frictionHurdleBps} bps</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 text-[11px] text-[#C4C7CC]">
                  <div>
                    Raw Disparity: <span className="text-[#F2F0EA] font-semibold">{noise.rawDisparityBps} bps</span>
                  </div>
                  <div>
                    Slippage Drag: <span className="text-[#E07878] font-semibold">{noise.slippageDragBps} bps</span>
                  </div>
                  <div>
                    Fee Hurdle: <span className="text-[#E07878] font-semibold">{noise.frictionHurdleBps} bps</span>
                  </div>
                </div>
              )}

              {/* Exact Quantitative Suppression Rationale */}
              <div className="mt-1 p-2 rounded bg-[#191C20] border border-[#292D32] text-[11px] text-[#C4C7CC] flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-[#D6D0C4] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#F2F0EA]">Algorithm Rationale:</strong> {noise.suppressionReason}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
