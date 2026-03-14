import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 ml-64 p-6 lg:p-8 overflow-auto scrollbar-thin">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
