import { InventoryItem } from '@/types/inventoryTypes';
import type { RefObject } from "react";
import { FormDataConvertible } from "@inertiajs/core";




// create form Types
export interface ReadyToSubmit {
    bool: boolean;
    name: boolean;
    brand: boolean;
    description: boolean;
    price: boolean;
    tags: boolean;
    thumbnail: boolean;
    inventory: boolean;
}

export interface ProductFormContextType {
    data: {
        name: string;
        brand: string;
        price: string;
        thumbnail: string;
        description: string;
        isFeatured: boolean;
        free_shipping: boolean;
        inventory: InventoryItem[];
        tags: string[];
    };
    setData: (key: string, value: unknown) => void;
    post: (url: string) => void;
    errors: Record<string, string>;
    isReadyToSubmit: ReadyToSubmit;
    setIsReadyToSubmit: React.Dispatch<React.SetStateAction<ReadyToSubmit>>;
    otherStringFieldsValid: boolean;
    setOtherStringFieldsValid: React.Dispatch<React.SetStateAction<boolean>>;
}


