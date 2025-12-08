import { NicheItem } from "@/context/NicheContext";
import { Material } from "@/types/inventoryTypes";
import { ElectronicsProduct, FashionProduct, FashionVariant, Gender, PerfumesProduct, ProductDataGlobal } from "@/types/productsTypes";
import { video } from "framer-motion/client";


export const EmptyInitialProductDataMap : Record<NicheItem, ProductDataGlobal> = {
    "fashion":{
        id: undefined,
        name: "",
        brand: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        category: [],
        description: "",
        rating_average: undefined,
        thumbnail: "",
        video:"",
        tags: [],
        isFeatured: false,
        niche: "fashion",
        gender: [] as Gender[],
        materials: [] as Material[],
        variants: [] as FashionVariant[],
        }
      ,
       "perfumes":{
        id: undefined,
        name: "",
        brand: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        category: [],
        description: "",
        rating_average: undefined,
        thumbnail: "",
        video:"",
        tags: [],
        isFeatured: false,
        niche: "perfumes",
        concentration: "EDT",
        fragranceFamily: "fresh",
        topNotes: [],
        middleNotes: [],
        baseNotes: [],
        volumes: [],
        quantity: 0,
        covers: [],
        gender: [] as Gender[],
        } , 

     "electronics":{
        id: undefined,
        name: "",
        brand: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        category: [],
        description: "",
        rating_average: undefined,
        thumbnail: "",
        video:"",
        tags: [],
        isFeatured: false,
        niche: "electronics",
        quantity: 0,
        colors: [],
        }
        
}



export const getEditedData  = (product: ProductDataGlobal, niche: NicheItem) => {
  const baseData = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    costPrice: product.costPrice,
    category: product.category,
    description: product.description,
    rating_average: product.rating_average,
    thumbnail: product.thumbnail,
    video:product.video ,
    tags: product.tags,
    isFeatured: product.isFeatured,
    niche: product.niche,
  };

  switch (niche) {
    case "fashion":
      const fashionProduct = product as FashionProduct;
      return {
        ...baseData,
        materials: fashionProduct.materials,
        gender: fashionProduct.gender,
        variants: fashionProduct.variants,
      };

    case "perfumes":
      const perfumesProduct = product as PerfumesProduct;
      return {
        ...baseData,
        concentration: perfumesProduct.concentration,
        fragranceFamily: perfumesProduct.fragranceFamily,
        gender: perfumesProduct.gender,
        topNotes: perfumesProduct.topNotes,
        middleNotes: perfumesProduct.middleNotes,
        baseNotes: perfumesProduct.baseNotes,
        volumes: perfumesProduct.volumes,
        quantity: perfumesProduct.quantity,
        covers: perfumesProduct.covers ?? [],
        longevity: perfumesProduct.longevity,
        sillage: perfumesProduct.sillage,
      };

    case "electronics":
      const electronicsProduct = product as ElectronicsProduct;
      return {
        ...baseData,
        batteryLife: electronicsProduct.batteryLife,
        connectivity: electronicsProduct.connectivity,
        voltage: electronicsProduct.voltage,
        storage: electronicsProduct.storage,
        colors: electronicsProduct.colors,
        quantity: electronicsProduct.quantity,
        warrantyMonths: electronicsProduct.warrantyMonths,
        model: electronicsProduct.model,
        brandSeries: electronicsProduct.brandSeries,
        techSpecs: electronicsProduct.techSpecs,
      };
    default:
      console.warn("Unknown niche in getEditedData:", niche);
      return baseData; 

  }
};
