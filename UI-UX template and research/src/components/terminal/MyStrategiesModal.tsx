"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Folder, Play, Plus, Trash2, BookmarkPlus } from "lucide-react";
import { BacktestParams } from "@/types/terminal";

interface StrategyPreset {
  id: string;
  name: string;
  tagline: string;
  category: "Scalping" | "Statistical Arb" | "Institutional" | "DMA";
  params: BacktestParams;
  historicalSharpe?: number;
  winRate?: string;
  annualizedRoi?: string;
  description: string;
}

const STORAGE_KEY = "swarnanet_saved_strategies";

interface MyStrategiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentParams: BacktestParams;
  onApplyParams: (params: BacktestParams) => void;
}

export function MyStrategiesModal({
  isOpen,
  onClose,
  currentParams,
  onApplyParams,
}: MyStrategiesModalProps) {
  const [presets, setPresets] = useState<StrategyPreset[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newStrategyName, setNewStrategyName] = useState("");
  const [newStrategyDesc, setNewStrategyDesc] = useState("");
  const [newStrategyCategory, setNewStrategyCategory] = useState<StrategyPreset["category"]>("Statistical Arb");

  // Load from local storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPresets(JSON.parse(stored));
      } else {
        setPresets([]);
      }
    } catch {
      setPresets([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = (preset: StrategyPreset) => {
    setSelectedId(preset.id);
    onApplyParams(preset.params);
    setAppliedToast(`Applied "${preset.name}" into terminal state!`);
    setTimeout(() => {
      setAppliedToast(null);
    }, 2500);
  };

  const handleSaveCurrentParams = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newStrategyName.trim() || `Strategy Config ${presets.length + 1}`;
    const newPreset: StrategyPreset = {
      id: `strat_${Date.now()}`,
      name,
      tagline: `Calibrated with ${currentParams.slippageDepthBps}bps slippage & ${currentParams.roundTripFrictionBps}bps friction`,
      category: newStrategyCategory,
      params: { ...currentParams },
      description: newStrategyDesc.trim() || "Custom trading desk parameters configured via live terminal.",
    };

    const updated = [newPreset, ...presets];
    setPresets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setNewStrategyName("");
    setNewStrategyDesc("");
    setIsCreating(false);
    setAppliedToast(`Strategy "${name}" saved!`);
    setTimeout(() => setAppliedToast(null), 2500);
  };

  const handleDeletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101113]/85 transition-all duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-xl bg-[#181A1D] border border-[#34383D] shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#25292E]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#222831] border border-[#34383D] text-[#D6D0C4]">
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-sans font-semibold text-[#F2F0EA]">Strategy Presets & Configurations</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#222831] text-[#AEB4BD] border border-[#34383D] uppercase">
                  Institutional
                </span>
              </div>
              <p className="text-xs font-mono text-[#9299A3] mt-0.5">
                Load calibrated parameter sets into the Backtest & Friction Execution engine
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111316] text-[#9299A3] hover:text-[#F2F0EA] hover:bg-[#24282D] transition-colors border border-[#292D32]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Toast confirmation */}
        {appliedToast && (
          <div className="mt-3 p-2.5 rounded-lg bg-[#142A23] border border-[#285D49] text-[#48B58A] text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#48B58A]" />
              <span>{appliedToast}</span>
            </div>
            <span className="text-[10px] text-[#48B58A] font-bold uppercase">LIVE SYNCED</span>
          </div>
        )}

        {/* Save New Strategy Form */}
        {isCreating && (
          <form onSubmit={handleSaveCurrentParams} className="mt-4 p-4 rounded-xl bg-[#141619] border border-[#2D3237] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#25292E]">
              <span className="text-xs font-mono font-bold text-[#F1EEE7]">Save Current Terminal Parameters</span>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-[#858D97] hover:text-[#F1EEE7]"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-[#858D97] block mb-1">Strategy Name</label>
                <input
                  type="text"
                  value={newStrategyName}
                  onChange={(e) => setNewStrategyName(e.target.value)}
                  placeholder="e.g. Carry Basis Momentum"
                  className="w-full rounded-lg bg-[#111316] border border-[#292D32] px-3 py-1.5 text-xs font-mono text-[#F1EEE7] focus:border-[#8EA8C5] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-[#858D97] block mb-1">Category</label>
                <select
                  value={newStrategyCategory}
                  onChange={(e) => setNewStrategyCategory(e.target.value as StrategyPreset["category"])}
                  className="w-full rounded-lg bg-[#111316] border border-[#292D32] px-3 py-1.5 text-xs font-mono text-[#F1EEE7] focus:border-[#8EA8C5] focus:outline-none"
                >
                  <option value="Statistical Arb">Statistical Arb</option>
                  <option value="Scalping">Scalping</option>
                  <option value="Institutional">Institutional</option>
                  <option value="DMA">DMA</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-mono text-[#858D97] block mb-1">Description (Optional)</label>
              <input
                type="text"
                value={newStrategyDesc}
                onChange={(e) => setNewStrategyDesc(e.target.value)}
                placeholder="Enter strategy notes or execution rationale"
                className="w-full rounded-lg bg-[#111316] border border-[#292D32] px-3 py-1.5 text-xs font-mono text-[#F1EEE7] focus:border-[#8EA8C5] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#D6D0C4] text-[#17191C] hover:bg-[#E5E0D6] text-xs font-mono font-semibold transition-colors"
              >
                Save Strategy
              </button>
            </div>
          </form>
        )}

        {/* Presets List or Clean Empty State */}
        <div className="mt-4 space-y-3 overflow-y-auto pr-1 flex-1">
          {presets.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-[#292D32] bg-[#141619]/40 flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-xl bg-[#1C1F22] border border-[#2D3237] flex items-center justify-center text-[#858D97] mb-3">
                <BookmarkPlus className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-sans font-semibold text-[#F1EEE7]">No Saved Strategies Yet</h4>
              <p className="text-xs text-[#858D97] font-mono mt-1 max-w-md">
                Configure your calibrated slippage depth, round-trip friction, and Z-scores, then save them as a reusable desk preset.
              </p>
              {!isCreating && (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#222831] hover:bg-[#2A313C] text-[#F1EEE7] border border-[#34383D] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Save Current Parameters</span>
                </button>
              )}
            </div>
          ) : (
            presets.map((preset) => {
              const isSelected = selectedId === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#24282D] border-[#8995A3]"
                      : "bg-[#1C1F22] border-[#292D32] hover:border-[#34383D] hover:bg-[#222529]"
                  }`}
                  onClick={() => setSelectedId(preset.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-sans font-semibold text-[#F2F0EA]">{preset.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#141619] text-[#AEB4BD] border border-[#25292E]">
                          {preset.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#9299A3] font-mono mt-1">{preset.description}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(preset);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#D6D0C4] text-[#17191C] hover:bg-[#E5E0D6]"
                            : "bg-[#111316] text-[#F2F0EA] hover:bg-[#24282D] border border-[#292D32]"
                        }`}
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Apply Preset</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePreset(preset.id);
                        }}
                        className="p-1.5 rounded-lg text-[#858D97] hover:text-[#E47777] hover:bg-[#301C1E] transition-colors"
                        title="Delete preset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quantitative Parameters */}
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#25292E] text-xs font-mono">
                    <div className="p-2 rounded bg-[#141619] border border-[#25292E]">
                      <span className="text-[10px] text-[#686F79] block">SLIPPAGE</span>
                      <span className="text-[#AEB4BD] font-semibold">{preset.params.slippageDepthBps} bps</span>
                    </div>
                    <div className="p-2 rounded bg-[#141619] border border-[#25292E]">
                      <span className="text-[10px] text-[#686F79] block">HURDLE</span>
                      <span className="text-[#F2F0EA] font-semibold">{preset.params.roundTripFrictionBps} bps</span>
                    </div>
                    <div className="p-2 rounded bg-[#141619] border border-[#25292E]">
                      <span className="text-[10px] text-[#686F79] block">ENTRY Z</span>
                      <span className="text-[#D6D0C4] font-semibold">±{preset.params.entryZScore}σ</span>
                    </div>
                    <div className="p-2 rounded bg-[#141619] border border-[#25292E]">
                      <span className="text-[10px] text-[#686F79] block">ALLOCATION</span>
                      <span className="text-[#45BD91] font-semibold">₹{preset.params.capitalAllocatedLakhs}L</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info & Actions */}
        <div className="mt-4 pt-3 border-t border-[#25292E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#686F79]">
          <div className="flex items-center gap-3">
            <span>Active Capital Allocation: ₹{currentParams.capitalAllocatedLakhs} Lakhs</span>
            {!isCreating && presets.length > 0 && (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="text-[#D6D0C4] hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="h-3 w-3" />
                <span>Save New Preset</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#111316] text-[#F2F0EA] hover:bg-[#24282D] text-xs font-mono font-medium border border-[#292D32] hover:border-[#8995A3] transition-colors cursor-pointer self-end sm:self-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

