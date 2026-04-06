


import { ReactNode, useState } from "react";
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
  const { isLoading } = useAuth();
  const { state: { currentTheme } } = useStoreConfigCtx();
  const [collapsed, setCollapsed] = useState(false); // ← lift state here
  return (
    <div  className="flex h-dvh overflow-hidden">

      {/* ← dynamic width instead of hardcoded w-64 */}
      <div style={{
        width: collapsed ? '72px' : '256px',
        minWidth: collapsed ? '70px' : '256px',
        flexShrink: 1,
        height: '100%',
        transition: 'width 0.3s ease, min-width 0.3s ease',
      }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0" >
        <Header />
        <main className="flex-1 overflow-auto"
          style={{ color: currentTheme.text, background: currentTheme.bgSecondary }}
       
       >
          {children}
        </main>
      </div>

    </div>
  );
};