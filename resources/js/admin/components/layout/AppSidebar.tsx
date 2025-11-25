import { Link, usePage } from "@inertiajs/react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import InlineDropdown from "../partials/InlineDropdown";
import { menuItems } from "@/admin/data/adminNavigationsLinks";
import { useState } from "react";



export function AppSidebar() {
  const { url } = usePage(); 
  const [openDropdown , setOpenDropdown] =  useState<string|null>(null);
  
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex-shrink-0 p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>

      <nav className="flex flex-col ">
        {menuItems.map((item) => {
          const isActive = url.startsWith(item?.href ?? '');

          return (
            <div className="flex items-center  ">
               
              <InlineDropdown item={item} isActive={isActive} isOpen={openDropdown === item.title} onToggle={(title:string) => setOpenDropdown(title === openDropdown ? null : title) }/>
            
            </div>
         
          );
        })}
      </nav>
    </aside>
  );
}