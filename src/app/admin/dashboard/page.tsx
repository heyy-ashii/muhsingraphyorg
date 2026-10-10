import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DashboardClient } from "@/components/admin/dashboard-client";

export const metadata: Metadata = {
  title: "Curator Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  if (isSupabaseConfigured) {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    if (!user) redirect("/admin/login?next=/admin/dashboard");
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  return <DashboardClient email={user?.email ?? "preview@muhsingraphy.com"} />;
}
