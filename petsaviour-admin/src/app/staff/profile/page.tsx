import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function StaffProfilePage() {
  return (
    <RoleGuard allow={["admin", "staff"]}>
      <PanelShell title="Staff • Profile">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Profile</h2>
          <p className="ps-muted mt-2">
            Coming next: view/update profile, change password.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
