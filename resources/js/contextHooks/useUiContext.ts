import { UIContext } from "@/context/UIContext";
import { UIContextType } from "@/types/UITypes";
import { useContext } from "react";

export const useUIContext = (): UIContextType => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUI must be used within UIProvider");
    }
    return context;
};