"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Activity,
  ArrowRight,
} from "lucide-react";
import { TermStructurePoint } from "@/types/terminal";

interface TermStructureChartProps {
  data: TermStructurePoint[];
}

export function TermStructureChart({ data }: TermStructureChartProps) {
  const [curveMode, setCurveMode] = useState<"raw" | "rollDown">("raw");

  // Format custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload as TermStructurePoint;
      return (
        <div className="rounded-lg border border-[#34383D] bg-[#181A1D] p-3 shadow-xl text-xs font-mono text-[#F2F0EA]">
          <div className="font-semibold text-[#D6D0C4] border-b border-[#25292E] pb-1.5 mb-2">
            {p.symbol} • Expiry {label} ({p.daysToExpiry} days)
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-4">
              <span className="text-[#9299A3]">Raw Settlement PPG:</span>
              <span className="font-semibold text-[#F2F0EA] tabular-nums">₹{p.rawPpg.toFixed(2)}/g</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#9299A3]">Roll-Down Adjusted:</span>
              <span className="font-semibold text-[#AEB4BD] tabular-nums">₹{p.rollDownAdjustedPpg.toFixed(2)}/g</span>
            </div>
            <div className="flex justify-between gap-4 pt-1.5 border-t border-[#25292E]">
              <span className="text-[#9299A3]">Annualized Carry Rate:</span>
              <span className="font-semibold text-[#48B58A] tabular-nums">+{p.carryYieldAnnualizedPct}% Contango</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const nearPpg = data[0]?.rawPpg ?? 0;
  const farPpg = data[data.length - 1]?.rawPpg ?? 0;
  const totalDays = data[data.length - 1]?.daysToExpiry || 108;
  const annualizedContango = nearPpg > 0
    ? Number((((farPpg - nearPpg) / nearPpg) * (365 / totalDays) * 100).toFixed(2))
    : 0.0;

  return (
    <div className="bg-[#181A1C] border border-[#2D3237] rounded-xl p-5 shadow-sm">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#2D3237]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold font-mono tracking-wider text-[#F1EEE7] uppercase">
              Term Structure & Carry Curve
            </h2>
            <span className="px-2 py-0.5 rounded bg-[#1D2023] border border-[#2D3237] text-[10px] font-mono font-medium text-[#B0B5BC]">
              Discrete Expiries
            </span>
          </div>
          <p className="text-xs text-[#858D97] font-mono mt-0.5">
            Normalized Price Per Pure Gram (₹/g) plotted against discrete delivery cycles
          </p>
        </div>

        {/* Dynamic Annualized Carry Rate Indicator & Toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Annualized Contango Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#142A23] border border-[#285D49] text-xs font-mono font-medium text-[#45BD91]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{annualizedContango}% Annualized Contango</span>
          </div>

          {/* Raw vs Roll-Down Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-[#2D3237] bg-[#111316] p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setCurveMode("raw")}
              className={`px-3 py-1 rounded font-medium transition-colors duration-150 cursor-pointer ${
                curveMode === "raw"
                  ? "bg-[#D8D0C0] text-[#17191B]"
                  : "text-[#858D97] hover:text-[#F1EEE7] hover:bg-[#1D2023]"
              }`}
            >
              Raw Settlement
            </button>
            <button
              type="button"
              onClick={() => setCurveMode("rollDown")}
              className={`px-3 py-1 rounded font-medium transition-colors duration-150 cursor-pointer ${
                curveMode === "rollDown"
                  ? "bg-[#D8D0C0] text-[#17191B]"
                  : "text-[#858D97] hover:text-[#F1EEE7] hover:bg-[#1D2023]"
              }`}
            >
              Roll-Down Adjusted
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="ivoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F1EEE7" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#F1EEE7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="coolGrayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B0B5BC" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#B0B5BC" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#25292E" vertical={false} />
            <XAxis
              dataKey="expiryDate"
              stroke="#2D3237"
              tick={{ fill: "#858D97", fontSize: 11, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#25292E" }}
            />
            <YAxis
              domain={["dataMin - 15", "dataMax + 15"]}
              stroke="#2D3237"
              tick={{ fill: "#858D97", fontSize: 11, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#25292E" }}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={curveMode === "raw" ? "rawPpg" : "rollDownAdjustedPpg"}
              stroke={curveMode === "raw" ? "#F1EEE7" : "#B0B5BC"}
              strokeWidth={2}
              fillOpacity={1}
              fill={curveMode === "raw" ? "url(#ivoryGradient)" : "url(#coolGrayGradient)"}
              name={curveMode === "raw" ? "Raw Settlement PPG" : "Roll-Down Adjusted PPG"}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Curve Interpretation Explainer */}
      <div className="mt-4 pt-3 border-t border-[#25292E] grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono text-[#858D97]">
        <div className="flex items-start gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F1EEE7] mt-1 shrink-0" />
          <span>
            <strong className="text-[#F1EEE7]">Raw Settlement Curve:</strong> Reflects nominal MCX price per pure gram including calendar carrying costs (financing & vaulting storage).
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="h-2 w-2 rounded-full bg-[#B0B5BC] mt-1 shrink-0" />
          <span>
            <strong className="text-[#F1EEE7]">Roll-Down Adjusted Curve:</strong> Strips out the +5.25% annualized contango carry rate (financing & vaulting storage) to isolate true structural cross-contract basis mispricings.
          </span>
        </div>
      </div>
    </div>
  );
}
