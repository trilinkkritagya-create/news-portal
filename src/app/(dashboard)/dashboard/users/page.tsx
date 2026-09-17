import React from "react";
import { getCurrentUser } from "@/lib/auth/authLib";
import UsersManagementView from "@/components/dashboard/UsersManagementView";
import { getUsersDashboardData } from "@/lib/dashboard/get-users-data";

export default async function UsersPage() {
  await getCurrentUser();
  const data = await getUsersDashboardData();

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#090e17] text-foreground">
      {/* Interactive Users Management View with Integrated Sticky Top Nav */}
      <UsersManagementView initialData={data} />
    </div>
  );
}
