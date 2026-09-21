export type Language = "te" | "hi" | "en";

export interface FarmerProfile {
  full_name: string;
  phone_number: string;
  village: string;
  district: string;
  state: string;
  main_crop: string;
  farm_size_acres: number;
  language: Language;
  profile_photo_url?: string | null;
  user_role?: "farmer" | "buyer" | "storage" | "transport" | "coordinator" | "admin";
  // Buyer Profile Fields
  company_name?: string;
  buyer_type?: string;
  crop_required?: string;
  min_quantity_tons?: number;
  price_offered?: number;
  // Storage Facility Profile Fields
  facility_name?: string;
  capacity_mt?: number;
  available_space_mt?: number;
  rate_per_day_quintal?: number;
  kyc_status?: "Verified" | "Pending" | "Rejected";
  account_status?: "Active" | "Suspended" | "Deactivated";
}

export interface WeatherData {
  success: boolean;
  location: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  rain_probability: number;
  condition: string;
  condition_te: string;
  condition_hi: string;
  advice_en: string;
  advice_te: string;
  advice_hi: string;
  alerts: Array<{
    type: string;
    title: string;
    title_te?: string;
    title_hi?: string;
    message_en: string;
    message_te: string;
    message_hi: string;
  }>;
  is_live_api: boolean;
  last_updated: string;
}

export interface CropDiagnosisResult {
  success: boolean;
  crop?: string;
  crop_te?: string;
  crop_hi?: string;
  condition?: string;
  condition_te?: string;
  condition_hi?: string;
  confidence?: number;
  severity?: "none" | "low" | "moderate" | "severe";
  explanation_en?: string;
  explanation_te?: string;
  explanation_hi?: string;
  treatment_en?: string[];
  treatment_te?: string[];
  treatment_hi?: string[];
  dataset_name?: string;
  model_version?: string;
  reason?: string;
  message?: string;
}

export interface MarketPrice {
  id: string;
  crop: string;
  crop_te: string;
  crop_hi: string;
  mandi: string;
  price: number;
  unit: string;
  change_pct: number;
  trend: "up" | "down";
  is_live: boolean;
  data_source: string;
  updated_at: string;
}

export interface Buyer {
  id: string;
  name: string;
  buyer_type: string;
  crop_required: string;
  min_quantity_tons: number;
  price_offered: number;
  location: string;
  phone_number: string;
  verified: boolean;
  is_demo: boolean;
}

export interface FPO {
  id: string;
  name: string;
  location: string;
  supported_crops: string[];
  member_count: number;
  contact_phone: string;
  benefits: string[];
  verified: boolean;
  is_demo: boolean;
}

export interface ColdStorageFacility {
  id: string;
  facility_name: string;
  location: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  capacity_mt: number;
  available_space_mt: number;
  supported_produce: string[];
  rate_per_day_quintal: number;
  contact_phone: string;
  is_demo: boolean;
}

export interface WorkCoordinator {
  coordinator_name: string;
  region: string;
  today_status: "Available" | "Limited" | "Unavailable";
  total_workers_available: number;
  phone_number: string;
  whatsapp_link: string;
  is_demo: boolean;
  work_matrix: Array<{
    work_type: string;
    status: "Available" | "Limited" | "Unavailable";
    rate_per_day: number;
    workers_free: number;
  }>;
}

export interface WorkRequest {
  id: string;
  farmer_name: string;
  work_type: string;
  date: string;
  workers_needed: number;
  location: string;
  instructions?: string;
  status: "Requested" | "Waiting for Coordinator" | "Confirmed" | "Unavailable" | "Completed" | "Cancelled";
  created_at: string;
}

export interface NotificationItem {
  id: string;
  type: "weather" | "market" | "worker" | "system";
  title: string;
  title_te?: string;
  title_hi?: string;
  message: string;
  time: string;
  is_read: boolean;
  target_screen?: string;
}
