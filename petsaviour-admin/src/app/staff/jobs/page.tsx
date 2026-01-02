import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function StaffJobsPage() {
  return (
    <RoleGuard allow={["admin", "staff"]}>
      <PanelShell title="Staff • Jobs">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Jobs</h2>
          <p className="ps-muted mt-2">
            Coming next: assigned jobs list + OTP + before/after upload.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
