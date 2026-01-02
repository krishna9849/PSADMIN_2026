import type { AppRole, Capabilities } from "../../lib/auth/rbac";

export type NavItem = {
  label: string;
  href: string;
  // lucide icon name string used by Sidebar
  icon:
    | "LayoutDashboard"
    | "Users"
    | "BadgeCheck"
    | "ShoppingBag"
    | "TicketPercent"
    | "Crown"
    | "Store"
    | "GitBranch"
    | "UserCog"
    | "Wrench"
    | "Package"
    | "ClipboardList"
    | "Briefcase"
    | "User";
  // gate visibility by capability
  showIf?: (c: Capabilities, role: AppRole) => boolean;
};

export function getNav(role: AppRole, c: Capabilities): { title: string; items: NavItem[] }[] {
  if (role === "admin") {
    return [
      {
        title: "Overview",
        items: [
          { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
        ],
      },
      {
        title: "Business",
        items: [
          { label: "Vendors", href: "/admin/vendors", icon: "Store" },
          { label: "Approvals", href: "/admin/approvals", icon: "BadgeCheck" },
          { label: "Orders", href: "/admin/orders", icon: "ShoppingBag" },
        ],
      },
      {
        title: "Monetization",
        items: [
          { label: "Coupons", href: "/admin/coupons", icon: "TicketPercent" },
          { label: "Subscriptions", href: "/admin/subscriptions", icon: "Crown" },
        ],
      },
    ];
  }

  // Vendor + Staff share almost same menu; staff is filtered by capabilities
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
          label: "Subscription",
          href: "/vendor/subscription",
          icon: "Crown",
          showIf: (cap, r) => r === "vendor" && cap.canViewSubscriptions,
        },
        {
          label: "Profile",
          href: role === "vendor" ? "/vendor/profile" : "/staff/profile",
          icon: "User",
        },
      ],
    },
  ];

  // Filter by showIf for staff/vend. Admin already separate.
  return shared.map((section) => ({
    title: section.title,
    items: section.items.filter((it) => (it.showIf ? it.showIf(c, role) : true)),
  }));
}
