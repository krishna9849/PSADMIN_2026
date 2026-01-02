"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api/client";
import { EP } from "../../../lib/api/endpoints";
import { useAuthStore } from "../../../store/auth.store";
import { ThemeToggle } from "../../../components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await api.post(EP.auth.adminLogin, { email, password });
      const token: string | undefined = res.data?.token;
      if (!token) throw new Error("Token not found in response");

      setSession({ role: "admin", accessToken: token, refreshToken: null });
      router.replace("/admin/dashboard");
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
          <h1 className="ps-title">Admin Login</h1>
          <p className="ps-subtitle">Login with admin credentials</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="ps-label">Email</label>
              <input
                className="ps-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@petsaviour.com"
                required
              />
            </div>

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
          </form>
        </div>
      </div>
    </div>
  );
}
