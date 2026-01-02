import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function AdminOrdersPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <PanelShell title="Admin • Orders">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Orders</h2>
          <p className="ps-muted mt-2">
            Coming next: global orders list, filters, detail view, status actions.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
