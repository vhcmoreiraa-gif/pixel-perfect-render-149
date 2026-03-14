import AppSidebar from "@/components/AppSidebar";
import AdminDashboard from "@/components/AdminDashboard";

const AdminPage = () => (
  <div className="flex min-h-screen bg-background">
    <AppSidebar />
    <main className="flex-1 ml-64 p-6 lg:p-8 overflow-auto scrollbar-thin">
      <AdminDashboard />
    </main>
  </div>
);

export default AdminPage;
