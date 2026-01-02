export const EP = {
  auth: {
    // ✅ Confirmed from your Postman
    adminLogin: "/auth/login",
    vendorStaffLogin: "/api/grooming/vendors/staff/login",

    // ❗ Not provided yet. Keep placeholder for now.
    // Replace when you share refresh API.
    refresh: "/auth/refresh",
  },
} as const;
