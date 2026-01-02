"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  BadgeCheck,
  ShoppingBag,
  Store,
  GitBranch,
  UserCog,
  Wrench,
  Package,
  Briefcase,
  User,
  PawPrint,
  X,
  Menu,
  ClipboardList,
  Library,
} from "lucide-react";

import type { AppRole, Capabilities } from "../../lib/auth/rbac";
import { getNav } from "./menu";

function Icon({ name }: { name: string }) {
  const props = { size: 18 };
  switch (name) {
    case "LayoutDashboard":
      return <LayoutDashboard {...props} />;
    case "Store":
      return <Store {...props} />;
    case "BadgeCheck":
      return <BadgeCheck {...props} />;
    case "Library":
      return <Library {...props} />;
    case "ShoppingBag":
      return <ShoppingBag {...props} />;
    case "GitBranch":
      return <GitBranch {...props} />;
    case "UserCog":
      return <UserCog {...props} />;
    case "Wrench":
      return <Wrench {...props} />;
    case "Package":
      return <Package {...props} />;
    case "Briefcase":
      return <Briefcase {...props} />;
    case "User":
      return <User {...props} />;
    case "ClipboardList":
      return <ClipboardList {...props} />;
    default:
      return <LayoutDashboard {...props} />;
  }
}

export function Sidebar({
  role,
  capabilities,
  onLogout,
}: {
  role: AppRole;
  capabilities: Capabilities;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const nav = useMemo(() => getNav(role, capabilities), [role, capabilities]);
  const [openMobile, setOpenMobile] = useState(false);

  const Shell = ({ mobile }: { mobile: boolean }) => (
    <aside className={mobile ? "w-72" : "hidden md:block md:w-72"}>
      <div className="p-4">
        <div className="ps-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="ps-badge" style={{ padding: "0.45rem 0.7rem" }}>
                <PawPrint size={16} />
              </span>
              <div>
                <div className="text-lg font-extrabold tracking-tight">PetSaviour</div>
                <div className="ps-muted mt-1 text-xs">
                  {role === "admin"
                    ? "Admin Panel"
                    : role === "vendor"
                      ? "Vendor Panel"
                      : "Staff Panel"}
                </div>
              </div>
            </div>

            {mobile && (
              <button
                type="button"
                className="ps-btn ps-btn-ghost"
                onClick={() => setOpenMobile(false)}
                aria-label="Close sidebar"
                title="Close"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div
            className="mt-4 ps-card p-3"
            style={{
              background: "radial-gradient(circle at top, hsl(var(--primary) / 0.14), transparent 65%)",
            }}
          >
            <p className="ps-muted text-xs">
              🐾 Vendor changes go as <b>Requests</b> → Admin approves → Live.
            </p>
          </div>
        </div>

        <nav className="mt-6 space-y-5">
          {nav.map((section) => (
            <div key={section.title}>
              <div className="ps-muted mb-2 text-xs font-bold uppercase tracking-wide">
                {section.title}
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");

                  const isRequests = item.href === "/vendor/requests";

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block"
                      onClick={() => mobile && setOpenMobile(false)}
                    >
                      <div
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition"
                        style={{
                          background: active
                            ? "hsl(var(--primary) / 0.12)"
                            : isRequests
                              ? "hsl(var(--primary) / 0.08)"
                              : "transparent",
                          border: active
                            ? "1px solid hsl(var(--primary) / 0.25)"
                            : isRequests
                              ? "1px solid hsl(var(--primary) / 0.18)"
                              : "1px solid transparent",
                          color: active
                            ? "hsl(var(--primary))"
                            : "hsl(var(--foreground))",
                        }}
                      >
                        <span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{
                            background: active
                              ? "hsl(var(--primary) / 0.12)"
                              : "hsl(var(--muted))",
                            border: `1px solid ${
                              active ? "hsl(var(--primary) / 0.25)" : "hsl(var(--border))"
                            }`,
                          }}
                        >
                          <Icon name={item.icon} />
                        </span>

                        <span>{item.label}</span>

                        {/* Staff view-only hint */}
                        {role === "staff" &&
                          (item.href.includes("/services") ||
                            item.href.includes("/packages") ||
                            item.href.includes("/branches") ||
                            item.href.includes("/staff")) && <span className="ml-auto ps-badge">View</span>}

                        {/* Requests badge for attention */}
                        {isRequests && role === "vendor" && <span className="ml-auto ps-badge">New</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <button onClick={onLogout} className="ps-btn ps-btn-secondary mt-6 w-full">
          Logout
        </button>

        <div className="mt-4 flex items-center justify-between">
          <span className="ps-muted text-xs">Built with 🧡 for pets</span>
          <span className="ps-badge">🐶 🐱</span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="ps-btn ps-btn-ghost md:hidden"
        onClick={() => setOpenMobile(true)}
        aria-label="Open sidebar"
        title="Menu"
      >
        <Menu size={18} />
      </button>

      <Shell mobile={false} />

      {openMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setOpenMobile(false)}
          />
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              background: "hsl(var(--background))",
              borderRight: "1px solid hsl(var(--border))",
            }}
          >
            <Shell mobile />
          </div>
        </div>
      )}
    </>
  );
}
