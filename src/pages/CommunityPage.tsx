import AppSidebar from "@/components/AppSidebar";
import Community from "@/components/Community";

const CommunityPage = () => (
  <div className="flex min-h-screen bg-background">
    <AppSidebar />
    <main className="flex-1 ml-64 p-6 lg:p-8 overflow-auto scrollbar-thin">
      <Community />
    </main>
  </div>
);

export default CommunityPage;
