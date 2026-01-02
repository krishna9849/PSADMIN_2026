"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";
import { useAuthStore } from "../../store/auth.store";
import { getDefaultCapabilities, type AppRole } from "../../lib/auth/rbac";
import { Sidebar } from "./Sidebar";
import { toast } from "../../lib/ui/toast";

function getUiRole(session: {
  backendRole: "admin" | "vendor" | null;
  staffRole?: string | null;
}): AppRole | null {
  if (!session.backendRole) return null;

  if (session.backendRole === "admin") return "admin";

  // backendRole === "vendor"
  if (session.staffRole && session.staffRole === "vendor_admin") return "vendor";
  return "staff";
}

export function PanelShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);
  const session = useAuthStore((s) => s.session);

  const uiRole = useMemo(() => getUiRole(session), [session]);

  const capabilities = useMemo(() => {
    // Later: merge vendor-assigned permissions fetched from API
    return getDefaultCapabilities((uiRole ?? "staff") as AppRole);
  }, [uiRole]);

  function logout() {
    clearSession();
    toast.success("Signed out safely 🐶");
    router.replace("/");
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        {uiRole && (
          <Sidebar role={uiRole} capabilities={capabilities} onLogout={logout} />
        )}

        <main className="flex-1">
          {/* Topbar */}
          <div
            className="sticky top-0 z-10"
            style={{
              background: "hsl(var(--card) / 0.72)",
              borderBottom: "1px solid hsl(var(--border))",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
              <div>
                <h1 className="text-base font-extrabold tracking-tight">{title}</h1>
                <p className="ps-muted text-xs">
                  {uiRole ? `Logged as ${uiRole}` : "Not logged in"} • PetSaviour 🐾
                </p>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button onClick={logout} className="ps-btn ps-btn-primary md:hidden">
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
