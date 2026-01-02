import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function AdminCouponsPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <PanelShell title="Admin • Coupons">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Coupons</h2>
          <p className="ps-muted mt-2">Coming next: create/list/disable coupons.</p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
