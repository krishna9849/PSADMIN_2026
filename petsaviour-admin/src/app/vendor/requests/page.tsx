import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

type RequestStatus = "pending" | "approved" | "rejected";
type RequestType = "vendor_profile" | "branch" | "service" | "package";

const demoRequests: {
  id: string;
  type: RequestType;
  title: string;
  status: RequestStatus;
  createdAt: string;
  note?: string;
}[] = [
  {
    id: "REQ-1001",
    type: "vendor_profile",
    title: "Update Vendor Profile (phone/address/logo)",
    status: "pending",
    createdAt: "Today",
    note: "Waiting for admin review 🐾",
  },
  {
    id: "REQ-1002",
    type: "service",
    title: "Add New Service: Premium Bath + De-shedding",
    status: "approved",
    createdAt: "Yesterday",
    note: "Approved ✅ Now visible to customers",
  },
  {
    id: "REQ-1003",
    type: "package",
    title: "Update Package Pricing: Monthly Grooming Plan",
    status: "rejected",
    createdAt: "2 days ago",
    note: "Rejected 😿 Please revise and resubmit",
  },
];

function statusPill(status: RequestStatus) {
  if (status === "approved") return { text: "Approved ✅", bg: "hsl(var(--primary) / 0.12)", bd: "hsl(var(--primary) / 0.25)", fg: "hsl(var(--primary))" };
  if (status === "rejected") return { text: "Rejected 😿", bg: "hsl(var(--destructive) / 0.10)", bd: "hsl(var(--destructive) / 0.35)", fg: "hsl(var(--destructive))" };
  return { text: "Pending 🐾", bg: "hsl(var(--muted))", bd: "hsl(var(--border))", fg: "hsl(var(--foreground))" };
}

function typeLabel(t: RequestType) {
  if (t === "vendor_profile") return "Vendor Profile";
  if (t === "branch") return "Branch";
  if (t === "service") return "Service";
  return "Package";
}

export default function VendorRequestsPage() {
  return (
    <RoleGuard allow={["vendor"]}>
      <PanelShell title="Vendor • Requests">
        <div className="ps-card p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Requests (Approval Workflow)</h2>
              <p className="ps-muted mt-1">
                Any change you make becomes a request. Admin approval makes it live to customers.
              </p>
            </div>

            <button className="ps-btn ps-btn-primary">
              + Create Request
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            {demoRequests.map((r) => {
              const pill = statusPill(r.status);

              return (
                <div key={r.id} className="ps-card p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="ps-badge">{typeLabel(r.type)}</span>
                        <span className="ps-muted text-xs">{r.id} • {r.createdAt}</span>
                      </div>
                      <div className="mt-2 text-base font-extrabold tracking-tight">
                        {r.title}
                      </div>
                      {r.note && <div className="ps-muted mt-2 text-sm">{r.note}</div>}
                    </div>

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
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="ps-btn ps-btn-secondary">View Details</button>
                    <button className="ps-btn ps-btn-ghost">Duplicate</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 ps-card p-4">
            <p className="ps-muted text-sm">
              Next: we’ll connect this to real APIs (create request, list requests, approve/reject reasons).
            </p>
          </div>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
