


import { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Header } from "./Header";
import { Inertia } from "@inertiajs/inertia";
import { AppSidebar } from "./AppSidebar";
import { AuthProvider } from "@/admin/context/AuthContext";
import { ThemeProvider } from "@/admin/context/ThemeContext";

export function AdminLayout({ children }: { children: ReactNode }) {

  return<>
  <ThemeProvider>
      <AuthProvider>
           <AdminLayoutContent children={children} />
       </AuthProvider>
  </ThemeProvider>
  </>
}


const AdminLayoutContent = ({ children }: { children: ReactNode }) => {
  const { admin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-700">
        Loading...
      </div>
    );
  }

  // if (!admin) {
  //   // Inertia.visit("/admin/login"); 
  //   return null;
  // }

  return (
    <div className="flex h-screen ">
      {/* Sidebar: fixed width, full height */}
      <AppSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header fixed height */}
        <Header />

        {/* Scrollable content */}
        <main style={{ overflowY:'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
export default AdminLayoutContent;

AdminLayoutContent.layout = (page:any) => <AdminLayout children={page} />