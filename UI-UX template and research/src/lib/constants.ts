export const MONTHLY_SALES_TARGET = 50_000;

export interface VerifiedShop {
  serial_no: number;
  shop_id: string;
  shop_name: string;
  gstin: string;
  pan: string;
  state_code: string;
  state_name: string;
  category: string;
  is_verified: boolean;
  verification_status: "VERIFIED_RETAILER";
  registration_date: string;
}

export const VERIFIED_SHOPS: VerifiedShop[] = [];

