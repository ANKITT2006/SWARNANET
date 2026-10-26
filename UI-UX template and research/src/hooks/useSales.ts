"use client";

import { useEffect, useState } from "react";
import type { SalesApiResponse, SalesYear, SalesRecord, MonthName } from "@/types/sales";

interface UseSalesResult {
  data: SalesApiResponse | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const MONTH_NAMES: MonthName[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function useSales(year: SalesYear): UseSalesResult {
  const [data, setData] = useState<SalesApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const baseSales = year === 2024 ? 3200000 : year === 2023 ? 2700000 : 2100000;
    const records: SalesRecord[] = MONTH_NAMES.map((month, idx) => ({
      year,
      month,
      sales: Math.round(baseSales + Math.sin(idx) * 450000 + idx * 80000),
    }));

    const prevYear = (year > 2022 ? (year - 1) : 2022) as SalesYear;
    const prevRecords: SalesRecord[] = MONTH_NAMES.map((month, idx) => ({
      year: prevYear,
      month,
      sales: Math.round(baseSales * 0.86 + Math.sin(idx) * 350000),
    }));

    const totalSales = records.reduce((acc, r) => acc + r.sales, 0);
    const sorted = [...records].sort((a, b) => b.sales - a.sales);
    const prevTotal = prevRecords.reduce((acc, r) => acc + r.sales, 0);

    setData({
      year,
      data: records,
      summary: {
        totalSales,
        averageMonthlySales: Math.round(totalSales / 12),
        highestMonth: sorted[0],
        lowestMonth: sorted[sorted.length - 1],
      },
      previousYear: {
        year: prevYear,
        data: prevRecords,
      },
      comparison: [
        {
          year,
          totalSales,
          averageMonthlySales: Math.round(totalSales / 12),
        },
        {
          year: prevYear,
          totalSales: prevTotal,
          averageMonthlySales: Math.round(prevTotal / 12),
        },
      ],
    });
    setIsLoading(false);
  }, [year, reloadToken]);

  return {
    data,
    isLoading,
    error,
    retry: () => setReloadToken((prev: number) => prev + 1),
  };
}
