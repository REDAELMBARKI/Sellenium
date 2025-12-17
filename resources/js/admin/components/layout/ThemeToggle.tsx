import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

export function ThemeToggle() {
  const {state :{currentThemeMode} , dispatch} = useStoreConfigCtx()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => dispatch({type : "SET_THEME_MODE"})}
      data-testid="button-theme-toggle"
      className="h-9 w-9"
    >
      {currentThemeMode === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
