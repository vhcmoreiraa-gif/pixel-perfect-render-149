import AppSidebar from "@/components/AppSidebar";
import StudentView360 from "@/components/StudentView360";

const StudentView360Page = () => (
  <div className="flex min-h-screen bg-background">
    <AppSidebar />
    <main className="flex-1 ml-64 p-6 lg:p-8 overflow-auto scrollbar-thin">
      <StudentView360 />
    </main>
  </div>
);

export default StudentView360Page;
