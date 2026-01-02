import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function StaffBranchesPage() {
  return (
    <RoleGuard allow={["admin", "staff"]}>
      <PanelShell title="Staff • Branches (View)">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Branches</h2>
          <p className="ps-muted mt-2">
            View-only for staff by default. Vendor can enable edit later.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
