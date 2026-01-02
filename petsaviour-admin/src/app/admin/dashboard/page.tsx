import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function AdminDashboard() {
  return (
    <RoleGuard allow={["admin"]}>
      <PanelShell title="Admin • Dashboard">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Step 3 complete. Next steps will add real modules + menus.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
