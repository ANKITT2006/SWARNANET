"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronRight,
} from "lucide-react";
import { McxContractQuote } from "@/types/terminal";
import { ContractInspectorModal } from "./ContractInspectorModal";

interface RelativeValueGridProps {
  contracts: McxContractQuote[];
}

export function RelativeValueGrid({ contracts }: RelativeValueGridProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [inspectContract, setInspectContract] = useState<McxContractQuote | null>(null);

  const filteredContracts = contracts.filter((c) => {
    const matchesSymbol = selectedSymbol === "ALL" || c.symbol === selectedSymbol;
    const matchesSearch =
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.expiryDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contractName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSymbol && matchesSearch;
  });

  return (
    <>
      <div className="bg-[#181A1C] rounded-xl p-5 sm:p-6 border border-[#2D3237] shadow-sm transition-colors">
        {/* Module Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5 pb-4 border-b border-[#2D3237]">
          {/* Title & Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-sm sm:text-base font-bold font-mono tracking-tight text-[#F1EEE7] uppercase">
                Cross-Contract Relative Value Grid
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-[#1D2023] border border-[#2D3237] text-[10px] font-mono font-medium text-[#B0B5BC]">
                0.999 vs 0.995 Fine Normalization
              </span>
            </div>
            <p className="text-xs text-[#858D97] font-mono mt-1 font-medium">
              Tracking MCX 4 Core Gold Contracts • Par Ratio: 1.00402 • Click any row for mathematical derivation
            </p>
          </div>

          {/* Right Controls: Filter Pills & Search */}
          <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 rounded-lg border border-[#2D3237] bg-[#111316] p-1">
              {(["ALL", "GOLDM", "GOLDTEN", "GOLDGUINEA", "GOLDPETAL"] as const).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setSelectedSymbol(sym)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                    selectedSymbol === sym
                      ? "bg-[#D8D0C0] text-[#17191B] font-bold"
                      : "text-[#858D97] hover:text-[#F1EEE7] hover:bg-[#1D2023]"
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#858D97]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search expiry..."
                className="bg-[#111316] border border-[#2D3237] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F1EEE7] font-mono placeholder-[#858D97] w-full sm:w-56 focus:outline-none focus:border-[#8EA8C5] focus:ring-1 focus:ring-[#8EA8C5]"
              />
            </div>
          </div>
        </div>

        {/* Relative Value Table Scroll Container (Sticky thead locks in view) */}
        <div className="max-h-[520px] overflow-y-auto overflow-x-auto rounded-lg border border-[#2D3237] bg-[#141619]">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="terminal-sticky-thead">
              <tr className="text-[#858D97] uppercase tracking-wider text-[11px] border-b border-[#2D3237]">
                <th className="py-3 px-3.5 font-semibold bg-[#141619]">Symbol & Contract</th>
                <th className="py-3 px-3 font-semibold bg-[#141619]">Expiry Date & Lifecycle</th>
                <th className="py-3 px-3 font-semibold bg-[#141619] text-right">Quote Base</th>
                <th className="py-3 px-3 font-semibold bg-[#141619] text-center">Purity</th>
                <th className="py-3 px-3 font-semibold text-right bg-[#141619]">Settlement Price</th>
                <th className="py-3 px-3.5 font-semibold text-right text-[#F1EEE7] bg-[#141619]">
                  Normalized PPG (₹/g)
                </th>
                <th className="py-3 px-3 font-semibold text-right bg-[#141619]">Par (₹/g)</th>
                <th className="py-3 px-3.5 font-semibold text-right bg-[#141619]">Disparity (bps)</th>
                <th className="py-3 px-3 font-semibold text-center bg-[#141619]">Liquidity</th>
                <th className="py-3 px-3 font-semibold text-right bg-[#141619]">Slippage</th>
                <th className="py-3 px-3.5 font-semibold text-center bg-[#141619]">Verdict</th>
                <th className="py-3 px-2 font-semibold text-center bg-[#141619]">[fx] Math</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-[#858D97] font-mono text-xs">
                    <p className="font-semibold text-[#B0B5BC]">No contract quotes available</p>
                    <p className="text-[11px] text-[#5E6570] mt-1">Connect market data stream or adjust active symbol filter.</p>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((c, idx) => {
                  const isAlt = idx % 2 === 1;
                return (
                  <tr
                    key={`${c.symbol}-${c.expiryDate}`}
                    onClick={() => setInspectContract(c)}
                    className={`transition-colors cursor-pointer border-b border-[#2D3237] ${
                      isAlt ? "bg-[#141619]" : "bg-[#181A1C]"
                    } hover:bg-[#1D2023]`}
                  >
                    {/* Symbol & Name */}
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-[#F1EEE7] flex items-center gap-1.5">
                        <span>{c.symbol}</span>
                      </div>
                      <div className="text-[10px] text-[#858D97] truncate max-w-[140px]">
                        {c.contractName}
                      </div>
                    </td>

                    {/* Expiry Date & Physical Delivery Tender Warning */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#1C1F22] border border-[#34383D] text-[11px] font-medium text-[#C4C7CC]">
                          {c.expiryDate}
                        </span>
                      </div>
                      <div className="mt-1">
                        {c.daysToExpiry <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#301C1E] text-[#E07878] border border-[#704044] text-[9px] font-bold">
                            <span>⚠️ TENDER ACTIVE (Physical Delivery Risk)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#48B58A] font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#48B58A]" />
                            <span>{c.daysToExpiry}d left</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quote Base */}
                    <td className="py-3 px-3 text-right text-[#C4C7CC] tabular-nums">
                      {c.quotationBaseGrams}g
                    </td>

                    {/* Purity Grade */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          c.purity === 999
                            ? "bg-[#222831] text-[#E6E1D6] border border-[#34383D]"
                            : "bg-[#1C1F22] text-[#C4C7CC] border border-[#292D32]"
                        }`}
                      >
                        {c.purity} Fine
                      </span>
                    </td>

                    {/* Settlement Price */}
                    <td className="py-3 px-3 text-right font-medium text-[#F2F0EA] tabular-nums">
                      ₹{c.settlementPrice.toLocaleString("en-IN")}
                      <div className={`text-[10px] font-medium ${c.changePct >= 0 ? "text-[#48B58A]" : "text-[#E07878]"}`}>
                        {c.changePct >= 0 ? "+" : ""}{c.changePct}%
                      </div>
                    </td>

                    {/* Normalized PPG */}
                    <td className="py-3 px-3.5 text-right font-bold text-[#E6E1D6] text-sm tabular-nums">
                      ₹{c.normalizedPpg.toFixed(2)}
                    </td>

                    {/* Theoretical Par */}
                    <td className="py-3 px-3 text-right text-[#C4C7CC] tabular-nums">
                      ₹{c.theoreticalParPpg.toFixed(2)}
                    </td>

                    {/* Disparity Spread */}
                    <td className="py-3 px-3.5 text-right tabular-nums">
                      <span
                        className={`font-bold ${
                          c.disparitySpreadBps > 0
                            ? "text-[#E07878]"
                            : c.disparitySpreadBps < 0
                            ? "text-[#48B58A]"
                            : "text-[#9299A3]"
                        }`}
                      >
                        {c.disparitySpreadBps > 0 ? "+" : ""}
                        {c.disparitySpreadBps} bps
                      </span>
                      <div className="text-[10px] text-[#9299A3]">
                        {c.disparitySpreadInr > 0 ? "+" : ""}₹{c.disparitySpreadInr.toFixed(2)}/g
                      </div>
                    </td>

                    {/* Liquidity Tier */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          c.liquidityTier === "High"
                            ? "bg-[#142A23] text-[#48B58A] border border-[#285D49]"
                            : c.liquidityTier === "Med"
                            ? "bg-[#222831] text-[#AEB8C5] border border-[#414750]"
                            : "bg-[#301C1E] text-[#E07878] border border-[#704044]"
                        }`}
                      >
                        {c.liquidityTier}
                      </span>
                    </td>

                    {/* Estimated Slippage Drag */}
                    <td className="py-3 px-3 text-right text-[#9299A3] tabular-nums">
                      {c.estimatedSlippageBps} bps
                    </td>

                    {/* Executable Verdict */}
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider ${
                          c.verdict === "CHEAP / LONG"
                            ? "bg-[#142A23] text-[#48B58A] border border-[#285D49]"
                            : c.verdict === "EXPENSIVE / SHORT"
                            ? "bg-[#301C1E] text-[#E07878] border border-[#704044]"
                            : "bg-[#222831] text-[#C4C7CC] border border-[#414750]"
                        }`}
                      >
                        {c.verdict}
                      </span>
                    </td>

                    {/* Feature D: Math [fx] Trigger */}
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectContract(c);
                        }}
                        className="px-2 py-1 rounded bg-[#1C1F22] hover:bg-[#24282D] text-[#D6D0C4] hover:text-[#F2F0EA] border border-[#34383D] hover:border-[#4A5058] transition-colors font-mono text-[10px] font-medium flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        title="Click to view step-by-step arithmetic derivation"
                      >
                        <span>[fx]</span>
                        <ChevronRight className="h-3 w-3 inline-block" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>

        {/* Table Footnote */}
        <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[#9299A3]">
          <span>
            * Par Ratio: 999 / 995 ≈ 1.00402 (~0.402% natural structural purity premium).
          </span>
          <span className="text-[#D6D0C4] flex items-center gap-1 font-medium">
            <span>Click any row or [fx] button to trigger interactive mathematical derivation modal</span>
          </span>
        </div>
      </div>

      {/* Inspector Modal */}
      <ContractInspectorModal
        contract={inspectContract}
        onClose={() => setInspectContract(null)}
      />
    </>
  );
}
