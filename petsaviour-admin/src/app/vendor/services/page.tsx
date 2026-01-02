import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function VendorServicesPage() {
  return (
    <RoleGuard allow={["admin", "vendor"]}>
      <PanelShell title="Vendor • Services">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Services</h2>
          <p className="ps-muted mt-2">
            Coming next: services CRUD, activate/deactivate, pricing.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
