import AppSidebar from "@/components/AppSidebar";
import StudentRegistration from "@/components/StudentRegistration";

const StudentRegistrationPage = () => (
  <div className="flex min-h-screen bg-background">
    <AppSidebar />
    <main className="flex-1 ml-64 p-6 lg:p-8 overflow-auto scrollbar-thin">
      <StudentRegistration />
    </main>
  </div>
);

export default StudentRegistrationPage;
