import Link from "next/link";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Landing() {
  return (
    <div className="ps-glow min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="ps-badge" style={{ fontSize: "0.9rem" }}>
                PS
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight">
                PetSaviour Admin
              </h1>
            </div>
            <p className="ps-subtitle">Select your role to continue to the panel.</p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="hidden md:inline ps-muted text-xs">
              Light: Orange/White • Dark: Black/Orange
            </span>
            <ThemeToggle />
          </div>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <RoleCard
            title="Admin"
            desc="Full access across the entire PetSaviour system."
            href="/login/admin"
            badge="All modules"
          />
          <RoleCard
            title="Vendor"
            desc="Manage branches, staff, services, packages & orders."
            href="/login/vendor-staff?mode=vendor"
            badge="Own business"
          />
          <RoleCard
            title="Staff"
            desc="Assigned jobs, OTP verification, status updates & photos."
            href="/login/vendor-staff?mode=staff"
            badge="Assigned jobs"
          />
        </section>

        <div className="ps-card mt-10 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="ps-muted text-sm">
              After login, you’ll be redirected to the correct panel automatically.
            </p>
            <Link href="/login/admin" className="ps-link text-sm">
              Go to Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  title,
  desc,
  href,
  badge,
}: {
  title: string;
  desc: string;
  href: string;
  badge: string;
}) {
  return (
    <Link href={href} className="ps-card ps-card-hover block p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
          <p className="mt-2 ps-muted text-sm">{desc}</p>
        </div>
        <span className="ps-badge shrink-0">{badge}</span>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 ps-primary text-sm font-bold">
        Continue <span className="transition group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}
