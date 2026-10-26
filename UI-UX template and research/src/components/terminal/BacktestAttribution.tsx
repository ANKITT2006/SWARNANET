"use client";

import React, { useState, useMemo } from "react";
import {
  Sliders,
  ShieldAlert,
  Percent,
  TrendingUp,
  Activity,
  Award,
  AlertTriangle,
  RotateCcw,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BacktestParams } from "@/types/terminal";
import { runWalkForwardBacktest } from "@/lib/swarnanetEngine";

interface BacktestAttributionProps {
  onParamsChange?: (params: BacktestParams) => void;
}

export function BacktestAttribution({ onParamsChange }: BacktestAttributionProps) {
  const [params, setParams] = useState<BacktestParams>({
    slippageDepthBps: 5, // 0.05%
    roundTripFrictionBps: 14, // 14 bps
    entryZScore: 1.8,
    exitZScore: 0.4,
    capitalAllocatedLakhs: 50,
  });

  const { attribution, equityCurve } = useMemo(() => {
    return runWalkForwardBacktest(params);
  }, [params]);

  const handleSliderChange = (key: keyof BacktestParams, val: number) => {
    const updated = { ...params, [key]: val };
    setParams(updated);
    if (onParamsChange) onParamsChange(updated);
  };

  const handleResetDefaults = () => {
    const defaults: BacktestParams = {
      slippageDepthBps: 5,
      roundTripFrictionBps: 14,
      entryZScore: 1.8,
      exitZScore: 0.4,
      capitalAllocatedLakhs: 50,
    };
    setParams(defaults);
    if (onParamsChange) onParamsChange(defaults);
  };

  return (
    <div className="bg-[#181A1D] border border-[#34383D] rounded-xl p-5 shadow-sm">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#25292E]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold font-mono tracking-wider text-[#F2F0EA] uppercase">
              Walk-Forward Backtester & Attribution Engine
            </h2>
            <span className="px-2 py-0.5 rounded bg-[#222831] border border-[#34383D] text-[10px] font-mono font-medium text-[#AEB4BD]">
              252-Day Out-of-Sample
            </span>
          </div>
          <p className="text-xs text-[#9299A3] font-mono mt-0.5">
            Real-time sensitivity analysis decomposing Alpha vs Beta vs Friction Drag
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111316] hover:bg-[#24282D] text-xs font-mono text-[#F2F0EA] border border-[#292D32] hover:border-[#8995A3] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="h-3 w-3 text-[#D6D0C4]" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Discipline Warning Banner (Triggered when After-Cost Sharpe < 0.20) */}
      {attribution.isDisciplineViolation && (
        <div className="mb-5 p-4 rounded-xl border border-[#704044] bg-[#301C1E]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#E47777] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#E47777] tracking-wider uppercase">
                  Execution Hurdle Exceeds Theoretical Edge
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#E47777]/20 text-[#E47777] border border-[#E47777]/30">
                  DISCIPLINE VIOLATION
                </span>
              </div>
              <p className="text-xs font-mono text-[#B0B5BC]">
                Edge does not survive real-world execution friction. After-cost annualized Sharpe ratio ({attribution.sharpeRatio.toFixed(2)}) is below the institutional hurdle of 0.20.
              </p>
              <p className="text-[11px] font-mono text-[#E47777] font-semibold pt-0.5">
                Risk-Gate Decision: Model enforces zero capital deployment. Position sizing locked to protect capital.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Parameter Sliders + Performance Attribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Interactive Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-4 p-4 rounded-xl border border-[#2D3237] bg-[#141619] font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#25292E]">
            <span className="font-semibold text-[#F1EEE7] flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-[#D8D0C0]" />
              <span>Execution Parameter Sliders</span>
            </span>
            <span className="text-[10px] text-[#686F79]">Live Recalculation</span>
          </div>

          {/* Slider 1: Slippage Depth Penalty */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#9299A3]">Slippage Depth Penalty:</label>
              <span className="font-semibold text-[#E6E1D6]">
                {(params.slippageDepthBps / 100).toFixed(2)}% ({params.slippageDepthBps} bps)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={params.slippageDepthBps}
              onChange={(e) => handleSliderChange("slippageDepthBps", Number(e.target.value))}
              className="w-full h-1.5 bg-[#25292E] rounded-lg appearance-none cursor-pointer accent-[#D6D0C4]"
            />
            <div className="flex justify-between text-[10px] text-[#686F79] mt-0.5">
              <span>0.01% (Mini liquid)</span>
              <span>0.25% (Thin Petal)</span>
            </div>
          </div>

          {/* Slider 2: Round-Trip Brokerage & STT/CTT Friction */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#9299A3]">Round-Trip STT & Fee Hurdle:</label>
              <span className="font-semibold text-[#E6E1D6]">
                {params.roundTripFrictionBps} bps
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={25}
              step={1}
              value={params.roundTripFrictionBps}
              onChange={(e) => handleSliderChange("roundTripFrictionBps", Number(e.target.value))}
              className="w-full h-1.5 bg-[#25292E] rounded-lg appearance-none cursor-pointer accent-[#D6D0C4]"
            />
            <div className="flex justify-between text-[10px] text-[#686F79] mt-0.5">
              <span>5 bps (DMA Tier)</span>
              <span>25 bps (Retail broker)</span>
            </div>
          </div>

          {/* Slider 3: Entry Z-Score Threshold */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#9299A3]">Entry Threshold (Z-Score):</label>
              <span className="font-semibold text-[#E6E1D6]">
                ±{params.entryZScore.toFixed(1)}σ
              </span>
            </div>
            <input
              type="range"
              min={1.2}
              max={2.8}
              step={0.1}
              value={params.entryZScore}
              onChange={(e) => handleSliderChange("entryZScore", Number(e.target.value))}
              className="w-full h-1.5 bg-[#25292E] rounded-lg appearance-none cursor-pointer accent-[#D6D0C4]"
            />
            <div className="flex justify-between text-[10px] text-[#686F79] mt-0.5">
              <span>±1.2σ (Frequent)</span>
              <span>±2.8σ (Rare High Alpha)</span>
            </div>
          </div>

          {/* Summary Friction Hurdle */}
          <div className="pt-2 border-t border-[#25292E] flex items-center justify-between text-[11px]">
            <span className="text-[#9299A3]">Combined Friction Barrier:</span>
            <span className="font-semibold text-[#F2F0EA]">
              {(params.roundTripFrictionBps + params.slippageDepthBps * 2).toFixed(1)} bps
            </span>
          </div>
        </div>

        {/* Attribution Decomposition Breakdown (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 rounded-xl border border-[#292D32] bg-[#141619] font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#25292E]">
            <span className="font-semibold text-[#F2F0EA] flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-[#D6D0C4]" />
              <span>P&L Attribution & Risk Metrics</span>
            </span>
            <span className="text-[10px] text-[#48B58A] font-semibold">Out-Of-Sample Audited</span>
          </div>

          {/* Attribution Bars */}
          <div className="grid grid-cols-3 gap-2.5 my-3">
            <div className="p-3 rounded-lg bg-[#181A1C] border border-[#2D3237]">
              <span className="text-[10px] text-[#858D97] block uppercase">Strategy Alpha</span>
              <span className={`text-base font-bold tabular-nums ${attribution.strategyAlphaPct >= 0 ? "text-[#45BD91]" : "text-[#E47777]"}`}>
                {attribution.strategyAlphaPct >= 0 ? "+" : ""}{attribution.strategyAlphaPct}%
              </span>
              <span className="text-[9px] text-[#5E6570] block mt-0.5">Basis Convergence</span>
            </div>

            <div className="p-3 rounded-lg bg-[#181A1C] border border-[#2D3237]">
              <span className="text-[10px] text-[#858D97] block uppercase">Gold Beta Drift</span>
              <span className="text-base font-bold text-[#F1EEE7] tabular-nums">
                +{attribution.goldBenchmarkBetaPct}%
              </span>
              <span className="text-[9px] text-[#5E6570] block mt-0.5">MCX Benchmark</span>
            </div>

            <div className="p-3 rounded-lg bg-[#181A1C] border border-[#2D3237]">
              <span className="text-[10px] text-[#858D97] block uppercase">Friction Drag</span>
              <span className="text-base font-bold text-[#E47777] tabular-nums">
                -{attribution.frictionDragPct}%
              </span>
              <span className="text-[9px] text-[#5E6570] block mt-0.5">STT + Slippage</span>
            </div>
          </div>

          {/* Quant Metric Cards */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#2D3237] text-center">
            <div className="p-2 rounded bg-[#181A1C] border border-[#2D3237]">
              <span className="text-[9px] text-[#858D97] block uppercase">Sharpe Ratio</span>
              <span className={`text-sm font-bold ${attribution.sharpeRatio >= 0.20 ? "text-[#45BD91]" : "text-[#E47777]"}`}>
                {attribution.sharpeRatio.toFixed(2)}
              </span>
            </div>
            <div className="p-2 rounded bg-[#181A1C] border border-[#2D3237]">
              <span className="text-[9px] text-[#858D97] block uppercase">Sortino</span>
              <span className="text-sm font-bold text-[#B0B5BC]">
                {attribution.sortinoRatio.toFixed(2)}
              </span>
            </div>
            <div className="p-2 rounded bg-[#181A1C] border border-[#2D3237]">
              <span className="text-[9px] text-[#858D97] block uppercase">Max DD</span>
              <span className="text-sm font-bold text-[#E47777]">
                -{attribution.maxDrawdownPct}%
              </span>
            </div>
            <div className="p-2 rounded bg-[#181A1C] border border-[#2D3237]">
              <span className="text-[9px] text-[#858D97] block uppercase">Win Rate</span>
              <span className="text-sm font-bold text-[#F1EEE7]">
                {attribution.winRatePct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cumulative Strategy Equity Curve vs Benchmark */}
      <div className="pt-4 border-t border-[#25292E]">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="text-[#F2F0EA] font-semibold">
            Cumulative Strategy Equity vs MCX Gold Buy & Hold
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#48B58A]">
              <span className="h-2 w-2 rounded-full bg-[#48B58A]" />
              <span>Swarnanet Strategy (Net)</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#AEB4BD]">
              <span className="h-2 w-2 rounded-full bg-[#AEB4BD]" />
              <span>Benchmark Gold Buy & Hold</span>
            </span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityCurve} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#25292E" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#34383D"
                tick={{ fill: "#9299A3", fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={{ stroke: "#25292E" }}
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                stroke="#34383D"
                tick={{ fill: "#9299A3", fontSize: 10, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={{ stroke: "#25292E" }}
                tickFormatter={(v) => `${v.toFixed(0)}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-[#34383D] bg-[#181A1D] p-2.5 text-xs font-mono text-[#F2F0EA] shadow-xl">
                        <div className="font-semibold text-[#9299A3] mb-1">{label}</div>
                        <div className="text-[#48B58A]">
                          Strategy Equity: {Number(payload[0]?.value).toFixed(2)}
                        </div>
                        <div className="text-[#AEB4BD]">
                          Benchmark Gold: {Number(payload[1]?.value).toFixed(2)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="strategyEquity"
                stroke="#48B58A"
                strokeWidth={2}
                dot={false}
                name="Strategy Equity"
              />
              <Line
                type="monotone"
                dataKey="benchmarkGold"
                stroke="#AEB4BD"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                name="Benchmark Gold"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
