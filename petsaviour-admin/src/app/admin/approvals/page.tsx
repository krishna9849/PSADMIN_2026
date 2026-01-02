import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function AdminApprovalsPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <PanelShell title="Admin • Approvals">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Approvals</h2>
          <p className="ps-muted mt-2">
            Coming next: approval requests list, approve/reject workflows.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
