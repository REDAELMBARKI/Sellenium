


import { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Header } from "./Header";
import { AuthProvider } from "@/admin/context/AuthContext";
import { Sidebar } from "./SideBar";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { ToastProvider } from "@/contextProvoders/ToastProvider";

export function AdminLayout({ children }: { children: ReactNode }) {

  return<>
  <StoreConfigProvider >
 
      <ToastProvider>
        <AuthProvider>
            <AdminLayoutContent children={children} />
        </AuthProvider>
        </ToastProvider>

  </StoreConfigProvider>
  </>
}


const AdminLayoutContent = ({ children }: { children: ReactNode }) => {
  const { admin, isLoading } = useAuth();
  const {state :{currentTheme}} = useStoreConfigCtx()

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
    <div className="flex h-dvh" 
    >
  {/* Sidebar: fixed width, full height, stays visible */}
  <div className="w-64 flex-shrink-0 h-full">
    <Sidebar />
  </div>

  {/* Main content area */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header fixed height */}
    <Header />

    {/* Scrollable content */}
    <main className="flex-1  overflow-auto " 
    style={{color : currentTheme.text , background : currentTheme.bgSecondary}}
    >
      {children}
    </main>
  </div>
</div>
  );
};
export default AdminLayoutContent;
