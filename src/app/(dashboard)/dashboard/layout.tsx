import SideBar from "@/components/dashboard/SideBar";
import { getCurrentUser } from "@/lib/auth/authLib";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News App",
  description: "Dashboard Page ",
};

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  return (
    <>
      <SideBar role={user?.role} />
      {children}
    </>
  );
}
