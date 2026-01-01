import BaseSharedForm from "@/Pages/admin/pages/products/A_sharedForAllNiches/components/editAndCreate/BaseSharedForm";
import MediaSection from "@/Pages/admin/pages/products/A_sharedForAllNiches/components/editAndCreate/MediaSection";
import ProductMetaData from "@/Pages/admin/pages/products/A_sharedForAllNiches/components/editAndCreate/ProductMetaData";
import FashionAttributesSection from "@/Pages/admin/pages/products/fashionNiche/components/FashionAttributesSection";
import { FashionVariantBuilder } from "@/Pages/admin/pages/products/fashionNiche/components/FashionVariantBuilder";
import { CategoryCode } from "@/types/products/categories";




export const VARIANTS_FORM_SECTIONS: Record<
  CategoryCode,
  React.ComponentType> = {
  fashion: FashionVariantBuilder
};


export const ATTRIBUTES_FORM_SECTIONS: Record<
  CategoryCode,
  React.ComponentType> = {
  fashion: FashionAttributesSection
};

