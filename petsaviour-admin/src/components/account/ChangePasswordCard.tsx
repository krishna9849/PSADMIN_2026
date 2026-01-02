"use client";

import { useState } from "react";
import { api } from "../../lib/api/client";
import { EP } from "../../lib/api/endpoints";
import { toast } from "../../lib/ui/toast";

type Props = {
  title?: string;
};

export function ChangePasswordCard({ title = "Change Password" }: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error("Please fill all required fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      // API doc lists the endpoint but payload is marked TODO.
      // Using the most common contract: oldPassword + newPassword.
      const res = await api.post(EP.vendorStaff.changePassword, {
        oldPassword,
        newPassword,
      });

      toast.success(res?.data?.message || "Password updated 🐾");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ps-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
          <p className="ps-muted mt-1 text-sm">
            Update your password. You’ll stay logged in unless your backend
            invalidates the token.
          </p>
        </div>
        <span className="ps-badge">Security 🔒</span>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-lg">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Current password</span>
          <input
            type="password"
            className="ps-input"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            autoComplete="current-password"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">New password</span>
          <input
            type="password"
            className="ps-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            autoComplete="new-password"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Confirm new password</span>
          <input
            type="password"
            className="ps-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            required
          />
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="ps-button"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            className="ps-button ps-button-ghost"
            onClick={() => {
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        <div className="ps-muted text-xs">
          Tip: If the backend returns a validation error, copy that message and
          send it to me — we’ll adjust the request body fields.
        </div>
      </form>
    </div>
  );
}
