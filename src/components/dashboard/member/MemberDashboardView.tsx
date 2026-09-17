"use client";

import MemberMetricCards from "./MemberMetricCards";
import MemberSavedArticles from "./MemberSavedArticles";
import MemberReadingHistory from "./MemberReadingHistory";
import { MemberDashboardData } from "@/lib/types/dashboard.types";
// import { MemberDashboardData } from "@/lib/dashboard/get-dashboard-data";

interface MemberDashboardViewProps {
  data: MemberDashboardData;
}

export default function MemberDashboardView({
  data,
}: MemberDashboardViewProps) {
  console.log(data);
  return (
    <div className="space-y-8">
      {/* 4 Responsive Member Key Metric Cards with Side Slider on Mobile */}
      <MemberMetricCards stats={data.stats} />
      {/* Main 2-Column Grid: Saved Reading Shelf & Recommendations */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Main Left Column (3 Cols): Saved Articles & Reading History */}
        <div className="xl:col-span-3 min-w-0 space-y-8">
          <MemberSavedArticles savedArticles={data.savedArticles} />
          <MemberReadingHistory history={data.readingHistory} />
        </div>
        {/* Right Column (1 Col): Editorial Recommendations & Patron Pass */}
        <div className="xl:col-span-1 min-w-0">
          {/* <MemberRecommendations recommended={data.recommendedForYou} /> */}
        </div>
      </div>
    </div>
  );
}
