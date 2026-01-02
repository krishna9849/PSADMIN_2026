import type { AppRole, Capabilities } from "../../lib/auth/rbac";

export type NavItem = {
  label: string;
  href: string;
  icon:
    | "LayoutDashboard"
    | "Store"
    | "BadgeCheck"
    | "Library"
    | "ShoppingBag"
    | "GitBranch"
    | "UserCog"
    | "Wrench"
    | "Package"
    | "Briefcase"
    | "User"
    | "ClipboardList";
  showIf?: (c: Capabilities, role: AppRole) => boolean;
};

export function getNav(role: AppRole, c: Capabilities): { title: string; items: NavItem[] }[] {
  if (role === "admin") {
    return [
      {
        title: "Overview",
        items: [{ label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" }],
      },
      {
        title: "Control Center",
        items: [
          { label: "Approvals", href: "/admin/approvals", icon: "BadgeCheck" },
          { label: "Catalogs", href: "/admin/catalogs", icon: "Library" },
          { label: "Vendors", href: "/admin/vendors", icon: "Store" },
        ],
      },
      {
        title: "Operations",
        items: [{ label: "Orders", href: "/admin/orders", icon: "ShoppingBag" }],
      },
    ];
  }

  // Vendor + Staff share the same structure, but filtered by capabilities.
  const shared: { title: string; items: NavItem[] }[] = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          href: role === "vendor" ? "/vendor/dashboard" : "/staff/dashboard",
          icon: "LayoutDashboard",
        },
      ],
    },
    {
      title: "Approvals",
      items: [
        {
          label: "Requests",
          href: "/vendor/requests",
          icon: "ClipboardList",
          // Only vendor creates/owns requests; staff won’t see this by default
          showIf: (_cap, r) => r === "vendor",
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          label: "Branches",
          href: role === "vendor" ? "/vendor/branches" : "/staff/branches",
          icon: "GitBranch",
          showIf: (cap) => cap.canViewBranches,
        },
        {
          label: "Staff",
          href: role === "vendor" ? "/vendor/staff" : "/staff/staff",
          icon: "UserCog",
          showIf: (cap) => cap.canViewStaff,
        },
        {
          label: "Services",
          href: role === "vendor" ? "/vendor/services" : "/staff/services",
          icon: "Wrench",
          showIf: (cap) => cap.canViewServices,
        },
        {
          label: "Packages",
          href: role === "vendor" ? "/vendor/packages" : "/staff/packages",
          icon: "Package",
          showIf: (cap) => cap.canViewPackages,
        },
        {
          label: "Orders",
          href: role === "vendor" ? "/vendor/orders" : "/staff/orders",
          icon: "ShoppingBag",
          showIf: (cap) => cap.canViewOrders,
        },
      ],
    },
    {
      title: "Work",
      items: [
        {
          label: "Jobs",
          href: "/staff/jobs",
          icon: "Briefcase",
          showIf: (cap, r) => r === "staff" && cap.canViewJobs,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Profile",
          href: role === "vendor" ? "/vendor/profile" : "/staff/profile",
          icon: "User",
        },
        {
          label: "Change Password",
          href: role === "vendor" ? "/vendor/change-password" : "/staff/change-password",
          icon: "UserCog",
        },
      ],
    },
  ];

  return shared.map((section) => ({
    title: section.title,
    items: section.items.filter((it) => (it.showIf ? it.showIf(c, role) : true)),
  }));
}
