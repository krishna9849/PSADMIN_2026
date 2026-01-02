import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function StaffStaffPage() {
  return (
    <RoleGuard allow={["admin", "staff"]}>
      <PanelShell title="Staff • Team (View)">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Team</h2>
          <p className="ps-muted mt-2">
            View-only staff list for staff role (default).
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
