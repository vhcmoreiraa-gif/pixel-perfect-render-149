import AppSidebar from "@/components/AppSidebar";
import Challenges from "@/components/Challenges";

const ChallengesPage = () => (
  <div className="flex min-h-screen bg-background">
    <AppSidebar />
    <main className="flex-1 ml-64 p-6 lg:p-8 overflow-auto scrollbar-thin">
      <Challenges />
    </main>
  </div>
);

export default ChallengesPage;
