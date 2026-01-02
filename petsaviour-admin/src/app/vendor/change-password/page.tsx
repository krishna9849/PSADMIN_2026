"use client";

import { useState } from "react";
import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";
import { api } from "../../../lib/api/client";
import { EP } from "../../../lib/api/endpoints";
import { toast } from "../../../lib/ui/toast";

export default function VendorChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!oldPassword.trim() || !newPassword.trim()) {
      toast.error("Please enter current and new password 😿");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters 😿");
      return;
    }

    if (newPassword !== confirm) {
      toast.error("New password and confirm password do not match 😿");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(EP.vendorStaff.changePassword, {
        oldPassword,
        newPassword,
      });

      toast.success(res?.data?.message || "Password updated 🐾");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password 😿");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RoleGuard allow={["admin", "vendor"]}>
      <PanelShell title="Vendor • Change Password">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Change Password</h2>
          <p className="ps-muted mt-2 text-sm">
            Update your password securely. (Authorization header is auto-attached.)
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid max-w-lg gap-4">
            <div>
              <label className="ps-label">Current Password</label>
              <input
                type="password"
                className="ps-input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="ps-label">New Password</label>
              <input
                type="password"
                className="ps-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="ps-label">Confirm New Password</label>
              <input
                type="password"
                className="ps-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter new password"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button className="ps-btn ps-btn-primary" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>

              <button
                type="button"
                className="ps-btn ps-btn-ghost"
                disabled={loading}
                onClick={() => {
                  setOldPassword("");
                  setNewPassword("");
                  setConfirm("");
                }}
              >
                Clear
              </button>
            </div>

            <p className="ps-muted text-xs">
              If the backend expects different field names, copy the exact error message and send it
              to me — we’ll adjust instantly.
            </p>
          </form>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
