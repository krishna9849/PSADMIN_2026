"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

type UiRole = "admin" | "vendor" | "staff";

function getUiRole(session: {
  backendRole: "admin" | "vendor" | null;
  staffRole?: string | null;
}): UiRole | null {
  if (!session.backendRole) return null;

  if (session.backendRole === "admin") return "admin";

  // backendRole === "vendor"
  // vendor_admin should behave like vendor panel
  if (session.staffRole && session.staffRole === "vendor_admin") return "vendor";

  // otherwise treat as staff panel
  return "staff";
}

type Props = {
  allow: UiRole[];
  children: React.ReactNode;
};

export function RoleGuard({ allow, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const session = useAuthStore((s) => s.session);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const token = session.token;
  const uiRole = getUiRole(session);

  useEffect(() => {
    // ✅ Critical: wait for persisted session to hydrate first
    if (!hasHydrated) return;

    if (!token || !uiRole) {
      router.replace("/");
      return;
    }

    if (!allow.includes(uiRole)) {
      if (uiRole === "admin") router.replace("/admin/dashboard");
      if (uiRole === "vendor") router.replace("/vendor/dashboard");
      if (uiRole === "staff") router.replace("/staff/dashboard");
    }
  }, [hasHydrated, token, uiRole, allow, router, pathname]);

  // ✅ While hydrating, render nothing (prevents flicker + wrong redirect)
  if (!hasHydrated) return null;

  if (!token || !uiRole) return null;
  if (!allow.includes(uiRole)) return null;

  return <>{children}</>;
}
