export const EP = {
  auth: {
    adminLogin: "/auth/login",
    vendorStaffLogin: "/api/grooming/vendors/staff/login",

    // 🚧 Future: update this when refresh API exists
    refresh: "/auth/refresh",
  },

  vendorStaff: {
    // ✅ Vendor + Staff change password (same endpoint)
    changePassword: "/api/grooming/vendors/staff/change-password",
  },
} as const;
