import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function VendorDashboard() {
  return (
    <RoleGuard allow={["admin", "vendor"]}>
      <PanelShell title="Vendor • Dashboard">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Vendor Dashboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You are logged in as Vendor (own-business scope).
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
