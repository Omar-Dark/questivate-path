import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { RoadmapContainer } from "@/components/dashboard/RoadmapContainer";
import { useAuth } from "@/lib/auth";

const DashboardNew = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <HeroStats
          level={12}
          streak={7}
          xp={4850}
          completedPaths={3}
          username={user?.user_metadata?.username || "Learner"}
        />
        <RoadmapContainer />
      </div>
    </DashboardLayout>
  );
};

export default DashboardNew;
