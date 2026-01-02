import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function VendorBranchesPage() {
  return (
    <RoleGuard allow={["admin", "vendor"]}>
      <PanelShell title="Vendor • Branches">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Branches</h2>
          <p className="ps-muted mt-2">
            Coming next: CRUD branches for vendor.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
