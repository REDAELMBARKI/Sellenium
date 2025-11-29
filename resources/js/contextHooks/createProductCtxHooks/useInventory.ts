import { useContext } from "react";
import { InventoryContextType } from "@/types/inventoryTypes.js";
import { InventoryContext } from "@/context/createproductContext/InventoryContext";

// Hook
export const useInventory = (): InventoryContextType => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error("useInventory must be used within InventoryProvider");
    }
    return context;
};