/**
 * SANJEEVANI AI SYSTEM CONTROLLER & PRIVACY ENFORCEMENT ENGINE
 * 
 * Enforces Role-Based Access Control (RBAC), Data Masking Rules,
 * Information Visibility Matrix, and Communication Firewalls between
 * Farmers, Buyers, and Cold Storage Providers.
 */

export type ActorRole = "ADMIN" | "FARMER" | "BUYER" | "COLD_STORAGE";

export type DataCategory = 
  | "farmer_personal"
  | "storage_requests"
  | "crop_offers"
  | "buyer_bids"
  | "storage_details";

// 1. INFORMATION VISIBILITY MATRIX
export const VISIBILITY_MATRIX: Record<DataCategory, Record<ActorRole, "FULL" | "HIDDEN">> = {
  farmer_personal: {
    ADMIN: "FULL",
    FARMER: "FULL",
    COLD_STORAGE: "HIDDEN",
    BUYER: "HIDDEN"
  },
  storage_requests: {
    ADMIN: "FULL",
    FARMER: "FULL",
    COLD_STORAGE: "FULL",
    BUYER: "HIDDEN"
  },
  crop_offers: {
    ADMIN: "FULL",
    FARMER: "FULL",
    COLD_STORAGE: "HIDDEN",
    BUYER: "FULL"
  },
  buyer_bids: {
    ADMIN: "FULL",
    FARMER: "FULL",
    COLD_STORAGE: "HIDDEN",
    BUYER: "FULL"
  },
  storage_details: {
    ADMIN: "FULL",
    FARMER: "FULL",
    COLD_STORAGE: "FULL",
    BUYER: "HIDDEN"
  }
};

// 2. AUTHORIZATION & COMMUNICATION FIREWALL RULE
export function checkCommunicationAllowed(senderRole: ActorRole, receiverRole: ActorRole): {
  allowed: boolean;
  reason?: string;
} {
  // Admin has master permission override
  if (senderRole === "ADMIN" || receiverRole === "ADMIN") {
    return { allowed: true };
  }

  // STRICT FIREWALL: Drop any attempt to establish a direct communication channel between Buyer & Cold Storage
  if (
    (senderRole === "BUYER" && receiverRole === "COLD_STORAGE") ||
    (senderRole === "COLD_STORAGE" && receiverRole === "BUYER")
  ) {
    return {
      allowed: false,
      reason: "FIREWALL BLOCK: Direct interaction between Buyer and Cold Storage Facility is strictly prohibited by Privacy Isolation Rules."
    };
  }

  // Farmers can communicate with Buyers & Cold Storage
  return { allowed: true };
}

// 3. DATA FILTERING & MASKING ENGINE
export function sanitizeFarmerPayload<T extends Record<string, any>>(payload: T, recipientRole: ActorRole): T {
  if (recipientRole === "ADMIN" || recipientRole === "FARMER") {
    return payload;
  }

  const sanitized = { ...payload };

  // Strip out sensitive credentials & farm details
  delete sanitized.farm_size_acres;
  delete sanitized.total_land_size;
  delete sanitized.soil_type;
  delete sanitized.soil_category;
  delete sanitized.geographical_survey_details;
  delete sanitized.land_record_no;
  delete sanitized.aadhaar_no;
  delete sanitized.personal_credentials;

  // Apply visual masking text for UI display
  return {
    ...sanitized,
    soil_type: "[PROTECTED BY PRIVACY ENGINE]",
    farm_size_acres: "[RESTRICTED - PRIVACY MASKED]",
    land_record_no: "[HIDDEN FROM EXTERNAL ROLES]"
  };
}

// 4. CATEGORY ACCESS GUARD
export function isCategoryAccessible(role: ActorRole, category: DataCategory): boolean {
  if (role === "ADMIN") return true;
  return VISIBILITY_MATRIX[category]?.[role] === "FULL";
}
