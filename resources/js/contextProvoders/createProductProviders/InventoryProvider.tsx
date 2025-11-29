import { useRef, useState, type ReactNode } from "react";
import { Color, ProductVariant } from "@/types/inventoryTypes";
import { InventoryContext } from "@/context/createproductContext/InventoryContext";

// Provider
interface InventoryProviderProps {
    children: ReactNode;
}

const defaultVariant: ProductVariant = {
    id: null,
    colors: [],
    sizes: [],
    fits: [],
    materials: [],
    quantity: 1,
    covers: [],
};

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
    const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
    const [currentVariant, setCurrentVariant] = useState<ProductVariant>(defaultVariant);
    const [inventoryValid, setInventoryValid] = useState(false);
    const [newSelectedColors, setNewSelectedColors] = useState<Color[]>([]);
    const [updateVariantMode, setUpdateVariantMode] = useState(false);
    const [isCurrentVariantActive, setIsCurrentVariantActive] = useState(false);
    const variantFormRef = useRef<HTMLFormElement | null>(null);

    return (
        <InventoryContext.Provider
            value={{
                productVariants,
                setProductVariants,
                currentVariant,
                setCurrentVariant,
                inventoryValid,
                setInventoryValid,
                newSelectedColors,
                setNewSelectedColors,
                updateVariantMode,
                setUpdateVariantMode,
                isCurrentVariantActive,
                setIsCurrentVariantActive,
                variantFormRef,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
};