import { NicheItem } from "@/context/NicheContext";
import { Cover, Fit, Material, Season, Style } from "@/types/inventoryTypes";
import { ImagePreviewItem } from "@/types/mediaTypes";
import { Country, ElectronicsProduct, FashionProduct, FashionVariant, Gender, PerfumesProduct, ProductDataGlobal, ProductVariant } from "@/types/productsTypes";
import { Tag } from "@/types/tagsTypes";
import { video } from "framer-motion/client";


export const EmptyInitialProductDataMap : Record<NicheItem, ProductDataGlobal> = { // for create new product
    "fashion":{
        id: undefined,
        name: "",
        brand: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        category: [] as {id:string , name : string}[],
        description: "",
        rating_average: undefined,
        thumbnail:null,
        video:null,
        tags: [] as Tag[],
        covers: [] as (Cover | ImagePreviewItem)[],
        isFeatured: false,
        niche: "fashion",
        season : [] as Season[] ,
        styles : [] as Style[] ,
        fits : [] as Fit[] ,
        stockQuantity: 0,
        madeCountry: null ,
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
        thumbnail:  null,
        video: null,
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
        thumbnail: null,
        video: null ,
        covers: [],
        tags: [] ,
        isFeatured: false,
        niche: "electronics",
        quantity: 0,
        colors: [],
        }
        
}



export const getEditedData  = (product: ProductDataGlobal, niche: NicheItem) => {
  const baseData = {
    id: product.id ?? '', 
    name: product.name ?? '',
    brand: product.brand ?? '',
    price: product.price ?? '',
    compareAtPrice: product.compareAtPrice ?? '',
    costPrice: product.costPrice ?? '',
    category: product.category ?? [] as {id:string , name : string}[],
    description: product.description ?? '',
    rating_average: product.rating_average,
    thumbnail: product.thumbnail ?? null,
    video:product.video ?? null,
    tags: product.tags ?? [] as Tag[],
    isFeatured: product.isFeatured ?? false,
    niche: product.niche || "fashion",
    covers: product.covers ?? [] as (Cover | ImagePreviewItem)[],
  };

  switch (niche) {
    case "fashion":
      const fashionProduct = product as FashionProduct;
      return {
        ...baseData,
        materials: fashionProduct.materials ?? [] as Material[],
        season : fashionProduct.season ?? [] as Season[] , 
        madeCountry : fashionProduct.madeCountry ?? '' , 
        styles : fashionProduct.styles ?? [] as Style[] , 
        fits : fashionProduct.fits ?? [] as Fit[] , 
        gender: fashionProduct.gender ?? [] as Gender[],
        variants: fashionProduct.variants ?? [] as ProductVariant[],
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
