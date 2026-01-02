export const EP = {
  auth: {
    adminLogin: "/auth/login",
    vendorStaffLogin: "/api/grooming/vendors/staff/login",

    // 🚧 Future: update this when refresh API exists
    refresh: "/auth/refresh",
  },
} as const;
