import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function StaffOrdersPage() {
  return (
    <RoleGuard allow={["admin", "staff"]}>
      <PanelShell title="Staff • Orders">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Orders</h2>
          <p className="ps-muted mt-2">
            Staff sees assigned/related orders. Next: filters + order detail.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
