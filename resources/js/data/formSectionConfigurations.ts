import BaseSharedForm from "@/Pages/admin/pages/products/A_sharedForAllNiches/components/editAndCreate/BaseSharedForm";
import MediaSection from "@/Pages/admin/pages/products/A_sharedForAllNiches/components/editAndCreate/MediaSection";
import NullSection from "@/Pages/admin/pages/products/A_sharedForAllNiches/components/editAndCreate/NullSection";
import ProductMetaData from "@/Pages/admin/pages/products/A_sharedForAllNiches/components/editAndCreate/ProductMetaData";
import FashionAttributesSection from "@/Pages/admin/pages/products/fashionNiche/components/FashionAttributesSection";
import { FashionVariantBuilder } from "@/Pages/admin/pages/products/fashionNiche/components/FashionVariantBuilder";
import { CategoryCode } from "@/types/products/categories";




export const VARIANTS_FORM_SECTIONS: Record<
  CategoryCode,
  React.ComponentType|null> = {
  fashion: FashionVariantBuilder,
  electronics : null,
  perfumes : null , 
  sports : null , 
  home : null,
  baby : null,
  beauty : null,
  jewelry : null,
  toys : null
};


export const ATTRIBUTES_FORM_SECTIONS: Record<
  CategoryCode,
  React.ComponentType|null> = {
  fashion: FashionAttributesSection , 
  electronics : null,
  perfumes : null , 
  sports : null , 
  home : null,
  baby : null,
  beauty : null,
  jewelry : null,
  toys : null
};

