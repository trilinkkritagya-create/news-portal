import { dashboardService } from "@/lib/services/dashboard/dashboard.service";
import MemberDashboardView from "./MemberDashboardView";
type props = {
  userId: string;
};

const MemberDashboardContent = async ({ userId }: props) => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const memberData = await dashboardService.getMemberDashboard(userId);
  console.log(memberData, "is memberData");
  return (
    <>
      <MemberDashboardView data={memberData} />
    </>
  );
};

export default MemberDashboardContent;
