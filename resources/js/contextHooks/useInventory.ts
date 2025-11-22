import { useContext } from "react";
import { InventoryContext } from "../context/InventoryContext.js";
import { InventoryContextType } from "@/types/inventoryTypes.js";

// Hook
export const useInventory = (): InventoryContextType => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error("useInventory must be used within InventoryProvider");
    }
    return context;
};