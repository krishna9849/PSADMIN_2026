"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";
import { toast } from "../../../lib/ui/toast";
import {
  VendorProfileState,
  VendorProfileLive,
  VendorProfileDraft,
} from "../../../lib/types/vendor";
import { VendorAPI } from "../../../lib/api/vendor";

const MOCK_LIVE: VendorProfileLive = {
  businessName: "Happy Paws Grooming",
  phone: "+91 98765 43210",
  email: "contact@happypaws.com",
  address: "Bangalore, India",
};

export default function VendorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<VendorProfileState>({
    live: MOCK_LIVE,
    status: "none",
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<VendorProfileDraft | null>(null);

  useEffect(() => {
    // When backend ready, load profile here
    // VendorAPI.getProfile().then(...)
    setLoading(false);
  }, []);

  function startEdit() {
    setDraft(profile.draft ?? profile.live);
    setEditing(true);
  }

  function discardDraft() {
    setDraft(null);
    setEditing(false);
    toast.success("Draft discarded 🐾");
  }

  async function saveDraft() {
    if (!draft) return;
    // await VendorAPI.saveDraft(draft);
    setProfile((p) => ({ ...p, draft }));
    toast.success("Draft saved 🐾");
  }

  async function submitForApproval() {
    // await VendorAPI.submitProfileRequest();
    setProfile((p) => ({
      ...p,
      status: "pending",
      adminNote: null,
    }));
    setEditing(false);
    toast.success("Profile sent for approval 🐶");
  }

  const statusBadge = () => {
    if (profile.status === "pending")
      return <span className="ps-badge">Pending 🐾</span>;
    if (profile.status === "approved")
      return <span className="ps-badge">Approved ✅</span>;
    if (profile.status === "rejected")
      return (
        <span
          className="ps-badge"
          style={{
            background: "hsl(var(--destructive) / 0.12)",
            color: "hsl(var(--destructive))",
            borderColor: "hsl(var(--destructive) / 0.35)",
          }}
        >
          Rejected 😿
        </span>
      );
    return <span className="ps-badge">Live</span>;
  };

  if (loading) {
    return (
      <RoleGuard allow={["vendor"]}>
        <PanelShell title="Vendor • Profile">
          <div className="ps-card p-6">Loading...</div>
        </PanelShell>
      </RoleGuard>
    );
  }

  const view = editing && draft ? draft : profile.live;

  return (
    <RoleGuard allow={["vendor"]}>
      <PanelShell title="Vendor • Profile">
        <div className="ps-card p-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                Vendor Profile
              </h2>
              <p className="ps-muted mt-1">
                Changes require admin approval before going live.
              </p>
            </div>
            {statusBadge()}
          </div>

          {/* Admin note */}
          {profile.status === "rejected" && profile.adminNote && (
            <div
              className="ps-card mt-4 p-4"
              style={{
                background: "hsl(var(--destructive) / 0.10)",
                borderColor: "hsl(var(--destructive) / 0.35)",
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "hsl(var(--destructive))" }}
              >
                Admin note: {profile.adminNote}
              </p>
            </div>
          )}

          {/* Form */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field
              label="Business Name"
              value={view.businessName}
              editable={editing}
              onChange={(v) => setDraft((d) => d && { ...d, businessName: v })}
            />
            <Field
              label="Phone"
              value={view.phone}
              editable={editing}
              onChange={(v) => setDraft((d) => d && { ...d, phone: v })}
            />
            <Field
              label="Email"
              value={view.email}
              editable={editing}
              onChange={(v) => setDraft((d) => d && { ...d, email: v })}
            />
            <Field
              label="Address"
              value={view.address}
              editable={editing}
              onChange={(v) => setDraft((d) => d && { ...d, address: v })}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            {!editing && profile.status !== "pending" && (
              <button className="ps-btn ps-btn-primary" onClick={startEdit}>
                Edit Draft
              </button>
            )}

            {editing && (
              <>
                <button className="ps-btn ps-btn-secondary" onClick={saveDraft}>
                  Save Draft
                </button>
                <button
                  className="ps-btn ps-btn-primary"
                  onClick={submitForApproval}
                >
                  Submit for Approval
                </button>
                <button className="ps-btn ps-btn-ghost" onClick={discardDraft}>
                  Discard
                </button>
              </>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 ps-card p-4">
            <p className="ps-muted text-sm">
              🐾 After approval, your updated profile will be visible to
              customers.
            </p>
          </div>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}

function Field({
  label,
  value,
  editable,
  onChange,
}: {
  label: string;
  value: string;
  editable: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="ps-label">{label}</label>
      {editable ? (
        <input
          className="ps-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="ps-input bg-transparent">{value}</div>
      )}
    </div>
  );
}
