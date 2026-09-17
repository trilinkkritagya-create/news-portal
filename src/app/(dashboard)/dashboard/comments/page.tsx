import React from "react";
import { getCurrentUser } from "@/lib/auth/authLib";
import CommentsModerationView from "@/components/dashboard/CommentsModerationView";
import { getCommentsDashboardData } from "@/lib/dashboard/get-comments-data";

export default async function CommentsPage() {
  await getCurrentUser();
  const data = await getCommentsDashboardData();

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#090e17] text-foreground">
      {/* Interactive Comments Moderation View with Integrated Sticky Top Nav */}
      <CommentsModerationView initialData={data} />
    </div>
  );
}
