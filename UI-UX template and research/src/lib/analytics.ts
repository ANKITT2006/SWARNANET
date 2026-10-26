export interface AnalyticsSummary {
  total_revenue: number;
  active_shops: number;
  total_transactions: number;
  average_order_value: number;
  return_rate_pct: number;
  yoy_growth_pct: number;
  mom_growth_pct: number;
}

export interface MonthlySalesPoint {
  month: string;
  sales: number;
  is_prediction?: boolean;
  lower_bound?: number;
  upper_bound?: number;
}

export interface StateDistribution {
  state_code: string;
  state_name: string;
  revenue: number;
  orders: number;
  share_pct: number;
}

export interface ShopLeaderboardItem {
  shop_id: string;
  shop_name: string;
  gstin: string;
  state_code: string;
  state_name: string;
  category: string;
  revenue: number;
  orders: number;
  return_rate_pct: number;
  performance_score: number;
}

export const INDIAN_STATE_MAP: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi NCR",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra & Nagar Haveli and Daman & Diu",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
};

export const SAMPLE_GEO_DISTRIBUTION: StateDistribution[] = [
  { state_code: "27", state_name: "Maharashtra", revenue: 84500000, orders: 48200, share_pct: 19.8 },
  { state_code: "29", state_name: "Karnataka", revenue: 62100000, orders: 36500, share_pct: 14.5 },
  { state_code: "07", state_name: "Delhi NCR", revenue: 51200000, orders: 31000, share_pct: 12.0 },
  { state_code: "33", state_name: "Tamil Nadu", revenue: 44800000, orders: 28400, share_pct: 10.5 },
  { state_code: "24", state_name: "Gujarat", revenue: 39200000, orders: 24900, share_pct: 9.2 },
  { state_code: "09", state_name: "Uttar Pradesh", revenue: 35100000, orders: 23100, share_pct: 8.2 },
  { state_code: "36", state_name: "Telangana", revenue: 29800000, orders: 19200, share_pct: 7.0 },
  { state_code: "19", state_name: "West Bengal", revenue: 24500000, orders: 16800, share_pct: 5.7 },
  { state_code: "08", state_name: "Rajasthan", revenue: 20100000, orders: 13900, share_pct: 4.7 },
  { state_code: "32", state_name: "Kerala", revenue: 18700000, orders: 12400, share_pct: 4.4 },
];

export const SAMPLE_SHOPS: ShopLeaderboardItem[] = [
  { shop_id: "shop_01", shop_name: "Mumbai Super Mart", gstin: "27AAACB2468R1Z1", state_code: "27", state_name: "Maharashtra", category: "FMCG & Grocery", revenue: 14500000, orders: 8200, return_rate_pct: 1.2, performance_score: 98 },
  { shop_id: "shop_02", shop_name: "Bengaluru Tech Hub", gstin: "29BBBCD3579S1Z2", state_code: "29", state_name: "Karnataka", category: "Electronics", revenue: 12800000, orders: 5400, return_rate_pct: 2.1, performance_score: 95 },
  { shop_id: "shop_03", shop_name: "Delhi Central Traders", gstin: "07CCCCE4680T1Z3", state_code: "07", state_name: "Delhi NCR", category: "Apparel & Fashion", revenue: 9900000, orders: 6100, return_rate_pct: 2.8, performance_score: 93 },
  { shop_id: "shop_04", shop_name: "Chennai Mega Store", gstin: "33DDDDF5791U1Z4", state_code: "33", state_name: "Tamil Nadu", category: "Quick Commerce", revenue: 8600000, orders: 7300, return_rate_pct: 1.5, performance_score: 91 },
  { shop_id: "shop_05", shop_name: "Ahmedabad Textiles Emporium", gstin: "24EEEEF6802V1Z5", state_code: "24", state_name: "Gujarat", category: "Apparel & Fashion", revenue: 7800000, orders: 4900, return_rate_pct: 1.8, performance_score: 90 },
  { shop_id: "shop_06", shop_name: "Lucknow Gourmet House", gstin: "09FFFFG7913W1Z6", state_code: "09", state_name: "Uttar Pradesh", category: "Dining & Cafes", revenue: 6400000, orders: 5100, return_rate_pct: 1.1, performance_score: 89 },
  { shop_id: "shop_07", shop_name: "Hyderabad Smart Foods", gstin: "36GGGGH8024X1Z7", state_code: "36", state_name: "Telangana", category: "FMCG & Grocery", revenue: 5900000, orders: 4200, return_rate_pct: 1.7, performance_score: 87 },
  { shop_id: "shop_08", shop_name: "Kolkata Craft Haven", gstin: "19HHHHJ9135Y1Z8", state_code: "19", state_name: "West Bengal", category: "Apparel & Fashion", revenue: 5100000, orders: 3800, return_rate_pct: 2.0, performance_score: 85 },
];

export function getMockAnalytics(selectedState = "ALL", dateRange = "2y") {
  const isAll = !selectedState || selectedState === "ALL";
  const stateName = isAll ? "All India" : INDIAN_STATE_MAP[selectedState] || selectedState;
  const rangeMultiplier = dateRange === "30d" ? 0.1 : dateRange === "6m" ? 0.5 : dateRange === "1y" ? 0.8 : 1;
  const multiplier = (isAll ? 1 : 0.12) * rangeMultiplier;

  const summary: AnalyticsSummary = {
    total_revenue: Math.round(428000000 * multiplier),
    active_shops: isAll ? 78 : 6,
    total_transactions: Math.round(285400 * multiplier),
    average_order_value: 1499,
    return_rate_pct: 1.8,
    yoy_growth_pct: 18.4,
    mom_growth_pct: 4.2,
  };

  const months = [
    "Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024",
    "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024",
    "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
    "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025",
  ];

  const monthly: MonthlySalesPoint[] = months.map((month, idx) => {
    const base = 28000000 + idx * 750000;
    const wave = Math.sin(idx / 2) * 3500000;
    return {
      month,
      sales: Math.round((base + wave) * multiplier),
    };
  });

  const geoDistribution = SAMPLE_GEO_DISTRIBUTION;
  const leaderboard = isAll
    ? SAMPLE_SHOPS
    : SAMPLE_SHOPS.filter((s) => s.state_code === selectedState).length > 0
    ? SAMPLE_SHOPS.filter((s) => s.state_code === selectedState)
    : SAMPLE_SHOPS.slice(0, 3);

  return {
    summary,
    monthly,
    geoDistribution,
    leaderboard,
    regionName: stateName,
  };
}
