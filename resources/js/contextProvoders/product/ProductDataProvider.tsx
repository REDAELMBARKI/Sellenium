
import { useEffect, useRef, useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/product/ProductDataContext';
import {  Category, Cover } from '@/types/inventoryTypes';
import { getEditedData, getEmptyInitialProductData } from '@/data/initialProductData';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { CategoriesList } from './../../Pages/admin/pages/categories/CategoriesList';
import { ProductBackendProps, ProductBase } from '@/types/products/ProductTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductSchemaType } from '@/shemas/productSchema';
import axios from 'axios';
import { route } from 'ziggy-js';


const fake = {
  "id": "prod_123",
  "name": "Sony WH-1000XM5 Wireless Headphones",
  "brand": "Sony",
  "category_niche_id": 3,
  "sub_categories": [
    { "id": 4, "name": "Headphones" },
    { "id": 7, "name": "Wireless Audio" }
  ],
  "description": "Industry-leading noise canceling with two processors and eight microphones. Up to 30 hours battery life with quick charge.",
  "price": 349.99,
  "sku": "SONY-WH1000XM5-BLK",
  "compare_price": 399.99,
  "stock": 42,
  "madeCountry": "JP",
  "releaseDate": 2023,
  "thumbnail": {
    "id": 1,
    "url": "https://picsum.photos/seed/headphones/400/400"
  },
  "video": [],
  "tags": ["wireless", "noise-canceling", "sony", "headphones", "bluetooth"],
  "covers": [
    { "id": 2, "url": "https://picsum.photos/seed/cover1/800/600" },
    { "id": 3, "url": "https://picsum.photos/seed/cover2/800/600" }
  ],
  "isFreeShipping": true,
  "isFeatured": true,
  "inventory": {
    "backorderOptions": "notify",
    "trackInventory": true,
    "lowStockThreshold": 5,
    "stockStatus": "in_stock",
    "weight": 1.2,
    "weightUnit": "kg",
    "dimensions": {
      "length": 25,
      "width": 18,
      "height": 10,
      "unit": "cm"
    },
    "warehouseLocation": "A3-B12",
    "fulfillmentType": "dropship"
  },
  "shipping": {
    "shippingClass": "express",
    "shippingCostOverride": 9.99,
    "isReturnable": true,
    "returnWindow": 30,
    "returnPolicy": "free_return"
  },
  "meta": {
    "metaTitle": "Sony WH-1000XM5 Noise Canceling Headphones",
    "metaDescription": "Buy Sony WH-1000XM5 wireless headphones with industry-leading noise cancellation and 30hr battery life."
  },
  "vendor": {
    "vendorName": "Sony Electronics",
    "vendorSku": "SUP-SONY-XM5",
    "vendorNotes": "Direct from manufacturer, ships within 2 business days"
  },
  "variants": [],
  "product_attributes": [],
  "related_products": [],
  "faqs": [
    {
      "question": "How long does the battery last?",
      "answer": "Up to 30 hours of playback with noise canceling enabled."
    },
    {
      "question": "Is it compatible with iPhone?",
      "answer": "Yes, compatible with all Bluetooth-enabled devices including iPhone and Android."
    }
  ],
  "badge_text": "Hot",
  "show_countdown": true,
  "show_related_products": true,
  "show_reviews": true,
  "show_social_share": true,
  "allow_backorder": false,
  "promotion_ids": [],
  "coupon_ids": []
}



const ProductDataProvider = ({children , product, nich_cats, shipping_class, badges, variants_options }:ProductBackendProps) => {
    
    const modeForm=  product ? "edit" : "create" ;
  
    const getInitialData = (mode: ModeForm, product?: ProductBase ) => {
      if (mode === "create") return getEmptyInitialProductData();
      if (mode === "edit" && product) return getEditedData(product);
      throw new Error("Invalid state");
      };

      console.log('test' , variants_options)

    
    const initialData = getInitialData(modeForm, product);
    const [nicheCategory , setNicheCategory] = useState<Category[]>() ; 
    const draftId = useRef<string | undefined>(product?.id ?? null);
    const { register,reset , handleSubmit, getValues, control, formState  , setError, watch, setValue } = useForm<ProductBase>({
        defaultValues: initialData, 
        resolver: zodResolver(productSchema), 
        mode: "onChange"
    })
    const hasReset = useRef(false);

    useEffect(() => {
        if (initialData && !hasReset.current) {
            reset(initialData);
            hasReset.current = true;
        }
    }, [initialData, reset]);


    return (
    <ProductDataContext.Provider value={{
        modeForm , 
        nicheCategory , setNicheCategory , 
        setValue , getValues , 
        register , handleSubmit , watch , 
        control , formState , setError , 
        nich_cats , shipping_class  , badges , variants_options , 
        draftId
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 