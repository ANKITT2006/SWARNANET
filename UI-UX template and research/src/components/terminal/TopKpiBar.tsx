"use client";

import React from "react";
import {
  Scale,
  Zap,
  Activity,
  ArrowUpRight,
  Coins,
} from "lucide-react";
import { TopKpiMetrics } from "@/types/terminal";

interface TopKpiBarProps {
  metrics: TopKpiMetrics;
  isUpdating?: boolean;
}

export function TopKpiBar({ metrics, isUpdating = false }: TopKpiBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Benchmark Pure Gram Price */}
      <div className="kpi-card flex flex-col justify-between rounded-xl p-3.5 sm:p-4 border border-[#2D3237] bg-[#181A1C] hover:bg-[#1D2023] hover:border-[#41474E] transition-colors min-h-[136px]">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <span className="text-[11px] font-mono tracking-normal text-[#858D97] flex items-center gap-1.5 font-semibold">
            <Coins className="h-3.5 w-3.5 text-[#B0B5BC] shrink-0" />
            <span className="whitespace-nowrap">Benchmark Price</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1D2023] text-[#B0B5BC] border border-[#2D3237] shrink-0">
            0.999 Fine
          </span>
        </div>

        {/* Main Metric Value & Sparkline */}
        <div className="flex items-center justify-between gap-2 my-1">
          <div className="flex items-baseline gap-1 min-w-0">
            <span className="text-xl xl:text-2xl 2xl:text-3xl font-mono font-bold text-[#F1EEE7] tracking-tight tabular-nums whitespace-nowrap">
              ₹{metrics.benchmarkPureGramPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-mono text-[#858D97] shrink-0">/g</span>
          </div>
          {/* Subtle Green Sparkline */}
          <div className="shrink-0 pl-1">
            <svg className="h-4.5 w-12 sm:w-14 stroke-[#45BD91] fill-none" viewBox="0 0 64 24">
              <path d="M 2 18 L 12 14 L 22 17 L 32 10 L 42 13 L 52 6 L 62 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#2D3237]">
          <span className="text-[#45BD91] flex items-center gap-1 font-semibold truncate">
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">+{metrics.benchmarkChangeBps} bps today</span>
          </span>
          <span className="text-[#5E6570] font-medium shrink-0">GOLDTEN Ref</span>
        </div>
      </div>

      {/* 2. Max Cross-Contract Basis Spread */}
      <div className="kpi-card flex flex-col justify-between rounded-xl p-3.5 sm:p-4 border border-[#2D3237] bg-[#181A1C] hover:bg-[#1D2023] hover:border-[#41474E] transition-colors min-h-[136px]">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <span className="text-[11px] font-mono tracking-normal text-[#858D97] flex items-center gap-1.5 font-semibold">
            <Scale className="h-3.5 w-3.5 text-[#B0B5BC] shrink-0" />
            <span className="whitespace-nowrap">Max Basis Spread</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1D2023] text-[#B0B5BC] border border-[#2D3237] shrink-0">
            +{metrics.maxBasisSpreadBps} bps
          </span>
        </div>

        {/* Main Metric Value & Sparkline */}
        <div className="flex items-center justify-between gap-2 my-1">
          <div className="flex items-baseline gap-1 min-w-0">
            <span className="text-xl xl:text-2xl 2xl:text-3xl font-mono font-bold text-[#F1EEE7] tracking-tight tabular-nums whitespace-nowrap">
              ₹{metrics.maxBasisSpreadInr.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-[#858D97] shrink-0">/g spread</span>
          </div>
          {/* Neutral Gray Sparkline */}
          <div className="shrink-0 pl-1">
            <svg className="h-4.5 w-12 sm:w-14 stroke-[#B0B5BC] fill-none" viewBox="0 0 64 24">
              <path d="M 2 16 L 12 18 L 22 11 L 32 15 L 42 7 L 52 12 L 62 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#2D3237]">
          <span className="text-[#B0B5BC] truncate max-w-[160px] font-medium" title={metrics.maxBasisPair}>
            {metrics.maxBasisPair}
          </span>
          <span className="text-[#5E6570] font-medium shrink-0">Gross Peak</span>
        </div>
      </div>

      {/* 3. Net Actionable Mispricings */}
      <div className="kpi-card flex flex-col justify-between rounded-xl p-3.5 sm:p-4 border border-[#2D3237] bg-[#181A1C] hover:bg-[#1D2023] hover:border-[#41474E] transition-colors min-h-[136px]">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <span className="text-[11px] font-mono tracking-normal text-[#858D97] flex items-center gap-1.5 font-semibold">
            <Zap className="h-3.5 w-3.5 text-[#45BD91] shrink-0" />
            <span className="whitespace-nowrap">Actionable Arbs</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#142A23] text-[#45BD91] border border-[#285D49] shrink-0">
            Hurdle &gt; {metrics.roundTripHurdleBps} bps
          </span>
        </div>

        {/* Main Metric Value & Sparkline */}
        <div className="flex items-center justify-between gap-2 my-1">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-xl xl:text-2xl 2xl:text-3xl font-mono font-bold text-[#45BD91] tracking-tight tabular-nums whitespace-nowrap">
              {metrics.actionableMispricingsCount}
            </span>
            <span className="text-xs font-mono text-[#858D97] shrink-0 whitespace-nowrap">
              of {metrics.totalMonitoredContracts} contracts
            </span>
          </div>
          {/* Green Sparkline */}
          <div className="shrink-0 pl-1">
            <svg className="h-4.5 w-12 sm:w-14 stroke-[#45BD91] fill-none" viewBox="0 0 64 24">
              <path d="M 2 19 L 14 15 L 24 16 L 36 9 L 46 11 L 56 4 L 62 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#2D3237]">
          <span className="text-[#45BD91] font-semibold flex items-center gap-1.5 truncate">
            <span className="h-1.5 w-1.5 rounded-full bg-[#45BD91] shrink-0" />
            <span className="truncate">Survives Friction</span>
          </span>
          <span className="text-[#5E6570] font-medium shrink-0">Active</span>
        </div>
      </div>

      {/* 4. Active Rolling Correlation */}
      <div className="kpi-card flex flex-col justify-between rounded-xl p-3.5 sm:p-4 border border-[#2D3237] bg-[#181A1C] hover:bg-[#1D2023] hover:border-[#41474E] transition-colors min-h-[136px]">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <span className="text-[11px] font-mono tracking-normal text-[#858D97] flex items-center gap-1.5 font-semibold">
            <Activity className="h-3.5 w-3.5 text-[#B0B5BC] shrink-0" />
            <span className="whitespace-nowrap">Rolling Corr (ρ)</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1D2023] text-[#B0B5BC] border border-[#2D3237] shrink-0">
            90-Day Window
          </span>
        </div>

        {/* Main Metric Value & Sparkline */}
        <div className="flex items-center justify-between gap-2 my-1">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-xl xl:text-2xl 2xl:text-3xl font-mono font-bold text-[#F1EEE7] tracking-tight tabular-nums whitespace-nowrap">
              {metrics.activeRollingCorrelation.toFixed(4)}
            </span>
            <span className="text-xs font-mono text-[#45BD91] font-semibold shrink-0 whitespace-nowrap">Near 1.0</span>
          </div>
          {/* Neutral Gray Sparkline */}
          <div className="shrink-0 pl-1">
            <svg className="h-4.5 w-12 sm:w-14 stroke-[#B0B5BC] fill-none" viewBox="0 0 64 24">
              <path d="M 2 14 L 12 8 L 22 16 L 32 6 L 42 12 L 52 5 L 62 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#2D3237]">
          <span className="text-[#B0B5BC] truncate max-w-[160px] font-medium" title={metrics.correlationPair}>
            {metrics.correlationPair}
          </span>
          <span className="text-[#5E6570] font-medium shrink-0">Par: 1.0040</span>
        </div>
      </div>
    </div>
  );
}
