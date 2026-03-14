import AppSidebar from "@/components/AppSidebar";
import Championships from "@/components/Championships";

const ChampionshipsPage = () => (
  <div className="flex min-h-screen bg-background">
    <AppSidebar />
    <main className="flex-1 ml-64 p-6 lg:p-8 overflow-auto scrollbar-thin">
      <Championships />
    </main>
  </div>
);

export default ChampionshipsPage;
