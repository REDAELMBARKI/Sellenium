// Define the type for category codes
export type CategoryCode =
  | "fashion"
  | "electronics"
  | "beauty"
  | "perfumes"
  | "home"
  | "sports"
  | "toys"
  | "jewelry"
  | "baby";

// Interface for a category
export interface Category {
  code: CategoryCode;  // short code for logic / DB
  label: string;       // human-friendly display label
}

// Array of categories
export const categories: Category[] = [
  { code: "fashion", label: "Fashion & Apparel" },
  { code: "electronics", label: "Electronics & Gadgets" },
  { code: "beauty", label: "Beauty & Personal Care" },
  { code: "perfumes", label: "Perfumes" },
  { code: "home", label: "Home & Living" },
  { code: "sports", label: "Sports & Outdoors" },
  { code: "toys", label: "Toys & Games" },
  { code: "jewelry", label: "Jewelry & Accessories" },
  { code: "baby", label: "Baby & Kids" },
];
