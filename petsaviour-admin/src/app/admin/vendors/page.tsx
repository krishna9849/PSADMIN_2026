import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function AdminVendorsPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <PanelShell title="Admin • Vendors">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Vendors</h2>
          <p className="ps-muted mt-2">
            Coming next: vendor list, vendor details, onboard vendor.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
