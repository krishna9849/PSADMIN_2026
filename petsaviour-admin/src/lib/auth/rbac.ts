export type AppRole = "admin" | "vendor" | "staff";

export type Capabilities = {
  // Generic capability flags (expand later via vendor-assigned permissions)
  canViewBranches: boolean;
  canEditBranches: boolean;

  canViewStaff: boolean;
  canEditStaff: boolean;

  canViewServices: boolean;
  canEditServices: boolean;

  canViewPackages: boolean;
  canEditPackages: boolean;

  canViewOrders: boolean;
  canUpdateOrderStatus: boolean;
  canAssignStaff: boolean;

  canViewCoupons: boolean;
  canEditCoupons: boolean;

  canViewSubscriptions: boolean;
  canEditSubscriptions: boolean;

  // Staff-only ops
  canViewJobs: boolean;
  canExecuteJobs: boolean; // OTP, upload images, etc.
};

export function getDefaultCapabilities(role: AppRole): Capabilities {
  if (role === "admin") {
    return {
      canViewBranches: true,
      canEditBranches: true,
      canViewStaff: true,
      canEditStaff: true,
      canViewServices: true,
      canEditServices: true,
      canViewPackages: true,
      canEditPackages: true,
      canViewOrders: true,
      canUpdateOrderStatus: true,
      canAssignStaff: true,
      canViewCoupons: true,
      canEditCoupons: true,
      canViewSubscriptions: true,
      canEditSubscriptions: true,
      canViewJobs: true,
      canExecuteJobs: true,
    };
  }

  if (role === "vendor") {
    return {
      canViewBranches: true,
      canEditBranches: true,
      canViewStaff: true,
      canEditStaff: true,
      canViewServices: true,
      canEditServices: true,
      canViewPackages: true,
      canEditPackages: true,
      canViewOrders: true,
      canUpdateOrderStatus: true,
      canAssignStaff: true,
      canViewCoupons: false,
      canEditCoupons: false,
      canViewSubscriptions: true,
      canEditSubscriptions: true,
      canViewJobs: true, // vendor can view jobs list/status
      canExecuteJobs: false,
    };
  }

  // staff (default) — similar screens but mostly view, and only job execution enabled
  return {
    canViewBranches: true,
    canEditBranches: false,

    canViewStaff: true,
    canEditStaff: false,

    canViewServices: true,
    canEditServices: false,

    canViewPackages: true,
    canEditPackages: false,

    canViewOrders: true,
    canUpdateOrderStatus: true, // assigned orders/job status updates
    canAssignStaff: false,

    canViewCoupons: false,
    canEditCoupons: false,

    canViewSubscriptions: false,
    canEditSubscriptions: false,

    canViewJobs: true,
    canExecuteJobs: true,
  };
}
