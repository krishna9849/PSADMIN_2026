import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function VendorPackagesPage() {
  return (
    <RoleGuard allow={["admin", "vendor"]}>
      <PanelShell title="Vendor • Packages">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Packages</h2>
          <p className="ps-muted mt-2">
            Coming next: packages CRUD, bundle services, price setup.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
