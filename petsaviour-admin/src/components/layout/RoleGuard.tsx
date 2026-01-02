"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

type Props = {
  allow: Array<"admin" | "vendor" | "staff">;
  children: React.ReactNode;
};

export function RoleGuard({ allow, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token || !role) {
      router.replace("/");
      return;
    }

    if (!allow.includes(role)) {
      if (role === "admin") router.replace("/admin/dashboard");
      if (role === "vendor") router.replace("/vendor/dashboard");
      if (role === "staff") router.replace("/staff/dashboard");
    }
  }, [token, role, allow, router, pathname]);

  if (!token || !role) return null;
  if (!allow.includes(role)) return null;

  return <>{children}</>;
}
