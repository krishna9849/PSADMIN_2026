import { api } from "./client";
import { VendorProfileDraft } from "../types/vendor";

// TODO: confirm endpoints with backend
export const VendorAPI = {
  getProfile: async () => {
    // Expected to return live profile + status (+ optional draft)
    // return (await api.get("/vendor/profile")).data;
    return null as any;
  },

  saveDraft: async (draft: VendorProfileDraft) => {
    // Save draft locally or backend draft endpoint
    // return (await api.post("/vendor/profile/draft", draft)).data;
    return null as any;
  },

  submitProfileRequest: async () => {
    // Create approval request for profile
    // return (await api.post("/vendor/requests/profile")).data;
    return null as any;
  },
};
