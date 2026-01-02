import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function StaffServicesPage() {
  return (
    <RoleGuard allow={["admin", "staff"]}>
      <PanelShell title="Staff • Services (View)">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Services</h2>
          <p className="ps-muted mt-2">
            View-only services for staff (default).
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
