


import { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Header } from "./Header";
import { Inertia } from "@inertiajs/inertia";
import { AppSidebar } from "./AppSidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { admin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-700">
        Loading...
      </div>
    );
  }

  if (!admin) {
    Inertia.visit("/admin/login"); 
    return null;
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
