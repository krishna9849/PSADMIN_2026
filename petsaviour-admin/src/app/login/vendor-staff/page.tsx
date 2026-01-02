"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api/client";
import { EP } from "../../../lib/api/endpoints";
import { useAuthStore } from "../../../store/auth.store";
import { ThemeToggle } from "../../../components/ThemeToggle";

type Mode = "vendor" | "staff";

export default function VendorStaffLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = useMemo<Mode>(() => (params.get("mode") === "staff" ? "staff" : "vendor"), [params]);

  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [staffId, setStaffId] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const payload: any = { password, vendorId };

      if (mode === "vendor") payload.email = email;
      if (mode === "staff") {
        if (staffId) payload.staffId = staffId;
        if (email) payload.email = email;
      }

      const res = await api.post(EP.auth.vendorStaffLogin, payload);

      const token: string | undefined = res.data?.token;
      if (!token) throw new Error("Token not found in response");

      const appRole = mode === "staff" ? "staff" : "vendor";
      setSession({ role: appRole, accessToken: token, refreshToken: null });

      router.replace(appRole === "staff" ? "/staff/dashboard" : "/vendor/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ps-glow min-h-screen">
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="ps-link text-sm">
            ← Back
          </Link>
          <ThemeToggle />
        </div>

        <div className="ps-card mt-6 p-6">
          <h1 className="ps-title">{mode === "staff" ? "Staff Login" : "Vendor Login"}</h1>
          <p className="ps-subtitle">
            {mode === "staff"
              ? "Login using Vendor ID and Staff ID (or email if enabled)."
              : "Login using Vendor ID and Email."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="ps-label">Vendor ID</label>
              <input
                className="ps-input"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                placeholder="694e8cb02c916acb5c6a7b8a"
                required
              />
            </div>

            {mode === "vendor" ? (
              <div>
                <label className="ps-label">Email</label>
                <input
                  className="ps-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendor@email.com"
                  required
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="ps-label">Staff ID</label>
                  <input
                    className="ps-input"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    placeholder="694e8cd32c916acb5c6a7b92"
                    required
                  />
                </div>

                <div>
                  <label className="ps-label">Email (optional)</label>
                  <input
                    className="ps-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@email.com (only if backend supports)"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="ps-label">Password</label>
              <input
                type="password"
                className="ps-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {err && (
              <div
                className="ps-card p-3"
                style={{
                  borderColor: "hsl(var(--destructive) / 0.45)",
                  background: "hsl(var(--destructive) / 0.10)",
                }}
              >
                <p style={{ color: "hsl(var(--destructive))" }} className="text-sm font-semibold">
                  {err}
                </p>
              </div>
            )}

            <button disabled={loading} className="ps-btn ps-btn-primary w-full">
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="ps-muted text-center text-sm">
              Use landing page to switch role.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
