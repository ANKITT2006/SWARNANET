/**
 * Pure Frontend All-India Transaction Engine Mock & State Stream
 * Lightweight in-memory simulator for all 28 Indian States & 8 Union Territories
 * Zero backend, zero external database, fully client-side reactive.
 */

export type IndianRegion = "North" | "South" | "West" | "East" | "Central" | "North-East";

export interface IndianStateMeta {
  code: string;
  name: string;
  gstCode: string;
  region: IndianRegion;
  weight: number;
  tierCities: string[];
}

export type PaymentGatewayType = "Razorpay" | "GooglePay" | "PhonePe" | "Cashfree" | "PayU" | "DirectUPI";

export interface NationalTransaction {
  transaction_id: string;
  timestamp: string;
  amount_inr: number;
  method: string;
  payment_provider: string;
  gateway?: PaymentGatewayType;
  state_code: string;
  state_name: string;
  city: string;
  category: "FMCG & Grocery" | "Quick Commerce" | "Electronics" | "Apparel & Fashion" | "Dining & Cafes";
  customer_name: string;
  is_verified: boolean;
  is_verified_razorpay: boolean;
  verification_badge?: string;
  shop_id: string;
  shop_name?: string;
  shop_gstin?: string;
}

export interface StateMetrics {
  state_code: string;
  state_name: string;
  region: IndianRegion;
  total_volume_inr: number;
  transaction_count: number;
  average_order_value: number;
  top_city: string;
  top_category: string;
  share_pct: number;
}

