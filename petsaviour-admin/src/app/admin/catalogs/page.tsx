import { RoleGuard } from "../../../components/layout/RoleGuard";
import { PanelShell } from "../../../components/layout/PanelShell";

export default function AdminCatalogsPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <PanelShell title="Admin • Catalogs">
        <div className="ps-card p-6">
          <h2 className="text-lg font-extrabold tracking-tight">Default Catalogs</h2>
          <p className="ps-muted mt-2">
            This is the master catalog used across PetSaviour. Vendors will select from this catalog,
            and request additions/changes via Approvals.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="ps-card p-5">
              <div className="text-base font-extrabold tracking-tight">Service Catalog</div>
              <p className="ps-muted mt-2 text-sm">
                Create/organize services, categories, and base pricing templates.
              </p>
              <div className="mt-4 flex gap-2">
                <button className="ps-btn ps-btn-primary">Manage Services</button>
                <button className="ps-btn ps-btn-secondary">Categories</button>
              </div>
            </div>

            <div className="ps-card p-5">
              <div className="text-base font-extrabold tracking-tight">Package Templates</div>
              <p className="ps-muted mt-2 text-sm">
                Optional: define package templates vendors can adopt and customize via requests.
              </p>
              <div className="mt-4 flex gap-2">
                <button className="ps-btn ps-btn-primary">Manage Templates</button>
                <button className="ps-btn ps-btn-ghost">Later</button>
              </div>
            </div>
          </div>

          <div className="mt-6 ps-card p-4">
            <p className="ps-muted text-sm">
              Next: connect catalogs APIs + link vendor “Services” page to select from catalog.
            </p>
          </div>
        </div>
      </PanelShell>
    </RoleGuard>
  );
}
