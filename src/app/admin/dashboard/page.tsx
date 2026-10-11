import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseContext } from "@/lib/supabase/context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DashboardClient } from "@/components/admin/dashboard-client";

export const metadata: Metadata = {
  title: "Curator Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  if (isSupabaseConfigured) {
    // `auth: 'user'` verifies the session JWT against JWKS before the dashboard
    // renders; middleware has already refreshed the cookie.
    const { data: ctx, error } = await createSupabaseContext({ auth: "user" });
    if (error || !ctx?.userClaims) redirect("/admin/login?next=/admin/dashboard");
    return (
      <DashboardClient
        email={ctx.userClaims.email ?? "curator@muhsingraphy.com"}
        userMetadata={ctx.userClaims.userMetadata}
      />
    );
  }

  return <DashboardClient email="preview@muhsingraphy.com" />;
}
