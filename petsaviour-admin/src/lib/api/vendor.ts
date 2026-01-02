import { api } from "./client";

export type VendorContact = {
  emailVerified?: boolean;
  phoneVerified?: boolean;
};

export type VendorApprovals = {
  meta?: { status?: string };
};

export type Vendor = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  contact?: VendorContact;
  approvals?: VendorApprovals;
  roles?: string[];
  businesses?: string[];
  coverage?: { cities?: string[]; pinCodes?: string[]; radiusKm?: number };
};

type SendOtpResponse = {
  message?: string;
  otp?: string; // sometimes debug
  debugOtp?: string; // sometimes debug
};

type VerifyOtpResponse = {
  message?: string;
};

const OTP_DEBUG = process.env.NEXT_PUBLIC_OTP_DEBUG === "true";

export const VendorAPI = {
  // ✅ Used on Vendor Profile page to show emailVerified & phoneVerified
  async getVendorById(vendorId: string): Promise<Vendor> {
    const res = await api.get(`/api/grooming/vendors/${vendorId}`);

    // backend may return { vendor }, { data }, or direct object depending on implementation
    const v = (res.data?.vendor ?? res.data?.data ?? res.data) as Vendor;
    return v;
  },

  // ✅ Phone OTP: POST /api/grooming/vendors/{vendorId}/phone/send-otp
  // Body: { mobile?: string, debug?: boolean }
  async sendPhoneOtp(vendorId: string, mobile?: string): Promise<SendOtpResponse> {
    const res = await api.post(
      `/api/grooming/vendors/${vendorId}/phone/send-otp`,
      {
        ...(mobile ? { mobile } : {}),
        ...(OTP_DEBUG ? { debug: true } : {}),
      }
    );
    return res.data as SendOtpResponse;
  },

  // ✅ Phone OTP verify: POST /api/grooming/vendors/{vendorId}/phone/verify-otp
  // Body: { mobile: string, otp: string }
  async verifyPhoneOtp(vendorId: string, mobile: string, otp: string): Promise<VerifyOtpResponse> {
    const res = await api.post(
      `/api/grooming/vendors/${vendorId}/phone/verify-otp`,
      { mobile, otp }
    );
    return res.data as VerifyOtpResponse;
  },
};
