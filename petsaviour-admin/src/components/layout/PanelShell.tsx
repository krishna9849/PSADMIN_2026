"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";
import { tokenStore } from "../../lib/auth/tokens";
import { useAuthStore } from "../../store/auth.store";
import { getDefaultCapabilities } from "../../lib/auth/rbac";
import { Sidebar } from "./Sidebar";

export function PanelShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);
  const role = useAuthStore((s) => s.role);

  const capabilities = useMemo(() => {
    // Later: merge vendor-assigned permissions fetched from API
    return role ? getDefaultCapabilities(role) : getDefaultCapabilities("staff");
  }, [role]);

  function logout() {
    clearSession();
    tokenStore.clearAll();
    router.replace("/");
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar includes mobile menu button + drawer */}
        {role && (
          <Sidebar role={role} capabilities={capabilities} onLogout={logout} />
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
              <div className="flex items-center gap-2">
                {/* Mobile menu button comes from Sidebar component */}
                {role && (
                  <span className="md:hidden">
                    {/* Sidebar renders the button; we keep spacing here only */}
                  </span>
                )}

                <div>
                  <h1 className="text-base font-extrabold tracking-tight">
                    {title}
                  </h1>
                  <p className="ps-muted text-xs">
                    {role ? `Logged as ${role}` : "Not logged in"} • PetSaviour 🐾
                  </p>
                </div>
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
