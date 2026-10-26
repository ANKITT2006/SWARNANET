"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AnalyticsSummary,
  MonthlySalesPoint,
  StateDistribution,
  ShopLeaderboardItem,
  getMockAnalytics,
} from "@/lib/analytics";

export interface AnalyticsState {
  summary: AnalyticsSummary | null;
  monthly: MonthlySalesPoint[];
  geoDistribution: StateDistribution[];
  leaderboard: ShopLeaderboardItem[];
  regionName: string;
  isLoading: boolean;
  isLiveUpdating: boolean;
  error: string | null;
}

export function useAnalytics(selectedState = "ALL", dateRange = "2y") {
  const [state, setState] = useState<AnalyticsState>({
    summary: null,
    monthly: [],
    geoDistribution: [],
    leaderboard: [],
    regionName: "All India",
    isLoading: true,
    isLiveUpdating: false,
    error: null,
  });

  const [refreshIndex, setRefreshIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefreshIndex((prev: number) => prev + 1);
  }, []);

  useEffect(() => {
    const mockData = getMockAnalytics(selectedState, dateRange);
    setState((prev: AnalyticsState) => ({
      ...prev,
      summary: mockData.summary,
      monthly: mockData.monthly,
      geoDistribution: mockData.geoDistribution,
      leaderboard: mockData.leaderboard,
      regionName: mockData.regionName,
      isLoading: false,
      error: null,
    }));
  }, [selectedState, dateRange, refreshIndex]);

  // Subtle simulated pulse every 8 seconds for dashboard vitality
  useEffect(() => {
    const pulse = setInterval(() => {
      setState((prev: AnalyticsState) => {
        if (!prev.summary) return prev;
        const randomShift = (Math.random() - 0.45) * 1500;
        return {
          ...prev,
          isLiveUpdating: true,
          summary: {
            ...prev.summary,
            total_revenue: Math.round(prev.summary.total_revenue + randomShift),
            total_transactions: prev.summary.total_transactions + (Math.random() > 0.5 ? 1 : 0),
          },
        };
      });

      setTimeout(() => {
        setState((prev: AnalyticsState) => ({ ...prev, isLiveUpdating: false }));
      }, 1200);
    }, 8000);

    return () => clearInterval(pulse);
  }, []);

  return { ...state, refetch };
}
