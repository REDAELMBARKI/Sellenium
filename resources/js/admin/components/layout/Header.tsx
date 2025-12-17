import { Bell, User, LogOut } from "lucide-react";

import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

export function Header() {
  const { admin } = useAuth();
  const { state : {currentTheme} } = useStoreConfigCtx();
  const toggleSidebar = () => {
    console.log("Sidebar toggled");
    // Implement your sidebar toggle logic here, e.g. updating state or triggering a class
  };

  return (
    <header 
    style={{background : currentTheme.bg , color : currentTheme.text}}
    className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b  px-6">
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={toggleSidebar}
        >
          ☰
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          data-testid="button-notifications"
          className="h-9 w-9"
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 gap-2 px-2"
              data-testid="button-admin-menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">
                  {admin ? getInitials(admin.name) : "AD"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">
                {admin?.name || "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{admin?.name}</p>
                <p className="text-xs text-muted-foreground">{admin?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {admin?.role?.replace("_", " ")}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="menu-item-profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              // onClick={logout}
              data-testid="menu-item-logout"
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
