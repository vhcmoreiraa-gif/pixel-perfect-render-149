import AppSidebar from "@/components/AppSidebar";
import Ranking from "@/components/Ranking";

const RankingPage = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 ml-64 p-6 lg:p-8 overflow-auto scrollbar-thin">
        <Ranking />
      </main>
    </div>
  );
};

export default RankingPage;
