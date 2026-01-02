import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function VendorProfilePage() {
  return (
    <RoleGuard allow={["admin", "vendor"]}>
      <PanelShell title="Vendor • Profile">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Profile</h2>
          <p className="ps-muted mt-2">
            Coming next: vendor profile view/update.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
