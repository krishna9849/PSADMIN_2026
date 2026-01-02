import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function VendorStaffPage() {
  return (
    <RoleGuard allow={["admin", "vendor"]}>
      <PanelShell title="Vendor • Staff">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Staff</h2>
          <p className="ps-muted mt-2">
            Coming next: create staff, update staff, enable/disable, assign to branch.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
