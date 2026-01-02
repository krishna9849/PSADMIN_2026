"use client";

import { useEffect, useMemo, useState } from "react";
import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";
import { toast } from "../../../lib/ui/toast";
import { onboardVendor, listVendorsByAddress, type Vendor } from "../../../features/admin/vendors/vendors.api";

function safeLower(v: any) {
  return String(v ?? "").toLowerCase();
}

export default function AdminVendorsPage() {
  const [loading, setLoading] = useState(false);

  // server pagination (works now + future-proof)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // server response meta
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  // data
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // ui filters (client-side now; can move to server later)
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(""); // pending/approved/rejected
  const [activeStatus, setActiveStatus] = useState(""); // active/inactive

  // modal
  const [open, setOpen] = useState(false);

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  async function load(p = page, l = limit) {
    setLoading(true);
    try {
      const resp = await listVendorsByAddress({ page: p, limit: l });

      const items = resp?.data?.vendors ?? [];
      const list = items.map((x) => x.vendor);

      setVendors(list);
      setPage(resp.data.page ?? p);
      setLimit(resp.data.limit ?? l);
      setTotal(resp.data.total ?? list.length);
      setTotalPages(resp.data.totalPages ?? 1);
      setHasNext(Boolean(resp.data.hasNext));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = safeLower(search.trim());
    return vendors.filter((v) => {
      const matchesSearch =
        !s ||
        safeLower(v.name).includes(s) ||
        safeLower(v.email).includes(s) ||
        safeLower(v.phone).includes(s) ||
        safeLower(v._id).includes(s);

      const vApproval = safeLower(v.approvals?.meta?.status);
      const matchesApproval = !approvalStatus || vApproval === safeLower(approvalStatus);

      const vStatus = safeLower(v.status);
      const matchesActive = !activeStatus || vStatus === safeLower(activeStatus);

      return matchesSearch && matchesApproval && matchesActive;
    });
  }, [vendors, search, approvalStatus, activeStatus]);

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setLogoUrl("");
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("🐾 Vendor name and email are required");
      return;
    }

    setLoading(true);
    try {
      await onboardVendor({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        logoUrl: logoUrl.trim() ? logoUrl.trim() : null,
      });

      toast.success("🐾 Vendor onboarded successfully!");
      setOpen(false);
      resetForm();

      // refresh first page
      await load(1, limit);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Onboard vendor failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RoleGuard allow={["admin"]}>
      <PanelShell title="Admin • Vendors">
        <div className="ps-card p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Vendors</h2>
              <p className="ps-muted mt-1 text-sm">
                Onboard vendors and monitor approval status (meta approvals). 🐾
              </p>
            </div>

            <button className="ps-btn ps-btn-primary" onClick={() => setOpen(true)}>
              + Onboard Vendor
            </button>
          </div>

          {/* Filters */}
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <input
              className="ps-input"
              placeholder="Search name/email/phone/id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select className="ps-input" value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)}>
              <option value="">All approvals</option>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>

            <select className="ps-input" value={activeStatus} onChange={(e) => setActiveStatus(e.target.value)}>
              <option value="">All status</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>

            <div className="flex gap-2">
              <button className="ps-btn ps-btn-secondary w-full" onClick={() => load(1, limit)}>
                Refresh
              </button>
              <button
                className="ps-btn ps-btn-ghost w-full"
                onClick={() => {
                  setSearch("");
                  setApprovalStatus("");
                  setActiveStatus("");
                  toast.success("Filters cleared 🐶");
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* List */}
          <div className="mt-6 ps-card p-0 overflow-hidden">
            <div
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderBottom: "1px solid hsl(var(--border))" }}
            >
              <div className="text-sm font-extrabold tracking-tight">
                Vendor Accounts
                <span className="ps-muted ml-2 text-xs">
                  (server total: {total}, showing: {filtered.length})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="ps-muted text-xs">
                  Page {page} / {totalPages}
                </span>
                <button
                  className="ps-btn ps-btn-ghost"
                  disabled={loading || page <= 1}
                  onClick={() => load(page - 1, limit)}
                >
                  ← Prev
                </button>
                <button
                  className="ps-btn ps-btn-ghost"
                  disabled={loading || !hasNext || page >= totalPages}
                  onClick={() => load(page + 1, limit)}
                >
                  Next →
                </button>

                <select
                  className="ps-input"
                  value={limit}
                  onChange={(e) => {
                    const l = Number(e.target.value || 20);
                    setLimit(l);
                    load(1, l);
                  }}
                  style={{ width: 120 }}
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase">
                  <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Approval</th>
                    <th className="px-4 py-3">Vendor ID</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center ps-muted">
                        No vendors found. 🐾
                      </td>
                    </tr>
                  )}

                  {filtered.map((v) => (
                    <tr key={v._id} style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                      <td className="px-4 py-3 font-semibold">{v.name || "—"}</td>
                      <td className="px-4 py-3">{v.email || "—"}</td>
                      <td className="px-4 py-3">{v.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="ps-badge">{v.status || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="ps-badge">{v.approvals?.meta?.status || "—"}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs ps-muted">{v._id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0.45)" }}
                onClick={() => setOpen(false)}
              />
              <div className="relative w-full max-w-lg ps-card p-0 overflow-hidden">
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: "1px solid hsl(var(--border))" }}
                >
                  <div>
                    <div className="text-base font-extrabold tracking-tight">Onboard Vendor</div>
                    <div className="ps-muted text-xs">Creates vendor in system 🐾</div>
                  </div>
                  <button className="ps-btn ps-btn-ghost" onClick={() => setOpen(false)}>
                    ✕
                  </button>
                </div>

                <form onSubmit={onCreate} className="px-5 py-4 space-y-3">
                  <div>
                    <label className="ps-label">Vendor Name *</label>
                    <input className="ps-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Pawsome Grooming" />
                  </div>

                  <div>
                    <label className="ps-label">Email *</label>
                    <input className="ps-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="pawsome@example.com" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="ps-label">Phone</label>
                      <input className="ps-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9999999999" />
                    </div>
                    <div>
                      <label className="ps-label">Logo URL</label>
                      <input className="ps-input" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
                    </div>
                  </div>

                  <div>
                    <label className="ps-label">Address</label>
                    <input className="ps-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="MG Road, Bengaluru" />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" className="ps-btn ps-btn-secondary" onClick={() => setOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="ps-btn ps-btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Create Vendor"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
