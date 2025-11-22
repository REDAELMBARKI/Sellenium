import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FolderTree,
  MessageSquare,
  BarChart3,
  Ship,
  Shield,
  Settings,
  Palette,
  Box,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Products", icon: Package, href: "/admin/products" },
  { title: "Variants", icon: Palette, href: "/admin/variants/colors" },
  { title: "Categories", icon: FolderTree, href: "/admin/categories" },
  { title: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { title: "Customers", icon: Users, href: "/admin/customers" },
  { title: "Coupons", icon: Tag, href: "/admin/coupons" },
  { title: "Inventory", icon: Box, href: "/admin/inventory" },
  { title: "Reviews", icon: MessageSquare, href: "/admin/reviews" },
  { title: "Reports", icon: BarChart3, href: "/admin/reports" },
  { title: "Shipping", icon: Ship, href: "/admin/shipping" },
  { title: "Admins", icon: Shield, href: "/admin/admins" },
  { title: "Settings", icon: Settings, href: "/admin/settings" },
];

export function AppSidebar() {
  const { url } = usePage(); // <---- The current URL in inertia

  return (
    <aside className="w-64 bg-gray-900 text-white h-full p-4">
      <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = url.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md
                ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
