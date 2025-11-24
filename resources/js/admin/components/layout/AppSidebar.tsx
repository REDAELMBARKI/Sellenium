import { Link, usePage } from "@inertiajs/react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import InlineDropdown from "../ui/InlineDropdown";
import { menuItems } from "@/admin/data/adminNavigationsLinks";



export function AppSidebar() {
  const { url } = usePage(); 

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex-shrink-0 p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>

      <nav className="flex flex-col ">
        {menuItems.map((item) => {
          const isActive = url.startsWith(item?.href ?? '');
          console.log(url)
          return (
            <div className="flex items-center  ">
               
              <InlineDropdown item={item} isActive={isActive} />
            
            </div>
         
          );
        })}
      </nav>
    </aside>
  );
}