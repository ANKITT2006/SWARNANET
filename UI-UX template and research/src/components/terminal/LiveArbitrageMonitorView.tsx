"use client";

import React, { useState } from "react";
import { ArrowLeftRight, Zap, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2, Sliders, ExternalLink } from "lucide-react";
import { McxContract } from "@/types/terminal";
import { RelativeValueGrid } from "./RelativeValueGrid";

interface LiveArbitrageMonitorViewProps {
  contracts: McxContract[];
}

export function LiveArbitrageMonitorView({ contracts }: LiveArbitrageMonitorViewProps) {
  const [selectedPurityFilter, setSelectedPurityFilter] = useState<string>("ALL");
  const [activeTicket, setActiveTicket] = useState<{ leg1: string; leg2: string; netEdgeBps: number } | null>(null);

  const filteredContracts = contracts.filter((c) => {
    if (selectedPurityFilter === "ALL") return true;
    if (selectedPurityFilter === "GOLDM") return c.symbol === "GOLDM";
    if (selectedPurityFilter === "GOLDTEN") return c.symbol === "GOLDTEN";
    if (selectedPurityFilter === "GOLDGUINEA") return c.symbol === "GOLDGUINEA";
    if (selectedPurityFilter === "GOLDPETAL") return c.symbol === "GOLDPETAL";
    return true;
  });

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="bg-[#181A1C] rounded-xl p-5 border border-[#2D3237] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#1D2023] text-[#D8D0C0] border border-[#2D3237]">
              <ArrowLeftRight className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-sans font-semibold text-[#F1EEE7]">Live Arbitrage Monitor (Maximized View)</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#13231B] text-[#45BD91] border border-[#1E4334] uppercase">
                  SUB-MILLI DISPARITY RADAR
                </span>
              </div>
              <p className="text-xs font-mono text-[#858D97] mt-0.5">
                Surveillance across GOLDM, GOLDTEN, GOLDGUINEA, and GOLDPETAL
              </p>
            </div>
          </div>
        </div>

        {/* Quick Contract Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#111315] border border-[#2D3237] text-xs font-mono">
          {["ALL", "GOLDM", "GOLDTEN", "GOLDGUINEA", "GOLDPETAL"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedPurityFilter(tab)}
              className={`px-3 py-1 rounded transition-colors ${
                selectedPurityFilter === tab
                  ? "bg-[#D8D0C0] text-[#17191B] font-semibold"
                  : "text-[#858D97] hover:text-[#F1EEE7] hover:bg-[#181A1C]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Disparity Radar Bar: 4 Contracts at Pure Gram Parity */}
      {contracts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {contracts.slice(0, 4).map((contract) => {
            const pureGram = contract.normalizedPpg;
            const isTender = contract.isTenderActive;
            return (
              <div
                key={`${contract.symbol}-${contract.expiryDate}`}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isTender
                    ? "bg-[#271719] border-[#55272B]"
                    : "bg-[#181A1C] border-[#2D3237] hover:border-[#41474E]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-[#F1EEE7]">{contract.symbol}</span>
                  <span className="text-[10px] font-mono text-[#B0B5BC] bg-[#1D2023] px-1.5 py-0.5 rounded border border-[#2D3237]">
                    {contract.purity} Fineness
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-mono font-bold text-[#F1EEE7] tabular-nums">
                      ₹{pureGram.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-mono text-[#858D97] ml-1">/ pure gram</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold tabular-nums ${
                      contract.disparitySpreadBps >= 0 ? "text-[#45BD91]" : "text-[#E47777]"
                    }`}
                  >
                    {contract.disparitySpreadBps >= 0 ? "+" : ""}
                    {contract.disparitySpreadBps.toFixed(1)} bps
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#22262A] flex items-center justify-between text-[10px] font-mono text-[#858D97]">
                  <span>Expiry: {contract.expiryDate}</span>
                  {isTender ? (
                    <span className="text-[#E47777] font-semibold">⚠️ TENDER ACTIVE</span>
                  ) : (
                    <span className="text-[#45BD91]">{contract.daysToExpiry}d left</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Maximized Relative Value Grid */}
      <RelativeValueGrid contracts={filteredContracts} />

      {/* Real-Time Fast Arbitrage Execution Ticket Bar */}
      <div className="bg-[#181A1C] rounded-xl p-4 border border-[#1E4334] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#13231B] text-[#45BD91] border border-[#1E4334]">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#F1EEE7]">Instant Arbitrage Execution Ticket</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#13231B] text-[#45BD91] border border-[#1E4334] uppercase">
                DMA Ready
              </span>
            </div>
            <span className="text-[#858D97] text-[11px]">
              Pair: <strong className="text-[#F1EEE7]">BUY GOLDTEN (10g)</strong> / <strong className="text-[#F1EEE7]">SELL GOLDM (100g)</strong> | Net Edge: <span className="text-[#45BD91] font-semibold">+22.4 bps</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTicket({ leg1: "GOLDTEN", leg2: "GOLDM", netEdgeBps: 22.4 });
              setTimeout(() => setActiveTicket(null), 3000);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#45BD91] hover:bg-[#4ed4a3] text-[#101112] font-semibold font-mono transition-colors cursor-pointer shadow-sm"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Simulate DMA Leg Fill</span>
          </button>
        </div>
      </div>

      {/* Toast ticket notification */}
      {activeTicket && (
        <div className="p-3 rounded-lg bg-[#13231B] border border-[#1E4334] text-[#45BD91] font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#45BD91]" />
            <span>
              Simulated fill executed: Long {activeTicket.leg1} / Short {activeTicket.leg2} @ Net +{activeTicket.netEdgeBps} bps
            </span>
          </div>
          <span className="text-[10px] text-[#45BD91] font-bold uppercase tracking-wider">FILL CONFIRMED (14ms)</span>
        </div>
      )}
    </div>
  );
}