export const ALL_INDIAN_STATES: IndianStateMeta[] = [
  { code: "MH", name: "Maharashtra", gstCode: "27", region: "West", weight: 18, tierCities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane"] },
  { code: "KA", name: "Karnataka", gstCode: "29", region: "South", weight: 14, tierCities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"] },
  { code: "DL", name: "Delhi NCR", gstCode: "07", region: "North", weight: 11, tierCities: ["New Delhi", "South Delhi", "Dwarka", "Rohini", "Connaught Place"] },
  { code: "TN", name: "Tamil Nadu", gstCode: "33", region: "South", weight: 10, tierCities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"] },
  { code: "GJ", name: "Gujarat", gstCode: "24", region: "West", weight: 9, tierCities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"] },
  { code: "UP", name: "Uttar Pradesh", gstCode: "09", region: "North", weight: 8, tierCities: ["Noida", "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj"] },
  { code: "TG", name: "Telangana", gstCode: "36", region: "South", weight: 6.5, tierCities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"] },
  { code: "WB", name: "West Bengal", gstCode: "19", region: "East", weight: 5.0, tierCities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"] },
  { code: "RJ", name: "Rajasthan", gstCode: "08", region: "West", weight: 4.5, tierCities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"] },
  { code: "KL", name: "Kerala", gstCode: "32", region: "South", weight: 4.0, tierCities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"] },
  { code: "MP", name: "Madhya Pradesh", gstCode: "23", region: "Central", weight: 3.5, tierCities: ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain"] },
  { code: "AP", name: "Andhra Pradesh", gstCode: "37", region: "South", weight: 3.0, tierCities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"] },
  { code: "PB", name: "Punjab", gstCode: "03", region: "North", weight: 2.5, tierCities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"] },
  { code: "HR", name: "Haryana", gstCode: "06", region: "North", weight: 2.8, tierCities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"] },
  { code: "BR", name: "Bihar", gstCode: "10", region: "East", weight: 2.2, tierCities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"] },
  { code: "OD", name: "Odisha", gstCode: "21", region: "East", weight: 2.0, tierCities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"] },
  { code: "JH", name: "Jharkhand", gstCode: "20", region: "East", weight: 1.6, tierCities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"] },
  { code: "CG", name: "Chhattisgarh", gstCode: "22", region: "Central", weight: 1.5, tierCities: ["Raipur", "Bhilai", "Bilaspur", "Korba"] },
  { code: "AS", name: "Assam", gstCode: "18", region: "North-East", weight: 1.5, tierCities: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur"] },
  { code: "UK", name: "Uttarakhand", gstCode: "05", region: "North", weight: 1.2, tierCities: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee"] },
  { code: "HP", name: "Himachal Pradesh", gstCode: "02", region: "North", weight: 0.9, tierCities: ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu"] },
  { code: "GA", name: "Goa", gstCode: "30", region: "West", weight: 0.8, tierCities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"] },
  { code: "TR", name: "Tripura", gstCode: "16", region: "North-East", weight: 0.4, tierCities: ["Agartala", "Dharmanagar", "Udaipur"] },
  { code: "ML", name: "Meghalaya", gstCode: "17", region: "North-East", weight: 0.35, tierCities: ["Shillong", "Tura", "Jowai"] },
  { code: "MN", name: "Manipur", gstCode: "14", region: "North-East", weight: 0.3, tierCities: ["Imphal", "Thoubal", "Churachandpur"] },
  { code: "NL", name: "Nagaland", gstCode: "13", region: "North-East", weight: 0.25, tierCities: ["Dimapur", "Kohima", "Mokokchung"] },
  { code: "MZ", name: "Mizoram", gstCode: "15", region: "North-East", weight: 0.2, tierCities: ["Aizawl", "Lunglei", "Champhai"] },
  { code: "AR", name: "Arunachal Pradesh", gstCode: "12", region: "North-East", weight: 0.2, tierCities: ["Itanagar", "Naharlagun", "Pasighat"] },
  { code: "SK", name: "Sikkim", gstCode: "11", region: "North-East", weight: 0.2, tierCities: ["Gangtok", "Namchi", "Gyalshing"] },
  { code: "JK", name: "Jammu & Kashmir", gstCode: "01", region: "North", weight: 1.1, tierCities: ["Srinagar", "Jammu", "Anantnag", "Baramulla"] },
  { code: "CH", name: "Chandigarh", gstCode: "04", region: "North", weight: 0.9, tierCities: ["Chandigarh City", "Manimajra"] },
  { code: "PY", name: "Puducherry", gstCode: "34", region: "South", weight: 0.4, tierCities: ["Pondicherry", "Karaikal", "Mahe"] },
  { code: "LA", name: "Ladakh", gstCode: "38", region: "North", weight: 0.2, tierCities: ["Leh", "Kargil", "Diskit"] },
  { code: "AN", name: "Andaman & Nicobar", gstCode: "35", region: "East", weight: 0.15, tierCities: ["Port Blair", "Havelock", "Diglipur"] },
  { code: "DN", name: "Dadra & Nagar Haveli & Daman & Diu", gstCode: "26", region: "West", weight: 0.2, tierCities: ["Daman", "Silvassa", "Diu"] },
  { code: "LD", name: "Lakshadweep", gstCode: "31", region: "South", weight: 0.05, tierCities: ["Kavaratti", "Agatti", "Amini"] },
];

const CUSTOMERS = [
  "Aarav Sharma", "Aditi Patel", "Rohan Verma", "Sneha Nair", "Priya Iyer",
  "Vikram Malhotra", "Ananya Deshmukh", "Rahul Sengupta", "Kavita Reddy", "Arjun Mehra"
];

const CATEGORIES: Array<"FMCG & Grocery" | "Quick Commerce" | "Electronics" | "Apparel & Fashion" | "Dining & Cafes"> = [
  "FMCG & Grocery", "Quick Commerce", "Electronics", "Apparel & Fashion", "Dining & Cafes"
];

const GATEWAYS: PaymentGatewayType[] = ["Razorpay", "GooglePay", "PhonePe", "Cashfree", "PayU", "DirectUPI"];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateClientTransaction(stateCode?: string): NationalTransaction {
  const stateMeta = stateCode && stateCode !== "ALL"
    ? ALL_INDIAN_STATES.find((s) => s.code === stateCode || s.gstCode === stateCode) || ALL_INDIAN_STATES[0]
    : randomChoice(ALL_INDIAN_STATES);

  const city = randomChoice(stateMeta.tierCities);
  const gateway = randomChoice(GATEWAYS);
  const category = randomChoice(CATEGORIES);
  const amount = Math.floor(Math.random() * 8500) + 250;
  const idNum = Math.floor(Math.random() * 900000) + 100000;

  return {
    transaction_id: `txn_${gateway.toLowerCase()}_${idNum}`,
    timestamp: new Date().toISOString(),
    amount_inr: amount,
    method: gateway === "DirectUPI" ? "UPI QR" : `${gateway} SmartCollect`,
    payment_provider: gateway,
    gateway,
    state_code: stateMeta.gstCode,
    state_name: stateMeta.name,
    city,
    category,
    customer_name: randomChoice(CUSTOMERS),
    is_verified: true,
    is_verified_razorpay: gateway === "Razorpay",
    verification_badge: "GSTIN Active",
    shop_id: `shop_${stateMeta.code.toLowerCase()}_01`,
    shop_name: `${stateMeta.name} Premier Retail`,
    shop_gstin: `${stateMeta.gstCode}AAAAA0000A1Z5`,
  };
}

export const indiaTransactionEngine = {
  getStateBreakdown(region?: string): StateMetrics[] {
    const list = region && region !== "ALL"
      ? ALL_INDIAN_STATES.filter((s) => s.region === region)
      : ALL_INDIAN_STATES;

    return list.map((state) => {
      const volume = Math.round(state.weight * 2_850_000 + Math.random() * 400_000);
      const count = Math.round(volume / (Math.random() * 1200 + 800));
      return {
        state_code: state.gstCode,
        state_name: state.name,
        region: state.region,
        total_volume_inr: volume,
        transaction_count: count,
        average_order_value: Math.round(volume / count),
        top_city: state.tierCities[0] || "Capital City",
        top_category: randomChoice(CATEGORIES),
        share_pct: Number((state.weight * 0.95).toFixed(1)),
      };
    });
  },
  generateTransaction: generateClientTransaction,
};
