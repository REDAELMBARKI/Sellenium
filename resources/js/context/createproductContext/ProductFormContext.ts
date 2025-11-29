import { createContext  } from "react";
import { useForm } from "@inertiajs/react";
import { ProductFormContextType } from "@/types/productsTypes";




// Context
export const ProductFormContext = createContext<ProductFormContextType | null>(null);
