


import { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Header } from "./Header";
import { AuthProvider } from "@/admin/context/AuthContext";
import { Sidebar } from "./SideBar";
import ToastContextProvider from "@/contextProvoders/ToastProvider";
import NicheProvider from "@/contextProvoders/NicheProvider";
import { ThemeModeProvider } from "@/admin/context/ThemeContext";
import ColorsProvider from "@/contextProvoders/ColorsProvider";

export function AdminLayout({ children }: { children: ReactNode }) {

  return<>
  <NicheProvider >
    <ThemeModeProvider>
      <ColorsProvider>
      <ToastContextProvider>
        <AuthProvider>
            <AdminLayoutContent children={children} />
        </AuthProvider>
        </ToastContextProvider>
        </ColorsProvider>
    </ThemeModeProvider>
  </NicheProvider>
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
    <div className="flex h-screen">
  {/* Sidebar: fixed width, full height, stays visible */}
  <div className="w-64 bg-gray-800 text-white flex-shrink-0">
    <Sidebar />
  </div>

  {/* Main content area */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header fixed height */}
    <Header />

    {/* Scrollable content */}
    <main className="flex-1 overflow-auto p-6 bg-gray-50">
      {children}
    </main>
  </div>
</div>
  );
};
export default AdminLayoutContent;

AdminLayoutContent.layout = (page:any) => <AdminLayout children={page} />