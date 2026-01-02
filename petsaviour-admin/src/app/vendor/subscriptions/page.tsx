import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function VendorSubscriptionPage() {
  return (
    <RoleGuard allow={["admin", "vendor"]}>
      <PanelShell title="Vendor • Subscription">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Subscription</h2>
          <p className="ps-muted mt-2">
            Coming next: purchase plan, view status, history.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
