import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function StaffDashboard() {
  return (
    <RoleGuard allow={["admin", "staff"]}>
      <PanelShell title="Staff • Dashboard">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Staff Dashboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You are logged in as Staff (assigned-jobs scope).
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
