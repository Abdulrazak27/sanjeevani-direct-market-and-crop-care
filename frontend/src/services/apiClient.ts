// Unified Sanjeevani Centralized Platform API Client

const API_BASE_URL = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:3000/api"
  : "/api";

export interface ApiFarmer {
  id: string;
  full_name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  main_crop: string;
  farm_size_acres: number;
  soil_type?: string;
  kyc_status: "Pending" | "Verified" | "Rejected";
  account_status: "Active" | "Suspended";
  profile_photo_url?: string | null;
  created_at?: string;
}

export interface ApiBuyer {
  id: string;
  company_name: string;
  rep_name: string;
  phone: string;
  email?: string;
  location: string;
  district: string;
  state?: string;
  buyer_type: string;
  interested_crops: string[];
  price_offered_qtl: number;
  min_qty_tons: number;
  kyc_status: "Pending" | "Under Review" | "Verified" | "Rejected" | "Suspended";
  account_status: "Active" | "Suspended";
  kyc_doc_name: string;
  created_at?: string;
}

export interface ApiCrop {
  id: string;
  name: string;
  name_te?: string;
  name_hi?: string;
  category: string;
  variety: string;
  season: string;
  harvest_status: string;
  expected_price_qtl: number;
  current_mandi_price: number;
  mandi_name: string;
  unit: string;
  change_pct: number;
  trend: "up" | "down";
  updated_at?: string;
}

export interface ApiStorageFacility {
  id: string;
  facility_name: string;
  operator_name: string;
  phone: string;
  location: string;
  district: string;
  state?: string;
  total_capacity_mt: number;
  occupied_capacity_mt: number;
  available_capacity_mt: number;
  daily_rate_qtl: number;
  temperature_c: number;
  humidity_pct: number;
  supported_crops: string[];
  maintenance_status: string;
  account_status: string;
}

export interface ApiAgreement {
  id: string;
  agreement_code: string;
  farmer_id?: string;
  farmer_name: string;
  buyer_id?: string;
  buyer_name: string;
  storage_id?: string;
  storage_name?: string;
  crop_name: string;
  quantity_qtl: number;
  agreed_price_qtl: number;
  total_value: number;
  start_date: string;
  end_date: string;
  status: "Draft" | "Active" | "Expiring Soon" | "Completed" | "Cancelled";
  created_at?: string;
}

export interface ApiPayment {
  id: string;
  txn_code: string;
  agreement_id?: string;
  payer_name: string;
  payee_name: string;
  amount: number;
  payment_method: string;
  status: "Success" | "Pending" | "Failed";
  reference_number?: string;
  created_at?: string;
}

export interface ApiWorkerRequest {
  id: string;
  farmer_name: string;
  phone: string;
  work_type: string;
  workers_needed: number;
  date: string;
  location: string;
  status: "Requested" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
  created_at?: string;
}

export interface ApiAuditLog {
  id: string;
  action: string;
  user_name: string;
  role: string;
  entity?: string;
  entity_id?: string;
  status: string;
  details?: string;
  timestamp: string;
}

export interface DashboardStats {
  farmers: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
  buyers: {
    total: number;
    verified: number;
    pending: number;
    suspended: number;
  };
  cold_storage: {
    total_facilities: number;
    active_facilities: number;
    total_capacity_mt: number;
    used_capacity_mt: number;
    free_capacity_mt: number;
    usage_percentage: number;
  };
  crops: {
    total: number;
    harvest_ready: number;
  };
  agreements: {
    total: number;
    active: number;
    expiring: number;
  };
  revenue: {
    total_processed: number;
    total_transactions: number;
    successful_transactions: number;
    pending_transactions: number;
  };
  alerts: Array<{
    id: string;
    type: string;
    title: string;
    severity: string;
    action: string;
  }>;
  recent_activities: ApiAuditLog[];
}

// Helper fetch wrapper
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    // If backend is unreachable, fallback to localStorage cache for seamless continuity
    console.warn(`Backend connection notice on ${endpoint}:`, err);
    throw err;
  }
}

