import React from "react";
import { getCurrentUser } from "@/lib/auth/authLib";
import ProfileSettingsView from "@/components/dashboard/ProfileSettingsView";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#090e17] text-foreground">
      {/* Interactive Profile Settings View with Integrated Sticky Top Nav */}
      <ProfileSettingsView user={user} />
    </div>
  );
}
