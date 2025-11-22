import { createContext  } from "react";
import { useForm } from "@inertiajs/react";
import { ProductFormContextType } from "@/types/createPageTypes";




// Context
export const ProductFormContext = createContext<ProductFormContextType | null>(null);
