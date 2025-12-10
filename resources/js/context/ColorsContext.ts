import { UIColorsType } from "@/types/UIColorsType";
import { createContext } from "react";





interface ColorsContextType {
  currentTheme : UIColorsType
  setCurrentTheme : React.Dispatch<React.SetStateAction<UIColorsType>>
}

export const ColorsContext = createContext<ColorsContextType | null>(null)