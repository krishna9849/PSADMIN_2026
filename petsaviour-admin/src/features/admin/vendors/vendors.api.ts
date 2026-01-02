import { api } from "../../../lib/api/client";

export type OnboardVendorPayload = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  addressLocation?: { lat: number; lng: number };
  logoUrl?: string | null;
};

export type Vendor = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  roles?: string[];
  businesses?: string[];
  commissionRate?: number;
  promotionEligible?: boolean;
  approvals?: {
    meta?: {
      status?: string; // pending/approved/rejected (as per your response)
    };
  };
  createdAt?: string;
  updatedAt?: string;
};

export type VendorListItem = {
  vendor: Vendor;
  services: any[];
};

export type VendorListResponse = {
  success: boolean;
  data: {
    address: any;
    vendors: VendorListItem[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  };
};

/**
 * Admin: Create Vendor (Onboard)
 * Based on your doc: POST /api/grooming/vendors
 */
export async function onboardVendor(payload: OnboardVendorPayload) {
  const res = await api.post("/api/grooming/vendors", payload);
  return res.data as any;
}

/**
 * Vendor list (currently available endpoint)
 * GET /api/cart/vendors/by-address
 *
 * Future flexibility:
 * - If backend later requires query params (lat/lng, addressId, city),
 *   we can add them here without touching UI.
 */
export async function listVendorsByAddress(params?: {
  page?: number;
  limit?: number;
  // future fields:
  addressId?: string;
  lat?: number;
  lng?: number;
  city?: string;
}) {
  const qs = new URLSearchParams();

  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.addressId) qs.set("addressId", params.addressId);
  if (params?.lat != null) qs.set("lat", String(params.lat));
  if (params?.lng != null) qs.set("lng", String(params.lng));
  if (params?.city) qs.set("city", params.city);

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  const res = await api.get(`/api/cart/vendors/by-address${suffix}`);
  return res.data as VendorListResponse;
}
