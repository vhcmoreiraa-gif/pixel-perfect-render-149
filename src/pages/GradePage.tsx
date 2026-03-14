import AppSidebar from "@/components/AppSidebar";
import ClassSchedule from "@/components/ClassSchedule";

const GradePage = () => (
  <div className="flex min-h-screen bg-background">
    <AppSidebar />
    <main className="flex-1 ml-64 p-6 lg:p-8 overflow-auto scrollbar-thin">
      <ClassSchedule />
    </main>
  </div>
);

export default GradePage;
