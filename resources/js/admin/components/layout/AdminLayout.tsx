


import { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Header } from "./Header";
import { AuthProvider } from "@/admin/context/AuthContext";
import { Sidebar } from "./SideBar";
import ToastContextProvider from "@/contextProvoders/ToastProvider";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

export function AdminLayout({ children }: { children: ReactNode }) {

  return<>
  <StoreConfigProvider >
 
      <ToastContextProvider>
        <AuthProvider>
            <AdminLayoutContent children={children} />
        </AuthProvider>
        </ToastContextProvider>

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
    <div className="flex h-screen">
  {/* Sidebar: fixed width, full height, stays visible */}
  <div className="w-64 bg-red-800 text-white flex-shrink-0">
    <Sidebar />
  </div>

  {/* Main content area */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Header fixed height */}
    <Header />

    {/* Scrollable content */}
    <main className="flex-1  overflow-auto " 
    style={{color : currentTheme.text , background : currentTheme.bg}}
    >
      {children}
    </main>
  </div>
</div>
  );
};
export default AdminLayoutContent;

AdminLayoutContent.layout = (page:any) => <AdminLayout children={page} />