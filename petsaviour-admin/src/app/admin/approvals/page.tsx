import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

type RequestStatus = "pending" | "approved" | "rejected";
type RequestType = "vendor_profile" | "branch" | "service" | "package";

const demoQueue: {
  id: string;
  vendorName: string;
  type: RequestType;
  title: string;
  status: RequestStatus;
  submittedAt: string;
}[] = [
  {
    id: "REQ-1001",
    vendorName: "Happy Paws Grooming",
    type: "vendor_profile",
    title: "Update Vendor Profile (phone/address/logo)",
    status: "pending",
    submittedAt: "10 mins ago",
  },
  {
    id: "REQ-1004",
    vendorName: "Purrfect Care",
    type: "service",
    title: "Request New Service: Cat Nail Trim",
    status: "pending",
    submittedAt: "1 hour ago",
  },
  {
    id: "REQ-1002",
    vendorName: "Happy Paws Grooming",
    type: "package",
    title: "Update Package Pricing: Monthly Grooming Plan",
    status: "approved",
    submittedAt: "Yesterday",
  },
];

function typeLabel(t: RequestType) {
  if (t === "vendor_profile") return "Vendor Profile";
  if (t === "branch") return "Branch";
  if (t === "service") return "Service";
  return "Package";
}

function statusPill(status: RequestStatus) {
  if (status === "approved") return { text: "Approved ✅", bg: "hsl(var(--primary) / 0.12)", bd: "hsl(var(--primary) / 0.25)", fg: "hsl(var(--primary))" };
  if (status === "rejected") return { text: "Rejected 😿", bg: "hsl(var(--destructive) / 0.10)", bd: "hsl(var(--destructive) / 0.35)", fg: "hsl(var(--destructive))" };
  return { text: "Pending 🐾", bg: "hsl(var(--muted))", bd: "hsl(var(--border))", fg: "hsl(var(--foreground))" };
}

export default function AdminApprovalsPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <PanelShell title="Admin • Approvals">
        <div className="ps-card p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Approvals Queue</h2>
              <p className="ps-muted mt-1">
                Vendors submit requests. Approve or reject with a reason. Approved changes go live.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="ps-btn ps-btn-ghost">All</button>
              <button className="ps-btn ps-btn-secondary">Pending</button>
              <button className="ps-btn ps-btn-ghost">Approved</button>
              <button className="ps-btn ps-btn-ghost">Rejected</button>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {demoQueue.map((r) => {
              const pill = statusPill(r.status);

              return (
                <div key={r.id} className="ps-card p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="ps-badge">{typeLabel(r.type)}</span>
                        <span className="ps-muted text-xs">{r.id} • {r.submittedAt}</span>
                      </div>

                      <div className="mt-2 text-base font-extrabold tracking-tight">
                        {r.title}
                      </div>

                      <div className="ps-muted mt-2 text-sm">
                        Vendor: <span className="ps-primary font-extrabold">{r.vendorName}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <div
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold"
                        style={{
                          background: pill.bg,
                          border: `1px solid ${pill.bd}`,
                          color: pill.fg,
                        }}
                      >
                        {pill.text}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button className="ps-btn ps-btn-secondary">View</button>
                        <button className="ps-btn ps-btn-primary">Approve</button>
                        <button
                          className="ps-btn ps-btn-ghost"
                          style={{
                            borderColor: "hsl(var(--destructive) / 0.30)",
                            color: "hsl(var(--destructive))",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 ps-card p-4">
                    <p className="ps-muted text-sm">
                      Next: add “Before vs After” diff + mandatory rejection reason + audit log.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