export const ApiClient = {
  // 1. Dashboard Statistics (Dynamic DB Counts)
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      return await apiRequest<DashboardStats>("/dashboard/stats");
    } catch {
      return {
        farmers: { total: 3, active: 2, pending: 1, suspended: 0 },
        buyers: { total: 3, verified: 2, pending: 1, suspended: 0 },
        cold_storage: { total_facilities: 2, active_facilities: 2, total_capacity_mt: 1700, used_capacity_mt: 1330, free_capacity_mt: 370, usage_percentage: 78.2 },
        crops: { total: 4, harvest_ready: 3 },
        agreements: { total: 2, active: 2, expiring: 0 },
        revenue: { total_processed: 231750, total_transactions: 2, successful_transactions: 2, pending_transactions: 0 },
        alerts: [{ id: "a1", type: "kyc", title: "1 Buyer KYC Verification Pending", severity: "high", action: "Review in Buyers" }],
        recent_activities: []
      };
    }
  },

  // 2. Farmers API
  async getFarmers(): Promise<ApiFarmer[]> {
    try {
      return await apiRequest<ApiFarmer[]>("/farmers");
    } catch {
      const raw = localStorage.getItem("sanjeevani_farmers");
      return raw ? JSON.parse(raw) : [];
    }
  },

  async createFarmer(farmer: Partial<ApiFarmer>): Promise<ApiFarmer> {
    try {
      return await apiRequest<ApiFarmer>("/farmers", {
        method: "POST",
        body: JSON.stringify(farmer)
      });
    } catch {
      const current = await this.getFarmers();
      const newFarmer: ApiFarmer = {
        id: `FAR_${Date.now().toString().slice(-4)}`,
        full_name: farmer.full_name || "New Farmer",
        phone: farmer.phone || "+91 9876543210",
        village: farmer.village || "Tadikonda",
        district: farmer.district || "Guntur",
        state: farmer.state || "Andhra Pradesh",
        main_crop: farmer.main_crop || "Tomato",
        farm_size_acres: farmer.farm_size_acres || 3.5,
        kyc_status: "Pending",
        account_status: "Active",
        profile_photo_url: farmer.profile_photo_url
      };
      localStorage.setItem("sanjeevani_farmers", JSON.stringify([newFarmer, ...current]));
      window.dispatchEvent(new Event("sanjeevani_storage_update"));
      return newFarmer;
    }
  },

  async updateFarmerStatus(farmerId: string, kycStatus: string, accountStatus?: string, adminName = "Hitaishi Admin") {
    try {
      return await apiRequest(`/farmers/${farmerId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ kyc_status: kycStatus, account_status: accountStatus, admin_name: adminName })
      });
    } catch {
      const current = await this.getFarmers();
      const updated = current.map(f => f.id === farmerId ? { ...f, kyc_status: kycStatus as any, account_status: (accountStatus || f.account_status) as any } : f);
      localStorage.setItem("sanjeevani_farmers", JSON.stringify(updated));
      window.dispatchEvent(new Event("sanjeevani_storage_update"));
      return { success: true };
    }
  },

  // 3. Buyers API
  async getBuyers(): Promise<ApiBuyer[]> {
    try {
      return await apiRequest<ApiBuyer[]>("/buyers");
    } catch {
      const raw = localStorage.getItem("sanjeevani_buyers");
      return raw ? JSON.parse(raw) : [];
    }
  },

  async createBuyer(buyer: Partial<ApiBuyer>): Promise<ApiBuyer> {
    try {
      return await apiRequest<ApiBuyer>("/buyers", {
        method: "POST",
        body: JSON.stringify(buyer)
      });
    } catch {
      const current = await this.getBuyers();
      const newBuyer: ApiBuyer = {
        id: `BUY_${Date.now().toString().slice(-4)}`,
        company_name: buyer.company_name || "New Buyer",
        rep_name: buyer.rep_name || "Representative",
        phone: buyer.phone || "+91 9849011223",
        email: buyer.email || "buyer@agri.com",
        location: buyer.location || "Guntur",
        district: buyer.district || "Guntur",
        buyer_type: buyer.buyer_type || "Processor",
        interested_crops: buyer.interested_crops || ["Tomato"],
        price_offered_qtl: buyer.price_offered_qtl || 2850,
        min_qty_tons: buyer.min_qty_tons || 5,
        kyc_status: "Pending",
        account_status: "Active",
        kyc_doc_name: buyer.kyc_doc_name || "GSTIN_KYC.pdf"
      };
      localStorage.setItem("sanjeevani_buyers", JSON.stringify([newBuyer, ...current]));
      window.dispatchEvent(new Event("sanjeevani_storage_update"));
      return newBuyer;
    }
  },

  async updateBuyerStatus(buyerId: string, kycStatus: string, accountStatus?: string, adminName = "Hitaishi Admin") {
    try {
      return await apiRequest(`/buyers/${buyerId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ kyc_status: kycStatus, account_status: accountStatus, admin_name: adminName })
      });
    } catch {
      const current = await this.getBuyers();
      const updated = current.map(b => b.id === buyerId ? { ...b, kyc_status: kycStatus as any, account_status: (accountStatus || b.account_status) as any } : b);
      localStorage.setItem("sanjeevani_buyers", JSON.stringify(updated));
      window.dispatchEvent(new Event("sanjeevani_storage_update"));
      return { success: true };
    }
  },

  // 4. Crops API
  async getCrops(): Promise<ApiCrop[]> {
    try {
      return await apiRequest<ApiCrop[]>("/crops");
    } catch {
      return [];
    }
  },

  async updateCrop(cropId: string, crop: Partial<ApiCrop>): Promise<ApiCrop> {
    return await apiRequest<ApiCrop>(`/crops/${cropId}`, {
      method: "PUT",
      body: JSON.stringify(crop)
    });
  },

  // 5. Cold Storage API
  async getStorageFacilities(): Promise<ApiStorageFacility[]> {
    try {
      return await apiRequest<ApiStorageFacility[]>("/cold-storage");
    } catch {
      return [];
    }
  },

  async bookStorage(data: { facility_id: string; farmer_name: string; phone: string; crop_name: string; batch_size_mt: number }) {
    return await apiRequest("/cold-storage/book", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  // 6. Agreements API
  async getAgreements(): Promise<ApiAgreement[]> {
    try {
      return await apiRequest<ApiAgreement[]>("/agreements");
    } catch {
      return [];
    }
  },

  // 7. Payments API
  async getPayments(): Promise<ApiPayment[]> {
    try {
      return await apiRequest<ApiPayment[]>("/payments");
    } catch {
      return [];
    }
  },

  // 8. Farm Workers API
  async getWorkerRequests(): Promise<ApiWorkerRequest[]> {
    try {
      return await apiRequest<ApiWorkerRequest[]>("/workers/requests");
    } catch {
      const raw = localStorage.getItem("sanjeevani_worker_requests");
      return raw ? JSON.parse(raw) : [];
    }
  },

  async createWorkerRequest(req: { farmer_name: string; phone: string; work_type: string; workers_needed: number; date: string; location: string }): Promise<ApiWorkerRequest> {
    try {
      return await apiRequest<ApiWorkerRequest>("/workers/requests", {
        method: "POST",
        body: JSON.stringify(req)
      });
    } catch {
      const current = await this.getWorkerRequests();
      const newReq: ApiWorkerRequest = {
        id: `wr_${Date.now()}`,
        farmer_name: req.farmer_name,
        phone: req.phone,
        work_type: req.work_type,
        workers_needed: req.workers_needed,
        date: req.date,
        location: req.location,
        status: "Requested",
        created_at: new Date().toISOString()
      };
      localStorage.setItem("sanjeevani_worker_requests", JSON.stringify([newReq, ...current]));
      window.dispatchEvent(new Event("sanjeevani_storage_update"));
      return newReq;
    }
  },

  // 9. Global Search API
  async searchGlobal(q: string) {
    try {
      return await apiRequest<{ results: any[] }>(`/search?q=${encodeURIComponent(q)}`);
    } catch {
      return { results: [] };
    }
  },

  // 10. Audit Logs API
  async getAuditLogs(limit = 20): Promise<ApiAuditLog[]> {
    try {
      return await apiRequest<ApiAuditLog[]>(`/audit-logs?limit=${limit}`);
    } catch {
      return [];
    }
  },

  // 11. CMS API
  async getCMSContent(key = "hero_banner") {
    try {
      return await apiRequest(`/cms/${key}`);
    } catch {
      return {
        key: "hero_banner",
        title: "Sanjeevani AgriTech Platform",
        subtitle: "From Crop Care to Market — Your Farming Saathi.",
        notice_text: "Special Procurement Drive: Guntur Mirchi Yard live rates +5.2% above MSP."
      };
    }
  },

  async updateCMSContent(key: string, data: any) {
    return await apiRequest(`/cms/${key}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
};
