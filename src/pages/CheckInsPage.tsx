import AppSidebar from "@/components/AppSidebar";
import CheckIns from "@/components/CheckIns";

const CheckInsPage = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 ml-64 p-8">
        <CheckIns />
      </main>
    </div>
  );
};

export default CheckInsPage;
