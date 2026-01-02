import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function VendorOrdersPage() {
  return (
    <RoleGuard allow={["admin", "vendor"]}>
      <PanelShell title="Vendor • Orders">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Orders</h2>
          <p className="ps-muted mt-2">
            Coming next: vendor orders list, assign staff, status updates.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
