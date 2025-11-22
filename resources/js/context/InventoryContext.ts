import { InventoryContextType } from "@/types/inventoryTypes";
import { createContext, useContext, useState, useRef } from "react";




// Context
export const InventoryContext = createContext<InventoryContextType| null>(null);
