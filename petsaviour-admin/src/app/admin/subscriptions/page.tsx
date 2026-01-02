import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function AdminSubscriptionsPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <PanelShell title="Admin • Subscriptions">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Subscriptions</h2>
          <p className="ps-muted mt-2">
            Coming next: plans, vendor subscriptions, trials, cancel operations.
          </p>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
