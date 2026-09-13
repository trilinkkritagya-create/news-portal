import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/auth/authLib";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsroom Dashboard · News Portal",
  description: "Editorial Newsroom and Content Operations Console",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <DashboardShell role={user?.role} user={user}>
      {children}
    </DashboardShell>
  );
}
