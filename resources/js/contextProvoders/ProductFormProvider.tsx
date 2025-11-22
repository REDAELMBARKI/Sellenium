import { useForm } from "@inertiajs/react";
import { useState, type ReactNode } from "react";
import type { ReadyToSubmit } from "../types/createPageTypes";
import { ProductFormContext } from "../context/ProductFormContext";
import { InventoryItem } from "@/types/inventoryTypes";


// Provider
interface ProductFormProviderProps {
    children: ReactNode;
}

export const ProductFormProvider = ({ children }: ProductFormProviderProps) => {
   const { data, setData, post, errors } = useForm({
    name: "",
    brand: "",
    price: "",
    thumbnail: "",
    description: "",
    isFeatured: false,
    free_shipping: false,
    inventory: [] as InventoryItem[],
    tags: [] as string[],
    });

    const [otherStringFieldsValid, setOtherStringFieldsValid] = useState(true);
    const [isReadyToSubmit, setIsReadyToSubmit] = useState<ReadyToSubmit>({
        bool: false,
        name: false,
        brand: false,
        description: false,
        price: false,
        tags: false,
        thumbnail: false,
        inventory: false,
    });

    return (
        <ProductFormContext.Provider
            value={{
                data,
                setData,
                post,
                errors,
                isReadyToSubmit,
                setIsReadyToSubmit,
                otherStringFieldsValid,
                setOtherStringFieldsValid,
            }}
        >
            {children}
        </ProductFormContext.Provider>
    );
};