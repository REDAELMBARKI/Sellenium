import { Size , Fit , Color , Material , Cover , Gender, Style, Season, Country } from "../inventoryTypes";
import { ProductBasicInfoData } from "./baseProductTypes";
import { ProductVariant } from "./productVariantType";

export interface FashionAttributes {
  materials : Material[]
  fits: Fit[]
  gender : Gender[]
  styles: Style[],
  season: Season[],
  madeCountry : Country | null
}

export interface FashionProduct extends FashionAttributes ,  ProductBasicInfoData {
  category: "fashion";
  variants : ProductVariant[]
}

export interface FashionFields {
  sizes: Size[];
  materials: Material[];
  colors: Color[];
  covers: Cover[] , 
  fits: Fit[];
  fabricType?: string[];
  gender?: "men" | "women" | "unisex";
}
