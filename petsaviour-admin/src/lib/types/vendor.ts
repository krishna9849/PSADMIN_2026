export type ApprovalStatus = "none" | "pending" | "approved" | "rejected";

export type VendorProfileLive = {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  logoUrl?: string;
};

export type VendorProfileDraft = VendorProfileLive;

export type VendorProfileState = {
  live: VendorProfileLive;
  draft?: VendorProfileDraft;
  status: ApprovalStatus;
  adminNote?: string | null;
};
