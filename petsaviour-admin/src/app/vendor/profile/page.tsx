"use client";

import { useEffect, useMemo, useState } from "react";
import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";
import { toast } from "../../../lib/ui/toast";
import {
  VendorProfileState,
  VendorProfileLive,
  VendorProfileDraft,
  ApprovalStatus,
} from "../../../lib/types/vendor";
import { VendorAPI, Vendor } from "../../../lib/api/vendor";
import { useAuthStore } from "../../../store/auth.store";

const EMPTY_LIVE: VendorProfileLive = {
  businessName: "",
  phone: "",
  email: "",
  address: "",
};

function mapApprovalStatus(raw?: string): ApprovalStatus {
  const v = String(raw || "").toLowerCase();
  if (v === "pending") return "pending";
  if (v === "approved") return "approved";
  if (v === "rejected") return "rejected";
  return "none";
}

export default function VendorProfilePage() {
  const session = useAuthStore((s) => s.session);

  const vendorId = session.vendorId ?? null;

  const [loading, setLoading] = useState(true);

  const [vendor, setVendor] = useState<Vendor | null>(null);

  const [profile, setProfile] = useState<VendorProfileState>({
    live: EMPTY_LIVE,
    status: "none",
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<VendorProfileDraft | null>(null);

  // Phone verification UI state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const emailVerified = !!vendor?.contact?.emailVerified;
  const phoneVerified = !!vendor?.contact?.phoneVerified;

  const phoneNumber = useMemo(() => {
    return String(vendor?.phone || "").trim();
  }, [vendor?.phone]);

  async function loadVendor() {
    if (!vendorId) {
      toast.error("Vendor ID missing. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const v = await VendorAPI.getVendorById(vendorId);
      setVendor(v);

      setProfile({
        live: {
          businessName: v?.name ?? "",
          phone: v?.phone ?? "",
          email: v?.email ?? "",
          address: (v as any)?.address ?? "",
        },
        status: mapApprovalStatus(v?.approvals?.meta?.status),
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load vendor profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

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
    // Profile update is NOT part of this step. We only keep draft locally.
    setProfile((p) => ({ ...p, draft }));
    toast.success("Draft saved 🐾");
  }

  async function submitForApproval() {
    // Not implementing approval submission now (this step is ONLY phone verification).
    toast.error("Complete phone verification first. Profile update comes next step.");
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

  async function onSendOtp() {
    if (!vendorId) return;

    if (!phoneNumber) {
      toast.error("Phone number not found on vendor profile");
      return;
    }

    setSendingOtp(true);
    try {
      const res = await VendorAPI.sendPhoneOtp(vendorId, phoneNumber);

      const dbg = res?.debugOtp || res?.otp;
      if (dbg) {
        toast.success(`OTP sent 🐾 (debug: ${dbg})`);
      } else {
        toast.success("OTP sent 🐾");
      }

      setOtpSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  }

  async function onVerifyOtp() {
    if (!vendorId) return;

    if (!phoneNumber) {
      toast.error("Phone number not found on vendor profile");
      return;
    }

    if (!otp.trim()) {
      toast.error("Enter OTP");
      return;
    }

    setVerifyingOtp(true);
    try {
      await VendorAPI.verifyPhoneOtp(vendorId, phoneNumber, otp.trim());
      toast.success("Phone verified ✅");

      // Reset OTP UI and refresh vendor flags
      setOtp("");
      setOtpSent(false);

      await loadVendor();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  }

  const view = editing && draft ? draft : profile.live;

  const canEdit = phoneVerified; // ✅ enforce: verify phone first (email is display-only)

  if (loading) {
    return (
      <RoleGuard allow={["vendor"]}>
        <PanelShell title="Vendor • Profile">
          <div className="ps-card p-6">Loading...</div>
        </PanelShell>
      </RoleGuard>
    );
  }

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
                First verify your phone number. Profile updates will be enabled next.
              </p>
            </div>
            {statusBadge()}
          </div>

          {/* Verification section (THIS STEP) */}
          <div className="mt-5 ps-card p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-extrabold tracking-tight">
                  Verification Status 🐾
                </div>
                <div className="ps-muted mt-1 text-sm">
                  Email is verified via Gmail. Phone verification uses OTP.
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="ps-badge">
                  Email: {emailVerified ? "✅ Verified" : "❌ Not Verified"}
                </span>
                <span
                  className="ps-badge"
                  style={
                    phoneVerified
                      ? undefined
                      : {
                          background: "hsl(var(--destructive) / 0.10)",
                          color: "hsl(var(--destructive))",
                          borderColor: "hsl(var(--destructive) / 0.35)",
                        }
                  }
                >
                  Phone: {phoneVerified ? "✅ Verified" : "❌ Not Verified"}
                </span>
              </div>
            </div>

            {!phoneVerified && (
              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <label className="ps-label">Registered Phone</label>
                  <div className="ps-input bg-transparent">
                    {phoneNumber || "—"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="ps-btn ps-btn-secondary"
                    onClick={onSendOtp}
                    disabled={sendingOtp}
                  >
                    {sendingOtp ? "Sending..." : "Send OTP"}
                  </button>
                </div>

                {otpSent && (
                  <>
                    <div>
                      <label className="ps-label">Enter OTP</label>
                      <input
                        className="ps-input"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit OTP"
                        inputMode="numeric"
                      />
                      <p className="ps-muted mt-1 text-xs">
                        Didn’t receive? You can resend OTP.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        className="ps-btn ps-btn-primary"
                        onClick={onVerifyOtp}
                        disabled={verifyingOtp}
                      >
                        {verifyingOtp ? "Verifying..." : "Verify OTP"}
                      </button>
                      <button
                        className="ps-btn ps-btn-ghost"
                        onClick={onSendOtp}
                        disabled={sendingOtp}
                      >
                        Resend
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {phoneVerified && (
              <div className="mt-4 ps-muted text-sm">
                ✅ Phone verified. Next step we will enable profile update + approval workflow.
              </div>
            )}
          </div>

          {/* Form (kept as-is, but gated until phone verified) */}
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
              editable={false} // don't edit phone here; verification uses registered phone
              onChange={() => {}}
            />
            <Field
              label="Email"
              value={view.email}
              editable={false} // email verification via Gmail - display only
              onChange={() => {}}
            />
            <Field
              label="Address"
              value={view.address}
              editable={editing}
              onChange={(v) => setDraft((d) => d && { ...d, address: v })}
            />
          </div>

          {/* Actions (disabled until phone verified) */}
          <div className="mt-6 flex flex-wrap gap-2">
            {!editing && profile.status !== "pending" && (
              <button
                className="ps-btn ps-btn-primary"
                onClick={startEdit}
                disabled={!canEdit}
                title={!canEdit ? "Verify phone to edit profile" : ""}
                style={!canEdit ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
              >
                Edit Draft
              </button>
            )}

            {editing && (
              <>
                <button
                  className="ps-btn ps-btn-secondary"
                  onClick={saveDraft}
                  disabled={!canEdit}
                  title={!canEdit ? "Verify phone to edit profile" : ""}
                  style={!canEdit ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
                >
                  Save Draft
                </button>
                <button
                  className="ps-btn ps-btn-primary"
                  onClick={submitForApproval}
                  disabled={!canEdit}
                  title={!canEdit ? "Verify phone to submit profile" : ""}
                  style={!canEdit ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
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
              🐾 Phone verification is mandatory. Next step we’ll wire profile update + approvals.
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
        <div className="ps-input bg-transparent">{value || "—"}</div>
      )}
    </div>
  );
}
