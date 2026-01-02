"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api/client";
import { EP } from "../../../lib/api/endpoints";
import { useAuthStore } from "../../../store/auth.store";
import { toast } from "../../../lib/ui/toast";

export default function VendorStaffLoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vendorId, setVendorId] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await api.post(EP.auth.vendorStaffLogin, {
        email,
        password,
        vendorId,
      });

      const {
        token,
        role,
        staffRole,
        vendorId: vId,
        staffId,
        branchId,
      } = res.data;

      if (!token || !role) throw new Error("Invalid login response");

      setSession({
        token,
        backendRole: role,
        staffRole,
        vendorId: vId,
        staffId,
        branchId,
        email,
      });

      toast.success("Welcome to PetSaviour 🐾");

      if (role === "vendor" && staffRole === "vendor_admin") {
        router.replace("/vendor/dashboard");
      } else {
        router.replace("/staff/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="ps-glow min-h-screen">
      <div className="mx-auto max-w-md px-4 py-10">
        <Link href="/" className="ps-link text-sm">
          ← Back
        </Link>

        <div className="ps-card mt-6 p-6">
          <h1 className="ps-title">Vendor / Staff Login</h1>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              className="ps-input"
              placeholder="Vendor ID"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
            />
            <input
              className="ps-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="ps-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="ps-btn ps-btn-primary w-full">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
